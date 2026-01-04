import { COMMON_ACTION_TYPES, CLIENT_ACTION_TYPES } from '../../utilities/constants'
import type { Client } from '../../utilities/models'

//get all clients
const getClientList = (params: Client) => {
  return {
    type: CLIENT_ACTION_TYPES.GET_CLIENT_LIST + COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}

export const clientActions = {
  getClientList,
}
