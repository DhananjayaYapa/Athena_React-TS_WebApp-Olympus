import {
  COMMON_ACTION_TYPES,
  TIME_SHEET_ACTION_TYPES,
} from "../../utilities/constants";

const INITIAL_STATE = {
  timeSheet: {
    data: [],
    isLoading: false,
    severity: null
  },
  updateTimeSheet: {
    response: null,
    isLoading: false,
    severity: null
  }
};

const timeSheetReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    // get time sheet
    case TIME_SHEET_ACTION_TYPES.GET_TIME_SHEET + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        timeSheet: {
          ...state.timeSheet,
          isLoading: true,
        },
      };
    case TIME_SHEET_ACTION_TYPES.GET_TIME_SHEET + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        timeSheet: {
          isLoading: false,
          data: action.data,
          severity: 'success'

        },
      };
    case TIME_SHEET_ACTION_TYPES.GET_TIME_SHEET  + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        timeSheet: {
          isLoading: false,
          data: action.data,
          severity: 'error'
        },
      };
    //update time sheet
    case TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        updateTimeSheet: {
          ...state.updateTimeSheet,
          isLoading: true,
        },
      };
    case TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        updateTimeSheet: {
          isLoading: false,
          response: action.data,
          severity: 'success'
        },
      };
    case TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        updateTimeSheet: {
          isLoading: false,
          response: action.data,
          severity: 'error'
        },
      };
      case TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        updateTimeSheet: {
          isLoading: false,
          response: null,
        },
      };
    default:
      return state;
  }
};

export default timeSheetReducer;
