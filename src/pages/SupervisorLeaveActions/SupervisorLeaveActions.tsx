import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SupervisorLeaveActionsForm, LeaveRejectPopup } from '../../components'
import { AppStateDto, LeaveRejectReasonFormDto } from '../../utilities/models'
import { LEAVE_STATUS_IDS } from '../../utilities/constants'
import { leaveActions } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import { validateFormData } from '../../utilities/helpers'
import { UserLeaveStatusUpdateDto, AlertDto } from '../../utilities/models/index'
import styles from './SupervisorLeaveActions.module.scss'

const SupervisorLeaveActions = () => {
  const { search } = useLocation()
  const searchParameters: any = React.useMemo(() => new URLSearchParams(search), [search])
  const dispatch = useDispatch()
  const INITIAL_REJECT_RESON_STATE: LeaveRejectReasonFormDto = {
    reason: { value: '', validator: 'text', isRequired: true, error: null, disable: false },
  }
  const [leaveRejectConfirmPopup, setLeaveRejectConfirmPopup] = useState({
    status: false,
    data: {},
  })
  const [rejectReason, setRejectReason] = useState(INITIAL_REJECT_RESON_STATE)
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    setToken(searchParameters.get('token'))
    if (searchParameters.get('token')) {
      dispatch(leaveActions.getUserLeaveInfoByToken(searchParameters.get('token')))
    }
  }, [])

  const leaveData = useSelector((state: AppStateDto) => state.leave.getUserLeaveInfo)
  const updateLeaveStatus = useSelector((state: AppStateDto) => state.leave.updateUserLeaveStatus)
  const updateLeaveStatusAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.updateUserLeaveStatus
  )

  useEffect(() => {
    if (updateLeaveStatusAlert.severity === 'success') {
      dispatch(leaveActions.getUserLeaveInfoByToken(token))
    }
  }, [updateLeaveStatusAlert])

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onLeaveRejectConfirm = async (isConfirmed: boolean) => {
    if (isConfirmed) {
      const [validatedData, isValid] = await validateFormData(rejectReason)
      setRejectReason(validatedData)

      if (isValid) {
        const payload: UserLeaveStatusUpdateDto = {
          token: token,
          leaveStatusId: LEAVE_STATUS_IDS.REJECTED,
          rejectionNote: rejectReason.reason.value,
          modifiedBy: 'System',
        }
        dispatch(leaveActions.updateUserLeaveStatusByToken(payload))
        setLeaveRejectConfirmPopup({
          status: false,
          data: {},
        })
      }
    } else {
      setLeaveRejectConfirmPopup({
        status: false,
        data: {},
      })
    }
  }

  const onApproveLeave = () => {
    const payload: UserLeaveStatusUpdateDto = {
      token: token,
      leaveStatusId: LEAVE_STATUS_IDS.APPROVED,
      modifiedBy: 'System',
    }
    dispatch(leaveActions.updateUserLeaveStatusByToken(payload))
  }

  const onRejectLeave = () => {
    setRejectReason(INITIAL_REJECT_RESON_STATE)
    setLeaveRejectConfirmPopup({
      status: true,
      data: {},
    })
  }

  return (
    <React.Fragment>
      <div className={styles.wrapper}>
        <LeaveRejectPopup
          open={leaveRejectConfirmPopup.status}
          data={leaveRejectConfirmPopup.data}
          onFormChange={onRejectLeaveFormChange}
          formData={rejectReason}
          onClose={onLeaveRejectConfirm}
        />
        <div className={styles.content}>
          <SupervisorLeaveActionsForm
            token={token}
            isLoading={leaveData.isLoading || updateLeaveStatus.isLoading}
            leaveData={leaveData.data || []}
            onHandleApproveLeave={onApproveLeave}
            onHandleRejectLeave={onRejectLeave}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

export default SupervisorLeaveActions
