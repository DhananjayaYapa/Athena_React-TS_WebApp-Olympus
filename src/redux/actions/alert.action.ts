import {
  ATTENDANCE_ACTION_TYPES,
  NONWORKINGDAY_ACTION_TYPES,
  USER_ACTION_TYPES,
  LEAVE_ACTION_TYPES,
  ALLOCATION_ACTION_TYPES,
  REPORT_ACTION_TYPES,
  ALERT_CONFIGS,
  TEAMS_ACTION_TYPES,
  COMMON_ACTION_TYPES,
} from './../../utilities/constants'
import type { AlertDto, AlertActionDto } from './../../utilities/models/alert.models'

// SET
const setTeamListAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}
const setAddAttendanceInfoAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}

const setGetAttendanceInfoAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}

const setGetNonWorkingDaysAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}

const setGetUserTeamsAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}

const setGetLeaveListAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}

const setUpdateLeaveAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}

const setGetUserListAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}

const setGetLeaveCountAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}

const setAddLeaveCountAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}

const setUpdateLeaveCountAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}
const setGetAllocationsAlertRequest = (
  alert: AlertDto,
  autoClear: boolean = ALERT_CONFIGS.AUTO_CLEAR,
  timeout: number = ALERT_CONFIGS.TIMEOUT
) => {
  const alertAction: AlertActionDto = {
    type: ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message: alert.message,
    severity: alert.severity,
    autoClear: autoClear,
    timeout: timeout,
  }
  return alertAction
}
// CLEAR
const clearTeamListAlert = () => {
  return { type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearAddAttendanceInfoAlert = () => {
  return { type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearGetAttendanceInfoAlert = () => {
  return { type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearGetNonWorkingDaysAlert = () => {
  return { type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT }
}

const clearGetUserTeamsAlert = () => {
  return { type: USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearGetLeaveListAlert = () => {
  return { type: LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearUpdateLeaveAlert = () => {
  return { type: LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearGetUserListAlert = () => {
  return { type: USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.CLEAR_ALERT }
}

const clearGetLeaveCountAlert = () => {
  return { type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearAddLeaveCountAlert = () => {
  return { type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearUpdateLeaveCountAlert = () => {
  return { type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearAddLeaveAlert = () => {
  return { type: LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearUpdateUserLeaveStatusAlert = () => {
  return { type: LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearUpdateDefaultTeamAlert = () => {
  return { type: TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.CLEAR_ALERT }
}
const clearGetAllocationsAlert = () => {
  return { type: ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.CLEAR_ALERT }
}

const clearExceptionAttendanceAlert = () => {
  return { type: REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.CLEAR_ALERT }
}

const clearExceptionAttendanceDownloadAlert = () => {
  return {
    type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR_ALERT,
  }
}
const clearAttendanceReportAlert = () => {
  return {
    type: REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.CLEAR_ALERT,
  }
}
const clearTimeEntryAlert = () => {
  return {
    type: REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.CLEAR_ALERT,
  }
}

const clearTimeEntryDownloadAlert = () => {
  return {
    type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR_ALERT,
  }
}
export const alertActions = {
  setTeamListAlertRequest,
  setAddAttendanceInfoAlertRequest,
  setGetAttendanceInfoAlertRequest,
  clearTeamListAlert,
  clearAddAttendanceInfoAlert,
  clearGetAttendanceInfoAlert,
  setGetNonWorkingDaysAlertRequest,
  clearGetNonWorkingDaysAlert,
  setGetUserTeamsAlertRequest,
  clearGetUserTeamsAlert,
  setGetLeaveListAlertRequest,
  clearGetLeaveListAlert,
  setUpdateLeaveAlertRequest,
  clearUpdateLeaveAlert,
  setGetUserListAlertRequest,
  clearGetUserListAlert,
  setGetLeaveCountAlertRequest,
  clearGetLeaveCountAlert,
  setAddLeaveCountAlertRequest,
  clearAddLeaveCountAlert,
  setUpdateLeaveCountAlertRequest,
  clearUpdateLeaveCountAlert,
  clearAddLeaveAlert,
  clearUpdateUserLeaveStatusAlert,
  clearUpdateDefaultTeamAlert,
  setGetAllocationsAlertRequest,
  clearGetAllocationsAlert,
  clearExceptionAttendanceAlert,
  clearExceptionAttendanceDownloadAlert,
  clearAttendanceReportAlert,
  clearTimeEntryAlert,
  clearTimeEntryDownloadAlert,
}
