export interface AttendanceSummaryReportDisplayFilterParams {
  clientId?: number | null
  startDate?: string | null
  endDate?: string | null
  clientName?: String | null
  projectId?: number | null
  projectName?: string | null
  billing?: boolean | null
}

export interface AttendanceSummaryDataObject {
  employeeNumber: string
  name: string
  clientName: string
  projectName?: string
  projectRole?: string
  fullDays: number
  halfDays: number
  totalWorkedDays: number
  totalLeaveDays: number
  totalWorkingDays: number
  attendanceSummery: [
    {
      day: any
    },
  ]
}
