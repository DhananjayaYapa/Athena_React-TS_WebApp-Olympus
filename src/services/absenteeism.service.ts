import { axiosPrivateInstance } from './index'
import type { AbsentInfoParams } from '../utilities/models'

//get absenteeism details
const getAbsenteeismDetails = (params: AbsentInfoParams) => {
  const absentDetail1 = axiosPrivateInstance.get(`/athena/api/v1/reports/absenteeism`, {
    params: params,
  })
  return absentDetail1
}

export const absenteeismService = {
  getAbsenteeismDetails,
}
