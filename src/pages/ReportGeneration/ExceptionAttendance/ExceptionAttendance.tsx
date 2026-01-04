import React, { useEffect, useState } from 'react'
import { AppLayout } from '../../../templates'
import { Divider, Grid } from '@mui/material'
import { ExceptionAttendanceReportForm } from '../../../components'
import { useDispatch, useSelector } from 'react-redux'
import { alertActions, reportActions } from '../../../redux/actions'
import {
  AlertDto,
  AppStateDto,
  GetDisabledSbuParamDto,
  getUserClientHierarchyListDto,
} from '../../../utilities/models'
import {
  ExceptionAttendanceReportDto,
  ExceptionFilterFormDto,
  GetExceptionAttendanceDLParamsDto,
  InitBriefDto,
  PostExceptionAttendanceParamsDto,
  SbuTeamsDto,
} from '../../../utilities/models/ReportGeneration/ExceptionReport.model'
import { validateFormData } from '../../../utilities/helpers'
import moment from 'moment'
import { APP_TABLE_CONFIGS, DATE_FORMAT, DATE_TIME_FORMAT } from '../../../utilities/constants'
import { Alert } from '@mui/material'
import ExceptionAttendanceReportTable from '../../../components/ReportGeneration/exception-attendance/ExceptionAttendanceReportTable/ExceptionAttendanceReportTable'

const ExceptionAttendance = () => {
  const INITIAL_FILTER_STATE: ExceptionFilterFormDto = {
    sbu: {
      value: {} as InitBriefDto,
      validator: 'object',
      isRequired: false,
      error: null,
      disable: false,
    },
    project: {
      value: {} as InitBriefDto,
      validator: 'object',
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
  const requestReportAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.exceptionAttendanceAlert
  )
  const reqReportIsLoading = useSelector(
    (state: AppStateDto) => state.report.exceptionAttendanceFilters.isLoading
  )
  const reportsDataList = useSelector(
    (state: AppStateDto) => state.report.exceptionAttendanceReportList
  )
  const reportsIsLoading = useSelector(
    (state: AppStateDto) => state.report.exceptionAttendanceReportList.isLoading
  )
  const clientHierarchy = useSelector(
    (state: AppStateDto) => state.report.getUserClientHierarchy.data
  )
  const isClientHierarchyLoading = useSelector(
    (state: AppStateDto) => state.report.getUserClientHierarchy.isLoading
  )
  const reportFileKey = useSelector(
    (state: AppStateDto) => state.report.exceptionAttendanceReportDownload.data
  )
  const downloadReportAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.exceptionAttendanceDownload
  )

  const [reportFilterFormData, setReportFilterFormData] =
    useState<ExceptionFilterFormDto>(INITIAL_FILTER_STATE)
  const [sbuTeamList, setSbuTeamList] = useState<SbuTeamsDto[]>([])
  const [onSubmitError, setOnSubmitError] = useState<boolean>(false)
  const [page, setPage] = useState(0)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [rowsPerPage, setRowsPerPage] = useState(APP_TABLE_CONFIGS.DEFAULT_ROWS_PER_PAGE)
  const [exceptionAttendanceList, setExceptionAttendanceList] = useState<
    ExceptionAttendanceReportDto[]
  >([])
  const [fileNameDate, setFileNameDate] = useState<string>('')
  const [reportId, setReportId] = useState(-1)

  useEffect(() => {
    getSBUList()
    getClientHierarchy()
    getReportList()

    return () => {
      dispatch(reportActions.getExceptionAttendanceDownloadClear())
    }
  }, [])

  useEffect(() => {
    setTimeout(() => setOnSubmitError(false), 4000)
  }, [onSubmitError])

  useEffect(() => {
    setExceptionAttendanceList(reportsDataList.data)
  }, [reportsDataList])

  useEffect(() => {
    if (downloadReportAlert.message) {
      setDownloadInitState()
    }
  }, [downloadReportAlert])

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

  const filterTeamsByClientHierarchy = (id: number): SbuTeamsDto[] => {
    const projectList: SbuTeamsDto[] = []
    const clients = clientHierarchy.filter((item: any) => item.sbuId === id)
    if (clients?.length > 0) {
      for (const client of clients) {
        for (const teams of client.teams) {
          projectList.push({
            teamId: teams.teamId,
            teamName: teams.teamName,
          })
        }
      }
    }
    return projectList
  }

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
          project: {
            ...reportFilterFormData.project,
            value: INITIAL_FILTER_STATE.project.value,
            disable: false,
            error: null,
          },
        })
        if (value) {
          setSbuTeamList(filterTeamsByClientHierarchy(value.id))
        }
        break
      case 'project':
        setReportFilterFormData({
          ...reportFilterFormData,
          project: {
            ...reportFilterFormData.project,
            value: value === null ? INITIAL_FILTER_STATE.project.value : value,
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
  }

  const requestForReport = async () => {
    setOnSubmitError(false)
    const [validateData, isValid] = await validateFormData(reportFilterFormData)
    setReportFilterFormData(validateData)
    if (isValid) {
      const filterFormParamsDto: PostExceptionAttendanceParamsDto = {
        sbuId: reportFilterFormData.sbu.value.id,
        projectId: reportFilterFormData.project.value.id,
        startDate: moment(reportFilterFormData.startDate.value).format(DATE_FORMAT),
        endDate: moment(reportFilterFormData.endDate.value).format(DATE_FORMAT),
      }

      dispatch(reportActions.postExceptionAttendanceReport(filterFormParamsDto))
    } else {
      setOnSubmitError(true)
    }
  }

  const closeExceptionAttendanceAlert = () => {
    dispatch(alertActions.clearExceptionAttendanceAlert())
  }

  const getReportList = () => {
    dispatch(reportActions.getExceptionAttendanceReport())
  }

  const onRefreshGrid = () => {
    getReportList()
  }

  const downloadOrgUtilReport = (reportId: number, startDate: string) => {
    const params: GetExceptionAttendanceDLParamsDto = {
      id: reportId,
    }
    setDownloading(true)
    dispatch(reportActions.getExceptionAttendanceDownload(params))
    setFileNameDate(startDate)
    setReportId(reportId)
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
        `Exception Report - ${moment(fileNameDate).format(DATE_TIME_FORMAT)}.xlsx`
      )
    }
  }, [reportFileKey])

  const closeExceptionDownloadAlert = () => {
    dispatch(alertActions.clearExceptionAttendanceDownloadAlert())
  }

  const setDownloadInitState = () => {
    setDownloading(false)
    setFileNameDate('')
    setReportId(-1)
  }

  return (
    <React.Fragment>
      <AppLayout breadcrumb="Exception Report" componentTitle="Exception Report">
        <Grid container spacing={3} direction="row" className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3 className="font-weight-bold">Generate Exception Report</h3>
            <p>
              Project and Allocation End Date fields are disabled until after SBU and Allocation
              Start Date selection.
            </p>
            <p>The start and end date fields are mandatory, while other fields are optional.</p>
          </Grid>
          <Grid size={{ md: 7 }}>
            <ExceptionAttendanceReportForm
              onFilterHandleChange={onFilterHandleChange}
              reportFilterFormData={reportFilterFormData}
              sbuList={allSbuList?.data || []}
              sbuTeamList={sbuTeamList || []}
              clientHierarchyLoading={isClientHierarchyLoading}
              handleInputFocus={handleInputFocus}
              clearFilters={clearFilters}
              onSubmitError={onSubmitError}
              requestForReport={requestForReport}
              reqReportIsLoading={reqReportIsLoading}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Divider style={{ margin: '5px 0px 0px 0px', width: '100%' }} />
          </Grid>
        </Grid>
        {requestReportAlert.message && (
          <Alert onClose={closeExceptionAttendanceAlert} severity={requestReportAlert.severity}>
            {requestReportAlert.message}
          </Alert>
        )}
        {downloadReportAlert.message && (
          <Alert onClose={closeExceptionDownloadAlert} severity={downloadReportAlert.severity}>
            {downloadReportAlert.message}
          </Alert>
        )}
        <Grid container spacing={2} className="content-padding">
          <Grid size={{ md: 12 }}>
            <ExceptionAttendanceReportTable
              page={page}
              rowsPerPage={rowsPerPage}
              filterRows={exceptionAttendanceList || []}
              reportsIsLoading={reportsIsLoading}
              sbuList={allSbuList?.data || []}
              sbuTeamList={sbuTeamList || []}
              downloadReport={downloadOrgUtilReport}
              refreshGrid={onRefreshGrid}
              downloading={downloading}
              onHandleChangePage={handleChangePage}
              onHandleChangeRowsPerPage={handleChangeRowsPerPage}
              reportId={reportId}
            />
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}

export default ExceptionAttendance
