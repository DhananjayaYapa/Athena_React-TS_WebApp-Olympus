import { axiosPrivateInstance } from './index'
import type {
  AnnualDetailedLeaveReportFilterParams,
  AttendanceInfoParams,
  AttendanceSummaryReportDisplayFilterParams,
  DetailedAttendanceReportFilterParams,
  GetDisabledSbuParamDto,
  getUserClientHierarchyListDto,
} from '../utilities/models'
import type {
  GetExceptionAttendanceDLParamsDto,
  PostExceptionAttendanceParamsDto,
} from '../utilities/models/ReportGeneration/ExceptionReport.model'
import {
  DownloadReportParamsDto,
  PostTimeEntryParamsDto,
} from '../utilities/models/ReportGeneration/TimeEntryReport.model'

//get attendance report details
const getAttendanceReport = (params: AttendanceInfoParams) => {
  return axiosPrivateInstance.get(`/athena/api/v1/reports/attendances`, { params: params })
}

//get detailed attendance report details
const getDetailedAttendanceReport = (params: DetailedAttendanceReportFilterParams) => {
  return axiosPrivateInstance.get(`/athena/api/v1/reports/detailedAttendance`, { params: params })
}

//get attendance summary report details
const getAttendanceSummaryReport = (params: AttendanceSummaryReportDisplayFilterParams) => {
  return axiosPrivateInstance.get(`/athena/api/v1/reports/attendanceSummery/`, { params: params })
}

const getUserClientHierarchy = (params: getUserClientHierarchyListDto) => {
  return axiosPrivateInstance.get(`/core/api/v1/clients/userHierarchy`, { params: params })
}

const getAnnualDetailedLeavesReport = (params: AnnualDetailedLeaveReportFilterParams) => {
  return axiosPrivateInstance.get(`/athena/api/v1/reports/detailedLeaves`, { params: params })
}

const getAttendanceSummaryReportProjectWise = (
  params: AttendanceSummaryReportDisplayFilterParams
) => {
  return axiosPrivateInstance.get(`/athena/api/v1/reports/attendenceSummeryByProject/`, {
    params: params,
  })
}

const getAllSbuList = (params: GetDisabledSbuParamDto) => {
  return axiosPrivateInstance.get('/core/api/v1/sbu', { params: params })
}

const postExceptionAttendanceFilters = (params: PostExceptionAttendanceParamsDto) => {
  return axiosPrivateInstance.post('/athena/api/v1/reports/exceptions', params)
}

const getExceptionAttendanceReport = () => {
  return axiosPrivateInstance.get('/athena/api/v1/reports/exceptions')
}

const getExceptionAttendanceDownload = (params: GetExceptionAttendanceDLParamsDto) => {
  return axiosPrivateInstance.get(`/athena/api/v1/reports/exceptions/${params.id}/download`)
}
const postTimeEntryRequest = (params: PostTimeEntryParamsDto) => {
  return axiosPrivateInstance.post('/athena/api/v1/reports/entries', params)
}

const getTimeEntryReport = () => {
  return axiosPrivateInstance.get('/athena/api/v1/reports/entries')
}

const timeEntryDownload = (params: DownloadReportParamsDto) => {
  return axiosPrivateInstance.get(`/athena/api/v1/reports/entries/${params.id}/download`)
}

export const reportService = {
  getAttendanceReport,
  getDetailedAttendanceReport,
  getAttendanceSummaryReport,
  getUserClientHierarchy,
  getAnnualDetailedLeavesReport,
  getAttendanceSummaryReportProjectWise,
  getAllSbuList,
  postExceptionAttendanceFilters,
  getExceptionAttendanceReport,
  getExceptionAttendanceDownload,
  postTimeEntryRequest,
  getTimeEntryReport,
  timeEntryDownload,
}
