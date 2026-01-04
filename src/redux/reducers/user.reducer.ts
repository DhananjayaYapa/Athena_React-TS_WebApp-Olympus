import { COMMON_ACTION_TYPES, USER_ACTION_TYPES } from '../../utilities/constants'

const INITIAL_STATE = {
  userDetail: {
    data: {},
    isLoading: false,
    error: null,
  },

  userList: {
    data: [],
    isLoading: false,
  },
  getUserTeamList: {
    data: [],
    isLoading: false,
    error: null,
  },
  userListBrief: {
    isLoading: false,
    data: [],
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    // // user authorizing
    // case USER_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST:
    //     return {
    //         ...state,
    //         userAuthorizing: {
    //             ...state.authorizedUser,
    //             isLoading: true,
    //         }
    //     }
    // case USER_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.SUCCESS:
    //     return {
    //         ...state,
    //         userAuthorizing: {
    //             isLoading: false,
    //             isAuthorized: true,
    //             error: null
    //         }
    //     }
    // case USER_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.ERROR:
    //     return {
    //         ...state,
    //         userAuthorizing: {
    //             isLoading: false,
    //             isAuthorized: false,
    //             error: action.error
    //         }
    //     }
    // // fetch authorized user
    // case USER_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST:
    //     return {
    //         ...state,
    //         authorizedUser: {
    //             ...state.authorizedUser,
    //             isLoading: true,
    //         }
    //     }
    // case USER_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.SUCCESS:
    //     return {
    //         ...state,
    //         authorizedUser: {
    //             isLoading: false,
    //             data: action.data,
    //             error: null
    //         }
    //     }
    // case USER_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.ERROR:
    //     return {
    //         ...state,
    //         authorizedUser: {
    //             isLoading: false,
    //             data: {},
    //             error: action.error
    //         }
    //     }
    // get user details
    case USER_ACTION_TYPES.GET_USER_DETAIL + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        userDetail: {
          ...state.userDetail,
          isLoading: true,
        },
      }
    case USER_ACTION_TYPES.GET_USER_DETAIL + COMMON_ACTION_TYPES.SUCCESS:
      //console.log('Action on reducer',action)
      return {
        ...state,
        userDetail: {
          isLoading: false,
          data: action.data.data,
          error: null,
        },
      }
    case USER_ACTION_TYPES.GET_USER_DETAIL + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        userDetail: {
          isLoading: false,
          data: {},
          error: action.error,
        },
      }

    //Get user List
    case USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        userList: {
          ...state.userList,
          isLoading: true,
        },
      }
    case USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        userList: {
          isLoading: false,
          data: action.data.data,
          error: null,
        },
      }
    case USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.ERROR:
    case USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        userList: {
          isLoading: false,
          data: [],
        },
      }
    //get user teams
    case USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        getUserTeamList: {
          ...state.getUserTeamList,
          isLoading: true,
        },
      }

    case USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        getUserTeamList: {
          isLoading: false,
          data: action.data,
        },
      }

    case USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.ERROR:
    case USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        getUserTeamList: {
          isLoading: false,
          data: [],
        },
      }
    case USER_ACTION_TYPES.GET_USER_LIST_BRIEF + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        userListBrief: {
          ...state.userListBrief,
          isLoading: true,
        },
      }
    case USER_ACTION_TYPES.GET_USER_LIST_BRIEF + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        userListBrief: {
          isLoading: false,
          data: action.data,
        },
      }
    case USER_ACTION_TYPES.GET_USER_LIST_BRIEF + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        userListBrief: {
          isLoading: false,
          data: [],
        },
      }
    default:
      return state
  }
}

export default userReducer
