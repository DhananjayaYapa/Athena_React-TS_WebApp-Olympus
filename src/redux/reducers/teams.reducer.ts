import { COMMON_ACTION_TYPES, TEAMS_ACTION_TYPES } from '../../utilities/constants'

const INITIAL_STATE = {
  teamList: {
    data: [],
    isLoading: false,
  },
  teamListV2: {
    data: [],
    isLoading: false,
  },
  updateDefaultTeam: {
    data: [],
    isLoading: false,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const teamsReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    // get teams
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        teamList: {
          ...state.teamList,
          isLoading: true,
        },
      }
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        teamList: {
          isLoading: false,
          data: action.data,
        },
      }
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.ERROR:
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        teamList: {
          isLoading: false,
          data: [],
        },
      }

    // get teams v2
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST_V2 + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        teamListV2: {
          ...state.teamListV2,
          isLoading: true,
        },
      }
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST_V2 + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        teamListV2: {
          isLoading: false,
          data: action.data,
        },
      }
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST_V2 + COMMON_ACTION_TYPES.ERROR:
    case TEAMS_ACTION_TYPES.GET_TEAMS_LIST_V2 + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        teamListV2: {
          isLoading: false,
          data: [],
        },
      }
    // set default team
    case TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        updateDefaultTeam: {
          ...state.updateDefaultTeam,
          isLoading: true,
        },
      }
    case TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        updateDefaultTeam: {
          isLoading: false,
          data: action.data,
        },
      }
    case TEAMS_ACTION_TYPES.UPDATE_DEFAULT_TEAM + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        updateDefaultTeam: {
          isLoading: false,
          data: [],
        },
      }
    default:
      return state
  }
}

export default teamsReducer
