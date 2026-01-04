import type {
  GetLeaveListParamsDto,
  UpdateLeaveDto,
  AddLeaveCountDto,
  UpdateLeaveCountDto,
  AddLeaveDto,
  UserLeaveStatusUpdateDto,
  AlertActionDto,
} from './../../utilities/models'
import { call, put, takeEvery, takeLeading, delay } from 'redux-saga/effects'

import { ALERT_CONFIGS, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { LEAVE_ACTION_TYPES } from '../../utilities/constants'
import { leaveService } from '../../services'

//  V2----------------------------------
function* getLeaveList(action: { type: string; payload: GetLeaveListParamsDto }) {
  try {
    // @ts-expect-error-ignore
    const leaves = yield call(leaveService.getLeaveList, action.payload)
    yield put({
      type: LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.SUCCESS,
      data: leaves.data.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.SET_ALERT,
    }

    yield put({ type: LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* updateLeave(action: { type: string; payload: UpdateLeaveDto }) {
  try {
    // @ts-expect-error-ignore
    const updateLeave = yield call(leaveService.updateLeave, action.payload)
    const setAlert: AlertActionDto = {
      message: updateLeave.data.message,
      severity: 'success',
      type: LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.SUCCESS })
    yield put(setAlert)
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.SET_ALERT,
    }

    yield put({ type: LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* getLeaveCount(action: { type: string; payload: string }) {
  try {
    // @ts-expect-error-ignore
    const leaveCount = yield call(leaveService.getLeaveCount, action.payload)
    yield put({
      type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.SUCCESS,
      data: leaveCount.data.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* addLeaveCount(action: { type: string; payload: AddLeaveCountDto }) {
  try {
    // @ts-expect-error-ignore
    const leaveCount = yield call(leaveService.insertLeaveCount, action.payload)
    const setAlert: AlertActionDto = {
      message: leaveCount.data.message,
      severity: 'success',
      type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.SUCCESS,
      data: leaveCount.data,
    })
    yield put(setAlert)
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* updateLeaveCount(action: { type: string; payload: UpdateLeaveCountDto }) {
  try {
    // @ts-expect-error-ignore
    const leaveCount = yield call(leaveService.updateLeaveCount, action.payload)
    const setAlert: AlertActionDto = {
      message: leaveCount.data.message,
      severity: 'success',
      type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.SUCCESS,
      data: leaveCount.data,
    })
    yield put(setAlert)
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* getLeaveCountSummary(action: { type: string; payload: string }) {
  try {
    // @ts-expect-error-ignore
    const leaveCount = yield call(leaveService.getLeaveCountSummary, action.payload)
    const setAlert: AlertActionDto = {
      message: leaveCount.data.message,
      severity: 'success',
      type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.SUCCESS,
      data: leaveCount.data.data,
    })
    yield put(setAlert)
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* addLeave(action: { type: string; payload: AddLeaveDto[] }) {
  try {
    // @ts-expect-error-ignore
    const leaveInput = yield call(leaveService.addLeave, action.payload)
    //console.log("addLeave fetch res", leaveInput.data.message);
    const setAlert: AlertActionDto = {
      message: leaveInput.data.message,
      severity: 'success',
      type: LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.SUCCESS,
      data: leaveInput.data.message,
    })
    yield put({
      type: LEAVE_ACTION_TYPES.GET_LEAVES_OF_USER + COMMON_ACTION_TYPES.REQUEST,
      payload: action.payload[0].username,
    })
    yield put(setAlert)
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* getUserLeaveInfo(action: { type: string; payload: string }) {
  try {
    // @ts-expect-error-ignore
    const userLeaves = yield call(leaveService.getUserLeaveInfo, action.payload)
    const setAlert: AlertActionDto = {
      message: userLeaves.data.message,
      severity: 'success',
      type: LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.SET_ALERT,
    }
    //console.log("Saga fetch res", nwDayDetail);
    yield put({
      type: LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.SUCCESS,
      data: userLeaves.data,
    })
    yield put(setAlert)
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* updateUserLeaveStatus(action: { type: string; payload: UserLeaveStatusUpdateDto }) {
  try {
    // @ts-expect-error-ignore
    const userLeaves = yield call(leaveService.updateUserLeaveStatus, action.payload)
    const setAlert: AlertActionDto = {
      message: userLeaves.data.message,
      severity: 'success',
      type: LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.SET_ALERT,
    }
    //console.log("Saga fetch res", nwDayDetail);
    yield put({
      type: LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.SUCCESS,
      data: userLeaves.data,
    })
    yield put(setAlert)
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getPointPersonList(action: any) {
  try {
    // @ts-expect-error-ignore
    const pointPersonsList = yield call(leaveService.getPointPersons, action.params)
    yield put({
      type: LEAVE_ACTION_TYPES.GET_POINT_PERSON_LIST + COMMON_ACTION_TYPES.SUCCESS,
      data: pointPersonsList.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: LEAVE_ACTION_TYPES.GET_POINT_PERSON_LIST + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: LEAVE_ACTION_TYPES.GET_POINT_PERSON_LIST + COMMON_ACTION_TYPES.ERROR,
      error: setAlert,
    })
  }
}

function* leaveSaga() {
  //  V2----------------------------------
  yield takeEvery(LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.REQUEST, getLeaveList)
  yield takeEvery(LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.REQUEST, updateLeave)
  yield takeEvery(LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.REQUEST, getLeaveCount)

  yield takeEvery(LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.REQUEST, addLeaveCount)

  yield takeEvery(
    LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.REQUEST,
    updateLeaveCount
  )

  yield takeEvery(
    LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.REQUEST,
    getLeaveCountSummary
  )

  yield takeEvery(LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.REQUEST, addLeave)

  yield takeLeading(
    LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.REQUEST,
    getUserLeaveInfo
  )

  yield takeLeading(
    LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.REQUEST,
    updateUserLeaveStatus
  )
  yield takeEvery(
    LEAVE_ACTION_TYPES.GET_POINT_PERSON_LIST + COMMON_ACTION_TYPES.REQUEST,
    getPointPersonList
  )
}

export default leaveSaga
