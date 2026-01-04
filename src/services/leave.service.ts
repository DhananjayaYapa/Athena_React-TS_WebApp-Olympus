import type {
  GetLeaveListParamsDto,
  PointPersonParamsDto,
  UpdateLeaveDto,
  AddLeaveCountDto,
  UpdateLeaveCountDto,
  AddLeaveDto,
  UserLeaveStatusUpdateDto,
} from './../utilities/models/leave.model'
import axios from 'axios'
import { axiosPrivateInstance, axiosPublicInstance } from './index'
import { APP_CONFIGS } from '../utilities/constants'

axios.defaults.baseURL = APP_CONFIGS.API_BASE

// SHOULD REMOVE ALL V1 After migrate marking leave feature
// V2 migrated functions
const getLeaveList = (params: GetLeaveListParamsDto) => {
  return axiosPrivateInstance.get('/athena/api/v1/leaves', { params: params })
}

const updateLeave = (payload: UpdateLeaveDto) => {
  return axiosPrivateInstance.put('/athena/api/v1/leaves', payload)
}

const getLeaveCount = (username?: string) => {
  return axiosPrivateInstance.get('/athena/api/v1/leaves/leaveCount', {
    params: { ...(username ? { username } : {}) },
  })
}

const insertLeaveCount = (leaveData: AddLeaveCountDto) => {
  return axiosPrivateInstance.post('/athena/api/v1/leaves/leaveCount', leaveData)
}

const updateLeaveCount = (leaveData: UpdateLeaveCountDto) => {
  return axiosPrivateInstance.put('/athena/api/v1/leaves/leaveCount', leaveData)
}

const getLeaveCountSummary = (username: string) => {
  return axiosPrivateInstance.get('/athena/api/v1/leaves/summary', { params: { username } })
}

const addLeave = (leave: AddLeaveDto[]) => {
  return axiosPrivateInstance.post('/athena/api/v1/leaves', leave)
}

const getUserLeaveInfo = (token: string) => {
  return axiosPublicInstance.get('/athena/api/v1/leaveAction', { params: { token } })
}

const updateUserLeaveStatus = (leaveData: UserLeaveStatusUpdateDto) => {
  return axiosPublicInstance.patch('/athena/api/v1/leaveAction', leaveData)
}
const getPointPersons = (params: PointPersonParamsDto) => {
  return axiosPrivateInstance.get(`/athena/api/v1/leaves/pointPersons`, { params: params })
}
export const leaveService = {
  addLeave,
  getLeaveCount,
  insertLeaveCount,
  getLeaveList,
  updateLeave,
  updateLeaveCount,
  getLeaveCountSummary,
  getUserLeaveInfo,
  updateUserLeaveStatus,
  getPointPersons,
}
