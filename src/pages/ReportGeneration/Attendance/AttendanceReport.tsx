import { Grid, Divider, Alert } from '@mui/material'
import React, { useEffect } from 'react'
import { CustomAlert } from '../../../components'
import { AppLayout } from '../../../templates'
import { useDispatch, useSelector } from 'react-redux'
import { alertActions, reportActions } from '../../../redux/actions'
import {
  AppStateDto,
  AttendanceInfoParams,
  getUserClientHierarchyListDto,
} from '../../../utilities/models'
import AttendanceReportForm from '../../../components/ReportGeneration/attendance/AttendanceReoprtForm'
import AttendanceReportTable from '../../../components/ReportGeneration/attendance/AttendanceReportTable'

const AttendanceReport = () => {
  const dispatch = useDispatch()

  const attendanceReportResponse = useSelector(
    (state: AppStateDto) => state.report.attendanceReport.data.data
  )

  const isAttendanceReportResponseLoading = useSelector(
    (state: AppStateDto) => state.report.attendanceReport.isLoading
  )

  const userClientHierarchy = useSelector(
    (state: AppStateDto) => state.report.getUserClientHierarchy
  )

  const attendanceReportAlert = useSelector(
    (state: AppStateDto) => state.alerts.getAttendanceReport
  )

  useEffect(() => {
    dispatch(reportActions.resetAttendanceDetail())
    getClientHierachy()
    //  dispatch(reportActions.getUserClientHierarchy({getDisabled: true}));
  }, [])

  const [noDetails, setNoDetails] = React.useState<boolean>(false)

  React.useEffect(() => {
    //console.log("attendance response no data", attendanceReportResponse)
    if (attendanceReportResponse?.length == 0) {
      setNoDetails(true)
      setTimeout(() => setNoDetails(false), 2000)
    } else {
      setNoDetails(false)
    }
  }, [attendanceReportResponse])

  React.useEffect(() => {
    setNoDetails(false)
  }, [])

  //console.log("clientssssssss", clientList);
  const getClientHierachy = () => {
    const clientHeirachyParams: getUserClientHierarchyListDto = {
      getDisabled: false,
    }
    dispatch(reportActions.getUserClientHierarchy(clientHeirachyParams))
  }
  const onAttendanceSearch = (filters: AttendanceInfoParams) => {
    if (filters.username === '') {
      filters.username = null
    }
    dispatch(reportActions.getAttendanceReport(filters))
  }

  const reset = () => {
    dispatch(reportActions.resetAttendanceDetail())
  }

  const closeAttendanceReportAlert = () => {
    dispatch(alertActions.clearAttendanceReportAlert())
  }
  return (
    <React.Fragment>
      <AppLayout breadcrumb="Attendance Report" componentTitle="Attendance Report">
        {noDetails ? (
          <div style={{ paddingTop: '5px' }}>
            <CustomAlert displayText="No details to display!" severity="warning" />
          </div>
        ) : (
          <div></div>
        )}
        {attendanceReportAlert.message && (
          <Alert onClose={closeAttendanceReportAlert} severity={attendanceReportAlert.severity}>
            {attendanceReportAlert.message}
          </Alert>
        )}
        <Grid container spacing={2} direction="row" className="content-padding">
          <Grid size={{ md: 3 }} direction="column" className="sectionTitleHolder">
            <h3 className="font-weight-bold">Generate Attendance Report</h3>
            <p>Select a Client, Start Date and End Date to filter results.</p>
            <p>
              Team and End Date fields are disabled until after Client and Start Date selection.
            </p>
          </Grid>
          <Grid
            size={{ md: 7 }}
            sx={{ direction: 'column', spacing: 4, justify: 'center', alignItems: 'center' }}
          >
            <AttendanceReportForm
              onAttendanceSearch={onAttendanceSearch}
              isUsersListLoading={userClientHierarchy.isLoading}
              userClientHierarchy={userClientHierarchy.data || []}
              isAttendanceReportResponseLoading={isAttendanceReportResponseLoading}
              reset={reset}
            />
          </Grid>
        </Grid>
        <Divider style={{ margin: '20px 0px 30px 0px', width: '100%' }} />
        {attendanceReportResponse != undefined &&
        attendanceReportResponse?.length > 0 &&
        isAttendanceReportResponseLoading === false ? (
          <AttendanceReportTable attendanceReportResponse={attendanceReportResponse} />
        ) : (
          <div></div>
        )}
      </AppLayout>
    </React.Fragment>
  )
}

export default AttendanceReport
