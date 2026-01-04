export interface AbsentInfoParams {
  username: string | null
  teamId?: string | null
  clientId?: string | null
  startDate?: string | null
  endDate?: string | null
}

export interface AbsenteeismEmployee {
  employeeId: string
  firstName: string
  lastName: string
  username: string
  absentDates: { date: string }[]
}
