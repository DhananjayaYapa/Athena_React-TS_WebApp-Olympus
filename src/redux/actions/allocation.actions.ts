import { COMMON_ACTION_TYPES, ALLOCATION_ACTION_TYPES } from '../../utilities/constants'
import type { GetAllocationsParamsDto } from '../../utilities/models/'

const getAllocations = (params: GetAllocationsParamsDto) => {
  return {
    type: ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}
const clearAllocations = () => {
  return {
    type: ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.CLEAR,
  }
}

export const allocationActions = {
  getAllocations,
  clearAllocations,
}
