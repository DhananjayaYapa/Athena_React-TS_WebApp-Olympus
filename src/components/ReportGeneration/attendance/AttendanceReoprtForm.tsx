import { Paper, Grid, TextField, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import Button from '@mui/material/Button'
import CustomIndicator from '../../shared/CustomIndicator/CustomIndicator'
import {
  AttendanceInfoParams,
  UserClientHierarchyDto,
  UserClientHierarchyUserDto,
  UserClientHierarchyTeamsDto,
} from '../../../utilities/models'
import { CustomAlert } from '../..'
import { v4 as uuidv4 } from 'uuid'
import { Autocomplete } from '@mui/material'
import moment from 'moment'
import DatePickerToolbarStyles from '../../../assets/theme/mobileDatePicker'

const AttendanceReportForm: React.FC<{
  onAttendanceSearch(filters: object): void
  isUsersListLoading: boolean
  isAttendanceReportResponseLoading: boolean
  reset(): void
  userClientHierarchy: UserClientHierarchyDto[]
}> = (props) => {
  const INITIAL_VALUES: AttendanceInfoParams = {
    username: '',
    endDate: null,
    startDate: null,
    teamId: '',
    clientId: '',
  }
  const INITIAL_TEAM: UserClientHierarchyTeamsDto = {
    teamId: 0,
    teamName: '',
    users: [],
  }

  const [defaultEmployee, setDefaultEmployee] = useState(uuidv4())
  const [defaultClient, setDefaultClient] = useState(uuidv4())
  const [defaultTeam, setDefaultTeam] = useState(uuidv4())
  const [values, setValues] = useState(INITIAL_VALUES)
  const [users, setUsers] = useState<UserClientHierarchyUserDto[]>([])

  const formatDate = (date: any) => {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  const [open, setOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    setTimeout(() => setOpen(false), 4000)
  }, [open])

  const [clientIdRequiredError, setClientIdRequiredError] = useState<boolean>(false)
  const [startDateRequiredError, setStartDateRequiredError] = useState<boolean>(false)
  const [endDateRequiredError, setEndDateRequiredError] = useState<boolean>(false)

  //  handle search button clik event
  const onAttendanceSearch = (e: any) => {
    setOpen(false)
    if (
      values.clientId === null ||
      values.clientId === '' ||
      values.startDate === null ||
      values.endDate === null
    ) {
      if (values.clientId === '' || values.clientId === null) {
        e.preventDefault()
        setClientIdRequiredError(true)
      } else {
        e.preventDefault()
        setClientIdRequiredError(false)
      }

      if (values.startDate === null) {
        e.preventDefault()
        setStartDateRequiredError(true)
      } else {
        e.preventDefault()
        setStartDateRequiredError(false)
      }

      if (values.endDate === null) {
        e.preventDefault()
        setEndDateRequiredError(true)
      } else {
        e.preventDefault()
        setEndDateRequiredError(false)
      }

      setOpen(true)
    } else {
      setOpen(false)
      e.preventDefault()

      props.onAttendanceSearch(values)
      setClientIdRequiredError(false)
      setStartDateRequiredError(false)
      setEndDateRequiredError(false)
    }
  }

  //  handle reset button clik event
  const onReset = () => {
    setFuture(new Date())
    setPast(undefined)
    setDefaultEmployee(uuidv4())
    setDefaultClient(uuidv4())
    setDefaultTeam(uuidv4())
    setClientIdRequiredError(false)
    setStartDateRequiredError(false)
    setEndDateRequiredError(false)
    setValues(INITIAL_VALUES)
    setTeam(INITIAL_TEAM)
    setUsers([])
    props.reset()
    // props.reset({ username: '' })
  }

  const [clientTeamsLocal, setClientTeamsLocal] = useState<any[]>([])
  const [, setTeam] = useState<UserClientHierarchyTeamsDto>(INITIAL_TEAM)

  const onClientSelect = (_event: any, value: any) => {
    if (value) {
      setDefaultTeam(uuidv4())
      setDefaultEmployee(uuidv4())
      setValues({ ...values, teamId: '', clientId: value.clientId, username: '' })
      setTeam(INITIAL_TEAM)
      const clientTeams = props.userClientHierarchy.filter(
        (client) => client.clientId === value.clientId
      )
      setClientTeamsLocal(clientTeams[0].teams)
      const usersList: UserClientHierarchyUserDto[] = []
      clientTeams[0].teams.map((team) =>
        team.users.map((user: any) => {
          if (usersList.findIndex((listUser) => listUser.userId === user.userId) === -1) {
            usersList.push(user)
          }
        })
      )
      setUsers(usersList)
      setClientIdRequiredError(false)
    } else {
      setDefaultEmployee(uuidv4())
      setDefaultClient(uuidv4())
      setDefaultTeam(uuidv4())
      setTeam(INITIAL_TEAM)
      setValues({ ...values, teamId: '', clientId: '', username: '' })
      setUsers([])
      // props.reset({ username: '' })
    }
  }

  const [future, setFuture] = useState<Date>()
  const [minimum, setMinimum] = useState<Date>()

  const onSelectStartDate = (date: any) => {
    setValues({
      ...values,
      startDate: formatDate(date),
      endDate: null,
    })

    // setFuture(addDays(date, 44))
    setFuture(moment(date).add(44, 'days').toDate())

    // setMinimum(addDays(date, 0))
    setMinimum(moment(date).add(0, 'days').toDate())

    setStartDateRequiredError(false)
  }

  const [, setPast] = useState<Date>()

  const onTeamChange = (_event: any, value: UserClientHierarchyTeamsDto) => {
    setDefaultEmployee(uuidv4())
    setTeam(value)
    if (!value) {
      const clientTeams = props.userClientHierarchy.filter(
        (client) => client.clientId === Number(values.clientId)
      )
      onClientSelect(null, clientTeams[0])
    }
    setValues({ ...values, teamId: value ? value.teamId : '', username: '' })
    if (value) {
      setUsers(value.users)
    }
  }

  return (
    <>
      {open == true ? (
        <CustomAlert displayText="Please fill all required fields" severity="warning" />
      ) : (
        <div></div>
      )}
      <form onSubmit={(e) => onAttendanceSearch(e)} noValidate>
        <Paper style={{ padding: 10 }} square elevation={0}>
          <Grid container direction="row" spacing={3}>
            <Grid direction="column" size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <MobileDatePicker
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      label: 'Start Date',
                      size: 'small',
                      fullWidth: true,
                      error: startDateRequiredError,
                      required: true,
                    },
                    inputAdornment: { position: 'end' },
                    toolbar: DatePickerToolbarStyles,
                    actionBar: {
                      actions: ['cancel', 'accept'],
                    },
                  }}
                  closeOnSelect
                  format="DD/MM/YYYY"
                  value={values.startDate ? moment(values.startDate) : null}
                  disableFuture={true}
                  onChange={() => {}}
                  onAccept={(event: moment.Moment | null) => {
                    if (event) {
                      onSelectStartDate(event)
                    }
                  }}
                  onOpen={() => {
                    if (!values.startDate) {
                      onSelectStartDate(moment())
                    }
                  }}
                  onClose={() => {
                    if (!values.startDate) {
                      onSelectStartDate(moment())
                    }
                  }}
                  localeText={{
                    toolbarTitle: values.startDate
                      ? moment(values.startDate).year().toString()
                      : moment().year().toString(),
                  }}
                />
              </LocalizationProvider>
              {startDateRequiredError === true ? (
                <small style={{ color: '#ff0000' }}>Start Date is required</small>
              ) : null}
            </Grid>
            <Grid direction="column" size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <MobileDatePicker
                  slotProps={{
                    textField: {
                      size: 'small',
                      variant: 'outlined',
                      label: 'End Date',
                      fullWidth: true,
                      error: endDateRequiredError,
                      required: true,
                    },
                    inputAdornment: { position: 'end' },
                    toolbar: DatePickerToolbarStyles,
                    actionBar: {
                      actions: ['cancel', 'accept'],
                    },
                  }}
                  closeOnSelect
                  disabled={!values.startDate}
                  disableFuture={true}
                  minDate={moment(minimum)}
                  maxDate={moment(future)}
                  format="DD/MM/YYYY"
                  value={values.endDate ? moment(values.endDate) : null}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(date: any) => {
                    setValues({
                      ...values,
                      endDate: formatDate(date),
                    })
                    setEndDateRequiredError(false)
                  }}
                  onOpen={() => {
                    if (!values.endDate) {
                      setValues({
                        ...values,
                        endDate: null,
                      })
                    }
                  }}
                  // onClose={() => {
                  //   setValues({
                  //     ...values,
                  //     endDate: formatDate(moment()),
                  //   })
                  // }}
                  localeText={{
                    toolbarTitle: values.endDate
                      ? moment(values.endDate).year().toString()
                      : moment().year().toString(),
                  }}
                />
              </LocalizationProvider>
              {endDateRequiredError === true ? (
                <small style={{ color: '#ff0000' }}>End Date is required</small>
              ) : null}
            </Grid>
            <Grid direction="column" size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                id="client-select"
                size="small"
                key={defaultClient}
                options={props.userClientHierarchy}
                getOptionLabel={(option) => option.clientName}
                // disableClearable
                onChange={onClientSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    required={true}
                    variant="outlined"
                    error={clientIdRequiredError}
                  />
                )}
              />
              {clientIdRequiredError === true ? (
                <small style={{ color: '#ff0000' }}>Client ID is required</small>
              ) : null}
            </Grid>
            <Grid direction="column" size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                key={defaultTeam}
                size="small"
                options={clientTeamsLocal}
                getOptionLabel={(option) => option.teamName}
                // disableClearable
                disabled={values.clientId === ''}
                onChange={onTeamChange}
                renderInput={(params) => <TextField {...params} label="Team" variant="outlined" />}
              />
            </Grid>
            <Grid direction="column" size={{ xs: 12 }}>
              <Autocomplete
                key={defaultEmployee}
                size="small"
                options={users}
                getOptionLabel={(option) => option.username}
                // disableClearable
                disabled={values.clientId === ''}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(_event: any, value: any) =>
                  setValues({ ...values, username: value ? value.username : '' })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Employee" variant="outlined" />
                )}
              />
              {props.isUsersListLoading ? (
                // || props.isAttendanceReportResponseLoading
                <CustomIndicator />
              ) : (
                <div />
              )}
            </Grid>
            <Grid direction="column" size={{ xs: 12, sm: 6 }}></Grid>
          </Grid>

          <Grid container size={{ xs: 12 }}>
            <Grid size={{ xs: 12 }}>
              <div>
                <Button
                  type="submit"
                  style={{ marginRight: 5 }}
                  variant="contained"
                  color="primary"
                  // onClick={(e) => onAttendanceSearch(e)}
                >
                  {props.isAttendanceReportResponseLoading && (
                    <CircularProgress sx={{ color: '#ffffff' }} size={20} />
                  )}
                  view report
                </Button>
                <Button variant="contained" color="primary" onClick={onReset}>
                  Reset
                </Button>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </>
  )
}

export default AttendanceReportForm
