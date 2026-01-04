/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Leave {
  leaveId?: number
  username: string
  date: string
  leaveType: number
  isHalfDay: string | boolean
  leaveNote: string
  coWorker: string
  batchId?: string
  leaveStatusId?: number
}

export interface LeaveInfoParams {
  username?: string | null
  startDate?: string | null
  endDate?: string | null
  status?: string | null
}

export interface IsEditingLeaveCountRowDto {
  username: string
  annual?: number | 0
  casual?: number | 0
  lieu?: number | 0
}

export interface LeaveCountMasterDataDto {
  username: string
  leaveCountData: LeaveCountBriefDto[]
}

export interface LeaveCountBriefDto {
  entitledLeaveCount: number
  leaveCountId: number
  leaveType: string
  leaveTypeId: number
}

export interface AddLeaveCountDto {
  username: string
  leaveCountData: AddLeaveCountBriefDto[]
}

export interface AddLeaveCountBriefDto {
  leaveTypeId: number
  leaveCount: number | string
}

// V2 migrated
export interface GetLeaveListParamsDto {
  username?: string
  from?: string
  to?: string
  typeId?: number
  statusId?: number
  createdBy?: string
}

export interface UpdateLeaveDto {
  leaveId: number
  date?: string
  username?: string
  leaveType?: number
  isHalfDay?: boolean
  leaveNote?: string
  coWorker?: string
  leaveStatusId?: number
  rejectionNote?: string
}

export interface LeaveTypeDto {
  id: number
  type: string
}
export interface LeaveStatusDto {
  id: number
  status: string
}

export interface LeaveListItemDto {
  coWorker: string
  createdAt: string
  createdBy: string
  date: string
  isHalfDay: number
  leaveId: number
  leaveNote: string
  leaveStatus: string
  leaveStatusId: number
  leaveType: string
  leaveTypeId: number
  username: string
  firstName: string
  lastName: string
  modifiedAt?: string
  modifiedBy?: string
  rejectionNote?: string
}

export interface LeaveFiltersFormDto {
  from: {
    value: Date | null
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  to: {
    value: Date | null
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  username: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  status: {
    value: LeaveStatusDto
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  type: {
    value: LeaveTypeDto
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

export interface LeaveRejectReasonFormDto {
  reason: {
    value: string
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
}

export interface LeaveCountDataObjectDto {
  username: string
  annual: number
  casual: number
  lieu: number
}

export interface UpdateLeaveCountDto {
  username: string
  leaveCountData: UpdateLeaveCountBriefDto[]
}

export interface UpdateLeaveCountBriefDto {
  leaveCountId: number
  leaveCount: number | string
}

export interface LeaveCountDataDto {
  leaveCount: number
  leaveCountId: number
}

export interface LeaveCountSummaryDto {
  appliedLeave: LeaveCountSummaryBriefDto[] | null
  approveLeave: LeaveCountSummaryBriefDto[] | null
  availableLeave: LeaveCountSummaryBriefDto[] | null
  username: string
}

export interface LeaveCountSummaryBriefDto {
  leaveCount: number
  leaveType: string
  leaveTypeId: number
}

export interface SelectedLeaveCountSummaryDto {
  applied: number
  approved: number
  available: number
}

export interface WithdrawLeaveDto {
  username: string
  leaveId: number
  date: string
  leaveStatusId: number
}

export interface AddLeaveDto {
  username: string
  date: string
  leaveType: number
  isHalfDay: boolean
  leaveNote: string
  coWorker: string
}

export interface PointPersonSelectDto {
  username: string
  inputValue?: string
}

export interface MakingLeaveInsertFormDto {
  username: { value: string; validator: string; isRequired: boolean; error: any; disable: boolean }
  coWorker: { value: string; validator: string; isRequired: boolean; error: any; disable: boolean }
  leaveType: { value: number; validator: string; isRequired: boolean; error: any; disable: boolean }
  isHalfDay: { value: string; validator: string; isRequired: boolean; error: any; disable: boolean }
  leaveDate: { value: Date; validator: string; isRequired: boolean; error: any; disable: boolean }
  leaveEndDate: {
    value: Date
    validator: string
    isRequired: boolean
    error: any
    disable: boolean
  }
  leaveNote: { value: string; validator: string; isRequired: boolean; error: any; disable: boolean }
}

export interface UserLeaveInfoDto {
  username: string
  firstName: string
  lastName: string
  from: string
  to: string
  daysCount: number
  leaveNote: string
  leaveStatus: string
  leaveStatusId: number
  leaveType: string
  leaveTypeId: number
  coWorker: string
}

export interface UserLeaveStatusUpdateDto {
  token: string | null
  leaveStatusId: number
  rejectionNote?: string
  modifiedBy?: string
}

export interface PointPersonDto {
  userId: number
  username: string
}
export interface PointPersonParamsDto {
  username: string
}
