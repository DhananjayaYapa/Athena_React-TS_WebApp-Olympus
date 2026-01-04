import type {
  TeamListParamsDto,
  SetDefaultTeamDto,
  TeamListV2ParamsDto,
} from './../../utilities/models'
import { COMMON_ACTION_TYPES, TEAMS_ACTION_TYPES } from '../../utilities/constants'

//get all teams
const getTeamList = (params?: TeamListParamsDto) => {
  return {
    type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.REQUEST,
    params: params,
  }
}
const getTeamListV2 = (params?: TeamListV2ParamsDto) => {
  return {
    type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST_V2 + COMMON_ACTION_TYPES.REQUEST,
    params: params,
  }
}
const setDefaultTeam = (payload: SetDefaultTeamDto) => {
  return {
    type: TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.REQUEST,
    payload: payload,
  }
}

const clearTeamList = () => {
  return {
    type: TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.CLEAR,
  }
}

export const teamsActions = {
  getTeamList,
  clearTeamList,
  setDefaultTeam,
  getTeamListV2,
}
