import { Paper, Grid, TextField, FormControlLabel, Checkbox } from '@mui/material'
import React from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import Button from '@mui/material/Button'
import {
  ResetKeys,
  UserClientHierarchyDto,
  UserClientHierarchyTeamsDto,
  UserClientHierarchyUserDto,
} from '../../../utilities/models'
import { Autocomplete } from '@mui/material'
import { PrimaryButton } from '../../shared'
import styles from './DetailedAttendanceReport.module.scss'
import moment from 'moment'
import DatePickerToolbarStyles from '../../../assets/theme/mobileDatePicker'

const DetailedAttendanceReportForm: React.FC<{
  isUsersListLoading: boolean
  isdetAttendanceReportResponseLoading: boolean
  userClientHierarchy: UserClientHierarchyDto[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues: any
  clientTeamsLocal: UserClientHierarchyTeamsDto[]
  users: UserClientHierarchyUserDto[]
  resetKeys: ResetKeys
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange(property: string, value: any): void
  onDetAttendanceSearch(): void
  reset(): void
}> = (props) => {
  return (
    <>
      <Paper style={{ padding: 10 }} square elevation={0}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileDatePicker
                label="Start Date"
                closeOnSelect
                format="MM/DD/YYYY"
                value={
                  props.formValues.startDate.value ? moment(props.formValues.startDate.value) : null
                }
                disableFuture={props.formValues.startDate.disableFuture}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value: any) => props.handleChange('startDate', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small',
                    error: props.formValues.startDate.error,
                    helperText: props.formValues.startDate.error ? 'Start Date is required' : null,
                    required: props.formValues.startDate.isRequired,
                  },
                  inputAdornment: {
                    position: 'end',
                  },
                  toolbar: DatePickerToolbarStyles,
                  actionBar: {
                    actions: ['cancel', 'accept'],
                  },
                }}
                localeText={{
                  toolbarTitle: props.formValues.startDate
                    ? moment(props.formValues.startDate.value).year().toString()
                    : moment().year().toString(),
                }}
                onOpen={() => {
                  if (!props.formValues.startDate.value) {
                    props.handleChange('startDate', moment())
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileDatePicker
                label="End Date"
                closeOnSelect
                disabled={!props.formValues.startDate.value}
                disableFuture={props.formValues.endDate.disableFuture}
                format="MM/DD/YYYY"
                value={
                  props.formValues.endDate.value ? moment(props.formValues.endDate.value) : null
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small',
                    error: props.formValues.endDate.error,
                    helperText: props.formValues.endDate.error ? 'End Date is required' : null,
                    required: props.formValues.endDate.isRequired,
                  },
                  inputAdornment: {
                    position: 'end',
                  },
                  toolbar: DatePickerToolbarStyles,
                  actionBar: {
                    actions: ['cancel', 'accept'],
                  },
                }}
                minDate={
                  props.formValues.endDate.previousDate
                    ? moment(props.formValues.endDate.previousDate)
                    : undefined
                }
                maxDate={
                  props.formValues.endDate.futureDate
                    ? moment(props.formValues.endDate.futureDate)
                    : undefined
                }
                localeText={{
                  toolbarTitle: props.formValues.endDate.value
                    ? moment(props.formValues.endDate.value).year().toString()
                    : moment().year().toString(),
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value: any) => props.handleChange('endDate', value)}
                onOpen={() => {
                  if (!props.formValues.endDate.value) {
                    props.handleChange('endDate', null)
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  value={props.formValues.getDisabled.value}
                  checked={props.formValues.getDisabled.checked}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(_event: any, value: any) => props.handleChange('getDisabled', value)}
                />
              }
              label="Show only enabled clients / teams"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              id="client-select"
              loading={props.isUsersListLoading}
              size="small"
              key={props.resetKeys.client}
              options={props.userClientHierarchy}
              isOptionEqualToValue={(option, value) => option.clientId === value.clientId}
              getOptionLabel={(option) => option.clientName}
              onChange={(_event: any, value: any) => props.handleChange('client', value)}
              renderInput={(params) => <TextField {...params} label="Client" variant="outlined" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              key={props.resetKeys.team}
              size="small"
              options={props.clientTeamsLocal}
              getOptionLabel={(option) => option.teamName}
              isOptionEqualToValue={(option, value) => option.teamId === value.teamId}
              disabled={props.formValues.clientId.value === ''}
              onChange={(_event: any, value: any) => props.handleChange('team', value)}
              renderInput={(params) => <TextField {...params} label="Team" variant="outlined" />}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              key={props.resetKeys.employee}
              size="small"
              options={props.users}
              getOptionLabel={(option) => option.username}
              isOptionEqualToValue={(option, value) => option.userId === value.userId}
              disabled={props.formValues.clientId.value === ''}
              onChange={(_event: any, value: any) => props.handleChange('username', value)}
              renderInput={(params) => (
                <TextField {...params} label="Employee" variant="outlined" />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <PrimaryButton
              isLoading={
                props.isdetAttendanceReportResponseLoading
                  ? props.isdetAttendanceReportResponseLoading
                  : false
              }
              className={styles.buttonDetailedAttendance}
              onClickFunction={props.onDetAttendanceSearch}
              buttonText="Download Report"
              buttonTextLoading="Downloading..."
              disabled={
                props.isdetAttendanceReportResponseLoading
                  ? props.isdetAttendanceReportResponseLoading
                  : false
              }
            />
            <Button
              variant="contained"
              color="primary"
              className={styles.resetBtnDetAtt}
              onClick={props.reset}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

export default DetailedAttendanceReportForm
