import type { AuthStateDto } from './../../utilities/models'
import { AUTH_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'

const INITIAL_STATE: AuthStateDto = {
  userAuthorizing: {
    isAuthorized: false,
    isLoading: false,
    error: null,
  },
  authorizedUser: {
    data: {
      designation: '',
      designationId: 0,
      firstName: '',
      isAuthorized: false,
      lastName: '',
      tag: '',
      timeZone: '',
      username: '',
    },
    isLoading: false,
    isFetched: false,
    error: null,
  },
  authorizedUserRoles: {
    data: [],
    isLoading: false,
    isFetched: false,
    error: null,
  },
  activeUserRole: {
    data: {
      entitlements: [],
      features: [],
      userRoleId: 0,
      userRoleKey: '',
      userRoleName: '',
    },
    isFetched: false,
    isLoading: false,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    // user authorizing
    case AUTH_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        userAuthorizing: {
          ...state.userAuthorizing,
          isLoading: true,
        },
      }
    case AUTH_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        userAuthorizing: {
          isLoading: false,
          isAuthorized: true,
          error: null,
        },
      }
    case AUTH_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        userAuthorizing: {
          isLoading: false,
          isAuthorized: false,
          error: action.error,
        },
      }
    // fetch authorized user
    case AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        authorizedUser: {
          ...state.authorizedUser,
          isLoading: true,
          isFetched: false,
        },
      }
    case AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        authorizedUser: {
          isLoading: false,
          data: action.data,
          isFetched: true,
          error: null,
        },
      }
    case AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        authorizedUser: {
          isLoading: false,
          data: {
            designation: '',
            designationId: 0,
            firstName: '',
            isAuthorized: false,
            lastName: '',
            tag: '',
            timeZone: '',
            username: '',
          },
          error: action.error,
          isFetched: true,
        },
      }
    // fetch authorized user roles
    case AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER_ROLES + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        authorizedUserRoles: {
          ...state.authorizedUserRoles,
          isLoading: true,
          isFetched: false,
        },
      }
    case AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER_ROLES + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        authorizedUserRoles: {
          isLoading: false,
          data: action.data,
          isFetched: true,
          error: null,
        },
      }
    case AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER_ROLES + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        authorizedUserRoles: {
          isLoading: false,
          data: [],
          isFetched: true,
          error: action.error,
        },
      }
    // set active user roles
    case AUTH_ACTION_TYPES.FETCH_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        activeUserRole: {
          ...state.activeUserRole,
          isLoading: true,
          isFetched: false,
        },
      }
    case AUTH_ACTION_TYPES.FETCH_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        activeUserRole: {
          isLoading: false,
          data: action.data,
          isFetched: true,
          error: null,
        },
      }
    case AUTH_ACTION_TYPES.FETCH_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        activeUserRole: {
          isLoading: false,
          isFetched: true,
          data: {
            entitlements: [],
            features: [],
            userRoleId: 0,
            userRoleKey: '',
            userRoleName: '',
          },
          error: action.error,
        },
      }
    default:
      return state
  }
}

export default authReducer
