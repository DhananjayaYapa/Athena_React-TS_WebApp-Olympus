import {
  NONWORKINGDAY_ACTION_TYPES,
  USER_ACTION_TYPES,
  LEAVE_ACTION_TYPES,
  REPORT_ACTION_TYPES,
  ALLOCATION_ACTION_TYPES,
  ATTENDANCE_ACTION_TYPES,
  COMMON_ACTION_TYPES,
  TEAMS_ACTION_TYPES,
} from './../../utilities/constants/action.constants'
import type { AlertActionDto } from './../../utilities/models'

const INITIAL_STATE = {
  teamListAlert: {
    message: null,
    severity: null,
  },
  addAttendanceInfo: {
    message: null,
    severity: null,
  },
  getAttendanceInfo: {
    message: null,
    severity: null,
  },
  getNonWorkingDays: {
    message: null,
    severity: null,
  },
  getUserTeamList: {
    message: null,
    severity: null,
  },
  getLeaveList: {
    message: null,
    severity: null,
  },
  updateLeave: {
    message: null,
    severity: null,
  },
  userList: {
    message: null,
    severity: null,
  },
  getLeaveCount: {
    message: null,
    severity: null,
  },
  addLeaveCount: {
    message: null,
    severity: null,
  },
  updateLeaveCount: {
    message: null,
    severity: null,
  },
  addLeave: {
    message: null,
    severity: null,
  },
  updateUserLeaveStatus: {
    message: null,
    severity: null,
  },
  getUserClientHierarchy: {
    message: null,
    severity: null,
  },
  updateDefaultTeam: {
    message: null,
    severity: null,
  },
  getAllocations: {
    message: null,
    severity: null,
  },
  exceptionAttendanceAlert: {
    message: null,
    severity: null,
  },
  exceptionAttendanceDownload: {
    message: null,
    severity: null,
  },
  getAttendanceReport: {
    message: null,
    severity: null,
  },
  timeEntryAlert: {
    message: null,
    severity: null,
  },
  timeEntryDownloadAlert: {
    message: null,
    severity: null,
  },
}

const alertReducer = (state = INITIAL_STATE, action: AlertActionDto) => {
  switch (action.type) {
    // team list alert
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        teamListAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        teamListAlert: {
          message: null,
          severity: null,
        },
      }
    // add attendance inso alert
    case ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        addAttendanceInfo: {
          message: action.message,
          severity: action.severity,
        },
      }
    case ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        addAttendanceInfo: {
          message: null,
          severity: null,
        },
      }
    // get attendance inso alert
    case ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        getAttendanceInfo: {
          message: action.message,
          severity: action.severity,
        },
      }
    case ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        getAttendanceInfo: {
          message: null,
          severity: null,
        },
      }
    // get non working days
    case NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        getNonWorkingDays: {
          message: action.message,
          severity: action.severity,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        getNonWorkingDays: {
          message: null,
          severity: null,
        },
      }
    // get user team list
    case USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        getUserTeamList: {
          message: action.message,
          severity: action.severity,
        },
      }
    case USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        getUserTeamList: {
          message: null,
          severity: null,
        },
      }
    // get Leave list
    case LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        getLeaveList: {
          message: action.message,
          severity: action.severity,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        getLeaveList: {
          message: null,
          severity: null,
        },
      }
    // Update Leave
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updateLeave: {
          message: action.message,
          severity: action.severity,
        },
      }
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updateLeave: {
          message: null,
          severity: null,
        },
      }
    // Get user lsit
    case USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        userList: {
          message: action.message,
          severity: action.severity,
        },
      }
    case USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        userList: {
          message: null,
          severity: null,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        getLeaveCount: {
          message: action.message,
          severity: action.severity,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        getLeaveCount: {
          message: null,
          severity: null,
        },
      }
    case LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        addLeaveCount: {
          message: action.message,
          severity: action.severity,
        },
      }
    case LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        addLeaveCount: {
          message: null,
          severity: null,
        },
      }
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updateLeaveCount: {
          message: action.message,
          severity: action.severity,
        },
      }
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updateLeaveCount: {
          message: null,
          severity: null,
        },
      }
    case LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        addLeave: {
          message: action.message,
          severity: action.severity,
        },
      }
    case LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        addLeave: {
          message: null,
          severity: null,
        },
      }

    case LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updateUserLeaveStatus: {
          message: action.message,
          severity: action.severity,
        },
      }
    case LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updateUserLeaveStatus: {
          message: null,
          severity: null,
        },
      }
    case REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        getUserClientHierarchy: {
          message: action.message,
          severity: action.severity,
        },
      }
    case REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        getUserClientHierarchy: {
          message: null,
          severity: null,
        },
      }
    case TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updateDefaultTeam: {
          message: action.message,
          severity: action.severity,
        },
      }
    case TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updateDefaultTeam: {
          message: null,
          severity: null,
        },
      }
    // get allocations alert
    case ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        getAllocations: {
          message: action.message,
          severity: action.severity,
        },
      }
    case ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        getAllocations: {
          message: null,
          severity: null,
        },
      }
    case REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        exceptionAttendanceAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        exceptionAttendanceAlert: {
          message: null,
          severity: null,
        },
      }
    case REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        exceptionAttendanceDownload: {
          message: action.message,
          severity: action.severity,
        },
      }
    case REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        exceptionAttendanceDownload: {
          message: null,
          severity: null,
        },
      }

    case REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        getAttendanceReport: {
          message: action.message,
          severity: action.severity,
        },
      }
    case REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        getAttendanceReport: {
          message: null,
          severity: null,
        },
      }
    case REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        timeEntryAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        timeEntryAlert: {
          message: null,
          severity: null,
        },
      }
    case REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        timeEntryDownloadAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        timeEntryDownloadAlert: {
          message: null,
          severity: null,
        },
      }
    default:
      return state
  }
}

export default alertReducer
