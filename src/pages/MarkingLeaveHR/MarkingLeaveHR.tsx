import React, { useState, useEffect } from 'react'
import { CustomAlert, LeaveList, MarkingLeaveForm } from '../../components'
import { AppLayout } from '../../templates'
import { useDispatch, useSelector } from 'react-redux'
import { leaveActions, userActions, nonWorkingDayActions, alertActions } from '../../redux/actions'
import { Divider, Grid } from '@mui/material'
import { DEFAULT_SELECTED_LEAVE_TYPE, ALERT_CONFIGS } from '../../utilities/constants/app.constants'
import styles from './MarkingLeaveHR.module.scss'
import {
  LeaveCountSummaryDto,
  WithdrawLeaveDto,
  UserDto,
  GetLeaveListParamsDto,
  AlertDto,
  LeaveListItemDto,
  AddLeaveDto,
  GetNonworkingDaysRangeDto,
  AppStateDto,
  PointPersonParamsDto,
  GetUserListBriefParamsDto,
} from '../../utilities/models/index'
import LeaveCountSummary from '../../components/leave-management/LeaveCountSummary/LeaveCountSummary'
import ConfirmationPopUp from '../../components/shared/ConfirmationPopUp/ConfirmationPopUp'
import { Alert } from '@mui/material'
import moment from 'moment-timezone'

const MarkingLeaveHR = () => {
  const dispatch = useDispatch()
  const pointPersons = useSelector((state: any) => state.leave.pointPersonList.data)
  const [selectedLeaveType, setSelectedLeaveType] = useState(DEFAULT_SELECTED_LEAVE_TYPE)
  const [leaveError, setLeaveError] = useState<string | null>(null)
  const [leaveWithdrawPopup, setLeaveWithdrawPopup] = React.useState({
    status: false,
    data: {} as LeaveListItemDto,
  })
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser.data)

  const handleLeaveError = (err: string) => {
    setLeaveError(err)
    setTimeout(() => setLeaveError(null), ALERT_CONFIGS.TIMEOUT)
  }
  useEffect(() => {
    getUserListBrief()
  }, [])

  const userListBrief = useSelector((state: AppStateDto) => state.user.userListBrief)
  const leaveCountSummaryData = useSelector((state: AppStateDto) => state.leave.leaveCountSummary)
  const leaveCountSummary: LeaveCountSummaryDto = leaveCountSummaryData.data[0]
  const nonWorkingDays = useSelector(
    (state: AppStateDto) => state.nonWorkingDays.nonWorkingDayRange
  )
  const leaveList = useSelector((state: AppStateDto) => state.leave.leaveList)
  const addLeave = useSelector((state: AppStateDto) => state.leave.addLeave)
  const addLeaveAlert: AlertDto = useSelector((state: AppStateDto) => state.alerts.addLeave)
  const updateLeaveAlert: AlertDto = useSelector((state: AppStateDto) => state.alerts.updateLeave)
  const filteredUsers =
    userListBrief.data &&
    userListBrief.data?.data?.filter((user: any) => user.username !== authorizedUser.username)

  useEffect(() => {
    if (updateLeaveAlert.severity === 'success' || addLeaveAlert.severity === 'success') {
      // const startDate = moment().startOf('year').format('YYYY-MM-DD');
      // const endDate = moment().endOf('year').format('YYYY-MM-DD')
      getLeaveList(selectedUser)
      // dispatch(leaveActions.getLeaveCountSummary(selectedUser));
    }
  }, [updateLeaveAlert, addLeaveAlert])

  const getUserListBrief = () => {
    const userListBrief: GetUserListBriefParamsDto = {
      userRoleKey: 'EMPLOYEE',
    }
    dispatch(userActions.getUserListBrief(userListBrief))
  }
  const filterCurrentUser = (employeeList: UserDto[]) => {
    return (
      employeeList &&
      employeeList.filter((employee: { username: any }) => employee.username !== selectedUser)
    )
  }

  // const filterLeaveList = (leaveList: LeaveListItemDto[]) => {
  //   return leaveList.filter(
  //     (leave: { createdBy: any }) => leave.createdBy === authorizedUser.username
  //   )
  // }

  const getNonWorkingDaysInfo = (startDate: string, endDate: string) => {
    const daysRange: GetNonworkingDaysRangeDto = {
      startDate: startDate,
      endDate: endDate,
    }
    dispatch(nonWorkingDayActions.getNonWorkingDaysRange(daysRange))
  }
  const getPointPersons = (username: string) => {
    const requestedBy: PointPersonParamsDto = {
      username: username,
    }
    dispatch(leaveActions.getPointPersonList(requestedBy))
  }
  const getLeaveList = (user: string) => {
    const startDate = moment().startOf('year').format('YYYY-MM-DD')
    const endDate = moment().endOf('year').format('YYYY-MM-DD')
    const leaveListParams: GetLeaveListParamsDto = {
      username: user,
      from: startDate,
      to: endDate,
    }
    dispatch(leaveActions.getLeaveList(leaveListParams))
  }

  const clearAddLeaveAlert = () => {
    dispatch(alertActions.clearAddLeaveAlert())
  }

  const clearUpdateLeaveAlert = () => {
    dispatch(alertActions.clearUpdateLeaveAlert())
  }

  const updateLeaveCountSummary = () => {
    dispatch(leaveActions.getLeaveCountSummary(authorizedUser.username))
  }

  const getSelectedLeaveType = (selectedLeaveType: number) => {
    if (leaveCountSummary) {
      const approved = leaveCountSummary.approveLeave
        ? leaveCountSummary.approveLeave.filter(
            (leaveSummary) => leaveSummary.leaveTypeId === selectedLeaveType
          )
        : []
      const applied = leaveCountSummary.appliedLeave
        ? leaveCountSummary.appliedLeave.filter(
            (leaveSummary) => leaveSummary.leaveTypeId === selectedLeaveType
          )
        : []
      const available = leaveCountSummary.availableLeave
        ? leaveCountSummary.availableLeave.filter(
            (leaveSummary) => leaveSummary.leaveTypeId === selectedLeaveType
          )
        : []
      return [
        approved[0] ? approved[0].leaveCount : 0,
        applied[0] ? applied[0].leaveCount : 0,
        available[0] ? available[0].leaveCount : 0,
      ]
    } else {
      return []
    }
  }
  const onLeaveTypeChange = (leaveTypeId: number) => {
    setSelectedLeaveType(leaveTypeId)
  }

  const onSubmitLeave = (leave: AddLeaveDto[]) => {
    dispatch(leaveActions.addLeave(leave))
  }

  const onwithdrawLeave = (leaveData: LeaveListItemDto) => {
    setLeaveWithdrawPopup({
      status: true,
      data: leaveData,
    })
  }

  const onLeaveApproveConfirm = (isConfirmed: boolean, data: LeaveListItemDto) => {
    if (isConfirmed) {
      const payload: WithdrawLeaveDto = {
        username: selectedUser,
        leaveId: data.leaveId,
        leaveStatusId: 4,
        date: moment(data.date).format('YYYY-MM-DD'),
      }
      dispatch(leaveActions.updateLeave(payload))
      setLeaveWithdrawPopup({
        status: false,
        data: {} as LeaveListItemDto,
      })
    } else {
      setLeaveWithdrawPopup({
        status: false,
        data: {} as LeaveListItemDto,
      })
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const compareLeaveDate = (leaveOne: LeaveListItemDto, leaveTwo: LeaveListItemDto) => {
    if (leaveOne.date < leaveTwo.date) {
      return 1
    }
    if (leaveOne.date > leaveTwo.date) {
      return -1
    }
    return 0
  }

  const handleUserChange = (username: string) => {
    setSelectedUser(username)

    if (username !== '') {
      dispatch(leaveActions.getLeaveCountSummary(username))
      getLeaveList(username)
      getPointPersons(username)
    }
  }

  return (
    <React.Fragment>
      <ConfirmationPopUp
        popUpTitle="Withdraw Leave"
        onClose={onLeaveApproveConfirm}
        confirmationMessage="Are you sure you want to withdraw the Leave ?"
        data={leaveWithdrawPopup.data}
        open={leaveWithdrawPopup.status}
      />
      <AppLayout breadcrumb="Insert Leave HR" componentTitle="Insert Leave(HR)">
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3>Apply a Leave For User</h3>
            <span>Apply for casual, annual or other leaves in this section.</span>
          </Grid>
          <Grid size={{ md: 6 }} className="sectionTitleHolder">
            {leaveError && (
              <div className={styles.alert}>
                <CustomAlert displayText={leaveError} severity="error" />
              </div>
            )}
            {addLeaveAlert.message && (
              <Alert
                className="mb-m"
                onClose={clearAddLeaveAlert}
                severity={addLeaveAlert.severity}
              >
                {addLeaveAlert.message}
              </Alert>
            )}
            <form>
              <MarkingLeaveForm
                employees={filterCurrentUser(filteredUsers) || []}
                pointPersons={pointPersons.data || []}
                currentUser={authorizedUser}
                nonWorkingDays={nonWorkingDays.data || []}
                isnonWorkingDaysLoading={nonWorkingDays.isLoading}
                leaveList={selectedUser !== '' ? leaveList.data : []}
                leaveSummaryData={getSelectedLeaveType(selectedLeaveType) || []}
                isLoading={addLeave.isLoading || nonWorkingDays.isLoading}
                isHR={true}
                addLeaveAlert={addLeaveAlert}
                submitLeave={onSubmitLeave}
                getNonWorkingDays={getNonWorkingDaysInfo}
                onHandleLeaveTypeChange={onLeaveTypeChange}
                onhandleLeaveDateChange={getLeaveList}
                onHandleLeaveError={handleLeaveError}
                onUpdateLeaveCount={updateLeaveCountSummary}
                onUserChange={handleUserChange}
              />
            </form>
          </Grid>
          <Grid
            size={{ md: 3 }}
            sx={{ direction: 'column', spacing: 4, justify: 'center', alignItems: 'center' }}
          >
            <LeaveCountSummary
              selectedLeaveType={selectedLeaveType}
              leaveSummaryData={selectedUser !== '' ? getSelectedLeaveType(selectedLeaveType) : []}
              isLoading={leaveCountSummaryData.isLoading}
            />
          </Grid>
        </Grid>

        <Divider />
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3>Leave History</h3>
            <span>Check the status of your previous leaves in this section.</span>
          </Grid>
          <Grid size={{ md: 9 }} className="sectionTitleHolder">
            {updateLeaveAlert.message && (
              <Alert
                className="mb-m"
                onClose={clearUpdateLeaveAlert}
                severity={updateLeaveAlert.severity}
              >
                {updateLeaveAlert.message}
              </Alert>
            )}
            <LeaveList
              data={selectedUser !== '' ? leaveList.data.slice().sort(compareLeaveDate) : []}
              page={page}
              isLoading={leaveList.isLoading}
              isUpdating={false}
              rowsPerPage={rowsPerPage}
              isHR={false}
              isAllowWithdrawAll={false}
              onHandleChangePage={handleChangePage}
              onHandleChangeRowsPerPage={handleChangeRowsPerPage}
              onApproveLeave={() => {}}
              onRejectLeave={() => {}}
              onWithdrawLeave={onwithdrawLeave}
              onClickLeaveCountSummary={() => {}}
            />
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}

export default MarkingLeaveHR
