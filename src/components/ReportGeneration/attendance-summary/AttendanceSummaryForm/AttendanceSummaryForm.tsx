import { Paper, Grid, TextField, FormControlLabel } from '@mui/material'
import React from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import Button from '@mui/material/Button'
import { ResetKeys, TeamSelectDto, UserClientHierarchyDto } from '../../../../utilities/models'
import { Autocomplete } from '@mui/material'
import { PrimaryButton } from '../../../shared'
import Checkbox from '@mui/material/Checkbox'
import styles from './AttendanceSummaryForm.module.scss'
import moment from 'moment'
import DatePickerToolbarStyles from '../../../../assets/theme/mobileDatePicker'

const AttendanceSummaryForm: React.FC<{
  clientLoading: boolean
  isAttendanceSumReportResponseLoading: boolean
  userClientHierarchy: UserClientHierarchyDto[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues: any
  resetKeys: ResetKeys
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange(property: string, value: any): void
  onAttendanceSumSearch(): void
  reset(): void
  teamList?: TeamSelectDto[]
  isAttendanceSumProjectWiseReportResponseLoading?: boolean
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
                disableFuture={props.formValues.startDate.disableFuture}
                value={
                  props.formValues.startDate.value ? moment(props.formValues.startDate.value) : null
                }
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
                onChange={(value) => props.handleChange('startDate', value)}
                onOpen={() => {
                  if (!props.formValues.startDate.value) {
                    props.handleChange('startDate', moment())
                  }
                }}
                localeText={{
                  toolbarTitle: props.formValues.startDate.value
                    ? moment(props.formValues.startDate.value).year().toString()
                    : moment().year().toString(),
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileDatePicker
                label="End Date"
                format="MM/DD/YYYY"
                closeOnSelect
                disabled={!props.formValues.startDate.value}
                disableFuture={props.formValues.endDate.disableFuture}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small',
                    error: props.formValues.endDate.error,
                    helperText: props.formValues.endDate.error,
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
                value={
                  props.formValues.endDate.value ? moment(props.formValues.endDate.value) : null
                }
                onChange={(value) => props.handleChange('endDate', value)}
                onOpen={() => {
                  if (!props.formValues.endDate.value) {
                    props.handleChange('endDate', null)
                  }
                }}
                localeText={{
                  toolbarTitle: props.formValues.endDate.value
                    ? moment(props.formValues.endDate.value).year().toString()
                    : moment().year().toString(),
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              id="client-select"
              loading={props.clientLoading}
              size="small"
              key={props.resetKeys.client}
              options={props.userClientHierarchy}
              isOptionEqualToValue={(option, value) => option.clientId === value.clientId}
              getOptionLabel={(option) => option.clientName}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(_event: any, value: any) => props.handleChange('client', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client"
                  variant="outlined"
                  required={props.formValues.client.isRequired}
                  error={!!props.formValues.client.error}
                  helperText={props.formValues.client.error}
                />
              )}
            />
          </Grid>
          {props.teamList && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                id="client-select"
                loading={props.clientLoading}
                size="small"
                key={props.resetKeys.team}
                options={props.teamList}
                isOptionEqualToValue={(option, value) => option.teamId === value.teamId}
                getOptionLabel={(option) => option.teamName}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(_event: any, value: any) => props.handleChange('project', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project"
                    variant="outlined"
                    required={props.formValues.project.isRequired}
                    error={!!props.formValues.project.error}
                    helperText={props.formValues.project.error}
                  />
                )}
              />
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  value={props.formValues.billing.value}
                  checked={props.formValues.billing.checked}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(_event: any, value: any) => props.handleChange('billing', value)}
                />
              }
              label="Billing"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <PrimaryButton
              isLoading={
                props.isAttendanceSumReportResponseLoading
                  ? props.isAttendanceSumReportResponseLoading
                  : props.isAttendanceSumProjectWiseReportResponseLoading
                    ? props.isAttendanceSumProjectWiseReportResponseLoading
                    : false
              }
              className={styles.buttonDetailedAttendance}
              onClickFunction={props.onAttendanceSumSearch}
              buttonText="Download Report"
              buttonTextLoading="Downloading..."
              disabled={
                props.isAttendanceSumReportResponseLoading
                  ? props.isAttendanceSumReportResponseLoading
                  : props.isAttendanceSumProjectWiseReportResponseLoading
                    ? props.isAttendanceSumProjectWiseReportResponseLoading
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

export default AttendanceSummaryForm
