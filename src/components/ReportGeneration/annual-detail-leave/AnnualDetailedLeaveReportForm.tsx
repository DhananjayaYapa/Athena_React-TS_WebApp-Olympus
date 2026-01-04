import { Grid, TextField } from '@mui/material'
import React from 'react'
import { UserDto } from '../../../utilities/models'
import { Autocomplete } from '@mui/material'
import { PrimaryButton } from '../../shared'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import DatePickerToolbarStyles from '../../../assets/theme/mobileDatePicker'
import moment from 'moment'

const AnnualDetailedLeaveReportForm: React.FC<{
  userList: UserDto[]
  viewReport(): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange(property: string, value: any): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues: any
  isProcessing?: boolean
  //onFilterChange(arg: GetAttendanceInfoParamsDto): void
  // clearFilteredData(): void
}> = (props) => {
  // const INITIAL_STATE = {
  //   username: { value: '', validator: 'text', isRequired: false, error: null, disable: false },
  //   year: { value: '', isRequired: true, error: false },
  // }
  // const [filters, setFilters] = useState(INITIAL_STATE)

  //   const filterTimeEntries = async () => {
  //       const [validatedData, isValid] = await validateFormData(filters)
  //       setFilters(validatedData)
  //       if (isValid) {
  //           // const getAttendanceInfoParams: GetAttendanceInfoParamsDto = {
  //           //     startDate: moment(filters.fromDate.value).format('YYYY-MM-DD'),
  //           //     endDate: moment(filters.toDate.value).format('YYYY-MM-DD'),
  //           //     teamId: filters.team.value?.teamId ? filters.team.value.teamId : undefined,
  //           //     username: !!filters.username.value ? filters.username.value : undefined
  //           // }
  //           // props.onFilterChange(getAttendanceInfoParams)
  //       }
  //   }

  // const clearFilters = async () => {
  //   setFilters(INITIAL_STATE)
  //   props.clearFilteredData()
  // }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
          <Autocomplete
            size="small"
            options={props.userList.map((user: UserDto) => user.username)}
            disabled={props.formValues.username.disable}
            value={props.formValues.username.value}
            isOptionEqualToValue={(option: string, value: string) => option === value}
            onChange={(_event, value) => props.handleChange('username', value)}
            renderInput={(params) => (
              <TextField
                required={props.formValues.username.isRequired}
                error={!!props.formValues.username.error}
                helperText={props.formValues.username.error}
                {...params}
                label="Username"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDatePicker
              label="Year"
              views={['year']}
              closeOnSelect
              disableFuture
              value={props.formValues.year.value ? props.formValues.year.value : null}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  size: 'small',
                  placeholder: 'Year*',
                  error: props.formValues.year.error,
                  helperText: props.formValues.year.error,
                  required: props.formValues.year.isRequired,
                  fullWidth: true,
                },
                toolbar: DatePickerToolbarStyles,
                actionBar: {
                  actions: ['cancel', 'accept'],
                },
              }}
              localeText={{
                toolbarTitle: props.formValues.year.value
                  ? moment(props.formValues.year.value).year().toString()
                  : moment().year().toString(),
              }}
              onChange={(value: any) => props.handleChange('year', value)}
              onOpen={() => {
                if (!props.formValues.year.value) {
                  props.handleChange('year', moment())
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <PrimaryButton
            isLoading={props.isProcessing ? props.isProcessing : false}
            // className={styles.buttonGroupMargin}
            onClickFunction={props.viewReport}
            buttonText="View Report"
            buttonTextLoading="Viewing"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default AnnualDetailedLeaveReportForm
