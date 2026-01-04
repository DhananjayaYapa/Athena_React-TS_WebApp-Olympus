import type { GetAttendanceInfoParamsDto, AddAttendanceInfoDto } from '../utilities/models/'
import { axiosPrivateInstance } from './index'

// V2
const getAttendanceInfo = (params: GetAttendanceInfoParamsDto) => {
  return axiosPrivateInstance.get(`/athena/api/v1/attendances`, { params: params })
}
const addAttendanceInfo = (payload: AddAttendanceInfoDto) => {
  return axiosPrivateInstance.post(`/athena/api/v1/attendances`, payload)
}

export const attendanceService = {
  getAttendanceInfo,
  addAttendanceInfo,
}
