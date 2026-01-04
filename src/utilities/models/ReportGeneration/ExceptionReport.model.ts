export interface InitBriefDto {
  id: number
  name: string
}

export interface SbuTeamsDto {
  teamId: number
  teamIsEnabled?: true
  teamName: string
  users?: SbuTeamUsersDto[]
}

export interface SbuTeamUsersDto {
  userId: number
  username: string
  firstName: string
  lastName: string
}
export interface ExceptionFilterFormDto {
  sbu: {
    value: InitBriefDto
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  project: {
    value: InitBriefDto
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  startDate: {
    value: Date | null
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  endDate: {
    value: Date | null
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
    disableFuture?: boolean
  }
}

export interface PostExceptionAttendanceParamsDto {
  sbuId?: number
  projectId?: number
  startDate: string
  endDate: string
}

export interface ExceptionAttendanceReportDto {
  reportId: number
  status: string
  hasReportData: boolean
  createdBy: string
  createdAt: string
  filters: ExceptionAttendanceReportFiltersDto
}

export interface ExceptionAttendanceReportFiltersDto {
  startDate: string
  endDate: string
  projectName: string | null
  clientName: string | null
  sbuName: string | null
}

export interface GetExceptionAttendanceDLParamsDto {
  id: number
}

export interface ExceptionAttendanceResponseDto {
  url: string
  expireTime: number
}
