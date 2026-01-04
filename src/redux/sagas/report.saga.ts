import { call, put, takeEvery, delay } from 'redux-saga/effects'
import {
  ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES,
  COMMON_ACTION_TYPES,
  DETAILED_ATTENDANCE_REPORT_ACTION_TYPES,
  REPORT_ACTION_TYPES,
} from '../../utilities/constants'
import { ALERT_CONFIGS } from '../../utilities/constants'
import { reportService } from '../../services'
import type {
  AlertActionDto,
  AnnualDetailedLeaveReportFilterParams,
  GetDisabledSbuParamDto,
} from '../../utilities/models'
import type {
  GetExceptionAttendanceDLParamsDto,
  PostExceptionAttendanceParamsDto,
} from '../../utilities/models/ReportGeneration/ExceptionReport.model'
import {
  DownloadReportParamsDto,
  PostTimeEntryParamsDto,
} from '../../utilities/models/ReportGeneration/TimeEntryReport.model'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getAttendanceReport(action: any) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(reportService.getAttendanceReport, action.payload)
    yield put({
      type: REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getDetailedAttendanceReport(action: any) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(reportService.getDetailedAttendanceReport, action.payload)
    yield put({
      type:
        DETAILED_ATTENDANCE_REPORT_ACTION_TYPES.GET_DETAILED_ATTENDANCE_DETAIL +
        COMMON_ACTION_TYPES.SUCCESS,
      data: response.data,
    })
  } catch (error) {
    yield put({
      type:
        DETAILED_ATTENDANCE_REPORT_ACTION_TYPES.GET_DETAILED_ATTENDANCE_DETAIL +
        COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getAttendanceSummaryReport(action: any) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(reportService.getAttendanceSummaryReport, action.payload)
    yield put({
      type:
        ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_DETAIL +
        COMMON_ACTION_TYPES.SUCCESS,
      data: response.data,
    })
  } catch (error) {
    yield put({
      type:
        ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_DETAIL +
        COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getUserClientHierarchy(action: any) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(reportService.getUserClientHierarchy, action.payload)
    yield put({
      type: REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* getAnnualDetailedLeavesInfo(action: {
  type: string
  payload: AnnualDetailedLeaveReportFilterParams
}) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(reportService.getAnnualDetailedLeavesReport, action.payload)
    yield put({
      type: REPORT_ACTION_TYPES.GET_ANNUAL_DETAILED_LEAVES_INFO + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data,
    })
  } catch (error) {
    yield put({
      type: REPORT_ACTION_TYPES.GET_ANNUAL_DETAILED_LEAVES_INFO + COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getAttendanceSummaryReportProjectWise(action: any) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(reportService.getAttendanceSummaryReportProjectWise, action.payload)
    yield put({
      type:
        ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_PROJECT_WISE_DETAIL +
        COMMON_ACTION_TYPES.SUCCESS,
      data: response.data,
    })
  } catch (error) {
    yield put({
      type:
        ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_PROJECT_WISE_DETAIL +
        COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
  }
}

function* allSbuList(action: { type: string; params: GetDisabledSbuParamDto }) {
  try {
    // @ts-expect-error-ignore
    const sbuList = yield call(reportService.getAllSbuList, action.params)
    yield put({
      type: REPORT_ACTION_TYPES.GET_SBU_LIST + COMMON_ACTION_TYPES.SUCCESS,
      data: sbuList.data,
    })
  } catch (error) {
    yield put({
      type: REPORT_ACTION_TYPES.GET_SBU_LIST + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

function* exceptionAttendanceFilters(action: {
  type: string
  params: PostExceptionAttendanceParamsDto
}) {
  try {
    // @ts-expect-error-ignore
    const exceptions = yield call(reportService.postExceptionAttendanceFilters, action.params)
    yield put({
      type: REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.SUCCESS,
      data: exceptions.data,
    })
    const setAlert: AlertActionDto = {
      message: exceptions.data.message,
      severity: 'success',
      type: REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put(setAlert)
    yield delay(ALERT_CONFIGS.ASYNC_REQ_TIMEOUT)
    yield put({
      type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.REQUEST,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* exceptionAttendanceReportList(action: { type: string }) {
  try {
    // @ts-expect-error-ignore
    const reportList = yield call(reportService.getExceptionAttendanceReport, action.params)
    yield put({
      type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.SUCCESS,
      data: reportList.data,
    })
  } catch (error) {
    yield put({
      type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

function* exceptionAttendanceDownload(action: {
  type: string
  params: GetExceptionAttendanceDLParamsDto
}) {
  try {
    // @ts-expect-error-ignore
    const exception = yield call(reportService.getExceptionAttendanceDownload, action.params)
    yield put({
      type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.SUCCESS,
      data: exception.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* timeEntryFilters(action: { type: string; params: PostTimeEntryParamsDto }) {
  try {
    // @ts-expect-error-ignore
    const timeEntry = yield call(reportService.postTimeEntryRequest, action.params)
    yield put({
      type: REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.SUCCESS,
      data: timeEntry.data,
    })
    const setAlert: AlertActionDto = {
      message: timeEntry.data.message,
      severity: 'success',
      type: REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put(setAlert)
    yield delay(ALERT_CONFIGS.ASYNC_REQ_TIMEOUT)
    yield put({
      type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_REPORT + COMMON_ACTION_TYPES.REQUEST,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* timeEntryReportList(action: { type: string }) {
  try {
    // @ts-expect-error-ignore
    const reportList = yield call(reportService.getTimeEntryReport, action.params)
    yield put({
      type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_REPORT + COMMON_ACTION_TYPES.SUCCESS,
      data: reportList.data,
    })
  } catch (error) {
    yield put({
      type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_REPORT + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

function* timeEntryDownload(action: { type: string; params: DownloadReportParamsDto }) {
  try {
    // @ts-expect-error-ignore
    const timeEntry = yield call(reportService.timeEntryDownload, action.params)
    yield put({
      type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.SUCCESS,
      data: timeEntry.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({
      type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({
      type: REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.CLEAR_ALERT,
    })
  }
}

function* reportSaga() {
  yield takeEvery(
    REPORT_ACTION_TYPES.GET_ATTENDANCE_REPORT + COMMON_ACTION_TYPES.REQUEST,
    getAttendanceReport
  )

  yield takeEvery(
    REPORT_ACTION_TYPES.GET_USER_CLIENT_HIERARCHY + COMMON_ACTION_TYPES.REQUEST,
    getUserClientHierarchy
  )

  yield takeEvery(
    DETAILED_ATTENDANCE_REPORT_ACTION_TYPES.GET_DETAILED_ATTENDANCE_DETAIL +
      COMMON_ACTION_TYPES.REQUEST,
    getDetailedAttendanceReport
  )

  yield takeEvery(
    ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_DETAIL +
      COMMON_ACTION_TYPES.REQUEST,
    getAttendanceSummaryReport
  )

  yield takeEvery(
    REPORT_ACTION_TYPES.GET_ANNUAL_DETAILED_LEAVES_INFO + COMMON_ACTION_TYPES.REQUEST,
    getAnnualDetailedLeavesInfo
  )

  yield takeEvery(
    ATTENDANCE_SUMMARY_REPORT_ACTION_TYPES.GET_ATTENDANCE_SUMMARY_PROJECT_WISE_DETAIL +
      COMMON_ACTION_TYPES.REQUEST,
    getAttendanceSummaryReportProjectWise
  )

  yield takeEvery(REPORT_ACTION_TYPES.GET_SBU_LIST + COMMON_ACTION_TYPES.REQUEST, allSbuList)

  yield takeEvery(
    REPORT_ACTION_TYPES.POST_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.REQUEST,
    exceptionAttendanceFilters
  )

  yield takeEvery(
    REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE + COMMON_ACTION_TYPES.REQUEST,
    exceptionAttendanceReportList
  )

  yield takeEvery(
    REPORT_ACTION_TYPES.GET_EXCEPTION_ATTENDANCE_DOWNLOAD + COMMON_ACTION_TYPES.REQUEST,
    exceptionAttendanceDownload
  )

  yield takeEvery(
    REPORT_ACTION_TYPES.POST_TIME_ENTRY + COMMON_ACTION_TYPES.REQUEST,
    timeEntryFilters
  )

  yield takeEvery(
    REPORT_ACTION_TYPES.GET_TIME_ENTRY_REPORT + COMMON_ACTION_TYPES.REQUEST,
    timeEntryReportList
  )

  yield takeEvery(
    REPORT_ACTION_TYPES.GET_TIME_ENTRY_DOWNLOAD + COMMON_ACTION_TYPES.REQUEST,
    timeEntryDownload
  )
}

export default reportSaga
