import type {
  GetLeaveListParamsDto,
  PointPersonParamsDto,
  UpdateLeaveDto,
  AddLeaveCountDto,
  UpdateLeaveCountDto,
  AddLeaveDto,
  UserLeaveStatusUpdateDto,
} from './../../utilities/models'
import { COMMON_ACTION_TYPES, LEAVE_ACTION_TYPES } from '../../utilities/constants'

//  V2

const getLeaveList = (params?: GetLeaveListParamsDto) => {
  return { type: LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.REQUEST, payload: params }
}

const updateLeave = (payload: UpdateLeaveDto) => {
  return { type: LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.REQUEST, payload: payload }
}

const clearLeaveList = () => {
  return { type: LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.CLEAR }
}

const getLeaveCount = (userName?: string) => {
  return {
    type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.REQUEST,
    payload: userName,
  }
}

const addLeaveCount = (leaveCount: AddLeaveCountDto) => {
  return {
    type: LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.REQUEST,
    payload: leaveCount,
  }
}

const updateLeaveCount = (leaveCount: UpdateLeaveCountDto) => {
  return {
    type: LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.REQUEST,
    payload: leaveCount,
  }
}

const getLeaveCountSummary = (username: string) => {
  return {
    type: LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.REQUEST,
    payload: username,
  }
}

const addLeave = (leave: AddLeaveDto[]) => {
  return {
    type: LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.REQUEST,
    payload: leave,
  }
}

const getUserLeaveInfoByToken = (token: string) => {
  return {
    type: LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.REQUEST,
    payload: token,
  }
}

const updateUserLeaveStatusByToken = (data: UserLeaveStatusUpdateDto) => {
  return {
    type: LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.REQUEST,
    payload: data,
  }
}
const getPointPersonList = (params: PointPersonParamsDto) => {
  return {
    type: LEAVE_ACTION_TYPES.GET_POINT_PERSON_LIST + COMMON_ACTION_TYPES.REQUEST,
    params: params,
  }
}

export const leaveActions = {
  addLeave,
  getLeaveList,
  clearLeaveList,
  updateLeave,
  getLeaveCount,
  addLeaveCount,
  updateLeaveCount,
  getLeaveCountSummary,
  getUserLeaveInfoByToken,
  updateUserLeaveStatusByToken,
  getPointPersonList,
}
