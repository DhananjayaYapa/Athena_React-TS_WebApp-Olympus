import React from 'react'
import {
  TextField,
  TableHead,
  Table,
  TableRow,
  TableBody,
  CircularProgress,
  TablePagination,
} from '@mui/material'
import type {
  IsEditingLeaveCountRowDto,
  LeaveCountBriefDto,
  LeaveCountMasterDataDto,
} from '../../../utilities/models'
import { StyledTableCell, StyledTableRow } from '../../../assets/theme/theme'
import { APP_TABLE_CONFIGS } from '../../../utilities/constants'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import styles from './LeaveCountTable.module.scss'
import { LEAVE_TYPE_IDS } from '../../../utilities/constants/app.constants'

const LeaveCountTable: React.FC<{
  employees: any
  leaveCountData: LeaveCountMasterDataDto[]
  isLoading: boolean
  isProcessing: boolean
  isEditingRow: any
  page: number
  rowsPerPage: number
  onRowChange(property: string, value: any, leaveCountId: any): void
  onRowEditTrigger(arg: IsEditingLeaveCountRowDto): void
  onSaveRowChanges(): void
  onIgnoreRowChanges(): void
  onHandleChangePage(event: unknown, newPage: number): void
  onHandleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void
  // onHandleUserChange(username?: string): void,
}> = (props) => {
  const getLeaveCount = (data: LeaveCountBriefDto[], leaveTypeId: number) => {
    const leaveTypeIndex = data.map((i: LeaveCountBriefDto) => i.leaveTypeId).indexOf(leaveTypeId)
    if (leaveTypeIndex > -1) {
      return {
        count: data[leaveTypeIndex].entitledLeaveCount,
        countId: data[leaveTypeIndex].leaveCountId,
      }
    } else {
      return {}
    }
  }

  return (
    <React.Fragment>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Username</StyledTableCell>
            <StyledTableCell align="left">Annual leave</StyledTableCell>
            <StyledTableCell align="left">Casual leave</StyledTableCell>
            <StyledTableCell align="left">Lieu leave</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.isLoading && (
            <StyledTableRow>
              <StyledTableCell colSpan={7} align="center">
                <CircularProgress className={styles.spinnerAlign} color="primary" size={20} />{' '}
                Loading...
              </StyledTableCell>
            </StyledTableRow>
          )}

          {!props.isLoading && props.leaveCountData.length === 0 && (
            <StyledTableRow>
              <StyledTableCell colSpan={7} align="left">
                No Records Available.
              </StyledTableCell>
            </StyledTableRow>
          )}

          {props.leaveCountData
            .slice(
              props.page * props.rowsPerPage,
              props.page * props.rowsPerPage + props.rowsPerPage
            )
            .map((record: LeaveCountMasterDataDto, index: number) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="left">
                  {record.username}
                  {/* {getLeaveCount(record.leaveCountData, 1)} */}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {}

                  {!!props.isEditingRow.username &&
                  props.isEditingRow.username.value === record.username ? (
                    <TextField
                      required={props.isEditingRow.annual.isRequired}
                      error={!!props.isEditingRow.annual.error}
                      onChange={(event) =>
                        props.onRowChange(
                          'annual',
                          event.target.value,
                          getLeaveCount(record.leaveCountData, LEAVE_TYPE_IDS.ANNUAL).countId
                        )
                      }
                      value={props.isEditingRow.annual.value}
                      variant="standard"
                    />
                  ) : record.leaveCountData ? (
                    getLeaveCount(record.leaveCountData, LEAVE_TYPE_IDS.ANNUAL).count
                  ) : (
                    <span>- -</span>
                  )}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {}

                  {!!props.isEditingRow.username &&
                  props.isEditingRow.username.value === record.username ? (
                    <TextField
                      required={props.isEditingRow.casual.isRequired}
                      error={!!props.isEditingRow.casual.error}
                      onChange={(event) =>
                        props.onRowChange(
                          'casual',
                          event.target.value,
                          getLeaveCount(record.leaveCountData, LEAVE_TYPE_IDS.CASUAL).countId
                        )
                      }
                      value={props.isEditingRow.casual.value}
                      variant="standard"
                    />
                  ) : record.leaveCountData ? (
                    getLeaveCount(record.leaveCountData, LEAVE_TYPE_IDS.CASUAL).count
                  ) : (
                    <span>- -</span>
                  )}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {}

                  {!!props.isEditingRow.username &&
                  props.isEditingRow.username.value === record.username ? (
                    <TextField
                      required={props.isEditingRow.lieu.isRequired}
                      error={!!props.isEditingRow.lieu.error}
                      onChange={(event) =>
                        props.onRowChange(
                          'lieu',
                          event.target.value,
                          getLeaveCount(record.leaveCountData, LEAVE_TYPE_IDS.LIEU).countId
                        )
                      }
                      value={props.isEditingRow.lieu.value}
                      variant="standard"
                    />
                  ) : record.leaveCountData ? (
                    getLeaveCount(record.leaveCountData, LEAVE_TYPE_IDS.LIEU).count
                  ) : (
                    <span>- -</span>
                  )}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {!!props.isEditingRow.username &&
                  props.isEditingRow.username.value === record.username ? (
                    <React.Fragment>
                      {props.isProcessing && (
                        <CircularProgress
                          className={styles.spinnerAlign}
                          color="primary"
                          size={20}
                        />
                      )}

                      {!props.isProcessing && (
                        <React.Fragment>
                          <button
                            className={styles.tableAction}
                            disabled={
                              (!!props.isEditingRow.username &&
                                props.isEditingRow.username.value !== record.username) ||
                              props.isProcessing
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
                              (!!props.isEditingRow.username &&
                                props.isEditingRow.username.value !== record.username) ||
                              props.isProcessing
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
                        !props.isEditingRow.username && props.isEditingRow.username.value === ''
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
        count={props.leaveCountData.length}
        page={props.page}
        onPageChange={props.onHandleChangePage}
        onRowsPerPageChange={props.onHandleChangeRowsPerPage}
        rowsPerPage={props.rowsPerPage}
      />
    </React.Fragment>
  )
}

export default LeaveCountTable
