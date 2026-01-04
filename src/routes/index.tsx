import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import {
  Login,
  NonWorkingDays,
  MarkingLeave,
  MarkingLeaveHR,
  EditTimeEntry,
  AbsenteeismReport,
  AttendanceReport,
  AddTimeEntry,
  Dashboard,
  LeaveConfiguration,
  ManageLeaves,
  UserProfile,
  DetailedAttendanceReport,
  AttendanceSummary,
  AnnualDetailedLeaveReport,
  ExceptionAttendance,
  TimeEntryReport,
} from '../pages'
import { APP_FEATURE_KEYS, APP_ROUTES } from '../utilities/constants'
import AddTimeSheet from '../pages/AddTimeSheet/AddTimeSheet'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.ROOT} element={<Login />} />
        <Route
          path={APP_ROUTES.DASHBOARD}
          element={
            <PrivateRoute
              permissionKeys={[
                APP_FEATURE_KEYS.VIEW_OWN_LEAVES,
                APP_FEATURE_KEYS.VIEW_OWN_TIME_ENTRIES,
              ]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.ADD_ATTENDANCE}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.CREATE_UPDATE_OWN_TIME_ENTRY]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <AddTimeEntry />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.MANAGE_TIME_ENTRIES}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.UPDATE_OWN_TIME_SHEET]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <AddTimeSheet />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.EDIT_TIME_ENTRY}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.CREATE_UPDATE_ALL_TIME_ENTRY]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <EditTimeEntry />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.MARKING_LEAVE}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.CREATE_UPDATE_OWN_LEAVE]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <MarkingLeave />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.MARKING_LEAVE_HR}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.CREATE_UPDATE_ALL_LEAVE]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <MarkingLeaveHR />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.LEAVE_MANAGEMENT}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.APPROVE_REJECT_LEAVES]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <ManageLeaves />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.NON_WORKING_DAYS}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.MANAGE_HOLIDAY_CALENDAR]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <NonWorkingDays />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.ABSENTEEISM_REPORT}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.ATHENA_ABSENTEEISM_REPORT]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <AbsenteeismReport />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.ATTENDANCE_REPORT}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.ATHENA_ATTENDANCE_REPORT]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <AttendanceReport />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.DETAILED_ATTENDANCE_REPORT}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.ATHENA_DETAILED_ATTENDANCE_REPORT]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <DetailedAttendanceReport />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.ATTENDANCE_SUMMARY_REPORT}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.ATHENA_ATTENDANCE_SUMMARY_REPORT]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <AttendanceSummary />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.ANNUAL_DETAILED_LEAVE_REPORT}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.ATHENA_ANNUAL_LEAVE_REPORT]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <AnnualDetailedLeaveReport />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.LEAVE_CONFIGURATION}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.UPDATE_LEAVE_COUNT_CONFIGURATION]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <LeaveConfiguration />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.USER_PROFILE}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.USER_PROFILE]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <UserProfile />
            </PrivateRoute>
          }
        />

        <Route
          path={APP_ROUTES.EXCEPTION_ATTENDANCE_REPORT}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.ATHENA_EXCEPTION_REPORT]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <ExceptionAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path={APP_ROUTES.TIME_ENTRY_REPORT}
          element={
            <PrivateRoute
              permissionKeys={[APP_FEATURE_KEYS.ATHENA_TIME_ENTRY_REPORT]}
              redirectTo={APP_ROUTES.ROOT}
            >
              <TimeEntryReport />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
