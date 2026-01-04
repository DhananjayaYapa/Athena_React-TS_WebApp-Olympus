import { axiosPrivateInstance } from './index'
import type {
  TeamListParamsDto,
  SetDefaultTeamDto,
  TeamListV2ParamsDto,
} from './../utilities/models'

//get all the teams
const getTeams = (params?: TeamListParamsDto) => {
  return axiosPrivateInstance.get(`/core/api/v1/teams`, { params: params })
}
const getTeamsV2 = (params?: TeamListV2ParamsDto) => {
  return axiosPrivateInstance.get(`/core/api/v2/teams`, { params: params })
}
const setDefaultTeam = (payload: SetDefaultTeamDto) => {
  return axiosPrivateInstance.patch('/core/api/v1/teams/setDefaultTeam', payload)
}

export const teamsService = {
  getTeams,
  setDefaultTeam,
  getTeamsV2,
}
