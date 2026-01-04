import type { LeaveTypeDto, LeaveStatusDto, UserRolesDto } from '../models'

export const LEAVE_TYPE_LIST: LeaveTypeDto[] = [
  { id: 1, type: 'Annual Leave' },
  { id: 2, type: 'Lieu Leave' },
  { id: 3, type: 'Casual Leave' },
  { id: 4, type: 'Special Leave' },
  { id: 5, type: 'Approved No pay Leave' },
  { id: 6, type: 'Non Approved No pay Leave' },
]
export const SPECIAL_LEAVE_TYPES = [4, 5, 6] //special, approved, non approved no pay leaves ids

export const LEAVE_STATUS_LIST: LeaveStatusDto[] = [
  { id: 1, status: 'Applied' },
  { id: 2, status: 'Approved' },
  { id: 3, status: 'Rejected' },
  { id: 4, status: 'Disabled' },
]

export const USER_ROLE_LIST: UserRolesDto[] = [
  { id: 1, role: 'Super Admin' },
  { id: 5, role: 'HR Personnel' },
  { id: 6, role: 'Internal Supervisor' },
  { id: 4, role: 'Employee' },
]
