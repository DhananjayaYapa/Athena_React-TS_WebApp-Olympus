import { COMMON_ACTION_TYPES, NONWORKINGDAY_ACTION_TYPES } from '../../utilities/constants'

const INITIAL_STATE = {
  nonWorkingDay: {
    data: {},
    editedNonWorkingDay: null,
    error: null,
    isLoading: false,
  },
  nonWorkingDayRange: {
    data: [],
    isLoading: false,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nonWorkingDayReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case NONWORKINGDAY_ACTION_TYPES.ADD_NON_WORKING_DAY + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        nonWorkingDay: {
          ...state.nonWorkingDay,
          editedNonWorkingDay: null,
          error: null,
          isLoading: true,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.ADD_NON_WORKING_DAY + COMMON_ACTION_TYPES.SUCCESS:
      //console.log("Action on nonworking day reducer", action);
      return {
        ...state,
        nonWorkingDay: {
          ...state.nonWorkingDay,
          editedNonWorkingDay: 'Non-working day added successfully',
          isLoading: false,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.ADD_NON_WORKING_DAY + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        nonWorkingDay: {
          ...state.nonWorkingDay,
          error: action.error,
          isLoading: false,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.UPDATE_NON_WORKING_DAYS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        nonWorkingDay: {
          ...state.nonWorkingDay,
          editedNonWorkingDay: null,
          error: null,
          isLoading: true,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.UPDATE_NON_WORKING_DAYS + COMMON_ACTION_TYPES.SUCCESS:
      //console.log("Action on nonworking day reducer", action);
      return {
        ...state,
        nonWorkingDay: {
          ...state.nonWorkingDay,
          editedNonWorkingDay: 'Non-working day updated successfully',
          isLoading: false,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.UPDATE_NON_WORKING_DAYS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        nonWorkingDay: {
          ...state.nonWorkingDay,
          error: action.error,
          isLoading: false,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        nonWorkingDay: {
          ...state.nonWorkingDay,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.SUCCESS:
      //console.log("Action on reducer", action);
      return {
        ...state,
        nonWorkingDay: {
          ...state.nonWorkingDay,
          data: action.data,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        nonWorkingDay: {
          ...state.nonWorkingDay,
          data: {},
          error: action.error,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        nonWorkingDay: {
          data: {},
          editedNonWorkingDay: null,
          error: null,
          isLoading: false,
        },
      }

    case NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS_RANGE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        nonWorkingDayRange: {
          ...state.nonWorkingDayRange,
          isLoading: true,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS_RANGE + COMMON_ACTION_TYPES.SUCCESS:
      //console.log("Action on reducer", action);
      return {
        ...state,
        nonWorkingDayRange: {
          ...state.nonWorkingDayRange,
          data: action.data,
          isLoading: false,
        },
      }
    case NONWORKINGDAY_ACTION_TYPES.GET_NON_WORKING_DAYS_RANGE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        nonWorkingDayRange: {
          ...state.nonWorkingDayRange,
          data: [],
          isLoading: false,
        },
      }
    default:
      return state
  }
}

export default nonWorkingDayReducer
