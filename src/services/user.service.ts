import { axiosPrivateInstance } from './index'
import type { GetUserListBriefParamsDto, GetUserListParamsDto } from '../utilities/models'

const getUserList = (params?: GetUserListParamsDto) => {
  return axiosPrivateInstance.get(`/core/api/v1/users`, { params: params })
}
const getUserListBrief = (params?: GetUserListBriefParamsDto) => {
  return axiosPrivateInstance.get('/core/api/v1/brief/users', { params: params })
}
export const userService = {
  getUserList,
  getUserListBrief,
}
