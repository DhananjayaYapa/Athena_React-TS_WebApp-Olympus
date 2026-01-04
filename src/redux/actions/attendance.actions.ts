import { COMMON_ACTION_TYPES, ATTENDANCE_ACTION_TYPES } from '../../utilities/constants'
import type { AddAttendanceInfoDto, GetAttendanceInfoParamsDto } from '../../utilities/models/'

const addAttendanceInfo = (data: AddAttendanceInfoDto) => {
  return {
    type: ATTENDANCE_ACTION_TYPES.ADD_ATTENDANCE_INFO + COMMON_ACTION_TYPES.REQUEST,
    payload: data,
  }
}

const getAttendanceInfo = (params: GetAttendanceInfoParamsDto) => {
  return {
    type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}

const clearAttendanceInfo = () => {
  return { type: ATTENDANCE_ACTION_TYPES.GET_ATTENDANCE_INFO + COMMON_ACTION_TYPES.CLEAR }
}

export const attendanceActions = {
  addAttendanceInfo,
  getAttendanceInfo,
  clearAttendanceInfo,
}
