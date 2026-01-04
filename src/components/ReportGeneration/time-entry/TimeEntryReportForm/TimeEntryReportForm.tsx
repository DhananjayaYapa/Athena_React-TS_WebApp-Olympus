import { Button, CircularProgress, Grid, Paper, TextField } from '@mui/material'
import { Autocomplete } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import DatePickerToolbarStyles from '../../../../assets/theme/mobileDatePicker'
import { GetAllSbuListDataDto, SbuTeamUsersDto } from '../../../../utilities/models'
import { TimeEntryFilterFormDto } from '../../../../utilities/models/ReportGeneration/TimeEntryReport.model'
import styles from './TimeEntryReportForm.module.scss'

const TimeEntryReportForm: React.FC<{
  sbuList: GetAllSbuListDataDto[]
  sbuUserList: SbuTeamUsersDto[]
  reportFilterFormData: TimeEntryFilterFormDto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestForReport(): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterHandleChange: (property: string, value: any) => void
  handleInputFocus(property: string): void
  clearFilters(): void
  reqReportIsLoading: boolean
  onSubmitError: boolean
}> = (props) => {
  const listOptions = props.sbuList.map((sbu) => ({ name: sbu.sbuName, id: sbu.sbuId }))
  const sbuUserListOptions = props.sbuUserList.map((user) => ({
    name: user.username,
    id: user.userId,
  }))
  return (
    <>
      <Paper square elevation={0}>
        <Grid container direction="row" spacing={2}>
          <Grid size={{ xs: 6, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileDatePicker
                label="Start Date"
                closeOnSelect
                maxDate={moment()}
                format="MM/DD/YYYY"
                value={
                  props.reportFilterFormData.startDate.value
                    ? moment(props.reportFilterFormData.startDate.value)
                    : null
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small',
                    error: Boolean(props.reportFilterFormData.startDate.error),
                    helperText: props.reportFilterFormData.startDate.error,
                    required: props.reportFilterFormData.startDate.isRequired,
                  },
                  inputAdornment: {
                    position: 'end',
                  },
                  toolbar: DatePickerToolbarStyles,
                  actionBar: {
                    actions: ['cancel', 'accept'],
                  },
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={() => {}}
                onAccept={(value: moment.Moment | null) => {
                  if (value) {
                    props.onFilterHandleChange('startDate', moment(value))
                  }
                }}
                localeText={{
                  toolbarTitle: props.reportFilterFormData.startDate.value
                    ? moment(props.reportFilterFormData.startDate.value).year().toString()
                    : moment().year().toString(),
                }}
                onOpen={() => {
                  if (!props.reportFilterFormData.startDate.value) {
                    props.onFilterHandleChange('startDate', new Date())
                  }
                }}
                onClose={() => {
                  if (!props.reportFilterFormData.startDate.value) {
                    props.onFilterHandleChange('startDate', moment())
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 6, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileDatePicker
                label="End Date"
                closeOnSelect
                disabled={!props.reportFilterFormData.startDate.value}
                disableFuture={props.reportFilterFormData.endDate.disableFuture}
                format="MM/DD/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small',
                    error: Boolean(props.reportFilterFormData.endDate.error),
                    helperText: props.reportFilterFormData.endDate.error,
                    required: props.reportFilterFormData.endDate.isRequired,
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
                  props.reportFilterFormData.startDate.value
                    ? moment(props.reportFilterFormData.startDate.value)
                    : undefined
                }
                maxDate={
                  props.reportFilterFormData.endDate.value
                    ? moment(props.reportFilterFormData.endDate.value)
                    : undefined
                }
                value={
                  props.reportFilterFormData.endDate.value
                    ? moment(props.reportFilterFormData.endDate.value)
                    : null
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(value: any) => props.onFilterHandleChange('endDate', new Date(value))}
                localeText={{
                  toolbarTitle: props.reportFilterFormData.endDate.value
                    ? moment(props.reportFilterFormData.endDate.value).year().toString()
                    : moment().year().toString(),
                }}
                onOpen={() => {
                  if (!props.reportFilterFormData.endDate.value) {
                    props.onFilterHandleChange('endDate', null)
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 6, sm: 6 }}>
            <Autocomplete
              size="small"
              options={listOptions}
              getOptionLabel={(option) => option?.name ?? ''}
              disabled={
                !props.reportFilterFormData.startDate.value ||
                !props.reportFilterFormData.endDate.value
              }
              value={props.reportFilterFormData.sbu.value}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(_event: any, value: any) => props.onFilterHandleChange('sbu', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="SBU"
                  variant="outlined"
                  required={props.reportFilterFormData.sbu.isRequired}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 6 }}>
            <Autocomplete
              multiple
              size="small"
              options={sbuUserListOptions}
              getOptionLabel={(option) => option?.name ?? ''}
              disabled={
                !props.reportFilterFormData.startDate.value ||
                !props.reportFilterFormData.endDate.value
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={props.reportFilterFormData.user.value}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(_event: any, value: any) => props.onFilterHandleChange('user', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employee"
                  variant="outlined"
                  required={props.reportFilterFormData.user.isRequired}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12 }} />
        </Grid>

        <Grid container size={{ xs: 12 }}>
          <Grid size={{ xs: 12 }}>
            <div>
              <Button
                type="submit"
                style={{ marginRight: 5 }}
                variant="contained"
                color="primary"
                onClick={props.requestForReport}
              >
                {props.reqReportIsLoading && (
                  <CircularProgress size="13px" className={styles.loading} />
                )}
                View Report
              </Button>
              <Button variant="contained" color="primary" onClick={props.clearFilters}>
                Reset
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

export default TimeEntryReportForm
