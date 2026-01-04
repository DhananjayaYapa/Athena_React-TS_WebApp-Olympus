export interface AllocationStateDto {
  allocations: {
    isLoading: boolean
    data: AllocationDto[]
    error: string | null
  }
}

export interface GetAllocationsParamsDto {
  requestedDate?: string
  username?: string
  getDeallocatedTeams?: boolean
  sbuId?: number
  clientId?: number
  projectId?: number
  projectRoleId?: number
  isBillable?: boolean
  getOnAndBefore?: boolean
  type?: string
  getDisabled?: boolean
}

export interface AllocationDto {
  userId: number
  empId: number
  userName: string
  employeeName: string
  designation: string
  designationDisplayName: string
  isEnable: boolean
  isRequestResign: boolean
  projectList: AllocationProjectsDetailDto[]
}

export interface AllocationProjectsDto {
  allocationId: number
  projectId: number
  projectName: string
  isDefault: boolean
  projectRoleId: number
  projectStartDate: string
  projectEndDate: string
}

export interface AllocationProjectsDetailDto {
  allocationId: number
  allocationPercentage: number
  billingEndDate: string
  billingStartDate: string
  client: string
  clientId: number
  clientIsEnabled: boolean
  isAllocate: boolean
  isBillable: boolean
  isConfirmed: boolean
  isDefault: boolean
  projectEndDate: string
  projectId: number
  projectName: string
  projectRelId: number
  projectRoleDisplayName: string
  projectRoleId: number
  projectRoleName: string
  projectStartDate: string
  sbu: string
  sbuId: number
  sbuIsEnabled: boolean
  teamIsEnabled: boolean
}
