import type { AxiosResponse } from 'axios'
import { ALERT_CONFIGS } from './../../utilities/constants/app.constants'
import { call, put, takeEvery, delay } from 'redux-saga/effects'
import { COMMON_ACTION_TYPES, ALLOCATION_ACTION_TYPES } from '../../utilities/constants'
import { allocationService } from '../../services'
import type {
  AlertActionDto,
  GetAllocationsParamsDto,
  AllocationDto,
  ApiResponseDto,
} from '../../utilities/models'

function* getAllocations(action: { type: string; payload: GetAllocationsParamsDto }) {
  try {
    const allocations: AxiosResponse<ApiResponseDto<AllocationDto[]>> = yield call(
      allocationService.getAllocations,
      action.payload
    )
    yield put({
      type: ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.SUCCESS,
      data: allocations.data.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.SET_ALERT,
    }

    yield put({ type: ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* allocationSaga() {
  yield takeEvery(
    ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.REQUEST,
    getAllocations
  )
}

export default allocationSaga
