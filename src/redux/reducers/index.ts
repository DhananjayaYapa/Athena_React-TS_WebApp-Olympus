import { combineReducers } from 'redux'
import userReducer from './user.reducer'
import nonWorkingDayReducer from './nonWorkingDay.reducer'
import attendanceReducer from './attendance.reducer'
import leaveReducer from './leave.reducer'
import teamsReducer from './teams.reducer'
import clientReducer from './client.reducer'
import reportReducer from './report.reducer'
import absenteeismReducer from './absenteeism.reducer'
import alertReducer from './alert.reducer'
import allocationReducer from './allocation.reducer'
import authReducer from './auth.reducer'

import timeSheetReducer from './timeSheet.reducer'
const rootReducer = combineReducers({
  user: userReducer,
  attendance: attendanceReducer,
  nonWorkingDays: nonWorkingDayReducer,
  leave: leaveReducer,
  teams: teamsReducer,
  client: clientReducer,
  report: reportReducer,
  absenteeism: absenteeismReducer,
  alerts: alertReducer,
  allocation: allocationReducer,
  auth: authReducer,
  timeSheet: timeSheetReducer,
})

export default rootReducer
