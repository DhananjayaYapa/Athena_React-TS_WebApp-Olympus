import { COMMON_ACTION_TYPES, ABSENTEEISM_REPORT_ACTION_TYPES } from '../../utilities/constants'
import type { AbsentInfoParams } from '../../utilities/models/'

//get
const getAbsenteeismDetail = (params: AbsentInfoParams) => {
  return {
    type: ABSENTEEISM_REPORT_ACTION_TYPES.GET_ABSENTEEISM_DETAIL + COMMON_ACTION_TYPES.REQUEST,
    payload: params,
  }
}

const resetAbsenteeismDetail = () => {
  return {
    type: ABSENTEEISM_REPORT_ACTION_TYPES.RESET_ABSENTEEISM_DETAIL + COMMON_ACTION_TYPES.REQUEST,
  }
}

export const absenteeismActions = {
  getAbsenteeismDetail,
  resetAbsenteeismDetail,
}
