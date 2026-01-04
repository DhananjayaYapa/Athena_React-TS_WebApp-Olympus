import {
  ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES,
  COMMON_ACTION_TYPES,
  DETAILED_ATTENDANCE_REPORT_ACTION_TYPES,
  REPORT_ACTION_TYPES,
} from '../../utilities/constants'
import { ExceptionAttendanceResponseDto } from '../../utilities/models/ReportGeneration/ExceptionReport.model'
import { DownloadReportResponseDto } from '../../utilities/models/ReportGeneration/TimeEntryReport.model'

const INITIAL_STATE = {
  attendanceReport: {
    data: [],
    isLoading: false,
    error: null,
  },

  getUserClientHierarchy: {
    isLoading: false,
    data: [],
  },

  detailedAttendanceReport: {
    data: [],
    isLoading: false,
    error: null,
  },
  attendanceSummaryReport: {
    data: [],
    isLoading: false,
    error: null,
  },
  annualDetailedLeavesReport: {
    data: [],
    isLoading: false,
    error: null,
  },
  attendanceSummaryReportProjectWise: {
    data: [],
    isLoading: false,
    error: null,
  },
  allSbuList: {
    isLoading: false,
    data: [],
  },
  exceptionAttendanceFilters: {
    isLoading: false,
    error: null,
  },
  exceptionAttendanceReportList: {
    isLoading: false,
    data: [],
    error: null,
  },
  exceptionAttendanceReportDownload: {
    isLoading: false,
    data: {} as ExceptionAttendanceResponseDto,
    error: null,
  },
  timeEntryRequest: {
    isLoading: false,
    error: null,
  },
  timeEntryReportList: {
    isLoading: false,
    data: [],
    error: null,
  },
  timeEntryReportDownload: {
    isLoading: false,
    data: {} as DownloadReportResponseDto,
    error: null,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reportReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    //get attendance report details
    case REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        attendanceReport: {
          ...state.attendanceReport,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        attendanceReport: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        attendanceReport: {
          isLoading: false,
          data: [],
          error: action.error,
        },
      }
    case REPORT_ACTION_TYPES.RESET_ATTENDANCE_DETAIL + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        attendanceReport: INITIAL_STATE.attendanceReport,
      }

    case REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        getUserClientHierarchy: {
          ...state.getUserClientHierarchy,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        getUserClientHierarchy: {
          ...state.getUserClientHierarchy,
          isLoading: false,
          data: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        getUserClientHierarchy: {
          ...state.getUserClientHierarchy,
          isLoading: false,
          data: [],
        },
      }
    //get detailed attendance report details
    case DETAILED_ATTENDANCE_REPORT_ACTION_TYPES.GET_DETAILED_ATTENDANCE_DETAIL +
      COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        detailedAttendanceReport: {
          ...state.detailedAttendanceReport,
          isLoading: true,
        },
      }
    case DETAILED_ATTENDANCE_REPORT_ACTION_TYPES.GET_DETAILED_ATTENDANCE_DETAIL +
      COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        detailedAttendanceReport: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case DETAILED_ATTENDANCE_REPORT_ACTION_TYPES.GET_DETAILED_ATTENDANCE_DETAIL +
      COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        detailedAttendanceReport: {
          isLoading: false,
          data: [],
          error: {
            msg: action.error,
            error: true,
          },
        },
      }
    case DETAILED_ATTENDANCE_REPORT_ACTION_TYPES.RESET_DETAILED_ATTENDANCE_DETAIL +
      COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        detailedAttendanceReport: {
          isLoading: false,
          data: [],
          error: null,
        },
      }
    //get attendance summary report details
    case ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_DETAIL +
      COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        attendanceSummaryReport: {
          ...state.attendanceSummaryReport,
          isLoading: true,
        },
      }
    case ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_DETAIL +
      COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        attendanceSummaryReport: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_DETAIL +
      COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        attendanceSummaryReport: {
          isLoading: false,
          data: [],
          error: {
            msg: action.error,
            error: true,
          },
        },
      }
    case ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.RESET_ATTENDANCE_SUMMARY_DETAIL +
      COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        attendanceSummaryReport: {
          isLoading: false,
          data: [],
          error: null,
        },
      }
    // get annual detailed leaves report
    case REPORT_ACTION_TYPES.GET_ANNUAL_DETAILED_LEAVES_INFO + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        annualDetailedLeavesReport: {
          ...state.annualDetailedLeavesReport,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.GET_ANNUAL_DETAILED_LEAVES_INFO + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        annualDetailedLeavesReport: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case REPORT_ACTION_TYPES.GET_ANNUAL_DETAILED_LEAVES_INFO + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        annualDetailedLeavesReport: {
          isLoading: false,
          data: [],
          error: {
            msg: action.error,
            error: true,
          },
        },
      }
    case ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_PROJECT_WISE_DETAIL +
      COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        attendanceSummaryReportProjectWise: {
          ...state.attendanceSummaryReportProjectWise,
          isLoading: true,
        },
      }
    case ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_PROJECT_WISE_DETAIL +
      COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        attendanceSummaryReportProjectWise: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_PROJECT_WISE_DETAIL +
      COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        attendanceSummaryReportProjectWise: {
          isLoading: false,
          data: [],
          error: {
            msg: action.error,
            error: true,
          },
        },
      }
    case REPORT_ACTION_TYPES.GET_SBU_LIST + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        allSbuList: {
          ...state.allSbuList,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.GET_SBU_LIST + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        allSbuList: {
          ...state.allSbuList,
          isLoading: false,
          data: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_SBU_LIST + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        allSbuList: {
          ...state.allSbuList,
          isLoading: false,
          data: [],
        },
      }
    case REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        exceptionAttendanceFilters: {
          ...state.exceptionAttendanceFilters,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        exceptionAttendanceFilters: {
          ...state.exceptionAttendanceFilters,
          isLoading: false,
        },
      }
    case REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        exceptionAttendanceFilters: {
          ...state.exceptionAttendanceFilters,
          isLoading: false,
          error: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        exceptionAttendanceReportList: {
          ...state.exceptionAttendanceReportList,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        exceptionAttendanceReportList: {
          ...state.exceptionAttendanceReportList,
          isLoading: false,
          data: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        exceptionAttendanceReportList: {
          ...state.exceptionAttendanceReportList,
          isLoading: false,
          error: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        exceptionAttendanceReportDownload: {
          ...state.exceptionAttendanceReportDownload,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        exceptionAttendanceReportDownload: {
          ...state.exceptionAttendanceReportDownload,
          isLoading: false,
          data: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        exceptionAttendanceReportDownload: {
          ...state.exceptionAttendanceReportDownload,
          isLoading: false,
          error: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        exceptionAttendanceReportDownload: INITIAL_STATE.exceptionAttendanceReportDownload,
      }

    case REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        timeEntryRequest: {
          ...state.timeEntryRequest,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        timeEntryRequest: {
          ...state.timeEntryRequest,
          isLoading: false,
          data: action.data,
        },
      }
    case REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        timeEntryRequest: {
          ...state.timeEntryRequest,
          isLoading: false,
          error: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_TIME_ENTRY_REPORT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        timeEntryReportList: {
          ...state.timeEntryReportList,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.GET_TIME_ENTRY_REPORT + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        timeEntryReportList: {
          ...state.timeEntryReportList,
          isLoading: false,
          data: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_TIME_ENTRY_REPORT + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        timeEntryReportList: {
          ...state.timeEntryReportList,
          isLoading: false,
          error: action.data,
        },
      }

    case REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        timeEntryReportDownload: {
          ...state.timeEntryReportDownload,
          isLoading: true,
        },
      }
    case REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        timeEntryReportDownload: {
          ...state.timeEntryReportDownload,
          isLoading: false,
          data: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        timeEntryReportDownload: {
          ...state.timeEntryReportDownload,
          isLoading: false,
          error: action.data,
        },
      }
    case REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        timeEntryReportDownload: INITIAL_STATE.timeEntryReportDownload,
      }
    default:
      return state
  }
}

export default reportReducer
