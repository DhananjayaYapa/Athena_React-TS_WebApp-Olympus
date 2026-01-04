import { Moment } from 'moment'
export interface AttendanceInfoParams {
  username?: string | null
  teamId?: string | number | null
  startDate?: string | null
  endDate?: string | null
  getTasks?: boolean | null
  clientId?: string | number | null
}

// V2
export interface TimeEntryRawDataDto {
  date: Date | Moment
  location: number
  timeEntryType: number
  startTime: Date | Moment | null
  endTime: Date | Moment | null
  isUpdate: boolean
}

export interface GetAttendanceInfoParamsDto {
  startDate: string
  endDate: string
  username?: string
  teamId?: number
  getTasks?: boolean
}
export interface AddAttendanceInfoDto {
  username: string
  capturedBy: string
  attendance: AddAttendaneInfoObjectDto[]
}

interface AddAttendaneInfoObjectDto {
  attendanceDate: string
  locationId: number
  isUserEmail?: boolean
  isUpdate?: boolean
  attendanceTime: AddAttendaneInfoTimeObjectDto[]
}

export interface AddAttendaneInfoTimeObjectDto {
  inOutFlag: boolean
  attendanceTime: string
}

export interface AttendanceInfoObjectDto {
  attendanceDate: string
  attendanceInfoId?: number | null
  endTime?: string | null
  location?: string | null
  locationId?: number | null
  startTime?: string | null
  username: string
}

export interface IsEditingAttendanceRowDto {
  rowId: number
  attendanceDate: string
  attendanceInfoId?: number | null
  endTime?: string | null
  location?: string | null
  locationId?: number | null
  startTime?: string | null
  username: string
}
