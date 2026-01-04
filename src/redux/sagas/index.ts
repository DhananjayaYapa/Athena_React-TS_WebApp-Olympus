import { all } from 'redux-saga/effects'
import userSaga from './user.saga'
import nonWorkingDaySaga from './nonWorkingDay.saga'
import attendanceSaga from './attendance.saga'
import leaveSaga from './leave.saga'
import teamsSaga from './teams.saga'
import clientSaga from './client.saga'
import reportSaga from './report.saga'
import absenteeismSaga from './absenteeism.saga'
import alertSaga from './alert.saga'
import allocationSaga from './allocation.saga'
import authSaga from './auth.saga'

import timeSheetSaga from './timeSheet.saga'
export default function* rootSaga() {
  yield all([
    userSaga(),
    attendanceSaga(),
    nonWorkingDaySaga(),
    leaveSaga(),
    teamsSaga(),
    clientSaga(),
    reportSaga(),
    absenteeismSaga(),
    alertSaga(),
    allocationSaga(),
    authSaga(),
    timeSheetSaga(),
  ])
}
