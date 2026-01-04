import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import { LocalizationProvider, MobileTimePicker, MobileDatePicker } from '@mui/x-date-pickers'
import styles from './AddTimeEntryForm.module.scss'
import { APP_ROUTES, TIME_ENTRY_LOCATION_IDS, TIME_ENTRY_TYPES } from '../../../utilities/constants'
import { PrimaryButton } from '../../shared'
import { Moment } from 'moment'
import moment from 'moment'
import { validateFormData } from '../../../utilities/helpers'
import { AttendanceInfoObjectDto, TimeEntryRawDataDto } from '../../../utilities/models'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import DatePickerToolbarStyles from '../../../assets/theme/mobileDatePicker'
import TimePickerStyles from '../../../assets/theme/mobileTimePicker'
import { useNavigate } from 'react-router-dom'

type AddTimeEntryProps = {
  isEditingRecord?: AttendanceInfoObjectDto
  timeEntryMinDate?: Moment
  isProcessing?: boolean
  onSaveTimeEntry(arg: TimeEntryRawDataDto): void
  onReset(): void
}

const AddTimeEntryForm = forwardRef<any, AddTimeEntryProps>((props, ref) => {
  const INITIAL_STATE = {
    date: { value: new Date(), validator: 'date', isRequired: true, error: null, disable: false },
    workFromLocation: {
      value: TIME_ENTRY_LOCATION_IDS.WORK_FROM_HOME,
      validator: 'number',
      isRequired: true,
      error: null,
      disable: false,
    },
    timeEntryType: {
      value: TIME_ENTRY_TYPES.START,
      validator: 'number',
      isRequired: true,
      error: null,
      disable: false,
    },
    startTime: {
      value: new Date() as Date | null,
      validator: 'date',
      isRequired: true,
      error: null,
      disable: false,
    },
    endTime: {
      value: null as Date | null,
      validator: 'date',
      isRequired: false,
      error: null,
      disable: true,
    },
  }

  const [timeEntryData, setTimeEntryData] = useState(INITIAL_STATE)
  const [tempEndValue, setTempEndValue] = useState<Moment | null>(null)
  const [tempStartValue, setTempStartValue] = useState<Moment | null>(null)

  useImperativeHandle(ref, () => ({
    resetFormData() {
      setTimeEntryData(INITIAL_STATE)
    },
  }))

  // handle edit data
  React.useEffect(() => {
    if (!!props.isEditingRecord && Object.keys(props.isEditingRecord).length > 0) {
      setTimeEntryData({
        ...timeEntryData,
        date: {
          ...timeEntryData.date,
          value: new Date(props.isEditingRecord.attendanceDate),
          disable: true,
        },
        workFromLocation: {
          ...timeEntryData.workFromLocation,
          value: props.isEditingRecord.locationId
            ? props.isEditingRecord.locationId
            : TIME_ENTRY_LOCATION_IDS.WORK_FROM_HOME,
          disable: !!props.isEditingRecord.locationId,
        },
        timeEntryType: {
          ...timeEntryData.timeEntryType,
          value: props.isEditingRecord.startTime
            ? TIME_ENTRY_TYPES.START_END
            : TIME_ENTRY_TYPES.START,
          disable: !!props.isEditingRecord.startTime,
        },
        startTime: {
          ...timeEntryData.startTime,
          value: props.isEditingRecord.startTime
            ? new Date(`${props.isEditingRecord.attendanceDate} ${props.isEditingRecord.startTime}`)
            : new Date(),
        },
        endTime: {
          ...timeEntryData.endTime,
          value: props.isEditingRecord.endTime
            ? new Date(`${props.isEditingRecord.attendanceDate} ${props.isEditingRecord.endTime}`)
            : props.isEditingRecord.startTime
              ? new Date()
              : null,
          isRequired: !!props.isEditingRecord.startTime,
          disable: !props.isEditingRecord.startTime,
        },
      })
    }
  }, [props.isEditingRecord])

  const handleChange = (property: string, value: any) => {
    switch (property) {
      case 'date':
        setTimeEntryData({
          ...timeEntryData,
          date: {
            ...timeEntryData.date,
            value: value,
            error: null,
          },
        })
        break
      case 'timeEntryType':
        setTimeEntryData({
          ...timeEntryData,
          timeEntryType: {
            ...timeEntryData.timeEntryType,
            value: value,
            error: null,
          },
          endTime: {
            ...timeEntryData.endTime,
            disable: value === TIME_ENTRY_TYPES.START,
            isRequired: value !== TIME_ENTRY_TYPES.START,
            value: value === TIME_ENTRY_TYPES.START ? null : new Date(),
            error: null,
          },
        })
        break

      case 'startTime':
        setTimeEntryData({
          ...timeEntryData,
          startTime: {
            ...timeEntryData.startTime,
            value: value,
            error: null,
          },
        })
        break

      case 'endTime':
        setTimeEntryData({
          ...timeEntryData,
          endTime: {
            ...timeEntryData.endTime,
            value: value,
            error: null,
          },
        })
        break
      default:
        setTimeEntryData({
          ...timeEntryData,
          [property]: {
            ...timeEntryData[property as keyof typeof timeEntryData],
            value: value,
            error: null,
          },
        })
    }
  }

  const saveTimeEntry = async () => {
    const [validatedData, isValid] = await validateFormData(timeEntryData)
    setTimeEntryData(validatedData)
    if (isValid) {
      // map attendance date for start & end times
      const startTime = timeEntryData.startTime.value
        ? new Date(
            `${moment(timeEntryData.date.value).format('YYYY-MM-DD')} ${moment(timeEntryData.startTime.value).format('HH:mm:ss')}`
          )
        : null
      const endTime = timeEntryData.endTime.value
        ? new Date(
            `${moment(timeEntryData.date.value).format('YYYY-MM-DD')} ${moment(timeEntryData.endTime.value).format('HH:mm:ss')}`
          )
        : null

      const timeEntryRawData: TimeEntryRawDataDto = {
        date: timeEntryData.date.value,
        location: timeEntryData.workFromLocation.value,
        timeEntryType: timeEntryData.timeEntryType.value,
        startTime: startTime,
        endTime: endTime,
        isUpdate: !!props.isEditingRecord && Object.keys(props.isEditingRecord).length > 0,
      }
      props.onSaveTimeEntry(timeEntryRawData)
    }
  }

  const resetTimeEntry = () => {
    setTimeEntryData(INITIAL_STATE)
    props.onReset()
  }
  const navigate = useNavigate()
  const goToAddTimeEntries = () => {
    navigate(APP_ROUTES.MANAGE_TIME_ENTRIES)
  }

  return (
    <React.Fragment>
      <form>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileDatePicker
                className={styles.fullWidth}
                minDate={props.timeEntryMinDate}
                label="Date"
                closeOnSelect
                disableFuture
                format="MM/DD/YYYY"
                disabled={timeEntryData.date.disable}
                value={timeEntryData.date.value ? moment(timeEntryData.date.value) : undefined}
                onChange={(value) => handleChange('date', value)}
                slotProps={{
                  textField: {
                    margin: 'dense',
                    variant: 'outlined',
                    size: 'small',
                    error: !!timeEntryData.date.error,
                    required: timeEntryData.date.isRequired,
                    InputProps: { readOnly: true },
                  },
                  toolbar: DatePickerToolbarStyles,
                  actionBar: {
                    actions: ['cancel', 'accept'],
                  },
                }}
                localeText={{
                  toolbarTitle: timeEntryData.date.value
                    ? moment(timeEntryData.date.value).year().toString()
                    : moment().year().toString(),
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <RadioGroup
              aria-label="workFromLocation"
              name="workFromLocation"
              row={true}
              value={timeEntryData.workFromLocation.value}
              onChange={(event) => handleChange('workFromLocation', Number(event.target.value))}
            >
              <FormControlLabel
                value={TIME_ENTRY_LOCATION_IDS.WORK_FROM_HOME}
                control={<Radio size="small" color="primary" />}
                label="Work from Home"
                disabled={timeEntryData.workFromLocation.disable}
              />
              <FormControlLabel
                value={TIME_ENTRY_LOCATION_IDS.WORK_FROM_OFFICE}
                control={<Radio size="small" color="primary" />}
                label="Work from Office"
                disabled={timeEntryData.workFromLocation.disable}
              />
            </RadioGroup>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <RadioGroup
              aria-label="timeEntryType"
              name="timeEntryType"
              row={true}
              value={timeEntryData.timeEntryType.value}
              onChange={(event) => handleChange('timeEntryType', Number(event.target.value))}
            >
              <FormControlLabel
                value={1}
                control={<Radio size="small" color="primary" />}
                label="Start Time"
                disabled={timeEntryData.timeEntryType.disable}
              />
              <FormControlLabel
                value={2}
                control={<Radio size="small" color="primary" />}
                label="Start & End Time"
                disabled={timeEntryData.timeEntryType.disable}
              />
            </RadioGroup>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileTimePicker
                className={styles.fullWidth}
                label="Start Time"
                disabled={timeEntryData.startTime.disable}
                slotProps={{
                  ...TimePickerStyles,
                  dialog: {
                    onClose: () => {
                      setTempEndValue(null)
                    },
                  },
                  textField: {
                    variant: 'outlined',
                    size: 'small',
                    margin: 'dense',
                    error: !!timeEntryData.startTime.error,
                    required: timeEntryData.startTime.isRequired,
                    InputProps: { readOnly: false },
                  },
                  openPickerIcon: <AccessTimeOutlinedIcon />,
                }}
                value={
                  tempStartValue ??
                  (timeEntryData.startTime.value
                    ? moment(timeEntryData.startTime.value)
                    : undefined)
                }
                onOpen={() => setTempStartValue(moment(timeEntryData.startTime.value))} // initialize staging value
                onChange={(value) => setTempStartValue(moment(value))} // update only staging state
                onAccept={(value) => {
                  setTempStartValue(null)
                  handleChange('startTime', value) // commit to global form
                }}
                onClose={() => setTempStartValue(null)} // discard if canceled
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileTimePicker
                className={styles.fullWidth}
                label="End Time"
                value={
                  tempEndValue ??
                  (timeEntryData.endTime.value ? moment(timeEntryData.endTime.value) : null)
                }
                disabled={timeEntryData.endTime.disable}
                slotProps={{
                  ...TimePickerStyles,
                  dialog: {
                    onClose: () => {
                      setTempEndValue(null)
                    },
                  },
                  textField: {
                    variant: 'outlined',
                    size: 'small',
                    margin: 'dense',
                    error: !!timeEntryData.endTime.error,
                    required: timeEntryData.endTime.isRequired,
                    InputProps: { readOnly: false },
                  },
                  openPickerIcon: <AccessTimeOutlinedIcon />,
                }}
                onOpen={() => setTempEndValue(moment(timeEntryData.endTime.value))} // initialize staging value
                onChange={(value) => setTempEndValue(moment(value))} // update only staging state
                onAccept={(value) => {
                  setTempEndValue(null)
                  handleChange('endTime', value) // commit to global form
                }}
                onClose={() => setTempEndValue(null)} // discard if canceled
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            <PrimaryButton
              isLoading={props.isProcessing ? props.isProcessing : false}
              disabled={props.isProcessing}
              className={styles.buttonGroupMargin}
              onClickFunction={saveTimeEntry}
              buttonText="Save Attendance"
              buttonTextLoading="Save Attendance"
            />
            <PrimaryButton
              isLoading={false}
              onClickFunction={resetTimeEntry}
              buttonText="Reset"
              className={styles.buttonGroupMargin}
              buttonTextLoading="Reset"
            />
            <PrimaryButton
              isLoading={false}
              onClickFunction={goToAddTimeEntries}
              buttonText="Add Time Entries"
              buttonTextLoading="Add Time Entries"
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  )
})
export default AddTimeEntryForm
