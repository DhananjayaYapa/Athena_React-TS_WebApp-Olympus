import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import styles from './SupervisorLeaveActionsForm.module.scss'
import logo from '../../../assets/images/acentura_logo.svg'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import { UserLeaveInfoDto } from '../../../utilities/models'
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'
import { LEAVE_STATUS_IDS } from '../../../utilities/constants'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import Alert from '@mui/material/Alert'
import { AppCopyright } from '../../index'
import moment from 'moment'

const SupervisorLeaveActionsForm: React.FC<{
  token: string | null
  isLoading: boolean
  leaveData: UserLeaveInfoDto
  onHandleRejectLeave(): void
  onHandleApproveLeave(): void
}> = (props) => {
  return (
    <React.Fragment>
      <Card className={styles.root} variant="outlined">
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <img className={styles.logo} src={logo} alt="acentura_logo" />
            </Grid>
            <Grid size={{ xs: 12 }} className="sectionTitleHolder">
              <h3 className={styles.title}>Approve/Reject Leave</h3>
            </Grid>
            {props.token !== '' ? (
              <Grid className={styles.leaveInfo} size={{ xs: 12 }}>
                {props.isLoading ? (
                  <div className={styles.loading}>
                    <CircularProgress color="primary" size={20} /> Loading...
                  </div>
                ) : (
                  <React.Fragment>
                    {props.leaveData.firstName ? (
                      <div className={styles.leaveInfoConatiner}>
                        <TableContainer className={styles.leaveInfoTable} component={Paper}>
                          <Table>
                            <TableBody>
                              <TableRow key={'name'}>
                                <TableCell component="th" className={styles.tableTitle} scope="row">
                                  Name
                                </TableCell>
                                <TableCell align="right">
                                  {' '}
                                  {`${props.leaveData.firstName} ${props.leaveData.lastName}`}
                                </TableCell>
                              </TableRow>
                              <TableRow key={'username'}>
                                <TableCell component="th" className={styles.tableTitle} scope="row">
                                  Email
                                </TableCell>
                                <TableCell align="right"> {props.leaveData.username}</TableCell>
                              </TableRow>
                              <TableRow key={'From'}>
                                <TableCell component="th" className={styles.tableTitle} scope="row">
                                  From
                                </TableCell>
                                <TableCell align="right">
                                  {' '}
                                  {moment(props.leaveData.from).format('YYYY-MM-DD')}
                                </TableCell>
                              </TableRow>
                              <TableRow key={'to'}>
                                <TableCell component="th" className={styles.tableTitle} scope="row">
                                  To
                                </TableCell>
                                <TableCell align="right">
                                  {' '}
                                  {moment(props.leaveData.to).format('YYYY-MM-DD')}
                                </TableCell>
                              </TableRow>
                              <TableRow key={'Leave Type'}>
                                <TableCell component="th" className={styles.tableTitle} scope="row">
                                  Leave Type
                                </TableCell>
                                <TableCell align="right"> {props.leaveData.leaveType}</TableCell>
                              </TableRow>
                              <TableRow key={'Days'}>
                                <TableCell component="th" className={styles.tableTitle} scope="row">
                                  Days
                                </TableCell>
                                <TableCell align="right"> {props.leaveData.daysCount}</TableCell>
                              </TableRow>
                              <TableRow key={'Leave Note'}>
                                <TableCell component="th" className={styles.tableTitle} scope="row">
                                  Leave Note
                                </TableCell>
                                <TableCell align="right"> {props.leaveData.leaveNote}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    ) : (
                      <div className={styles.noData}>
                        <h3>No data found</h3>
                      </div>
                    )}
                  </React.Fragment>
                )}
              </Grid>
            ) : (
              <span className={styles.unauthorized}>
                <ErrorOutlineOutlinedIcon className={styles.errorIcon} />
                <h3>Unauthorized access denied!</h3>
              </span>
            )}
          </Grid>
        </CardContent>
        <CardActions>
          {!props.isLoading && props.leaveData.leaveStatusId === LEAVE_STATUS_IDS.APPLIED ? (
            <div className={styles.leaveActionButtons}>
              <Button
                style={{ marginLeft: '10px' }}
                color="primary"
                variant="contained"
                className={styles.approve}
                onClick={props.onHandleApproveLeave}
              >
                <CheckCircleOutlineIcon className={styles.approvedIcon} />
                Approve
              </Button>
              <Button
                style={{ marginLeft: '10px' }}
                color="warning"
                variant="contained"
                className={styles.reject}
                onClick={props.onHandleRejectLeave}
              >
                <BlockOutlinedIcon className={styles.rejectIcon} />
                Reject
              </Button>
            </div>
          ) : (
            ''
          )}
          <br />
          {props.leaveData.leaveStatusId === LEAVE_STATUS_IDS.APPROVED ? (
            <Alert variant="filled" className={styles.leaveStatus} severity="success">
              Leave Approved!
            </Alert>
          ) : props.leaveData.leaveStatusId === LEAVE_STATUS_IDS.REJECTED ? (
            <Alert variant="filled" className={styles.leaveStatus} severity="error">
              Leave Rejected!
            </Alert>
          ) : props.leaveData.leaveStatusId === LEAVE_STATUS_IDS.DISABLED ? (
            <Alert variant="filled" className={styles.leaveStatus} severity="warning">
              Leave Disabled!
            </Alert>
          ) : (
            ''
          )}
        </CardActions>
        <div className={styles.copyRight}>
          <AppCopyright />
        </div>
      </Card>
    </React.Fragment>
  )
}

export default SupervisorLeaveActionsForm
