import { call, put, takeEvery, delay } from 'redux-saga/effects'
import {
  COMMON_ACTION_TYPES,
  ATTENDANCE_ACTION_TYPES,
  ALERT_CONFIGS,
} from '../../utilities/constants'
import { attendanceService } from '../../services'
import type {
  AlertActionDto,
  AddAttendanceInfoDto,
  GetAttendanceInfoParamsDto,
} from '../../utilities/models'

function* addAttendanceInfo(action: { type: string; payload: AddAttendanceInfoDto }) {
  try {
    // @ts-expect-error-ignore
    const addAttendanceInfo = yield call(attendanceService.addAttendanceInfo, action.payload)
    const setAlert: AlertActionDto = {
      message: addAttendanceInfo.data.message,
      severity: 'success',
      type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SUCCESS })
    yield put(setAlert)
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT,
    }

    yield put({ type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* getAttendanceInfo(action: { type: string; payload: GetAttendanceInfoParamsDto }) {
  try {
    //@ts-expect-error-ignore
    const attendanceInfo = yield call(attendanceService.getAttendanceInfo, action.payload)
    yield put({
      type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SUCCESS,
      data: attendanceInfo.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SET_ALERT,
    }

    yield put({ type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* attendanceSaga() {
  yield takeEvery(
    ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.REQUEST,
    addAttendanceInfo
  )
  yield takeEvery(
    ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.REQUEST,
    getAttendanceInfo
  )
}

export default attendanceSaga
