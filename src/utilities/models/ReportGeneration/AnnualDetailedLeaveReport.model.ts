export interface AnnualDetailedLeaveReportFilterParams {
  username: string | null
  year: Date | string | null
}

export interface AnnualDetailedLeavesDto {
  userId: number
  employeeNumber: String
  name: string
  designation: string
  tier: string
  joinDate: Date
  confirmationDate: Date
  designationEffectiveDate: Date
  project: string
  leaves: LeavesCountDto[]
}

export interface LeavesCountDto {
  from: Date
  to: Date
  leaveTypeId: number
  leaveCount: number
}
