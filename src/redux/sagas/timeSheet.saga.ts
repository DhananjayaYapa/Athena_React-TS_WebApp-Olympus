import { TimeEntryRequest, TimeSheetRequest } from '../../utilities/models';
import { call, put, takeEvery, delay } from "redux-saga/effects";
import { COMMON_ACTION_TYPES, ALERT_CONFIGS, TIME_SHEET_ACTION_TYPES } from "../../utilities/constants";
import { timeSheetService } from "../../services";
import { SagaIterator } from 'redux-saga';

//time sheet
function* getTimeSheet(action: { type: string, payload:  TimeSheetRequest}): SagaIterator  {
  try {
    const timeSheet = yield call(timeSheetService.getTimeSheet, action.payload);
    yield put({type: TIME_SHEET_ACTION_TYPES.GET_TIME_SHEET + COMMON_ACTION_TYPES.SUCCESS, data: timeSheet});

    } catch (error: any) {
    yield put({type: TIME_SHEET_ACTION_TYPES.GET_TIME_SHEET + COMMON_ACTION_TYPES.ERROR, data: {
      message: error,
      severity: 'error'
    }});

  }
}

function* updateTimeSheet(action: { type: string, payload: TimeEntryRequest }) {
  try {
    // @ts-ignore
    const response = yield call(timeSheetService.manageTimeSheet, action.payload);
     yield put({type: TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.SUCCESS,
       data: response?.data});
  } catch (error: any) {
    yield put({type: TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.ERROR, data: {
      message: error,
      severity: 'error'
    }});

  }finally {
    yield delay(ALERT_CONFIGS.TIMEOUT);
    yield put({ type: TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.CLEAR, data: null });
  }
}

function* timeSheetSaga() {
  yield takeEvery(TIME_SHEET_ACTION_TYPES.GET_TIME_SHEET + COMMON_ACTION_TYPES.REQUEST,  getTimeSheet);
  yield takeEvery(TIME_SHEET_ACTION_TYPES.UPDATE_TIME_SHEET + COMMON_ACTION_TYPES.REQUEST,  updateTimeSheet);
}

export default timeSheetSaga;
