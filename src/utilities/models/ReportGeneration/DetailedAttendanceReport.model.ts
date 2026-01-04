export interface DetailedAttendanceReportFilterParams {
  username: string | null
  teamId?: string | null
  clientId?: string | null
  startDate?: string | null
  endDate?: string | null
  getDisabled?: boolean | null
}

export interface DetailedAttendanceReportDisplayFilterParams {
  username: string | null
  teamName?: string | null
  clientName?: string | null
  startDate?: string | null
  endDate?: string | null
}

export interface ResetKeys {
  employee?: string
  team?: string
  client?: string
}
