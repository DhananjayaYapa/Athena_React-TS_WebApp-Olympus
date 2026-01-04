import {
  COMMON_ACTION_TYPES,
  NONWORKINGDAY_ACTION_TYPES,
  NWDAY_CAL_ACTION_TYPES,
} from '../../utilities/constants'
import type { NonWorkingDayPayload, GetNonworkingDaysRangeDto } from '../../utilities/models'

const addNonWorkingDay = (nonWorkingDay: NonWorkingDayPayload) => {
  return {
    type: NONWORKINGDAY_ACTION_TYPES.ADD_NON_WORKING_DAY + COMMON_ACTION_TYPES.REQUEST,
    payload: nonWorkingDay,
  }
}

const updateNonWorkingDay = (nonWorkingDay: NonWorkingDayPayload) => {
  return {
    type: NONWORKINGDAY_ACTION_TYPES.UPDATE_NON_WORKING_DAYS + COMMON_ACTION_TYPES.REQUEST,
    payload: nonWorkingDay,
  }
}

const getNonWorkingDays = (year?: number) => {
  return {
    type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.REQUEST,
    payload: year,
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clearNonWorkingDays = () => {
  return {
    type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS + COMMON_ACTION_TYPES.CLEAR,
  }
}

const getNonWorkingDaysRange = (daysRange: GetNonworkingDaysRangeDto) => {
  return {
    type: NWDAY_CAL_ACTION_TYPES.GET_NON_WORKING_DAYS_RANGE + COMMON_ACTION_TYPES.REQUEST,
    payload: daysRange,
  }
}

export const nonWorkingDayActions = {
  addNonWorkingDay,
  updateNonWorkingDay,
  getNonWorkingDays,
  clearNonWorkingDays,
  getNonWorkingDaysRange,
}
