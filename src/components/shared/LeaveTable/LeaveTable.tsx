import React from 'react'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import { Leave } from '../../../utilities/models'
import styles from './LeaveTable.module.scss'
import { StatusLabel } from '..'
import { Table, TableBody, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import { APP_TABLE_CONFIGS } from '../../../utilities/constants'
import { StyledTableCell } from '../../../assets/theme/theme'
import { StyledTableRow } from '../../../assets/theme/theme'
import RejectionNoteIcon from '../RejectionNoteIcon/RejectionNoteIcon'
import ConfirmationPopUp from '../ConfirmationPopUp/ConfirmationPopUp'

const LeaveTable: React.FC<{
  leaveData: Leave[]
  withdrawLeave(leaveID: number, leaveDate: string): void
}> = (props) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(APP_TABLE_CONFIGS.DEFAULT_ROWS_PER_PAGE)
  const [page, setPage] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [withdrawLeave, setWithdrawLeave] = React.useState<Leave | null>(null)

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const openPopup = (leave: Leave) => {
    setWithdrawLeave(leave)
    setOpen(true)
  }

  const confirmWithdraw = (isConfirmed: boolean, leave: Leave) => {
    setOpen(false)
    if (isConfirmed && leave && leave.leaveId && leave.date) {
      // console.log("#Leave : ", leave);
      props.withdrawLeave(leave.leaveId, leave.date)
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)

    setPage(0)
  }

  return (
    <React.Fragment>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" width={100}>
              Date
            </StyledTableCell>
            <StyledTableCell align="left" width={100}>
              Leave Type
            </StyledTableCell>
            <StyledTableCell align="left" width={100}>
              Days
            </StyledTableCell>
            <StyledTableCell align="left">Reason</StyledTableCell>
            <StyledTableCell align="left">Co-worker</StyledTableCell>
            <StyledTableCell align="center" width={100}>
              Status
            </StyledTableCell>
            <StyledTableCell align="center" width={20}>
              Action
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.leaveData?.length !== 0 ? (
            props.leaveData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((leave: any) => (
                <StyledTableRow key={leave.leaveId}>
                  <StyledTableCell align="left">{leave.date.split(' ')[0]}</StyledTableCell>
                  <StyledTableCell align="left">
                    <div>
                      {leave.isHalfDay === 0 ? (
                        <div className={styles.fullDayMarker}></div>
                      ) : (
                        <div className={styles.halfDayMarker}></div>
                      )}
                      {leave.leaveType ? leave.leaveType.split(' ')[0] : leave.leaveType}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <div>{leave.isHalfDay ? '0.5' : '1'}</div>
                  </StyledTableCell>
                  <StyledTableCell align="left">{leave.leaveNote}</StyledTableCell>
                  <StyledTableCell align="left" className={styles.coWorker}>
                    {leave.coWorker
                      ? leave.coWorker.substring(0, leave.coWorker.lastIndexOf('@'))
                      : ''}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <StatusLabel status={leave.leaveStatus || ''} />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {leave.leaveStatusId === 1 && new Date(leave.date) > yesterday ? (
                      <Tooltip title="Withdraw leave" onClick={() => openPopup(leave)}>
                        <BlockOutlinedIcon className={styles.disableIcon} fontSize="small" />
                      </Tooltip>
                    ) : null}
                    {leave.leaveStatus.includes('Rejected') ? (
                      <RejectionNoteIcon rejectionNote={leave.rejectionNote} />
                    ) : null}
                  </StyledTableCell>
                </StyledTableRow>
              ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={12} align="center">
                <div style={{ padding: '10px' }}>No data to display</div>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
      <ConfirmationPopUp
        open={open}
        onClose={confirmWithdraw}
        data={withdrawLeave}
        popUpTitle="Withdrawing leave"
        confirmationMessage={'Are you sure you want to withdraw your leave?'}
      />
      <TablePagination
        rowsPerPageOptions={APP_TABLE_CONFIGS.DEFAULT_ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={props.leaveData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}

export default LeaveTable
