import axios from 'axios'
import { axiosPrivateInstance } from './index'
import type { NonWorkingDay, GetNonworkingDaysRangeDto } from '../utilities/models'
import { APP_CONFIGS } from '../utilities/constants'

axios.defaults.baseURL = APP_CONFIGS.API_BASE

//Define a model
const addNonWorkingDay = (nonWorkingDays: NonWorkingDay) => {
  const postURL = '/athena/api/v1/nonWorkingDays'

  return axiosPrivateInstance.post(postURL, nonWorkingDays)
}

const updateNonWorkingDay = (nonWorkingDays: NonWorkingDay) => {
  const putURL = '/athena/api/v1/nonWorkingDays'

  return axiosPrivateInstance.put(putURL, nonWorkingDays)
}

const getNonWorkingDays = (year?: number) => {
  return axiosPrivateInstance.get('/athena/api/v1/nonWorkingDays', { params: { year: year } })
}

const getNonWorkingDaysRange = (daysRange: GetNonworkingDaysRangeDto) => {
  return axiosPrivateInstance.get('/athena/api/v1/nonWorkingDays', {
    params: { to: daysRange.endDate, from: daysRange.startDate },
  })
}

export const nonWorkingDayService = {
  addNonWorkingDay,
  updateNonWorkingDay,
  getNonWorkingDays,
  getNonWorkingDaysRange,
}
