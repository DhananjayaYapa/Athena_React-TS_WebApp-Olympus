import { Alert, Divider, Grid } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AddTimeEntryForm, AppAuthorizer, AddTimeEntryHistory } from '../../components'
import { AppLayout } from '../../templates'
import { alertActions, attendanceActions } from '../../redux/actions'
import {
  AddAttendanceInfoDto,
  AddAttendaneInfoTimeObjectDto,
  AlertDto,
  AttendanceInfoObjectDto,
  GetAttendanceInfoParamsDto,
  TimeEntryRawDataDto,
  AppStateDto,
} from '../../utilities/models'
import moment from 'moment'
import { TIME_ENTRY_TYPES } from '../../utilities/constants'
import { APP_FEATURE_KEYS } from '../../utilities/constants'
import { AppDispatch } from '../../redux/store'

const AddTimeEntry = () => {
  const ADD_ATTENDANCE_ALLOWED_DAYS: number = 5

  const { search } = useLocation()
  const searchParameters: any = React.useMemo(() => new URLSearchParams(search), [search])

  const dispatch = useDispatch<AppDispatch>()
  const addTimeEntryFormRef = useRef<any>(null)

  // get from local storage
  const activeUserRole = useSelector((state: AppStateDto) => state.auth.activeUserRole)
  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)
  const addAttendanceInfoAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.addAttendanceInfo
  )
  const getAttendanceInfoAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.getAttendanceInfo
  )
  const addAttendanceInfo = useSelector((state: AppStateDto) => state.attendance.addAttendanceInfo)
  const attendanceInfo = useSelector((state: AppStateDto) => state.attendance.attendanceInfo)

  const [addTimeEntryMinDate, setAddTimeEntryMinDate] = useState(moment())
  const [isEditingRecord, setIsEditingRecord] = useState<AttendanceInfoObjectDto>(
    {} as AttendanceInfoObjectDto
  )

  React.useEffect(() => {
    setAddTimeEntryMinDate(moment().subtract(ADD_ATTENDANCE_ALLOWED_DAYS, 'days'))
    // get data
    getUserAttendanceInfo()

    // on comp unmount
    return () => {
      clearAddAttendanceInfoAlert()
      clearGetAttendanceInfoAlert()
      dispatch(attendanceActions.clearAttendanceInfo())
    }
  }, [])
  React.useEffect(() => {
    if (addAttendanceInfoAlert.severity === 'success') {
      addTimeEntryFormRef.current.resetFormData()
      setIsEditingRecord({} as AttendanceInfoObjectDto)
      getUserAttendanceInfo()
    }
  }, [addAttendanceInfoAlert])

  React.useEffect(() => {
    if (addAttendanceInfoAlert.severity !== 'success' && searchParameters.get('date')) {
      filterSelectedDate(searchParameters.get('date'))
    }
  }, [searchParameters, attendanceInfo])

  const submitTimeEntry = (timeEntryRawData: TimeEntryRawDataDto) => {
    const attendanceTime: AddAttendaneInfoTimeObjectDto[] = []
    // validate & process time records,
    if (timeEntryRawData.timeEntryType === TIME_ENTRY_TYPES.START_END) {
      if (moment(timeEntryRawData.startTime).isAfter(timeEntryRawData.endTime)) {
        const alert: AlertDto = {
          message: 'Invalid End time, end time should be greater than start time.',
          severity: 'error',
        }
        dispatch(alertActions.setAddAttendanceInfoAlertRequest(alert))
        return
      }

      attendanceTime.push({
        inOutFlag: false,
        attendanceTime: moment(timeEntryRawData.endTime).format('HH:mm:ss'),
      })
    }

    attendanceTime.push({
      inOutFlag: true,
      attendanceTime: moment(timeEntryRawData.startTime).format('HH:mm:ss'),
    })

    // create payload
    const payload: AddAttendanceInfoDto = {
      username: authorizedUser.data.username,
      capturedBy: authorizedUser.data.username,
      attendance: [
        {
          attendanceDate: moment(timeEntryRawData.date).format('YYYY-MM-DD'),
          locationId: timeEntryRawData.location,
          attendanceTime: attendanceTime,
          isUpdate: timeEntryRawData.isUpdate,
        },
      ],
    }
    dispatch(attendanceActions.addAttendanceInfo(payload))
  }

  const initAttendanceEdit = (record: AttendanceInfoObjectDto) => {
    const alert: AlertDto = {
      severity: 'info',
      message: `Update attendance info for the date : ${record.attendanceDate}`,
    }
    dispatch(alertActions.setAddAttendanceInfoAlertRequest(alert, false))
    setIsEditingRecord(record)
  }

  const getUserAttendanceInfo = () => {
    const timeEntryMinDate = moment().subtract(ADD_ATTENDANCE_ALLOWED_DAYS, 'days')
    const attendanceInfoParams: GetAttendanceInfoParamsDto = {
      startDate: moment(timeEntryMinDate).format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      getTasks: true,
      username: authorizedUser.data.username,
    }
    dispatch(attendanceActions.getAttendanceInfo(attendanceInfoParams))
  }

  const clearAddAttendanceInfoAlert = () => {
    dispatch(alertActions.clearAddAttendanceInfoAlert())
  }

  const onAttendanceFormReset = () => {
    dispatch(alertActions.clearAddAttendanceInfoAlert())
    setIsEditingRecord({} as AttendanceInfoObjectDto)
  }

  const clearGetAttendanceInfoAlert = () => {
    dispatch(alertActions.clearGetAttendanceInfoAlert())
  }

  const filterSelectedDate = (date: string) => {
    const record =
      attendanceInfo.data?.data &&
      attendanceInfo.data.data?.filter(
        (data: AttendanceInfoObjectDto) => data.attendanceDate === date
      )
    if (record?.length > 0) {
      setIsEditingRecord(record[0])
    }
  }

  return (
    <React.Fragment>
      <AppLayout breadcrumb="Manage Attendance" componentTitle="Manage Attendance">
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3>Enter Attendance</h3>
            <p>Log a start or end time for the day in this section.</p>
            <p className="appInfoMessage">
              The earliest start time and the latest end time will be recorded.
            </p>
          </Grid>
          <AppAuthorizer
            activeRoleFeatures={activeUserRole.data.features}
            authorizedFeatureKey={[APP_FEATURE_KEYS.CREATE_UPDATE_OWN_TIME_ENTRY]}
          >
            <Grid size={{ md: 8 }} className="sectionTitleHolder">
              {addAttendanceInfoAlert.message && (
                <Alert
                  className="mb-m"
                  onClose={clearAddAttendanceInfoAlert}
                  severity={addAttendanceInfoAlert.severity}
                >
                  {addAttendanceInfoAlert.message}
                </Alert>
              )}

              <AddTimeEntryForm
                ref={addTimeEntryFormRef}
                onSaveTimeEntry={submitTimeEntry}
                isEditingRecord={isEditingRecord}
                onReset={onAttendanceFormReset}
                isProcessing={addAttendanceInfo.isLoading}
                timeEntryMinDate={addTimeEntryMinDate}
              />
            </Grid>
          </AppAuthorizer>
        </Grid>
        <Divider />
        <AppAuthorizer
          activeRoleFeatures={activeUserRole.data.features}
          authorizedFeatureKey={[
            APP_FEATURE_KEYS.CREATE_UPDATE_OWN_TIME_ENTRY,
            APP_FEATURE_KEYS.VIEW_OWN_TIME_ENTRIES,
          ]}
        >
          <Grid container spacing={3} className="content-padding">
            <Grid size={{ md: 3 }} className="sectionTitleHolder">
              <h3>Attendance History</h3>
              <p>Click the edit icon under 'Action' to edit a previously entered record.</p>
            </Grid>
            <Grid size={{ md: 9 }} className="sectionTitleHolder">
              {getAttendanceInfoAlert.message && (
                <Alert
                  className="mb-m"
                  onClose={clearGetAttendanceInfoAlert}
                  severity={getAttendanceInfoAlert.severity}
                >
                  {getAttendanceInfoAlert.message}
                </Alert>
              )}
              <AddTimeEntryHistory
                isLoading={attendanceInfo.isLoading}
                onRecordEdit={initAttendanceEdit}
                data={attendanceInfo.data?.data || []}
              />
            </Grid>
          </Grid>
        </AppAuthorizer>
      </AppLayout>
    </React.Fragment>
  )
}

export default AddTimeEntry
