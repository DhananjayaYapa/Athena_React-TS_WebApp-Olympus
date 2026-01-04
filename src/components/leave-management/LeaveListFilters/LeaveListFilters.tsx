import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { FormControl, Grid, TextField } from '@mui/material'
import { Autocomplete } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import React from 'react'
import {
  LeaveFiltersFormDto,
  LeaveStatusDto,
  LeaveTypeDto,
  UserDto,
} from '../../../utilities/models'
import { PrimaryButton } from '../../shared'
import styles from './LeaveListFilters.module.scss'
import moment from 'moment'
import DatePickerToolbarStyles from '../../../assets/theme/mobileDatePicker'

const LeaveListFilters: React.FC<{
  data: LeaveFiltersFormDto
  leaveStatusList: LeaveStatusDto[]
  userList: UserDto[]
  leaveTypeList: LeaveTypeDto[]
  handleChange(property: string, value: any): void
  onFilterClear(): void
  onFilterApply(): void
}> = (props) => {
  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDatePicker
              className={styles.fullWidth}
              label="From (Leave Date)"
              format="DD/MM/YYYY"
              disabled={props.data.from.disable}
              value={props.data.from.value ? moment(props.data.from.value) : null}
              onChange={(value) => props.handleChange('from', value)}
              closeOnSelect
              slotProps={{
                textField: {
                  required: props.data.from.isRequired,
                  error: !!props.data.from.error,
                  InputProps: { readOnly: true },
                  size: 'small',
                  variant: 'outlined',
                  margin: 'dense',
                },
                toolbar: DatePickerToolbarStyles,
                actionBar: {
                  actions: ['cancel', 'accept'],
                },
              }}
              onOpen={() => {
                if (!props.data.from.value) {
                  props.handleChange('from', moment())
                }
              }}
              localeText={{
                toolbarTitle: props.data.from.value
                  ? moment(props.data.from.value).year().toString()
                  : moment().year().toString(),
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDatePicker
              className={styles.fullWidth}
              minDate={props.data.from.value ? moment(props.data.from.value) : undefined}
              label="To (Leave Date)"
              format="DD/MM/YYYY"
              disabled={props.data.to.disable}
              value={props.data.to.value ? moment(props.data.to.value) : null}
              onChange={(value) => props.handleChange('to', value)}
              closeOnSelect
              slotProps={{
                textField: {
                  required: props.data.to.isRequired,
                  error: !!props.data.to.error,
                  InputProps: { readOnly: true },
                  size: 'small',
                  variant: 'outlined',
                  margin: 'dense',
                },
                toolbar: DatePickerToolbarStyles,
                actionBar: {
                  actions: ['cancel', 'accept'],
                },
              }}
              onOpen={() => {
                if (!props.data.to.value) {
                  props.handleChange('to', moment())
                }
              }}
              localeText={{
                toolbarTitle: props.data.to.value
                  ? moment(props.data.to.value).year().toString()
                  : moment().year().toString(),
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl className={styles.fullWidth} margin="dense">
            <Autocomplete
              size="small"
              options={props.leaveTypeList}
              getOptionLabel={(option: LeaveTypeDto) => option.type || ''}
              disabled={props.data.type.disable}
              value={props.data.type.value}
              isOptionEqualToValue={(option: LeaveTypeDto, value: LeaveTypeDto) =>
                option.id === value.id
              }
              onChange={(_event, value) => props.handleChange('type', value)}
              renderInput={(params) => (
                <TextField
                  required={props.data.type.isRequired}
                  error={!!props.data.type.error}
                  {...params}
                  label="Leave Type"
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
              options={props.leaveStatusList}
              getOptionLabel={(option: LeaveStatusDto) => option.status || ''}
              disabled={props.data.status.disable}
              value={props.data.status.value}
              isOptionEqualToValue={(option: LeaveStatusDto, value: LeaveStatusDto) =>
                option.id === value.id
              }
              onChange={(_event, value) => props.handleChange('status', value)}
              renderInput={(params) => (
                <TextField
                  required={props.data.status.isRequired}
                  error={!!props.data.status.error}
                  {...params}
                  label="Leave Status"
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
              options={props.userList && props.userList.map((user: UserDto) => user.username)}
              disabled={props.data.username.disable}
              value={props.data.username.value}
              isOptionEqualToValue={(option: string, value: string) => option === value}
              onChange={(_event, value) => props.handleChange('username', value)}
              renderInput={(params) => (
                <TextField
                  required={props.data.username.isRequired}
                  error={!!props.data.username.error}
                  {...params}
                  label="Username"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid container size={{ xs: 12, sm: 6 }} justifyContent="flex-start" alignItems="center">
          <PrimaryButton
            isLoading={false}
            className={styles.buttonGroupMargin}
            onClickFunction={() => props.onFilterApply()}
            buttonText="Search Records"
            buttonTextLoading="Search Records"
          />
          <PrimaryButton
            isLoading={false}
            onClickFunction={() => props.onFilterClear()}
            buttonText="Reset"
            buttonTextLoading="Reset"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default LeaveListFilters
