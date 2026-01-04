import { COMMON_ACTION_TYPES, CLIENT_ACTION_TYPES } from '../../utilities/constants'

const INITIAL_STATE = {
  clientList: {
    data: [],
    isLoading: false,
    error: null,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clientReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    // get clients
    case CLIENT_ACTION_TYPES.GET_CLIENT_LIST + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        clientList: {
          ...state.clientList,
          isLoading: true,
        },
      }
    case CLIENT_ACTION_TYPES.GET_CLIENT_LIST + COMMON_ACTION_TYPES.SUCCESS:
      // console.log("Action on reducer", action);
      return {
        ...state,
        clientList: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case CLIENT_ACTION_TYPES.GET_CLIENT_LIST + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        clientList: {
          isLoading: false,
          data: [],
          error: action.error,
        },
      }

    default:
      return state
  }
}

export default clientReducer
