import {
  COMMON_ACTION_TYPES,
  TIME_SHEET_ACTION_TYPES,
} from "../../utilities/constants";
import { TimeEntryRequest, TimeSheetRequest } from '../../utilities/models';


const getTimeSheet = (params: TimeSheetRequest) => {
  return {
    type: TIME_SHEET_ACTION_TYPES.GET_TIME_SHEET + COMMON_ACTION_TYPES.REQUEST,
    payload: params
  };
};

const updateTimeSheet = (payload: TimeEntryRequest) => {
  return {
    type: TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.REQUEST,
    payload: payload
  };
};

const clearUpdateTimeSheet = () => {
  return { 
    type: TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.CLEAR
  }
}

export const timeSheetActions = {
  getTimeSheet,
  updateTimeSheet,
  clearUpdateTimeSheet
};
