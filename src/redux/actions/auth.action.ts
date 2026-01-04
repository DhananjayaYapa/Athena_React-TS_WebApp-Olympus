import { AUTH_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'

const authorizeUser = () => {
  return {
    type: AUTH_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST,
  }
}

const fetchAuthorizeUser = () => {
  return {
    type: AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST,
  }
}

const fetchAuthorizeUserRoles = () => {
  return {
    type: AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER_ROLES + COMMON_ACTION_TYPES.REQUEST,
  }
}

const setActiveUserRole = (userRoleKey: string) => {
  return {
    type: AUTH_ACTION_TYPES.SET_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.REQUEST,
    payload: userRoleKey,
  }
}

const fetchActiveUserRole = () => {
  return {
    type: AUTH_ACTION_TYPES.FETCH_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.REQUEST,
  }
}

const logout = () => {
  return {
    type: AUTH_ACTION_TYPES.LOGOUT + COMMON_ACTION_TYPES.REQUEST,
  }
}
export const authActions = {
  authorizeUser,
  fetchAuthorizeUser,
  fetchAuthorizeUserRoles,
  setActiveUserRole,
  fetchActiveUserRole,
  logout,
}
