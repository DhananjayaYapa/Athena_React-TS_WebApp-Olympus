import { COMMON_ACTION_TYPES, LEAVE_ACTION_TYPES } from '../../utilities/constants'

const INITIAL_STATE = {
  // V2
  leaveList: {
    data: [],
    isLoading: false,
  },
  updateLeave: {
    isLoading: false,
  },

  leaveCount: {
    data: [],
    isLoading: false,
  },

  updateLeaveCount: {
    data: [],
    isLoading: false,
  },

  addLeaveCount: {
    data: [],
    isLoading: false,
  },

  leaveCountSummary: {
    data: [],
    isLoading: false,
  },

  addLeave: {
    data: [],
    isLoading: false,
  },

  getLeave: {
    data: [],
    isLoading: false,
  },

  getUserLeaveInfo: {
    data: [],
    isLoading: false,
  },

  updateUserLeaveStatus: {
    data: [],
    isLoading: false,
  },
  pointPersonList: {
    data: [],
    isLoading: false,
    error: null,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const leaveReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    // V2----------------------------------------
    // get leave list
    case LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        leaveList: {
          ...state.leaveList,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        leaveList: {
          isLoading: false,
          data: action.data,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.ERROR:
    case LEAVE_ACTION_TYPES.GET_LEAVE_LIST + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        leaveList: {
          isLoading: false,
          data: [],
        },
      }
    // Update leave
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        updateLeave: {
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.SUCCESS:
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        updateLeave: {
          isLoading: false,
        },
      }
    // Get leave count
    case LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        leaveCount: {
          ...state.leaveCount,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        leaveCount: {
          isLoading: false,
          data: action.data,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVE_COUNT + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        leaveCount: {
          isLoading: false,
          data: [],
        },
      }
    // Add leave count
    case LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        addLeaveCount: {
          ...state.addLeaveCount,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        addLeaveCount: {
          isLoading: false,
          data: action.data,
        },
      }
    case LEAVE_ACTION_TYPES.ADD_LEAVE_COUNT + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        addLeaveCount: {
          isLoading: false,
          data: {},
        },
      }
    // Update leave count
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        updateLeaveCount: {
          ...state.updateLeaveCount,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        updateLeaveCount: {
          isLoading: false,
          data: action.data,
        },
      }
    case LEAVE_ACTION_TYPES.UPDATE_LEAVE_COUNT + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        updateLeaveCount: {
          isLoading: false,
          data: {},
        },
      }
    // Get Leave count summary
    case LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        leaveCountSummary: {
          ...state.leaveCountSummary,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        leaveCountSummary: {
          isLoading: false,
          data: action.data,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVE_COUNT_SUMMARY + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        leaveCountSummary: {
          isLoading: false,
          data: {},
        },
      }
    case LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        addLeave: {
          ...state.addLeave,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.SUCCESS:
      //console.log("Action on leave reducer", action);
      return {
        ...state,
        addLeave: {
          ...state.addLeave,
          isLoading: false,
          data: action.data,
        },
      }
    case LEAVE_ACTION_TYPES.ADD_LEAVE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        addLeave: {
          ...state.addLeave,
          isLoading: false,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVES_OF_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        getLeave: {
          ...state.getLeave,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVES_OF_USER + COMMON_ACTION_TYPES.SUCCESS:
      //console.log("Action on leave reducer", action);
      return {
        ...state,
        getLeave: {
          ...state.getLeave,
          data: action.data,
          isLoading: false,
        },
      }
    case LEAVE_ACTION_TYPES.GET_LEAVES_OF_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        getLeave: {
          ...state.getLeave,
          data: [],
          isLoading: false,
        },
      }

    case LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        getUserLeaveInfo: {
          ...state.getUserLeaveInfo,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        getUserLeaveInfo: {
          ...state.getUserLeaveInfo,
          isLoading: false,
          data: action.data,
        },
      }
    case LEAVE_ACTION_TYPES.GET_USER_LEAVE_INFO + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        getUserLeaveInfo: {
          ...state.getUserLeaveInfo,
          isLoading: false,
          data: [],
        },
      }

    case LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        updateUserLeaveStatus: {
          ...state.updateUserLeaveStatus,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        updateUserLeaveStatus: {
          ...state.updateUserLeaveStatus,
          isLoading: false,
          data: action.data,
        },
      }
    case LEAVE_ACTION_TYPES.UPDATE_USER_LEAVE_STATUS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        updateUserLeaveStatus: {
          ...state.updateUserLeaveStatus,
          isLoading: false,
          data: [],
        },
      }
    case LEAVE_ACTION_TYPES.GET_POINT_PERSON_LIST + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        pointPersonList: {
          ...state.pointPersonList,
          isLoading: true,
        },
      }
    case LEAVE_ACTION_TYPES.GET_POINT_PERSON_LIST + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        pointPersonList: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case LEAVE_ACTION_TYPES.GET_POINT_PERSON_LIST + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        pointPersonList: {
          isLoading: false,
          data: [],
          error: action.error,
        },
      }

    default:
      return state
  }
}

export default leaveReducer
