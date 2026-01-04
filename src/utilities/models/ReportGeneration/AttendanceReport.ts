export interface AttendanceReportDto {
  employeeId: string
  username: string
  firstName: string
  lastName: string
  attendanceInfo: AttendanceInfoDto[]
}

export interface AttendanceInfoDto {
  attendanceInfoId: number
  date: string
  startTime: string
  endTime: string
}

export interface TableRowAttendance {
  employeeId: string
  username: string
  firstName: string
  lastName: string
  attendanceInfoId: number
  date: string
  startTime: string
  endTime: string
}
