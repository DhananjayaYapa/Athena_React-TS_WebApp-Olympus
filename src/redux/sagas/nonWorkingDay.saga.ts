import { call, put, takeEvery, delay } from 'redux-saga/effects'
import { ALERT_CONFIGS, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { NONWORKINGDAY_ACTION_TYPES, NWDAY_CAL_ACTION_TYPES } from '../../utilities/constants'
import { nonWorkingDayService } from '../../services'
import type { AlertActionDto, GetNonworkingDaysRangeDto } from '../../utilities/models'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* addNonWorkingDay(action: any) {
  try {
    // @ts-expect-error-ignore
    const nonWorkingDayInput = yield call(nonWorkingDayService.addNonWorkingDay, action.payload)
    //console.log("addNonWorkingDay fetch res", nonWorkingDayInput.data.message);
    yield put({
      type: NONWORKINGDAY_ACTION_TYPES.ADD_NON_WORKING_DAY + COMMON_ACTION_TYPES.SUCCESS,
      data: nonWorkingDayInput.data.message,
    })

    yield put({
      type: NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.REQUEST,
    })
  } catch (error) {
    yield put({
      type: NONWORKINGDAY_ACTION_TYPES.ADD_NON_WORKING_DAY + COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* updateNonWorkingDay(action: any) {
  try {
    // @ts-expect-error-ignore
    const nonWorkingDayInput = yield call(nonWorkingDayService.updateNonWorkingDay, action.payload)
    yield put({
      type: NONWORKINGDAY_ACTION_TYPES.UPDATE_NON_WORKING_DAYS + COMMON_ACTION_TYPES.SUCCESS,
      data: nonWorkingDayInput.data.message,
    })

    yield put({
      type: NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.REQUEST,
    })
  } catch (error) {
    yield put({
      type: NONWORKINGDAY_ACTION_TYPES.UPDATE_NON_WORKING_DAYS + COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getNonWorkingDays(action: any) {
  try {
    // @ts-expect-error-ignore
    const nwDayDetail = yield call(nonWorkingDayService.getNonWorkingDays, action.payload)
    //console.log("Saga fetch res", nwDayDetail);
    yield put({
      type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.SUCCESS,
      data: nwDayDetail.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* getNonWorkingDaysRange(action: { type: string; payload: GetNonworkingDaysRangeDto }) {
  try {
    // @ts-expect-error-ignore
    const nonWorkingDays = yield call(nonWorkingDayService.getNonWorkingDaysRange, action.payload)
    //console.log("Saga fetch res", nwDayDetail);
    yield put({
      type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS_RANGE + COMMON_ACTION_TYPES.SUCCESS,
      data: nonWorkingDays.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS_RANGE + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS_RANGE + COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS_RANGE + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* nonWorkingDaySaga() {
  yield takeEvery(
    NONWORKINGDAY_ACTION_TYPES.ADD_NON_WORKING_DAY + COMMON_ACTION_TYPES.REQUEST,
    addNonWorkingDay
  )
  yield takeEvery(
    NONWORKINGDAY_ACTION_TYPES.UPDATE_NON_WORKING_DAYS + COMMON_ACTION_TYPES.REQUEST,
    updateNonWorkingDay
  )
  yield takeEvery(
    NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.REQUEST,
    getNonWorkingDays
  )
  yield takeEvery(
    NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS_RANGE + COMMON_ACTION_TYPES.REQUEST,
    getNonWorkingDaysRange
  )
}

export default nonWorkingDaySaga
