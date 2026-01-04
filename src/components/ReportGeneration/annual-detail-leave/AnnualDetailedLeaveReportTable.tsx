/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Paper,
  Grid,
  TableBody,
  TableContainer,
  Table,
  Box,
  TablePagination,
  Typography,
  TableRow,
} from '@mui/material'
import React from 'react'
import { StyledTableCell, StyledTableRow, StyledTableBoldCell } from '../../../assets/theme/theme'
import { PrimaryButton } from '../../shared'
const AnnualDetailedLeaveReportTable: React.FC<{
  filterData: any
  reportData: any
  downloadReport(): void
  isProcessing: boolean
}> = (props) => {
  let [al, cl, ll, sl, npl] = [0, 0, 0, 0, 0]
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {props.reportData?.length > 0 && !props.isProcessing && props.filterData && (
          <>
            <Grid size={{ xs: 8, sm: 8, md: 10, lg: 10 }}>
              <Box sx={{}}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 5, sm: 5, md: 5, lg: 2 }}>
                    <Typography>
                      <strong>Username: </strong>{' '}
                    </Typography>
                    <Typography>
                      <strong>Designation</strong>:{' '}
                    </Typography>
                    <Typography>
                      <strong>Current Project/Site</strong>:
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 7, sm: 7, md: 7, lg: 4 }}>
                    <Typography>{props.filterData.username}</Typography>
                    <Typography>{props.reportData[0].designation} </Typography>
                    <Typography>{props.reportData[0].project}</Typography>
                  </Grid>
                  <Grid size={{ xs: 5, sm: 5, md: 5, lg: 3 }}>
                    <Typography>
                      <strong>Date of Appointment: </strong>
                    </Typography>
                    <Typography>
                      <strong>Confirmed Date:</strong>{' '}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 7, sm: 7, md: 7, lg: 3 }}>
                    <Typography>{props.reportData[0]?.joinDate}</Typography>
                    <Typography>
                      {props.reportData[0]?.confirmationDate
                        ? props.reportData[0]?.confirmationDate
                        : 'Not Confirmed'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 4, sm: 4, md: 2, lg: 2 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <PrimaryButton
                isLoading={props.isProcessing ? props.isProcessing : false}
                // className={styles.buttonGroupMargin}
                onClickFunction={props.downloadReport}
                buttonText="Download Report"
                buttonTextLoading="Download Report"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
              <Box sx={{ pt: 2 }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow style={{ backgroundColor: '#BBD3F3' }}>
                        <StyledTableCell colSpan={2}>
                          <strong>Leave Entitlement</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>
                            {props.reportData[0]?.leaveEntitlements?.annualLeave !== null
                              ? props.reportData[0]?.leaveEntitlements?.annualLeave
                              : 'No Annual Leave'}
                          </strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>
                            {props.reportData[0]?.leaveEntitlements?.casualLeave !== null
                              ? props.reportData[0]?.leaveEntitlements?.casualLeave
                              : 'No Casual Leave'}
                          </strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>N/A</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>N/A</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>N/A</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                      </TableRow>
                      <TableRow style={{ backgroundColor: '#CAE5F9' }}>
                        {props.reportData[0]?.leaves.slice().map((row: any) => {
                          switch (row.leaveTypeId) {
                            case 1:
                              al = al + row.leaveCount
                              break
                            case 2:
                              ll = ll + row.leaveCount
                              break
                            case 3:
                              cl = cl + row.leaveCount
                              break
                            case 4:
                              sl = sl + row.leaveCount
                              break
                            case 5:
                              npl = npl + row.leaveCount
                              break
                            case 6:
                              npl = npl + row.leaveCount
                              break
                          }
                        })}
                        <StyledTableCell colSpan={2}>
                          <strong>Leave Utilization</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>{al}</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>{cl}</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>{ll}</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>{npl}</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>{sl}</strong>
                        </StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                      <TableRow style={{ backgroundColor: '#BBF3CE' }}>
                        <StyledTableCell colSpan={2}>
                          <strong>Leave Balance</strong>
                        </StyledTableCell>
                        {props.reportData[0]?.leaveEntitlements?.annualLeave - al >= 0 ? (
                          <StyledTableCell align="center" style={{ color: 'green' }}>
                            <strong>
                              {props.reportData[0]?.leaveEntitlements?.annualLeave - al}
                            </strong>
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell align="center" style={{ color: 'red' }}>
                            <strong>
                              {props.reportData[0]?.leaveEntitlements?.annualLeave - al}
                            </strong>
                          </StyledTableCell>
                        )}
                        {props.reportData[0]?.leaveEntitlements?.casualLeave - cl >= 0 ? (
                          <StyledTableCell align="center" style={{ color: 'green' }}>
                            <strong>
                              {props.reportData[0]?.leaveEntitlements?.casualLeave - cl}
                            </strong>
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell align="center" style={{ color: 'red' }}>
                            <strong>
                              {props.reportData[0]?.leaveEntitlements?.casualLeave - cl}
                            </strong>
                          </StyledTableCell>
                        )}
                        <StyledTableCell align="center">
                          <strong>N/A</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>N/A</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <strong>N/A</strong>
                        </StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                      </TableRow>
                      {/* </Table>
                    </TableContainer>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>                             */}

                      <StyledTableRow>
                        <StyledTableBoldCell align="left">From</StyledTableBoldCell>
                        <StyledTableBoldCell align="left">To</StyledTableBoldCell>
                        <StyledTableBoldCell align="center">A/L</StyledTableBoldCell>
                        <StyledTableBoldCell align="center">C/L</StyledTableBoldCell>
                        <StyledTableBoldCell align="center">L/L</StyledTableBoldCell>
                        <StyledTableBoldCell align="center">No Pay</StyledTableBoldCell>
                        <StyledTableBoldCell align="center">Special</StyledTableBoldCell>
                        <StyledTableBoldCell align="left">Remarks</StyledTableBoldCell>
                      </StyledTableRow>
                      {props.reportData[0]?.leaves.length <= 0 && (
                        <TableRow>
                          <StyledTableBoldCell align="center" colSpan={8}>
                            No Leaves Taken
                          </StyledTableBoldCell>
                        </TableRow>
                      )}
                      {props.reportData[0]?.leaves.length > 0 &&
                        props.reportData[0]?.leaves
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row: any) => {
                            let al, cl, ll, npl, sl
                            switch (row.leaveTypeId) {
                              case 1:
                                al = row.leaveCount
                                break
                              case 2:
                                ll = row.leaveCount
                                break
                              case 3:
                                cl = row.leaveCount
                                break
                              case 4:
                                sl = row.leaveCount
                                break
                              case 5:
                                npl = row.leaveCount
                                break
                              case 6:
                                npl = row.leaveCount
                                break
                            }
                            return (
                              <StyledTableRow>
                                <StyledTableCell align="left">{row.from}</StyledTableCell>
                                <StyledTableCell align="left">{row.to}</StyledTableCell>
                                <StyledTableCell align="center">{al ? al : '-'}</StyledTableCell>
                                <StyledTableCell align="center">{cl ? cl : '-'}</StyledTableCell>
                                <StyledTableCell align="center">{ll ? ll : '-'}</StyledTableCell>
                                <StyledTableCell align="center">{npl ? npl : '-'}</StyledTableCell>
                                <StyledTableCell align="center">{sl ? sl : '-'}</StyledTableCell>
                                <StyledTableCell align="left">{row.remark}</StyledTableCell>
                              </StyledTableRow>
                            )
                          })}
                    </TableBody>
                  </Table>

                  {props.reportData[0]?.leaves.length > 0 && (
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      component="div"
                      count={props.reportData[0]?.leaves.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  )}
                </TableContainer>
              </Box>
            </Grid>
          </>
        )}

        {/* {props.isProcessing &&
            <Grid size={{}} xs={12} sm={12} lg={12}>
                <CircularProgress className={styles.spinnerAlign} color="primary" size={20} /> Loading...
                </Grid>
            } */}
      </Grid>
    </React.Fragment>
  )
}

export default AnnualDetailedLeaveReportTable
