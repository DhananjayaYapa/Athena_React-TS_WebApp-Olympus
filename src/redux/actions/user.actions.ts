import type { GetUserListBriefParamsDto, GetUserListParamsDto } from './../../utilities/models'
import { COMMON_ACTION_TYPES, USER_ACTION_TYPES } from '../../utilities/constants'

// const authorizeUser = () => {
//     return {
//         type: USER_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST,
//     }
// }

// const fetchAuthorizeUser = () => {
//     return {
//         type: USER_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST,
//     }
// }

const getUserDetail = (userId: number) => {
  return {
    type: USER_ACTION_TYPES.GET_USER_DETAIL + COMMON_ACTION_TYPES.REQUEST,
    payload: userId,
  }
}

const getUserList = (params?: GetUserListParamsDto) => {
  return {
    type: USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}
const getUserListBrief = (params?: GetUserListBriefParamsDto) => {
  return {
    type: USER_ACTION_TYPES.GET_USER_LIST_BRIEF + COMMON_ACTION_TYPES.REQUEST,
    params: params,
  }
}
const getUserTeams = (username: string) => {
  return {
    type: USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.REQUEST,
    payload: username,
  }
}

const clearUserTeams = () => {
  return {
    type: USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.CLEAR,
  }
}

const clearUserList = () => {
  return {
    type: USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.CLEAR,
  }
}

export const userActions = {
  getUserDetail,
  getUserListBrief,
  // fetchAuthorizeUser,
  getUserList,
  getUserTeams,
  clearUserTeams,
  clearUserList,
}
