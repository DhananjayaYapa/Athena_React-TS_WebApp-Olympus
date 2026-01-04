import { put, takeEvery, delay } from 'redux-saga/effects'
import {
  ATTENDANCE_ACTION_TYPES,
  COMMON_ACTION_TYPES,
  LEAVE_ACTION_TYPES,
  TEAMS_ACTION_TYPES,
} from '../../utilities/constants'
import type { AlertActionDto } from '../../utilities/models'

function* setTeamListAlert(action: AlertActionDto) {
  try {
    const setAlert: AlertActionDto = {
      type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.SET_ALERT,
      message: action.message,
      severity: action.severity,
    }
    yield put(setAlert)
  } finally {
    if (action.autoClear) {
      yield delay(action.timeout ? action.timeout : 0)
      yield put({ type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.CLEAR_ALERT })
    }
  }
}

function* setAddAttendanceInfoAlert(action: AlertActionDto) {
  try {
    const setAlert: AlertActionDto = {
      type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT,
      message: action.message,
      severity: action.severity,
    }
    yield put(setAlert)
  } finally {
    if (action.autoClear) {
      yield delay(action.timeout ? action.timeout : 0)
      yield put({
        type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT,
      })
    }
  }
}

function* setGetAttendanceInfoAlert(action: AlertActionDto) {
  try {
    const setAlert: AlertActionDto = {
      type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT,
      message: action.message,
      severity: action.severity,
    }
    yield put(setAlert)
  } finally {
    if (action.autoClear) {
      yield delay(action.timeout ? action.timeout : 0)
      yield put({
        type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT,
      })
    }
  }
}

function* setAddLeaveCountInfoAlert(action: AlertActionDto) {
  try {
    const setAlert: AlertActionDto = {
      type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT,
      message: action.message,
      severity: action.severity,
    }
    yield put(setAlert)
  } finally {
    if (action.autoClear) {
      yield delay(action.timeout ? action.timeout : 0)
      yield put({ type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT })
    }
  }
}

function* setUpdateLeaveCountInfoAlert(action: AlertActionDto) {
  try {
    const setAlert: AlertActionDto = {
      type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT,
      message: action.message,
      severity: action.severity,
    }
    yield put(setAlert)
  } finally {
    if (action.autoClear) {
      yield delay(action.timeout ? action.timeout : 0)
      yield put({ type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT })
    }
  }
}

function* alertSaga() {
  yield takeEvery(
    TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    setTeamListAlert
  )
  yield takeEvery(
    ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    setAddAttendanceInfoAlert
  )
  yield takeEvery(
    ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    setGetAttendanceInfoAlert
  )
  yield takeEvery(
    LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    setAddLeaveCountInfoAlert
  )
  yield takeEvery(
    LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    setUpdateLeaveCountInfoAlert
  )
}

export default alertSaga
