import {
  Table,
  TableRow,
  TableBody,
  TableHead,
  TablePagination,
  CircularProgress,
} from '@mui/material'
import React from 'react'
import { StyledTableCell, StyledTableRow } from '../../../assets/theme/theme'
import { LeaveListItemDto } from '../../../utilities/models'
import moment from 'moment'
import styles from './LeaveList.module.scss'
import { APP_TABLE_CONFIGS, LEAVE_STATUS_IDS } from '../../../utilities/constants'
import Tooltip from '@mui/material/Tooltip'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import BlockIcon from '@mui/icons-material/Block'
import ListAltIcon from '@mui/icons-material/ListAlt'

const LeaveList: React.FC<{
  data: LeaveListItemDto[]
  isLoading?: boolean
  isUpdating?: boolean
  page: number
  rowsPerPage: number
  isHR: boolean
  isAllowWithdrawAll?: boolean
  onHandleChangePage(event: unknown, newPage: number): void
  onHandleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void
  onApproveLeave(leave: LeaveListItemDto): void
  onRejectLeave(leave: LeaveListItemDto): void
  onWithdrawLeave(leave: LeaveListItemDto): void
  onClickLeaveCountSummary: (leaveData: LeaveListItemDto) => void
}> = (props) => {
  const isOverdue = (leaveData: LeaveListItemDto): boolean => {
    if (leaveData.leaveStatusId === LEAVE_STATUS_IDS.APPLIED) {
      return moment().isSameOrAfter(leaveData.date)
    } else {
      return false
    }
  }
  return (
    <React.Fragment>
      <div className={styles.leaveListTableHolder}>
        <div className={`${styles.isUpdating} ${props.isUpdating && styles.show}`}>
          <CircularProgress className={styles.spinnerAlign} color="primary" size={40} />
        </div>
        {props.isHR && (
          <div className={styles.legend}>
            <i className={styles.icon} />
            <span className={styles.block}>Un-approved Overdue Leaves</span>
          </div>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="left" width={100}>
                Leave Date
              </StyledTableCell>
              {props.isHR && <StyledTableCell align="left">Name</StyledTableCell>}
              <StyledTableCell align="left" width={150}>
                Leave Type
              </StyledTableCell>
              <StyledTableCell align="left">Reason</StyledTableCell>
              <StyledTableCell>Point Person</StyledTableCell>
              <StyledTableCell align="left" width={100}>
                Applied Date
              </StyledTableCell>
              <StyledTableCell align="center" width={80}>
                Status
              </StyledTableCell>
              <StyledTableCell align="center" width={80}>
                Action
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.isLoading && (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="center">
                  <CircularProgress className={styles.spinnerAlign} color="primary" size={20} />{' '}
                  Loading...
                </StyledTableCell>
              </StyledTableRow>
            )}
            {!props.isLoading && props.data.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="left">
                  No Records Available.
                </StyledTableCell>
              </StyledTableRow>
            )}
            {props.data
              .slice(
                props.page * props.rowsPerPage,
                props.page * props.rowsPerPage + props.rowsPerPage
              )
              .map((leaveData: LeaveListItemDto) => (
                <StyledTableRow
                  key={leaveData.leaveId}
                  className={props.isHR ? `${isOverdue(leaveData) && styles.overdueRow}` : ''}
                >
                  <StyledTableCell
                    align="left"
                    className={
                      props.isHR
                        ? `${isOverdue(leaveData) && styles.overdue} ${styles.overdueHolder}`
                        : ''
                    }
                  >
                    {moment(leaveData.date).format('YYYY-MM-DD')}
                  </StyledTableCell>
                  {props.isHR && (
                    <StyledTableCell align="left">
                      <Tooltip title={leaveData.username}>
                        <span>{`${leaveData.firstName} ${leaveData.lastName}`}</span>
                      </Tooltip>
                    </StyledTableCell>
                  )}
                  <StyledTableCell align="left">
                    {leaveData.isHalfDay === 0 ? 'Full day - ' : 'Half day - '}
                    {leaveData.leaveType}
                  </StyledTableCell>

                  <StyledTableCell align="left">{leaveData.leaveNote}</StyledTableCell>

                  <StyledTableCell align="left">
                    <Tooltip title={leaveData.coWorker}>
                      <span>
                        {leaveData.coWorker
                          ? leaveData.coWorker.substring(0, leaveData.coWorker.lastIndexOf('@'))
                          : ''}
                      </span>
                    </Tooltip>
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    {moment(leaveData.createdAt).format('YYYY-MM-DD')}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Tooltip title={leaveData.rejectionNote ? leaveData.rejectionNote : ''}>
                      <span className={`statusChip ${leaveData?.leaveStatus?.toLowerCase()}`}>
                        {leaveData.leaveStatus}
                      </span>
                    </Tooltip>
                  </StyledTableCell>

                  <StyledTableCell align="center" padding="checkbox">
                    {leaveData.leaveStatusId === LEAVE_STATUS_IDS.APPLIED && props.isHR ? (
                      <span className={styles.actionGroup}>
                        <Tooltip title="Leave Count Summary">
                          <ListAltIcon
                            fontSize="small"
                            className={styles.leaveSummaryAction}
                            onClick={() => props.onClickLeaveCountSummary(leaveData)}
                          />
                        </Tooltip>
                        <Tooltip title="Accept Leave">
                          <CheckCircleOutlineIcon
                            className={styles.acceptAction}
                            fontSize="small"
                            onClick={() => props.onApproveLeave(leaveData)}
                          />
                        </Tooltip>
                        <Tooltip title="Reject Leave">
                          <BlockIcon
                            className={styles.rejectAction}
                            fontSize="small"
                            color="error"
                            onClick={() => props.onRejectLeave(leaveData)}
                          />
                        </Tooltip>
                      </span>
                    ) : (
                      <React.Fragment>
                        {props.isAllowWithdrawAll ||
                        (leaveData.leaveStatusId === LEAVE_STATUS_IDS.APPLIED &&
                          moment(leaveData.date).isSameOrAfter(
                            moment().format('YYYY-MM-DD'),
                            'day'
                          )) ? (
                          <span className={styles.actionGroup}>
                            <Tooltip title="Withdraw leave">
                              <BlockOutlinedIcon
                                className={styles.disableIcon}
                                fontSize="small"
                                onClick={() => props.onWithdrawLeave(leaveData)}
                              />
                            </Tooltip>
                          </span>
                        ) : (
                          ''
                        )}
                      </React.Fragment>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </div>
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

export default LeaveList
