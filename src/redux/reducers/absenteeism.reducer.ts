import { COMMON_ACTION_TYPES, ABSENTEEISM_REPORT_ACTION_TYPES } from '../../utilities/constants'

const INITIAL_STATE = {
  absenteeismInfo: {
    data: [],
    isLoading: false,
    error: null,
  },
}

const absenteeismReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case ABSENTEEISM_REPORT_ACTION_TYPES.GET_ABSENTEEISM_DETAIL + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        absenteeismInfo: {
          ...state.absenteeismInfo,
          isLoading: true,
        },
      }
    case ABSENTEEISM_REPORT_ACTION_TYPES.GET_ABSENTEEISM_DETAIL + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        absenteeismInfo: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case ABSENTEEISM_REPORT_ACTION_TYPES.GET_ABSENTEEISM_DETAIL + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        absenteeismInfo: {
          isLoading: false,
          data: {},
          error: action.error,
        },
      }
    case ABSENTEEISM_REPORT_ACTION_TYPES.RESET_ABSENTEEISM_DETAIL + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        absenteeismInfo: {
          isLoading: false,
          data: ['null'],
        },
      }
    default:
      return state
  }
}

export default absenteeismReducer
