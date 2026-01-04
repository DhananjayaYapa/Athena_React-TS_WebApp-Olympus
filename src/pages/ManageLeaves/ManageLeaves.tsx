import { Grid } from '@mui/material'
import { Alert } from '@mui/material'
import React, { useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { LeaveList, LeaveListFilters, LeaveRejectPopup } from '../../components'
import { AppLayout } from '../../templates'
import { alertActions, leaveActions, userActions } from '../../redux/actions'
import { LEAVE_STATUS_IDS, LEAVE_STATUS_LIST, LEAVE_TYPE_LIST } from '../../utilities/constants'
import {
  AlertDto,
  GetLeaveListParamsDto,
  LeaveFiltersFormDto,
  LeaveListItemDto,
  LeaveRejectReasonFormDto,
  LeaveTypeDto,
  UpdateLeaveDto,
  AppStateDto,
  GetUserListBriefParamsDto,
} from '../../utilities/models'
import ConfirmationPopUp from '../../components/shared/ConfirmationPopUp/ConfirmationPopUp'
import { validateFormData } from '../../utilities/helpers'
import LeaveCountSummaryPopUp from '../../components/leave-management/LeaveCountSummary/LeaveCountSummaryPopUp'

const ManageLeaves = () => {
  const INITIAL_FILTER_STATE: LeaveFiltersFormDto = {
    from: { value: null, validator: 'date', isRequired: false, error: null, disable: false },
    to: { value: null, validator: 'date', isRequired: false, error: null, disable: true },
    username: { value: '', validator: 'text', isRequired: false, error: null, disable: false },
    status: {
      value: { id: LEAVE_STATUS_IDS.APPLIED, status: 'Applied' },
      validator: 'object',
      isRequired: false,
      error: null,
      disable: false,
    },
    type: {
      value: {} as LeaveTypeDto,
      validator: 'object',
      isRequired: false,
      error: null,
      disable: false,
    },
  }
  const INITIAL_REJECT_RESON_STATE: LeaveRejectReasonFormDto = {
    reason: { value: '', validator: 'text', isRequired: true, error: null, disable: false },
  }

  const [leaveApproveConfirmPopup, setLeaveApproveConfirmPopup] = React.useState({
    status: false,
    data: {} as LeaveListItemDto,
  })
  const [leaveRejectConfirmPopup, setLeaveRejectConfirmPopup] = React.useState({
    status: false,
    data: {} as LeaveListItemDto,
  })
  const [leaveCountSummaryPopup, setLeaveCountSummaryPopup] = React.useState({
    status: false,
    data: {} as LeaveListItemDto,
  })
  const dispatch = useDispatch()
  const [filters, setFilters] = useState(INITIAL_FILTER_STATE)
  const [rejectReason, setRejectReason] = useState(INITIAL_REJECT_RESON_STATE)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const getLeaveListAlert: AlertDto = useSelector((state: AppStateDto) => state.alerts.getLeaveList)
  const updateLeaveAlert: AlertDto = useSelector((state: AppStateDto) => state.alerts.updateLeave)
  const leaveList = useSelector((state: AppStateDto) => state.leave.leaveList)
  const userListBrief = useSelector((state: AppStateDto) => state.user.userListBrief)
  const updateLeave = useSelector((state: AppStateDto) => state.leave.updateLeave)
  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)
  const leaveCountSummaryData = useSelector((state: AppStateDto) => state.leave.leaveCountSummary)
  const filteredUsers =
    userListBrief.data &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userListBrief.data?.data?.filter((user: any) => user.username !== authorizedUser.data.username)
  React.useEffect(() => {
    const initialParams: GetLeaveListParamsDto = {
      statusId: LEAVE_STATUS_IDS.APPLIED,
    }
    getLeaveList(initialParams)
    getUserListBrief()

    return () => {
      dispatch(leaveActions.clearLeaveList())
    }
  }, [])

  React.useEffect(() => {
    if (updateLeaveAlert.severity === 'success') {
      onFilterApply()
    }
  }, [updateLeaveAlert])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFilterChange = (property: string, value: any) => {
    switch (property) {
      case 'from':
        setFilters({
          ...filters,
          to: {
            ...filters.to,
            disable: false,
          },
          from: {
            ...filters.from,
            value: value,
            error: null,
          },
        })
        break
      default:
        setFilters({
          ...filters,
          [property]: {
            ...filters[property as keyof typeof filters],
            value: value,
            error: null,
          },
        })
    }
  }
  const getUserListBrief = () => {
    const userListBrief: GetUserListBriefParamsDto = {}
    dispatch(userActions.getUserListBrief(userListBrief))
  }
  const onFilterApply = () => {
    const params: GetLeaveListParamsDto = {
      statusId: filters.status.value?.id ? filters.status.value.id : undefined,
      from: filters.from.value ? moment(filters.from.value).format('YYYY-MM-DD') : undefined,
      to: filters.to.value ? moment(filters.to.value).format('YYYY-MM-DD') : undefined,
      typeId: filters.type.value?.id ? filters.type.value.id : undefined,
      username: filters.username.value ? filters.username.value : undefined,
    }
    setPage(0)
    getLeaveList(params)
  }

  const onFilterClear = () => {
    setFilters(INITIAL_FILTER_STATE)
    setPage(0)
    setRowsPerPage(10)
    const initialParams: GetLeaveListParamsDto = {
      statusId: LEAVE_STATUS_IDS.APPLIED,
    }
    getLeaveList(initialParams)
  }

  const getLeaveList = (params: GetLeaveListParamsDto) => {
    dispatch(leaveActions.getLeaveList(params))
  }

  const initLeaveApproveConfirm = (data: LeaveListItemDto) => {
    setLeaveApproveConfirmPopup({
      status: true,
      data: data,
    })
  }

  const onLeaveApproveConfirm = (isConfirmed: boolean, data: LeaveListItemDto) => {
    setLeaveApproveConfirmPopup({
      status: false,
      data: {} as LeaveListItemDto,
    })

    if (isConfirmed) {
      const payload: UpdateLeaveDto = {
        leaveId: data.leaveId,
        leaveStatusId: LEAVE_STATUS_IDS.APPROVED,
      }

      dispatch(leaveActions.updateLeave(payload))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRejectLeaveFormChange = (property: string, value: any) => {
    setRejectReason({
      ...rejectReason,
      [property]: {
        ...rejectReason[property as keyof typeof rejectReason],
        value: value,
        error: null,
      },
    })
  }

  const initLeaveRejectConfirm = (data: LeaveListItemDto) => {
    setRejectReason(INITIAL_REJECT_RESON_STATE)
    setLeaveRejectConfirmPopup({
      status: true,
      data: data,
    })
  }

  const onLeaveRejectConfirm = async (isConfirmed: boolean, data?: LeaveListItemDto) => {
    if (isConfirmed) {
      const [validatedData, isValid] = await validateFormData(rejectReason)
      setRejectReason(validatedData)

      if (isValid) {
        const payload: UpdateLeaveDto = {
          leaveId: data?.leaveId || 0,
          leaveStatusId: LEAVE_STATUS_IDS.REJECTED,
          rejectionNote: rejectReason.reason.value,
        }

        dispatch(leaveActions.updateLeave(payload))
        setLeaveRejectConfirmPopup({
          status: false,
          data: {} as LeaveListItemDto,
        })
      }
    } else {
      setLeaveRejectConfirmPopup({
        status: false,
        data: {} as LeaveListItemDto,
      })
    }
  }

  const clearGetLeaveListAlert = () => {
    dispatch(alertActions.clearGetLeaveListAlert())
  }

  const clearUpdateLeaveAlert = () => {
    dispatch(alertActions.clearUpdateLeaveAlert())
  }

  // handle pagination page change event
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // handle pagination rows per page dropdown change event
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const getLeaveCountSummary = (username: string) => {
    dispatch(leaveActions.getLeaveCountSummary(username))
  }

  const onLeaveLeaveCountSummaryClose = () => {
    setLeaveCountSummaryPopup({
      ...leaveCountSummaryPopup,
      status: false,
    })
  }

  const handleLeaveCountSummary = (data: LeaveListItemDto) => {
    getLeaveCountSummary(data.username)
    setLeaveCountSummaryPopup({
      status: true,
      data: data,
    })
  }

  return (
    <React.Fragment>
      <ConfirmationPopUp
        popUpTitle="Leave History"
        onClose={onLeaveApproveConfirm}
        confirmationMessage="Are you sure you want to approve the Leave ?"
        data={leaveApproveConfirmPopup.data}
        open={leaveApproveConfirmPopup.status}
      />

      <LeaveRejectPopup
        open={leaveRejectConfirmPopup.status}
        data={leaveRejectConfirmPopup.data}
        onFormChange={onRejectLeaveFormChange}
        formData={rejectReason}
        onClose={onLeaveRejectConfirm}
      />

      <LeaveCountSummaryPopUp
        open={leaveCountSummaryPopup.status}
        data={leaveCountSummaryPopup.data || {}}
        onClose={onLeaveLeaveCountSummaryClose}
        leaveCountSummary={leaveCountSummaryData.data[0]}
        isLoading={leaveCountSummaryData.isLoading}
      />

      <AppLayout breadcrumb="Approve Leaves" componentTitle="Approve Leaves">
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3>Manage Leaves</h3>
            <p>
              View and manage all leaves of employees. You can filter the leaves base on date, type,
              status & username.
            </p>
          </Grid>
          <Grid size={{ md: 7 }}>
            {getLeaveListAlert.message && (
              <Alert
                className="mb-m"
                onClose={clearGetLeaveListAlert}
                severity={getLeaveListAlert.severity}
              >
                {getLeaveListAlert.message}
              </Alert>
            )}
            <LeaveListFilters
              leaveStatusList={LEAVE_STATUS_LIST}
              leaveTypeList={LEAVE_TYPE_LIST}
              userList={filteredUsers || []}
              handleChange={onFilterChange}
              data={filters}
              onFilterApply={onFilterApply}
              onFilterClear={onFilterClear}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 12 }}>
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
              data={leaveList.data || []}
              page={page}
              isLoading={leaveList.isLoading}
              isUpdating={updateLeave.isLoading}
              rowsPerPage={rowsPerPage}
              isHR={true}
              onHandleChangePage={handleChangePage}
              onHandleChangeRowsPerPage={handleChangeRowsPerPage}
              onApproveLeave={initLeaveApproveConfirm}
              onRejectLeave={initLeaveRejectConfirm}
              onWithdrawLeave={() => {}}
              onClickLeaveCountSummary={handleLeaveCountSummary}
            />
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}

export default ManageLeaves
