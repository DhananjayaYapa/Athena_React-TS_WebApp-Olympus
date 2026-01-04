import { axiosPrivateInstance } from './index'
import type { Client } from '../utilities/models'

//get all the clients
const getClientList = (params: Client) => {
  return axiosPrivateInstance.get(`/core/api/v1/clients`, { params: params })
}

export const clientService = {
  getClientList,
}
