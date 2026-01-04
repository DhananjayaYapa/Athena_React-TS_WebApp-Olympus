import { COMMON_ACTION_TYPES, ALLOCATION_ACTION_TYPES } from '../../utilities/constants'
import type { AllocationStateDto } from '../../utilities/models'

const INITIAL_STATE: AllocationStateDto = {
  allocations: {
    isLoading: false,
    data: [],
    error: null,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allocationReducer = (state = INITIAL_STATE, action: any): AllocationStateDto => {
  switch (action.type) {
    //get allocations
    case ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        allocations: {
          ...state.allocations,
          isLoading: true,
        },
      }

    case ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        allocations: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }

    case ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        allocations: {
          isLoading: false,
          data: [],
          error: action.error,
        },
      }
    case ALLOCATION_ACTION_TYPES.GET_ALLOCATIONS + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        allocations: {
          isLoading: false,
          data: [],
          error: null,
        },
      }

    default:
      return state
  }
}

export default allocationReducer
