import { call, put, takeEvery } from 'redux-saga/effects'
import { ABSENTEEISM_REPORT_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { absenteeismService } from '../../services'
import type { AbsentInfoParams } from '../../utilities/models/'

function* getAbsenteeismDetail(action: { type: string; payload: AbsentInfoParams }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(absenteeismService.getAbsenteeismDetails, action.payload)
    yield put({
      type: ABSENTEEISM_REPORT_ACTION_TYPES.GET_ABSENTEEISM_DETAIL + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data,
    })
  } catch (error) {
    yield put({
      type: ABSENTEEISM_REPORT_ACTION_TYPES.GET_ABSENTEEISM_DETAIL + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

function* absenteeismSaga() {
  yield takeEvery(
    ABSENTEEISM_REPORT_ACTION_TYPES.GET_ABSENTEEISM_DETAIL + COMMON_ACTION_TYPES.REQUEST,
    getAbsenteeismDetail
  )
}

export default absenteeismSaga
