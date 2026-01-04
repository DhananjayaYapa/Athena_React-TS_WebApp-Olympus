import type { AlertActionDto, SetDefaultTeamDto } from './../../utilities/models'
import { call, put, takeEvery, delay } from 'redux-saga/effects'
import { COMMON_ACTION_TYPES, ALERT_CONFIGS, TEAMS_ACTION_TYPES } from '../../utilities/constants'
import { teamsService } from '../../services'

//teams
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getTeams(action: any) {
  try {
    // @ts-expect-error-ignore
    const teams = yield call(teamsService.getTeams, action.params)
    yield put({
      type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.SUCCESS,
      data: teams.data.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.SET_ALERT,
    }

    yield put({ type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  }
}
//teams vw
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getTeamsV2(action: any) {
  try {
    // @ts-expect-error-ignore
    const teams = yield call(teamsService.getTeamsV2, action.params)
    yield put({
      type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST_V2 + COMMON_ACTION_TYPES.SUCCESS,
      data: teams.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST_V2 + COMMON_ACTION_TYPES.SET_ALERT,
    }

    yield put({ type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST_V2 + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  }
}
function* setDefaultTeam(action: { type: string; payload: SetDefaultTeamDto }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(teamsService.setDefaultTeam, action.payload)
    const setAlert: AlertActionDto = {
      message: response.data.message,
      severity: 'success',
      type: TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.SUCCESS })
    yield put(setAlert)
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* teamsSaga() {
  yield takeEvery(TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.REQUEST, getTeams)
  yield takeEvery(TEAMS_ACTION_TYPES.GET_TEAMS_LIST_V2 + COMMON_ACTION_TYPES.REQUEST, getTeamsV2)
  yield takeEvery(
    TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.REQUEST,
    setDefaultTeam
  )
}

export default teamsSaga
