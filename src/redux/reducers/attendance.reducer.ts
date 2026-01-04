import { COMMON_ACTION_TYPES, ATTENDANCE_ACTION_TYPES } from '../../utilities/constants'

const INITIAL_STATE = {
  addAttendanceInfo: {
    isLoading: false,
  },
  attendanceInfo: {
    isLoading: false,
    data: [],
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const attendanceReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    //Add Attendance Info
    case ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        addAttendanceInfo: {
          isLoading: true,
        },
      }

    case ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SUCCESS:
    case ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        addAttendanceInfo: {
          isLoading: false,
        },
      }

    //get Attendance Info
    case ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        attendanceInfo: {
          ...state.attendanceInfo,
          isLoading: true,
        },
      }

    case ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        attendanceInfo: {
          isLoading: false,
          data: action.data,
        },
      }

    case ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.ERROR:
    case ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        attendanceInfo: {
          isLoading: false,
          data: [],
        },
      }

    default:
      return state
  }
}

export default attendanceReducer
