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
export interface TimeEntryFilterFormDto {
  sbu: {
    value: InitBriefDto
    validator: string
    isRequired: boolean
    error: string | null
    disable: boolean
  }
  user: {
    value: InitBriefDto[]
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

export interface PostTimeEntryParamsDto {
  sbuId?: number
  employee?: string[]
  startDate: string
  endDate: string
}

export interface TimeEntryReportDto {
  reportId: number
  status: string
  hasReportData: boolean
  createdBy: string
  createdAt: string
  filters: TimeEntryReportFiltersDto
}

export interface TimeEntryReportFiltersDto {
  startDate: string
  endDate: string
  projectName: string | null
  employee: string | null
  sbuName: string | null
}

export interface GetTimeEnrtyReportDLParamsDto {
  id: number
}

export interface TimeEntryResponseDto {
  url: string
  expireTime: number
}

export interface DownloadReportParamsDto {
  id: number
}

export interface DownloadReportResponseDto {
  url: string
  expireTime: number
}
