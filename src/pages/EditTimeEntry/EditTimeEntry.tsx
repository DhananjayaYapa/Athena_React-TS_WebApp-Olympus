import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { EditTimeEntryFilters, EditTimeEntryGrid } from '../../components'
import { AppLayout } from '../../templates'
import { alertActions, attendanceActions, teamsActions, userActions } from '../../redux/actions'
import { TIME_ENTRY_LOCATION_IDS } from '../../utilities/constants'
import { validateFormData } from '../../utilities/helpers'
import {
  AddAttendanceInfoDto,
  GetUserListBriefParamsDto,
  AlertDto,
  GetAttendanceInfoParamsDto,
  IsEditingAttendanceRowDto,
  AppStateDto,
  TeamListV2ParamsDto,
} from '../../utilities/models'
import { AppDispatch } from '../../redux/store'
import { Alert, Grid } from '@mui/material'

const EditTimeEntry = () => {
  const INITIAL_EDITING_ROW_STATE = {
    rowId: { value: -1 },
    username: { value: '' },
    attendanceDate: { value: null as Date | null },
    workFromLocation: {
      value: TIME_ENTRY_LOCATION_IDS.WORK_FROM_HOME,
      validator: 'number',
      isRequired: true,
      error: null,
      disable: false,
    },
    startTime: {
      value: null as Date | null,
      validator: 'date',
      isRequired: true,
      error: null,
      disable: false,
    },
    endTime: {
      value: null as Date | null,
      validator: 'date',
      isRequired: true,
      error: null,
      disable: false,
    },
  }

  const dispatch = useDispatch<AppDispatch>()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [isEditingRow, setIsEditingRow] = React.useState(INITIAL_EDITING_ROW_STATE)
  const [timeEntryFilters, setTimeEntryFilters] = React.useState<GetAttendanceInfoParamsDto>(
    {} as GetAttendanceInfoParamsDto
  )

  const getAttendanceInfoAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.getAttendanceInfo
  )
  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)
  const attendanceInfo = useSelector((state: AppStateDto) => state.attendance.attendanceInfo)
  const teamListv2 = useSelector((state: AppStateDto) => state.teams.teamListV2)
  const teamListAlert: AlertDto = useSelector((state: AppStateDto) => state.alerts.teamListAlert)
  const userListBrief = useSelector((state: AppStateDto) => state.user.userListBrief)
  const addAttendanceInfo = useSelector((state: AppStateDto) => state.attendance.addAttendanceInfo)
  const addAttendanceInfoAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.addAttendanceInfo
  )
  const allocationsListAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.getAllocations
  )
  const filteredUsers =
    userListBrief.data &&
    userListBrief.data?.data?.filter((user: any) => user.username !== authorizedUser.data.username)

  React.useEffect(() => {
    getTeamListV2()
    getUserListBrief()

    return () => {
      clearTeamListAlert()
      clearGetAttendanceInfoAlert()
      clearAddAttendanceInfoAlert()
      dispatch(attendanceActions.clearAttendanceInfo())
    }
  }, [])

  React.useEffect(() => {
    if (addAttendanceInfoAlert.severity === 'success') {
      ignoreRowChanges()
      getAttendanceInfo(timeEntryFilters)
    }
  }, [addAttendanceInfoAlert])

  const getTeamListV2 = () => {
    const teamListV2Params: TeamListV2ParamsDto = {
      //    getAllProjects: false
    }
    dispatch(teamsActions.getTeamListV2(teamListV2Params))
  }
  const getUserListBrief = () => {
    const userListBrief: GetUserListBriefParamsDto = {
      userRoleKey: 'EMPLOYEE',
    }
    dispatch(userActions.getUserListBrief(userListBrief))
  }
  const onFilterChange = (params: GetAttendanceInfoParamsDto) => {
    setPage(0)
    setTimeEntryFilters(params)
    getAttendanceInfo(params)
  }

  const getAttendanceInfo = (params: GetAttendanceInfoParamsDto) => {
    dispatch(attendanceActions.getAttendanceInfo(params))
  }

  const rowEditTrigger = (data: IsEditingAttendanceRowDto) => {
    setIsEditingRow({
      ...isEditingRow,
      rowId: { value: data.rowId },
      username: { value: data.username },
      attendanceDate: { value: new Date(data.attendanceDate) },
      workFromLocation: {
        ...isEditingRow.workFromLocation,
        value: data.locationId ? data.locationId : TIME_ENTRY_LOCATION_IDS.WORK_FROM_HOME,
      },
      endTime: {
        ...isEditingRow.endTime,
        value: data.endTime ? new Date(`${data.attendanceDate} ${data.endTime}`) : null,
      },
      startTime: {
        ...isEditingRow.startTime,
        value: data.startTime ? new Date(`${data.attendanceDate} ${data.startTime}`) : null,
      },
    })
  }

  const handleTableRowChange = (property: string, value: any) => {
    switch (property) {
      case 'startTime':
        setIsEditingRow({
          ...isEditingRow,
          startTime: {
            ...isEditingRow.startTime,
            value: value,
            error: null,
          },
        })
        break
      case 'endTime':
        setIsEditingRow({
          ...isEditingRow,
          endTime: {
            ...isEditingRow.endTime,
            value: value,
            error: null,
          },
        })
        break
      default:
        setIsEditingRow({
          ...isEditingRow,
          [property]: {
            ...isEditingRow[property as keyof typeof isEditingRow],
            value: value,
            error: null,
          },
        })
    }
  }

  const saveTableRowChanges = async () => {
    const [validatedData, isValid] = await validateFormData(isEditingRow)
    setIsEditingRow(validatedData)

    if (isValid) {
      if (moment(isEditingRow.startTime.value).isAfter(isEditingRow.endTime.value)) {
        const alert: AlertDto = {
          message: 'Invalid End time, end time should be greater than start time.',
          severity: 'error',
        }
        dispatch(alertActions.setAddAttendanceInfoAlertRequest(alert))
        return
      }

      const payload: AddAttendanceInfoDto = {
        username: isEditingRow.username.value,
        capturedBy: authorizedUser.data.username,
        attendance: [
          {
            attendanceDate: moment(isEditingRow.attendanceDate.value).format('YYYY-MM-DD'),
            locationId: isEditingRow.workFromLocation.value,
            isUpdate: true,
            attendanceTime: [
              {
                attendanceTime: moment(isEditingRow.startTime.value).format('HH:mm:ss'),
                inOutFlag: true,
              },
              {
                attendanceTime: moment(isEditingRow.endTime.value).format('HH:mm:ss'),
                inOutFlag: false,
              },
            ],
          },
        ],
      }
      dispatch(attendanceActions.addAttendanceInfo(payload))
    }
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

  const ignoreRowChanges = () => {
    setIsEditingRow(INITIAL_EDITING_ROW_STATE)
  }

  const clearTeamListAlert = () => {
    dispatch(alertActions.clearTeamListAlert())
  }

  const clearGetAllocationsAlert = () => {
    dispatch(alertActions.clearGetAllocationsAlert())
  }
  const clearGetAttendanceInfoAlert = () => {
    dispatch(alertActions.clearGetAttendanceInfoAlert())
  }

  const clearAddAttendanceInfoAlert = () => {
    dispatch(alertActions.clearAddAttendanceInfoAlert())
  }
  const clearFilteredData = () => {
    dispatch(attendanceActions.clearAttendanceInfo())
  }

  return (
    <React.Fragment>
      <AppLayout breadcrumb="Edit Time Entries" componentTitle="Edit Time Entries">
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3>Search Time Entries</h3>
            <p>Search time entries base on date, team or Employee to edit.</p>
          </Grid>
          <Grid size={{ md: 7 }}>
            {teamListAlert.message && (
              <Alert
                className="mb-m"
                onClose={clearTeamListAlert}
                severity={teamListAlert.severity}
              >
                {teamListAlert.message}
              </Alert>
            )}
            {getAttendanceInfoAlert.message && (
              <Alert
                className="mb-m"
                onClose={clearGetAttendanceInfoAlert}
                severity={getAttendanceInfoAlert.severity}
              >
                {getAttendanceInfoAlert.message}
              </Alert>
            )}
            {allocationsListAlert.message && (
              <Alert
                className="mb-m"
                onClose={clearGetAllocationsAlert}
                severity={allocationsListAlert.severity}
              >
                {allocationsListAlert.message}
              </Alert>
            )}
            <EditTimeEntryFilters
              onFilterChange={onFilterChange}
              isProcessing={attendanceInfo.isLoading}
              userList={filteredUsers || []}
              teamList={teamListv2.data || []}
              clearFilteredData={clearFilteredData}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 12 }}>
            {addAttendanceInfoAlert.message && (
              <Alert
                className="mb-m"
                onClose={clearAddAttendanceInfoAlert}
                severity={addAttendanceInfoAlert.severity}
              >
                {addAttendanceInfoAlert.message}
              </Alert>
            )}

            {!!timeEntryFilters && timeEntryFilters.startDate && (
              <EditTimeEntryGrid
                isEditingRow={isEditingRow}
                onRowChange={handleTableRowChange}
                onIgnoreRowChanges={ignoreRowChanges}
                onSaveRowChanges={saveTableRowChanges}
                onRowEditTrigger={rowEditTrigger}
                page={page}
                rowsPerPage={rowsPerPage}
                isAttendnaceSubmitting={addAttendanceInfo.isLoading}
                isDataLoading={attendanceInfo.isLoading}
                onHandleChangePage={handleChangePage}
                onHandleChangeRowsPerPage={handleChangeRowsPerPage}
                data={attendanceInfo.data?.data || []}
              />
            )}
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}
export default EditTimeEntry
