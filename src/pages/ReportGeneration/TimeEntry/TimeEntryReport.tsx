import React, { useEffect, useState } from 'react'
import { AppLayout } from '../../../templates'
import { Alert, Divider, Grid } from '@mui/material'
import TimeEntryReportForm from '../../../components/ReportGeneration/time-entry/TimeEntryReportForm/TimeEntryReportForm'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppStateDto,
  GetDisabledSbuParamDto,
  getUserClientHierarchyListDto,
  GetUserListBriefParamsDto,
  SbuTeamUsersDto,
} from '../../../utilities/models'
import { alertActions, reportActions, userActions } from '../../../redux/actions'
import {
  DownloadReportParamsDto,
  InitBriefDto,
  PostTimeEntryParamsDto,
  TimeEntryFilterFormDto,
  TimeEntryReportDto,
} from '../../../utilities/models/ReportGeneration/TimeEntryReport.model'
import { validateFormData } from '../../../utilities/helpers'
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../../../utilities/constants'
import moment from 'moment'
import TimeEntryReportTable from '../../../components/ReportGeneration/time-entry/TimeEntryReportTable/TimeEntryReportTable'

const TimeEntryReport = () => {
  const INITIAL_FILTER_STATE = {
    sbu: {
      value: {} as InitBriefDto,
      validator: 'object',
      isRequired: false,
      error: null,
      disable: false,
    },
    user: {
      value: [] as InitBriefDto[],
      validator: 'array',
      isRequired: false,
      error: null,
      disable: true,
    },
    startDate: { value: null, validator: 'date', isRequired: true, error: null, disable: false },
    endDate: {
      value: null,
      validator: 'date',
      isRequired: true,
      error: null,
      disable: true,
      disableFuture: true,
    },
  }
  const dispatch = useDispatch()

  const allSbuList = useSelector((state: AppStateDto) => state.report.allSbuList.data)
  const clientHierarchy = useSelector(
    (state: AppStateDto) => state.report.getUserClientHierarchy.data
  )
  const userListBrief = useSelector((state: AppStateDto) => state.user.userListBrief)
  const reportsDataList = useSelector((state: AppStateDto) => state.report.timeEntryReportList)
  const reportsIsLoading = useSelector(
    (state: AppStateDto) => state.report.timeEntryReportList.isLoading
  )
  const reqReportIsLoading = useSelector(
    (state: AppStateDto) => state.report.timeEntryRequest.isLoading
  )
  const requestReportAlert = useSelector((state: AppStateDto) => state.alerts.timeEntryAlert)
  const reportFileKey = useSelector(
    (state: AppStateDto) => state.report.timeEntryReportDownload.data
  )
  const timeEntryDownloadAlert = useSelector(
    (state: AppStateDto) => state.alerts.timeEntryDownloadAlert
  )

  const [sbuUserList, setSbuUserList] = useState<SbuTeamUsersDto[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const [timeEntryReportList, setTimeEntryReportList] = useState<TimeEntryReportDto[]>([])

  const [reportFilterFormData, setReportFilterFormData] =
    useState<TimeEntryFilterFormDto>(INITIAL_FILTER_STATE)
  const [onSubmitError, setOnSubmitError] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [fileNameDate, setFileNameDate] = useState<string>('')
  const [reportId, setReportId] = useState(-1)

  const employeeList = React.useMemo(() => {
    if (reportFilterFormData.sbu.value && Object.keys(reportFilterFormData.sbu.value).length > 0) {
      // SBU is selected, use filtered users
      return sbuUserList
    } else {
      // No SBU selected, use all users from UserListBrief
      return Array.isArray(userListBrief?.data?.data) ? userListBrief.data.data : []
    }
  }, [reportFilterFormData.sbu.value, sbuUserList, userListBrief])

  const getTimeEntryReportList = () => {
    dispatch(reportActions.getTimeEntryReport())
  }

  useEffect(() => {
    getSBUList()
    getClientHierarchy()
    getUserListBrief()
    getTimeEntryReportList()

    return () => {
      dispatch(reportActions.getTimeEntryDownloadClear())
    }
  }, [])

  useEffect(() => {
    setTimeEntryReportList(reportsDataList?.data || [])
  }, [reportsDataList])

  useEffect(() => {
    setTimeout(() => setOnSubmitError(false), 4000)
  }, [onSubmitError])

  useEffect(() => {
    if (requestReportAlert.severity === 'success' || requestReportAlert.severity === 'error') {
      clearFilters()
    }
  }, [requestReportAlert])

  const getSBUList = () => {
    const sbuListParams: GetDisabledSbuParamDto = {
      getDisabled: 'false',
      getAll: true,
    }
    dispatch(reportActions.allSbuList(sbuListParams))
  }

  const getClientHierarchy = () => {
    const clientHierarchyParams: getUserClientHierarchyListDto = {
      getDisabled: false,
      getAll: true,
    }
    dispatch(reportActions.getUserClientHierarchy(clientHierarchyParams))
  }

  const getUserListBrief = () => {
    const userListBrief: GetUserListBriefParamsDto = {}
    dispatch(userActions.getUserListBrief(userListBrief))
  }

  const filterUsersByClientHierarchy = (id: number): SbuTeamUsersDto[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clients = clientHierarchy.filter((client: any) => client.sbuId === id)

    if (!clients.length) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allUsers = clients.flatMap((client: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client.teams.flatMap((team: any) => team.users || [])
    )
    const uniqueUsers = allUsers.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (user: any, index: number, self: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        index === self.findIndex((u: any) => u.userId === user.userId)
    )

    return uniqueUsers
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFilterHandleChange = (property: string, value: any) => {
    switch (property) {
      case 'sbu':
        setReportFilterFormData({
          ...reportFilterFormData,
          sbu: {
            ...reportFilterFormData.sbu,
            value: value === null ? INITIAL_FILTER_STATE.sbu.value : value,
            error: null,
          },
          user: {
            ...reportFilterFormData.user,
            value: INITIAL_FILTER_STATE.user.value,
            disable: false,
            error: null,
          },
        })
        if (value) {
          setSbuUserList(filterUsersByClientHierarchy(value.id))
        } else {
          setSbuUserList([])
        }
        break
      case 'user':
        setReportFilterFormData({
          ...reportFilterFormData,
          user: {
            ...reportFilterFormData.user,
            value: value === null ? INITIAL_FILTER_STATE.user.value : value,
            error: null,
          },
        })
        break
      case 'startDate':
        setReportFilterFormData({
          ...reportFilterFormData,
          startDate: {
            ...reportFilterFormData.startDate,
            value: value,
            error: null,
          },
          endDate: {
            ...reportFilterFormData.endDate,
            value: INITIAL_FILTER_STATE.endDate.value,
            error: null,
          },
        })
        break
      default:
        setReportFilterFormData({
          ...reportFilterFormData,
          [property]: {
            ...reportFilterFormData[property as keyof typeof reportFilterFormData],
            value,
            error: null,
          },
        })
    }
  }

  const handleInputFocus = (property: string) => {
    setReportFilterFormData({
      ...reportFilterFormData,
      [property]: {
        ...reportFilterFormData[property as keyof typeof reportFilterFormData],
        error: null,
      },
    })
  }

  const clearFilters = (): void => {
    setReportFilterFormData(INITIAL_FILTER_STATE)
    setSbuUserList([])
  }
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const requestForReport = async () => {
    setOnSubmitError(false)
    const [validateData, isValid] = await validateFormData(reportFilterFormData)
    setReportFilterFormData(validateData)
    if (isValid) {
      const filterFormParamsDto: PostTimeEntryParamsDto = {
        sbuId: reportFilterFormData.sbu.value?.id,
        employee:
          reportFilterFormData.user.value.length > 0
            ? reportFilterFormData.user.value.map((user) => user.name)
            : undefined,
        startDate: moment(reportFilterFormData.startDate.value).format(DATE_FORMAT),
        endDate: moment(reportFilterFormData.endDate.value).format(DATE_FORMAT),
      }

      dispatch(reportActions.postTimeEntryReport(filterFormParamsDto))
    } else {
      setOnSubmitError(true)
    }
  }

  const closeTimeEntryAlert = () => {
    dispatch(alertActions.clearExceptionAttendanceAlert())
  }

  const closeTimeEntryDownloadAlert = () => {
    dispatch(alertActions.clearTimeEntryDownloadAlert())
  }

  const onRefreshGrid = () => {
    getTimeEntryReportList()
  }

  const downloadOrgUtilReport = (reportId: number, startDate: string) => {
    const params: DownloadReportParamsDto = {
      id: reportId,
    }
    setDownloading(true)
    dispatch(reportActions.getTimeEntryDownload(params))
    setFileNameDate(startDate)
    setReportId(reportId)
  }
  const downloadURI = async (uri: string, name: string) => {
    try {
      const response = await fetch(uri)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`)
      }
      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    } finally {
      setDownloadInitState()
    }
  }

  useEffect(() => {
    if (reportFileKey.url) {
      downloadURI(
        reportFileKey.url,
        `Time Entry Report - ${moment(fileNameDate).format(DATE_TIME_FORMAT)}.xlsx`
      )
    }
  }, [reportFileKey])

  const setDownloadInitState = () => {
    setDownloading(false)
    setFileNameDate('')
    setReportId(-1)
  }

  useEffect(() => {
    if (timeEntryDownloadAlert?.severity == 'error') {
      setDownloadInitState()
    }
  }, [timeEntryDownloadAlert])

  return (
    <React.Fragment>
      <AppLayout breadcrumb="Time Entry Report" componentTitle="Time Entry Report">
        <Grid container spacing={3} direction="row" className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3 className="font-weight-bold">Time Entry Report</h3>
            <p>
              Enter Start date and End date to generate the Time Entry Report Select SBU or
              Employee, if needed.
            </p>
          </Grid>
          <Grid size={{ md: 7 }}>
            {requestReportAlert.message && (
              <div style={{ paddingTop: '5px', paddingBottom: '10px' }}>
                <Alert onClose={closeTimeEntryAlert} severity={requestReportAlert.severity}>
                  {requestReportAlert.message}
                </Alert>
              </div>
            )}
            <TimeEntryReportForm
              sbuList={allSbuList?.data || []}
              sbuUserList={employeeList}
              reportFilterFormData={reportFilterFormData}
              onFilterHandleChange={onFilterHandleChange}
              handleInputFocus={handleInputFocus}
              clearFilters={clearFilters}
              requestForReport={requestForReport}
              reqReportIsLoading={reqReportIsLoading}
              onSubmitError={onSubmitError}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Divider style={{ margin: '5px 0px 0px 0px', width: '100%' }} />
          </Grid>
        </Grid>

        <Grid container spacing={2} className="content-padding">
          <Grid size={{ md: 3 }} />
          <Grid size={{ md: 9 }}>
            {timeEntryDownloadAlert.message && (
              <Alert
                onClose={closeTimeEntryDownloadAlert}
                severity={timeEntryDownloadAlert.severity}
              >
                {timeEntryDownloadAlert.message}
              </Alert>
            )}
          </Grid>
          <Grid size={{ md: 12 }}>
            <TimeEntryReportTable
              page={page}
              rowsPerPage={rowsPerPage}
              filterRows={timeEntryReportList || []}
              reportsIsLoading={reportsIsLoading}
              onHandleChangePage={handleChangePage}
              onHandleChangeRowsPerPage={handleChangeRowsPerPage}
              reportId={reportId}
              refreshGrid={onRefreshGrid}
              downloadReport={downloadOrgUtilReport}
              downloading={downloading}
            />
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}

export default TimeEntryReport
