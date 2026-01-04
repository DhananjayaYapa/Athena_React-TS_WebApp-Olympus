import React from 'react'
import {
  TableHead,
  Table,
  TableRow,
  TableBody,
  CircularProgress,
  TablePagination,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import moment from 'moment'
import { StyledTableCell, StyledTableRow } from '../../../assets/theme/theme'
import { APP_TABLE_CONFIGS, TIME_ENTRY_LOCATION_IDS } from '../../../utilities/constants'
import { AttendanceInfoObjectDto, IsEditingAttendanceRowDto } from '../../../utilities/models'
import styles from './EditTimeEntryGrid.module.scss'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import TimePickerStyles from '../../../assets/theme/mobileTimePicker'

const EditTimeEntryGrid: React.FC<{
  data: AttendanceInfoObjectDto[]
  isDataLoading?: boolean
  isAttendnaceSubmitting?: boolean
  isEditingRow: any
  page: number
  rowsPerPage: number
  onRowChange(property: string, value: any): void
  onRowEditTrigger(arg: IsEditingAttendanceRowDto): void
  onSaveRowChanges(): void
  onIgnoreRowChanges(): void
  onHandleChangePage(event: unknown, newPage: number): void
  onHandleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void
}> = (props) => {
  return (
    <React.Fragment>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Employee</StyledTableCell>
            <StyledTableCell align="left">Date</StyledTableCell>
            <StyledTableCell align="left">Start Time</StyledTableCell>
            <StyledTableCell align="left">End Time</StyledTableCell>
            <StyledTableCell align="left">Work From</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.isDataLoading && (
            <StyledTableRow>
              <StyledTableCell colSpan={7} align="center">
                <CircularProgress className={styles.spinnerAlign} color="primary" size={20} />{' '}
                Loading...
              </StyledTableCell>
            </StyledTableRow>
          )}

          {!props.isDataLoading && props.data.length === 0 && (
            <StyledTableRow>
              <StyledTableCell colSpan={7} align="left">
                No Records Available.
              </StyledTableCell>
            </StyledTableRow>
          )}

          {props.data
            .map((r: AttendanceInfoObjectDto, index): IsEditingAttendanceRowDto => {
              return {
                attendanceDate: r.attendanceDate,
                rowId: index,
                username: r.username,
                attendanceInfoId: r.attendanceInfoId,
                endTime: r.endTime,
                location: r.location,
                locationId: r.locationId,
                startTime: r.startTime,
              }
            })
            .slice(
              props.page * props.rowsPerPage,
              props.page * props.rowsPerPage + props.rowsPerPage
            )
            .map((record: IsEditingAttendanceRowDto, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="left">{record.username}</StyledTableCell>

                <StyledTableCell align="left">{record.attendanceDate}</StyledTableCell>

                <StyledTableCell align="left">
                  {}

                  {!!props.isEditingRow.rowId && props.isEditingRow.rowId.value === record.rowId ? (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <MobileTimePicker
                        className={styles.tableTimeInput}
                        disabled={props.isEditingRow.startTime.disable}
                        value={
                          props.isEditingRow.startTime.value
                            ? moment(props.isEditingRow.startTime.value)
                            : null
                        }
                        onChange={(value) => props.onRowChange('startTime', value)}
                        slotProps={{
                          ...TimePickerStyles,
                          textField: {
                            variant: 'standard',
                            size: 'small',
                            margin: 'none',
                            error: !!props.isEditingRow.startTime.error,
                            required: props.isEditingRow.startTime.isRequired,
                            InputProps: { readOnly: true },
                            className: styles.tableTimeInput,
                          },
                          openPickerIcon: <AccessTimeOutlinedIcon fontSize="small" />,
                        }}
                        onOpen={() => {
                          if (!props.isEditingRow.startTime.value) {
                            props.onRowChange('startTime', moment())
                          }
                        }}
                      />
                    </LocalizationProvider>
                  ) : record.startTime ? (
                    moment(record.startTime, 'HH:mm:ss').format('hh:mm A')
                  ) : (
                    <span className={styles.missingInfo}>- - : - -</span>
                  )}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {!!props.isEditingRow.rowId && props.isEditingRow.rowId.value === record.rowId ? (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <MobileTimePicker
                        className={styles.tableTimeInput}
                        disabled={props.isEditingRow.endTime.disable}
                        value={
                          props.isEditingRow.endTime.value
                            ? moment(props.isEditingRow.endTime.value)
                            : null
                        }
                        onChange={(value) => props.onRowChange('endTime', value)}
                        slotProps={{
                          ...TimePickerStyles,
                          textField: {
                            variant: 'standard',
                            size: 'small',
                            margin: 'none',
                            error: !!props.isEditingRow.endTime.error,
                            required: props.isEditingRow.endTime.isRequired,
                            InputProps: { readOnly: true },
                            className: styles.tableTimeInput,
                          },
                          openPickerIcon: <AccessTimeOutlinedIcon fontSize="small" />,
                        }}
                        onOpen={() => {
                          if (!props.isEditingRow.endTime.value) {
                            props.onRowChange('endTime', moment())
                          }
                        }}
                      />
                    </LocalizationProvider>
                  ) : record.endTime ? (
                    moment(record.endTime, 'HH:mm:ss').format('hh:mm A')
                  ) : (
                    <span className={styles.missingInfo}>- - : - -</span>
                  )}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {!!props.isEditingRow.rowId && props.isEditingRow.rowId.value === record.rowId ? (
                    <FormControl className={styles.tableTeamInput} variant="standard">
                      <Select
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                        }}
                        value={props.isEditingRow.workFromLocation.value}
                        onChange={(event) =>
                          props.onRowChange('workFromLocation', event.target.value)
                        }
                        margin="none"
                      >
                        <MenuItem value={TIME_ENTRY_LOCATION_IDS.WORK_FROM_HOME}>Home</MenuItem>
                        <MenuItem value={TIME_ENTRY_LOCATION_IDS.WORK_FROM_OFFICE}>Office</MenuItem>
                      </Select>
                    </FormControl>
                  ) : record.location ? (
                    record.location
                  ) : (
                    <span className={styles.missingInfo}>- -</span>
                  )}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {!!props.isEditingRow.rowId && props.isEditingRow.rowId.value === record.rowId ? (
                    <React.Fragment>
                      {props.isAttendnaceSubmitting && (
                        <CircularProgress
                          className={styles.spinnerAlign}
                          color="primary"
                          size={20}
                        />
                      )}

                      {!props.isAttendnaceSubmitting && (
                        <React.Fragment>
                          <button
                            className={styles.tableAction}
                            disabled={
                              (!!props.isEditingRow.rowId &&
                                props.isEditingRow.rowId.value !== record.rowId) ||
                              props.isAttendnaceSubmitting
                            }
                            onClick={() => props.onSaveRowChanges()}
                          >
                            <SaveOutlinedIcon
                              color="primary"
                              className="cursorPointer"
                              fontSize="medium"
                            />
                          </button>
                          <button
                            className={styles.tableAction}
                            disabled={
                              (!!props.isEditingRow.rowId &&
                                props.isEditingRow.rowId.value !== record.rowId) ||
                              props.isAttendnaceSubmitting
                            }
                            onClick={() => props.onIgnoreRowChanges()}
                          >
                            <CloseOutlinedIcon
                              color="error"
                              className="cursorPointer"
                              fontSize="medium"
                            />
                          </button>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    <button
                      className={styles.tableAction}
                      disabled={
                        !!props.isEditingRow.rowId &&
                        props.isEditingRow.rowId.value !== -1 &&
                        props.isEditingRow.rowId.value !== record.rowId
                      }
                      onClick={() => props.onRowEditTrigger(record)}
                    >
                      <EditOutlinedIcon className="cursorPointer" fontSize="medium" />
                    </button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={APP_TABLE_CONFIGS.DEFAULT_ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={props.data.length}
        page={props.page}
        onPageChange={props.onHandleChangePage}
        onRowsPerPageChange={props.onHandleChangeRowsPerPage}
        rowsPerPage={props.rowsPerPage}
      />
    </React.Fragment>
  )
}

export default EditTimeEntryGrid
