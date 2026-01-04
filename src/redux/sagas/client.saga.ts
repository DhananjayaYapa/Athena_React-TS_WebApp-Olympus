import { call, put, takeEvery } from 'redux-saga/effects'

import { COMMON_ACTION_TYPES } from '../../utilities/constants'
import { CLIENT_ACTION_TYPES } from '../../utilities/constants'
import { clientService } from '../../services'
import type { AlertActionDto } from '../../utilities/models'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getClientList(action: any) {
  try {
    // @ts-expect-error-ignore
    const clientList = yield call(clientService.getClientList, action.payload)

    yield put({
      type: CLIENT_ACTION_TYPES.GET_CLIENT_LIST + COMMON_ACTION_TYPES.SUCCESS,
      data: clientList.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: CLIENT_ACTION_TYPES.GET_CLIENT_LIST + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: CLIENT_ACTION_TYPES.GET_CLIENT_LIST + COMMON_ACTION_TYPES.ERROR,
      error: setAlert,
    })
  }
}

function* clientSaga() {
  yield takeEvery(CLIENT_ACTION_TYPES.GET_CLIENT_LIST + COMMON_ACTION_TYPES.REQUEST, getClientList)
}

export default clientSaga
