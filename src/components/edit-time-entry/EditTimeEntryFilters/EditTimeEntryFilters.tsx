import { FormControl, Grid, TextField } from '@mui/material'
import { Autocomplete } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import React, { useState } from 'react'
import { GetAttendanceInfoParamsDto, TeamSelectDto, UserDto } from '../../../utilities/models'
import { PrimaryButton } from '../../shared'
import styles from './EditTimeEntryFilters.module.scss'
import moment from 'moment'
import { validateFormData } from '../../../utilities/helpers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import DatePickerToolbarStyles from '../../../assets/theme/mobileDatePicker'

const EditTimeEntryFilters: React.FC<{
  teamList: Array<any>
  userList: UserDto[]
  isProcessing?: boolean
  onFilterChange(arg: GetAttendanceInfoParamsDto): void
  clearFilteredData(): void
}> = (props) => {
  const EDIT_TIME_ENTRY_ALLOWED_RANGE = 45
  const INITIAL_STATE = {
    fromDate: {
      value: new Date(),
      validator: 'date',
      isRequired: true,
      error: null,
      disable: false,
      minDate: moment().subtract(EDIT_TIME_ENTRY_ALLOWED_RANGE, 'days'),
      maxDate: moment(),
    },
    toDate: {
      value: new Date(),
      validator: 'date',
      isRequired: true,
      error: null,
      disable: false,
      minDate: moment().subtract(EDIT_TIME_ENTRY_ALLOWED_RANGE, 'days'),
      maxDate: moment(),
    },
    team: {
      value: {} as TeamSelectDto,
      validator: 'object',
      isRequired: false,
      error: null,
      disable: false,
    },
    username: { value: '', validator: 'text', isRequired: false, error: null, disable: false },
  }
  const [filters, setFilters] = useState(INITIAL_STATE)

  const handleChange = (property: string, value: any) => {
    switch (property) {
      case 'fromDate':
        setFilters({
          ...filters,
          fromDate: {
            ...filters.fromDate,
            value: value,
            error: null,
          },
          toDate: {
            ...filters.toDate,
            minDate: value,
          },
        })
        break
      case 'toDate':
        setFilters({
          ...filters,
          toDate: {
            ...filters.toDate,
            value: value,
            error: null,
          },
          fromDate: {
            ...filters.fromDate,
            maxDate: value,
          },
        })
        break
      default:
        setFilters({
          ...filters,
          [property]: {
            ...filters[property as keyof typeof filters],
            value: value,
            error: null,
          },
        })
    }
  }

  const filterTimeEntries = async () => {
    const [validatedData, isValid] = await validateFormData(filters)
    setFilters(validatedData)
    if (isValid) {
      const getAttendanceInfoParams: GetAttendanceInfoParamsDto = {
        startDate: moment(filters.fromDate.value).format('YYYY-MM-DD'),
        endDate: moment(filters.toDate.value).format('YYYY-MM-DD'),
        teamId: filters.team.value?.teamId ? filters.team.value.teamId : undefined,
        username: filters.username.value ? filters.username.value : undefined,
      }
      props.onFilterChange(getAttendanceInfoParams)
    }
  }

  const clearFilters = async () => {
    setFilters(INITIAL_STATE)
    props.clearFilteredData()
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDatePicker
              className={styles.fullWidth}
              disabled={filters.fromDate.disable}
              minDate={filters.fromDate.minDate}
              maxDate={filters.fromDate.maxDate}
              value={moment(filters.fromDate.value)}
              onChange={(value) => handleChange('fromDate', value)}
              disableFuture
              format="MM/DD/YYYY"
              closeOnSelect
              slotProps={{
                textField: {
                  margin: 'dense',
                  variant: 'outlined',
                  size: 'small',
                  label: 'From',
                  error: !!filters.fromDate.error,
                  required: filters.fromDate.isRequired,
                  InputProps: { readOnly: true },
                },
                toolbar: DatePickerToolbarStyles,
                actionBar: {
                  actions: ['cancel', 'accept'],
                },
              }}
              localeText={{
                toolbarTitle: moment(filters.fromDate.value).year().toString(),
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDatePicker
              className={styles.fullWidth}
              disabled={filters.toDate.disable}
              minDate={filters.toDate.minDate}
              maxDate={filters.toDate.maxDate}
              label="To"
              closeOnSelect
              disableFuture
              format="MM/DD/YYYY"
              value={moment(filters.toDate.value)}
              onChange={(value) => handleChange('toDate', value)}
              slotProps={{
                textField: {
                  margin: 'dense',
                  variant: 'outlined',
                  size: 'small',
                  error: !!filters.toDate.error,
                  required: filters.toDate.isRequired,
                  InputProps: { readOnly: true },
                },
                toolbar: DatePickerToolbarStyles,
                actionBar: {
                  actions: ['cancel', 'accept'],
                },
              }}
              localeText={{
                toolbarTitle: moment(filters.toDate.value).year().toString(),
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl className={styles.fullWidth} margin="dense">
            <Autocomplete
              size="small"
              options={props.teamList.map((team) => {
                return { teamName: team.teamName, teamId: team.teamId }
              })}
              getOptionLabel={(option: any) => option.teamName || ''}
              disabled={filters.team.disable}
              value={filters.team.value}
              isOptionEqualToValue={(option: TeamSelectDto, value: TeamSelectDto) =>
                option.teamId === value.teamId
              }
              onChange={(_event, value) => handleChange('team', value)}
              renderInput={(params) => (
                <TextField
                  required={filters.team.isRequired}
                  error={!!filters.team.error}
                  {...params}
                  label="Team"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl className={styles.fullWidth} margin="dense">
            <Autocomplete
              size="small"
              options={props.userList && props.userList?.map((user: UserDto) => user.username)}
              disabled={filters.username.disable}
              value={filters.username.value}
              isOptionEqualToValue={(option: string, value: string) => option === value}
              onChange={(_event, value) => handleChange('username', value)}
              renderInput={(params) => (
                <TextField
                  required={filters.username.isRequired}
                  error={!!filters.username.error}
                  {...params}
                  label="Username"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <PrimaryButton
            isLoading={props.isProcessing ? props.isProcessing : false}
            className={styles.buttonGroupMargin}
            onClickFunction={filterTimeEntries}
            buttonText="Search Records"
            buttonTextLoading="Search Records"
          />
          <PrimaryButton
            isLoading={false}
            onClickFunction={clearFilters}
            buttonText="Clear Records"
            buttonTextLoading="Clear Records"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default EditTimeEntryFilters
