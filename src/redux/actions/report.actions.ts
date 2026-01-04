import {
  ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES,
  COMMON_ACTION_TYPES,
  DETAILED_ATTENDANCE_REPORT_ACTION_TYPES,
  REPORT_ACTION_TYPES,
} from '../../utilities/constants'
import type {
  AnnualDetailedLeaveReportFilterParams,
  AttendanceInfoParams,
  AttendanceSummaryReportDisplayFilterParams,
  DetailedAttendanceReportFilterParams,
  GetDisabledSbuParamDto,
  getUserClientHierarchyListDto,
} from '../../utilities/models'
import type {
  PostExceptionAttendanceParamsDto,
  GetExceptionAttendanceDLParamsDto,
} from '../../utilities/models/ReportGeneration/ExceptionReport.model'
import {
  DownloadReportParamsDto,
  PostTimeEntryParamsDto,
} from '../../utilities/models/ReportGeneration/TimeEntryReport.model'

//get attendance report details

const getAttendanceReport = (params: AttendanceInfoParams) => {
  return {
    type: REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}

const resetAttendanceDetail = () => {
  return {
    type: REPORT_ACTION_TYPES.RESET_ATTENDANCE_DETAIL + COMMON_ACTION_TYPES.REQUEST,
  }
}

//Detailed Attendance Report
const getDetailedAttendanceReport = (params: DetailedAttendanceReportFilterParams) => {
  return {
    type:
      DETAILED_ATTENDANCE_REPORT_ACTION_TYPES.GET_DETAILED_ATTENDANCE_DETAIL +
      COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}

const resetDetailedAttendanceDetail = () => {
  return {
    type:
      DETAILED_ATTENDANCE_REPORT_ACTION_TYPES.RESET_DETAILED_ATTENDANCE_DETAIL +
      COMMON_ACTION_TYPES.REQUEST,
  }
}

//Attendance Summary Report
const getAttendanceSummaryReport = (params: AttendanceSummaryReportDisplayFilterParams) => {
  return {
    type:
      ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_DETAIL +
      COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}

const resetAttendanceSummaryDetail = () => {
  return {
    type:
      ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.RESET_ATTENDANCE_SUMMARY_DETAIL +
      COMMON_ACTION_TYPES.REQUEST,
  }
}

const getUserClientHierarchy = (params: getUserClientHierarchyListDto) => {
  return {
    type: REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}

const getAnnualDetailedLeavesInfo = (params: AnnualDetailedLeaveReportFilterParams) => {
  return {
    type: REPORT_ACTION_TYPES.GET_ANNUAL_DETAILED_LEAVES_INFO + COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}

const getAttendanceSummaryReportProjectWise = (
  params: AttendanceSummaryReportDisplayFilterParams
) => {
  return {
    type:
      ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_PROJECT_WISE_DETAIL +
      COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}

const allSbuList = (params: GetDisabledSbuParamDto) => {
  return {
    type: REPORT_ACTION_TYPES.GET_SBU_LIST + COMMON_ACTION_TYPES.REQUEST,
    params: params,
  }
}

// exception attendance report
const postExceptionAttendanceReport = (params: PostExceptionAttendanceParamsDto) => {
  return {
    type: REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.REQUEST,
    params: params,
  }
}

const getExceptionAttendanceReport = () => {
  return {
    type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.REQUEST,
  }
}

const getExceptionAttendanceDownload = (params: GetExceptionAttendanceDLParamsDto) => {
  return {
    type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.REQUEST,
    params: params,
  }
}

const getExceptionAttendanceDownloadClear = () => {
  return {
    type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR,
  }
}

const postTimeEntryReport = (params: PostTimeEntryParamsDto) => {
  return {
    type: REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.REQUEST,
    params: params,
  }
}

const getTimeEntryReport = () => {
  return {
    type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_REPORT + COMMON_ACTION_TYPES.REQUEST,
  }
}

const getTimeEntryDownload = (params: DownloadReportParamsDto) => {
  return {
    type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.REQUEST,
    params: params,
  }
}

const getTimeEntryDownloadClear = () => {
  return {
    type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR,
  }
}

export const reportActions = {
  getAttendanceReport,
  resetAttendanceDetail,
  getUserClientHierarchy,
  getDetailedAttendanceReport,
  resetDetailedAttendanceDetail,
  getAttendanceSummaryReport,
  resetAttendanceSummaryDetail,
  getAnnualDetailedLeavesInfo,
  getAttendanceSummaryReportProjectWise,
  allSbuList,
  postExceptionAttendanceReport,
  getExceptionAttendanceReport,
  getExceptionAttendanceDownload,
  getExceptionAttendanceDownloadClear,
  getTimeEntryReport,
  postTimeEntryReport,
  getTimeEntryDownload,
  getTimeEntryDownloadClear,
}
