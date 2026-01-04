export interface NonWorkingDay {
  nonWorkingDayId?: number
  date: Date
  holidayDesc: string
  isEnabled: any
  isHalfDay: boolean
}

export interface NonWorkingDayPayload {
  nonWorkingDayId?: number
  date: string
  holidayDesc: string
  isEnabled: boolean
  isHalfDay: boolean
}

export interface GetNonworkingDaysRangeDto {
  startDate: string
  endDate: string
}
