import {
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Button,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv6 } from 'uuid'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { PrimaryButton } from '../../shared'
import {
  DEFAULT_SELECTED_LEAVE_TYPE,
  LEAVE_STATUS_IDS,
  LEAVE_TYPE_IDS,
} from '../../../utilities/constants/index'
import {
  Leave,
  NonWorkingDay,
  AlertDto,
  UserDto,
  PointPersonSelectDto,
  LeaveListItemDto,
  MakingLeaveInsertFormDto,
  AuthorizedUserInfo,
  PointPersonDto,
} from '../../../utilities/models'
import { validateFormData } from '../../../utilities/helpers'
import styles from './LeaveInsertForm.module.scss'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { Autocomplete, createFilterOptions } from '@mui/material'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import 'moment-business-days'

import { LEAVE_TYPE_LIST, SPECIAL_LEAVE_TYPES } from '../../../utilities/constants/data.constamts'
import DatePickerToolbarStyles from '../../../assets/theme/mobileDatePicker'
import moment from 'moment'

const MarkingLeaveForm: React.FC<{
  currentUser: AuthorizedUserInfo
  nonWorkingDays: NonWorkingDay[]
  isLoading: boolean
  pointPersons: PointPersonDto[]
  employees: UserDto[]
  leaveList: LeaveListItemDto[]
  leaveSummaryData: number[]
  addLeaveAlert: AlertDto
  isnonWorkingDaysLoading: boolean
  isHR: boolean
  submitLeave(leaveData: Leave[]): void
  getNonWorkingDays(startDate: string, endDate: string): void
  onhandleLeaveDateChange: (startDate: string, endDate: string) => void
  onHandleLeaveTypeChange: (leaveTypeId: number) => void
  onHandleLeaveError: (error: string) => void
  onUpdateLeaveCount: () => void
  onUserChange: (username: string) => void
}> = (props) => {
  const [isHalfDay, setIsHalfDay] = useState('1')
  const [isSubmit, setIsSubmit] = useState(false)

  const momentRange = extendMoment(Moment as any)
  const filter = createFilterOptions()

  useEffect(() => {
    if (!props.isnonWorkingDaysLoading && props.nonWorkingDays && isSubmit) {
      handleLeaveSubmit()
    }
  }, [props.nonWorkingDays])

  useEffect(() => {
    if (props.addLeaveAlert.severity === 'success') {
      if (props.isHR !== true) {
        props.onUpdateLeaveCount()
      }
      resetForm()
    }
  }, [props.addLeaveAlert])

  const MARKING_LEAVE: MakingLeaveInsertFormDto = {
    username: {
      value: !props.isHR ? props.currentUser.username : '',
      validator: 'text',
      isRequired: true,
      error: null,
      disable: false,
    },
    coWorker: {
      value: '',
      validator: 'email',
      isRequired: props.isHR ? false : true,
      error: null,
      disable: false,
    },
    leaveType: {
      value: DEFAULT_SELECTED_LEAVE_TYPE,
      validator: 'number',
      isRequired: true,
      error: null,
      disable: false,
    },
    isHalfDay: { value: '1', validator: 'number', isRequired: true, error: null, disable: false },
    leaveDate: {
      value: new Date(),
      validator: 'date',
      isRequired: true,
      error: null,
      disable: false,
    },
    leaveEndDate: {
      value: new Date(),
      validator: 'date',
      isRequired: isHalfDay === '0',
      error: null,
      disable: false,
    },
    leaveNote: {
      value: '',
      validator: 'text',
      isRequired: props.isHR ? false : true,
      error: null,
      disable: false,
    },
  }

  const [leave, setLeave] = useState<MakingLeaveInsertFormDto>(MARKING_LEAVE)

  const [defaultEmployee, setDefaultEmployee] = useState(uuidv6())

  const handleDateChange = (date: any) => {
    handleChange('leaveDate', date)
    handleChange('leaveEndDate', date)
  }

  const handleEndDateChange = (date: any) => {
    handleChange('leaveEndDate', date)
  }

  const handleChange = (property: string, value: any) => {
    setLeave((prevState: MakingLeaveInsertFormDto) => ({
      ...prevState,
      [property as keyof typeof leave]: {
        ...prevState[property as keyof typeof prevState],
        value: value,
        error: null,
      },
    }))
  }

  const handleIsHalfDay = (value: string) => {
    setIsHalfDay(value)
    handleChange('isHalfDay', value)
  }

  const handleLeaveTypeChange = (value: number) => {
    handleChange('leaveType', value)
    props.onHandleLeaveTypeChange(value)

    if (value === LEAVE_TYPE_IDS.ANNUAL) {
      handleIsHalfDay('0')
    } else {
      handleIsHalfDay('1')
    }
  }

  const resetForm = () => {
    handleLeaveTypeChange(DEFAULT_SELECTED_LEAVE_TYPE)
    setDefaultEmployee(uuidv6())
    setIsSubmit(false)
    setLeave(MARKING_LEAVE)
    handleUserChange('')
    handleChange('username', !props.isHR ? props.currentUser.username : '')
  }

  const filterWorkingDays = async (leaveDate: Date, leaveEndDate: Date) => {
    const filterDate: string[] = []
    if (leave.isHalfDay.value === '1') {
      if (Moment(leaveDate, 'YYYY-MM-DD').isBusinessDay()) {
        filterDate.push(Moment(leaveDate).format('YYYY-MM-DD'))
      }
      return filterDate
    }
    const range = momentRange.range(leaveDate, leaveEndDate)
    const acc = Array.from(range.reverseBy('day'))
    acc.map(
      (m) =>
        Moment(m.format('YYYY-MM-DD')).isBusinessDay() && filterDate.push(m.format('YYYY-MM-DD'))
    )
    return filterDate
  }

  const filterHolidays = async (userleaveDays: string[]) => {
    const leaveDays = userleaveDays
    props.nonWorkingDays.map((holiday) => {
      if (leaveDays.includes(Moment(holiday.date).format('YYYY-MM-DD'))) {
        const index = leaveDays.indexOf(Moment(holiday.date).format('YYYY-MM-DD'))
        if (index > -1 && holiday.isEnabled === 1) {
          leaveDays.splice(index, 1)
        }
      }
    })
    return leaveDays
  }

  const filterExsistingLeave = async (userLeaveDays: string[]) => {
    const filterLeave = userLeaveDays
    props.leaveList.map((userLeave) => {
      if (filterLeave.includes(Moment(userLeave.date).format('YYYY-MM-DD'))) {
        const index = filterLeave.indexOf(Moment(userLeave.date).format('YYYY-MM-DD'))
        if (
          index > -1 &&
          userLeave.leaveStatusId !== LEAVE_STATUS_IDS.DISABLED &&
          userLeave.leaveStatusId !== LEAVE_STATUS_IDS.REJECTED
        ) {
          filterLeave.splice(index, 1)
        }
      }
    })
    return filterLeave
  }

  const validateForm = async () => {
    const [validatedData, isValid] = await validateFormData(leave)
    setLeave(validatedData)
    if (isValid) {
      loadNonWorkingDays()
    }
  }

  const loadNonWorkingDays = () => {
    props.getNonWorkingDays(
      Moment(leave.leaveDate.value).format('YYYY-MM-DD'),
      Moment(
        leave.leaveEndDate.value && leave.isHalfDay.value === '0'
          ? leave.leaveEndDate.value
          : leave.leaveDate.value
      ).format('YYYY-MM-DD')
    )
    setIsSubmit(true)
  }

  const compareLeaveDate = (leaveOne: any, leaveTwo: Leave) => {
    if (new Date(leaveOne.date) < new Date(leaveTwo.date)) {
      return -1
    }
    if (new Date(leaveOne.date) > new Date(leaveTwo.date)) {
      return 1
    }
    return 0
  }

  const handleLeaveSubmit = async () => {
    const leaveData: Leave[] = []
    const timestamp = Moment().unix()
    if (leave.isHalfDay.value === '0' && leave.leaveDate.value > leave.leaveEndDate.value) {
      props.onHandleLeaveError('Invalid Date, End date should be greater than start date')
    } else {
      const workingDays = await filterWorkingDays(leave.leaveDate.value, leave.leaveEndDate.value)
      const filteredHolidays = await filterHolidays(workingDays)
      const filterUserLeave = await filterExsistingLeave(filteredHolidays)
      if (filterUserLeave.length === 0) {
        const date = leave.leaveDate.value.toISOString().slice(0, 10)
        if (!Moment(date, 'YYYY-MM-DD').isBusinessDay()) {
          props.onHandleLeaveError('Leave/Holiday available for the selected date')
        } else {
          leaveData.push({
            username: leave.username.value,
            date: date.toString(),
            leaveType: leave.leaveType.value,
            isHalfDay: leave.isHalfDay.value === '1',
            leaveNote: leave.leaveNote.value,
            coWorker: leave.coWorker.value,
            batchId: `${timestamp}_${props.currentUser.username.substring(0, props.currentUser.username.lastIndexOf('@'))}`,
            leaveStatusId: props.isHR ? LEAVE_STATUS_IDS.APPROVED : LEAVE_STATUS_IDS.APPLIED,
          })
          props.submitLeave(leaveData)
        }
        //props.onHandleLeaveError("Leave/Holiday available for the selected date");
      } else {
        if (
          (SPECIAL_LEAVE_TYPES.includes(leave.leaveType.value) ||
            filterUserLeave.length <= props.leaveSummaryData[2]) &&
          leave.isHalfDay.value === '0'
        ) {
          filterUserLeave.map((leaveDate) => {
            leaveData.push({
              username: leave.username.value,
              date: leaveDate,
              leaveType: leave.leaveType.value,
              isHalfDay: leave.isHalfDay.value === '1',
              leaveNote: leave.leaveNote.value,
              coWorker: leave.coWorker.value,
              batchId: `${timestamp}_${props.currentUser.username.substring(0, props.currentUser.username.lastIndexOf('@'))}`,
              leaveStatusId: props.isHR ? LEAVE_STATUS_IDS.APPROVED : LEAVE_STATUS_IDS.APPLIED,
            })
          })
          const orderLeave = leaveData.sort(compareLeaveDate)
          props.submitLeave(orderLeave)
        } else if (
          (filterUserLeave.length === 1 &&
            leave.isHalfDay.value === '1' &&
            0.5 <= props.leaveSummaryData[2]) ||
          SPECIAL_LEAVE_TYPES.includes(leave.leaveType.value)
        ) {
          leaveData.push({
            username: leave.username.value,
            date: filterUserLeave[0],
            leaveType: leave.leaveType.value,
            isHalfDay: leave.isHalfDay.value === '1',
            leaveNote: leave.leaveNote.value,
            coWorker: leave.coWorker.value,
            batchId: `${timestamp}_${props.currentUser.username.substring(0, props.currentUser.username.lastIndexOf('@'))}`,
            leaveStatusId: props.isHR ? LEAVE_STATUS_IDS.APPROVED : LEAVE_STATUS_IDS.APPLIED,
          })
          props.submitLeave(leaveData)
        } else {
          // leave count is not enough
          props.onHandleLeaveError('Available leave count not enough')
        }
      }
    }
  }

  const handleCoWorkerChange = (value?: { username: string }) => {
    const username = value ? value.username : ''
    handleChange('coWorker', username)
  }

  const handleUserChange = (value: string) => {
    handleChange('username', value)
    props.onUserChange(value)
  }
  const sevenDaysPrior = new Date().setDate(new Date().getDate() - 7)
  const userLeaveTypes = LEAVE_TYPE_LIST.slice(0)
  const hrLeaveTypes = LEAVE_TYPE_LIST.slice(0)
  userLeaveTypes.splice(3, 5) //remove special, approved and non approved no pay leaves from LEAVE_TYPE_LIST
  const leaveTypes = props.isHR === true ? hrLeaveTypes : userLeaveTypes

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {props.isHR && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              id="employee-select"
              size="small"
              key={defaultEmployee}
              options={props.employees}
              getOptionLabel={(option: any) => option.username || ''}
              disableClearable
              onChange={(_event, value) => handleUserChange(value.username)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Username"
                  variant="outlined"
                  error={!!leave.username.error}
                  size="small"
                  fullWidth
                />
              )}
              sx={{
                width: '100%',
                '& .MuiSelect-nativeInput': {
                  height: 30,
                },
              }}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl style={{ width: '100%' }} variant="outlined">
            <InputLabel required id="select-outlined-label">
              Leave Type
            </InputLabel>
            <Select
              required
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              id="leaveType"
              value={leave.leaveType.value}
              // onChange={handleSelectChange}

              onChange={(event: any) => handleLeaveTypeChange(event.target.value)}
              label="Leave Type *"
              size="small"
              margin="dense"
              labelId="select-outlined-label"
              error={!!leave.leaveType.error}
            >
              {/* !! Get from DB */}
              {/* <MenuItem value={1}>Annual leave</MenuItem>
                <MenuItem value={2}>Lieu leave</MenuItem>
              <MenuItem value={3}>Casual leave</MenuItem>*/}
              {leaveTypes.map((leaveType) => (
                <MenuItem value={leaveType.id}>{leaveType.type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: props.isHR ? 12 : 6 }}>
          <RadioGroup
            value={leave.isHalfDay.value}
            onChange={(event) => handleIsHalfDay(event.target.value)}
            row={true}
          >
            <FormControlLabel
              value={'1'}
              control={<Radio size="small" color="primary" />}
              label="Half day leave"
              disabled={leave.leaveType.value === LEAVE_TYPE_IDS.ANNUAL}
            />
            <FormControlLabel
              value={'0'}
              control={<Radio size="small" color="primary" />}
              label="Full day leave"
            />
          </RadioGroup>
        </Grid>
        {leave.isHalfDay.value === '0' ? (
          <React.Fragment>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <MobileDatePicker
                  // required
                  closeOnSelect
                  // inputVariant="outlined"
                  label="Leave Start Date"
                  className={styles.leaveDatePicker}
                  minDate={!props.isHR ? Moment(sevenDaysPrior) : undefined}
                  // margin="dense"
                  // size="small"
                  // id="date-picker-dialog"
                  format="DD/MM/YYYY"
                  value={leave.leaveDate.value ? Moment(leave.leaveDate.value) : undefined}
                  onChange={(date) => {
                    handleDateChange(date)
                  }}
                  slotProps={{
                    textField: {
                      required: true,
                      error: !!leave.leaveDate.error,
                      readOnly: true,
                      size: 'small',
                      variant: 'outlined',
                      margin: 'dense',
                    },
                    toolbar: DatePickerToolbarStyles,
                    actionBar: {
                      actions: ['cancel', 'accept'],
                    },
                  }}
                  sx={{ width: '100%' }}
                  // error={!!leave.leaveDate.error}
                  // KeyboardButtonProps={{
                  //   'aria-label': 'change date',
                  // }}
                  // InputProps={{ readOnly: true }}
                  localeText={{
                    toolbarTitle: leave.leaveDate.value
                      ? moment(leave.leaveDate.value).year().toString()
                      : moment().year().toString(),
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <MobileDatePicker
                  // required
                  closeOnSelect
                  // style={{ width: '100%' }}
                  className={styles.leaveDatePicker}
                  // inputVariant="outlined"
                  label="Leave End Date"
                  // error={!!leave.leaveEndDate.error}
                  minDate={leave.leaveDate.value ? Moment(leave.leaveDate.value) : undefined}
                  maxDate={
                    leave.leaveType.value === 1
                      ? new Date(leave.leaveDate.value).getDay() === 5
                        ? Moment(new Date(leave.leaveDate.value).getTime() + 10 * 86400000)
                        : Moment(new Date(leave.leaveDate.value).getTime() + 8 * 86400000)
                      : Moment(new Date(leave.leaveDate.value).getTime() + 365 * 86400000)
                  }
                  // margin="dense"
                  // size="small"
                  // id="date-picker-dialog"
                  format="DD/MM/YYYY"
                  value={leave.leaveEndDate.value ? Moment(leave.leaveEndDate.value) : undefined}
                  onChange={(date) => handleEndDateChange(date)}
                  // KeyboardButtonProps={{
                  //   'aria-label': 'change date',
                  // }}
                  // InputProps={{ readOnly: true }}
                  slotProps={{
                    textField: {
                      required: true,
                      error: !!leave.leaveEndDate.error,
                      readOnly: true,
                      size: 'small',
                      variant: 'outlined',
                      margin: 'dense',
                    },
                    toolbar: DatePickerToolbarStyles,
                    actionBar: {
                      actions: ['cancel', 'accept'],
                    },
                  }}
                  sx={{ width: '100%' }}
                  localeText={{
                    toolbarTitle: leave.leaveEndDate.value
                      ? moment(leave.leaveEndDate.value).year().toString()
                      : moment().year().toString(),
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </React.Fragment>
        ) : (
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileDatePicker
                // required
                closeOnSelect
                // style={{ width: '100%' }}
                className={styles.leaveDatePicker}
                // inputVariant="outlined"
                label="Leave Date"
                minDate={!props.isHR ? Moment(sevenDaysPrior) : undefined}
                // margin="dense"
                // size="small"
                // id="date-picker-dialog"
                format="DD/MM/YYYY"
                value={leave.leaveDate.value ? Moment(leave.leaveDate.value) : undefined}
                // error={!!leave.leaveDate.error}
                onChange={handleDateChange}
                // KeyboardButtonProps={{
                //   'aria-label': 'change date',
                // }}
                // InputProps={{ readOnly: true }}
                slotProps={{
                  textField: {
                    required: true,
                    error: !!leave.leaveDate.error,
                    readOnly: true,
                    size: 'small',
                    variant: 'outlined',
                    margin: 'dense',
                  },
                  toolbar: DatePickerToolbarStyles,
                  actionBar: {
                    actions: ['cancel', 'accept'],
                  },
                }}
                sx={{ width: '100%' }}
                localeText={{
                  toolbarTitle: leave.leaveDate.value
                    ? moment(leave.leaveDate.value).year().toString()
                    : moment().year().toString(),
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: leave.isHalfDay.value === '1' ? 6 : 12 }}>
          <FormControl style={{ width: '100%' }} margin="dense">
            <Autocomplete
              id="employee-select"
              size="small"
              key={defaultEmployee}
              loading={props.isLoading}
              value={leave.coWorker.value}
              onChange={(_event, newValue: any) => {
                if (typeof newValue === 'string') {
                  handleCoWorkerChange({ username: newValue })
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  handleCoWorkerChange({ username: newValue.inputValue })
                } else {
                  handleCoWorkerChange(newValue)
                }
              }}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                  return option
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue
                }
                // Regular option
                return option.username
              }}
              filterOptions={(options: PointPersonSelectDto[], params: any): any => {
                const filtered = filter(options, params)

                // Suggest the creation of a new value
                if (params.inputValue !== '') {
                  filtered.push({
                    inputValue: params.inputValue,
                    username: `Add "${params.inputValue}"`,
                  })
                }

                return filtered
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={props.pointPersons.map(
                (employ): PointPersonSelectDto => ({ username: employ.username })
              )}
              renderOption={(props, option: PointPersonSelectDto) => (
                <li {...props}>
                  <div>{option.username}</div>
                </li>
              )}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  required={!props.isHR}
                  error={!!leave.coWorker.error}
                  variant="outlined"
                  label="Point Person"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required={!props.isHR}
            style={{ width: '100%' }}
            id="leaveNote"
            label="Leave Note"
            variant="outlined"
            size="small"
            color="primary"
            rows={4}
            multiline
            inputProps={{
              maxLength: 255,
            }}
            className={styles.leaveNoteTextField}
            value={leave.leaveNote.value}
            onChange={(event) => handleChange('leaveNote', event.target.value)}
            error={!!leave.leaveNote.error}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <PrimaryButton
            buttonText="Submit"
            buttonTextLoading="Submitting"
            onClickFunction={validateForm}
            isLoading={props.isLoading}
          />
          <Button
            style={{ marginLeft: '10px' }}
            variant="contained"
            color="primary"
            onClick={resetForm}
          >
            RESET
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default MarkingLeaveForm
