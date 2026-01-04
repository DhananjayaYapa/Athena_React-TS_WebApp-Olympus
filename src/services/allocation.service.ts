import type { AxiosPromise } from 'axios'
import type { AllocationDto, ApiResponseDto, GetAllocationsParamsDto } from '../utilities/models'
import { axiosPrivateInstance } from './index'

const getAllocations = (
  params?: GetAllocationsParamsDto
): AxiosPromise<ApiResponseDto<AllocationDto[]>> => {
  return axiosPrivateInstance.get(`/hera/api/v1/allocations`, { params: params })
}

export const allocationService = {
  getAllocations,
}
