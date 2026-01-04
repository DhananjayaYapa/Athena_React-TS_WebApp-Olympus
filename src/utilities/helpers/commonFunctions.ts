import moment, { Moment } from 'moment'
import { TIME_ENTRY_COLORS, TIME_ENTRY_DATE_TYPES, TIME_ENTRY_LEAVE_TYPES } from '../constants'

interface WeekDay {
  month: string // e.g., "Aug"
  date: number // e.g., 14
  day: string // e.g., "Thu"
}

export const isCellDisabled = (
  allocationEnd: string,
  allocationStart: string,
  selectedDate: string
) => {
  let isDisabled = false
  if (!(selectedDate >= allocationStart && selectedDate <= allocationEnd)) {
    isDisabled = true
  } else if (selectedDate >= moment().add(1, 'day').format('YYYY-MM-DD')) {
    isDisabled = true
  }
  // else if (selectedDate < moment().subtract(5, 'day').format('YYYY-MM-DD')) {
  //   isDisabled = true
  // }
  return isDisabled
}

export const isFutureAllocatedDate = (
  allocationEnd: string,
  allocationStart: string,
  selectedDate: string
) => {
  // Check if the date is within allocation range AND is a future date
  return (
    selectedDate >= allocationStart &&
    selectedDate <= allocationEnd &&
    selectedDate >= moment().add(1, 'day').format('YYYY-MM-DD') &&
    isCellDisabled(allocationEnd, allocationStart, selectedDate)
  )
}

export const getWeekRangeForDate = (date: string | Date | Moment) => {
  const givenDate: Moment = moment(date)
  const startOfWeek = givenDate.startOf('isoWeek').format('YYYY-MM-DD') // Monday start
  const endOfWeek = givenDate.endOf('isoWeek').format('YYYY-MM-DD') // Sunday end

  return { startOfWeek, endOfWeek }
}

export const getWeekDaysForDate = (date: string | Date | Moment): WeekDay[] => {
  const givenDate: Moment = moment(date)
  const startOfWeek = givenDate.startOf('isoWeek') // Monday start
  const days: WeekDay[] = []

  for (let i = 0; i < 7; i++) {
    const dayMoment = startOfWeek.clone().add(i, 'days')
    days.push({
      month: dayMoment.format('MMM'),
      date: dayMoment.date(),
      day: dayMoment.format('ddd'),
    })
  }

  return days
}

export function getWeekDaysMondayToSunday(baseDate: Date) {
  const startOfWeek = moment(baseDate).startOf('isoWeek') // Monday start
  const days = []

  for (let i = 0; i < 7; i++) {
    const d = startOfWeek.clone().add(i, 'days')
    days.push({
      day: d.format('ddd'),
      date: d.date(),
      month: d.format('MMM'),
      fullDate: d.format('YYYY-MM-DD'),
    })
  }
  return days
}

export function getMondayToSundayRange(baseDate: Date) {
  const start = moment(baseDate).startOf('isoWeek') // Monday
  const end = moment(baseDate).endOf('isoWeek') // Sunday
  return {
    startOfWeek: start.format('YYYY-MM-DD'),
    endOfWeek: end.format('YYYY-MM-DD'),
  }
}

export const getColumnColor = (
  leaveStatus?: TIME_ENTRY_LEAVE_TYPES,
  dateType?: TIME_ENTRY_DATE_TYPES,
  disabled?: boolean,
  isFutureAllocated?: boolean
): string => {
  // Show future allocated dates with a different color even if they are disabled
  if (isFutureAllocated) return TIME_ENTRY_COLORS.FUTURE_DATE

  if (disabled) return TIME_ENTRY_COLORS.DISABLED

  switch (leaveStatus) {
    case TIME_ENTRY_LEAVE_TYPES.FULL_DAY_APPROVED:
    case TIME_ENTRY_LEAVE_TYPES.FULL_DAY_APPLIED:
      return TIME_ENTRY_COLORS.FULL_DAY
    case TIME_ENTRY_LEAVE_TYPES.HALF_DAY_APPROVED:
    case TIME_ENTRY_LEAVE_TYPES.HALF_DAY_APPLIED:
      return TIME_ENTRY_COLORS.HALF_DAY
  }

  switch (dateType) {
    case TIME_ENTRY_DATE_TYPES.FULL_NON_WORKING:
      return TIME_ENTRY_COLORS.HOLIDAY
    case TIME_ENTRY_DATE_TYPES.WEEKEND:
      return TIME_ENTRY_COLORS.WEEKEND
    case TIME_ENTRY_DATE_TYPES.DISABLED:
      return TIME_ENTRY_COLORS.DISABLED
    default:
      return TIME_ENTRY_COLORS.DEFAULT
  }
}

export const getBackgroundColor = (
  date: string,
  total: number,
  leaveStatus: TIME_ENTRY_LEAVE_TYPES
): string => {
  const today = moment()
  const maxDate = today.clone().add(1, 'day').format('YYYY-MM-DD')
  const isAfterMax = date >= maxDate
  const inRange = !isAfterMax

  if (!inRange) return TIME_ENTRY_COLORS.DISABLED

  if (total > 24) return TIME_ENTRY_COLORS.ERROR
  if (total <= 0) return TIME_ENTRY_COLORS.EMPTY

  const isFullDayLeave =
    leaveStatus === TIME_ENTRY_LEAVE_TYPES.DEFAULT ||
    leaveStatus === TIME_ENTRY_LEAVE_TYPES.FULL_DAY_APPLIED ||
    leaveStatus === TIME_ENTRY_LEAVE_TYPES.FULL_DAY_APPROVED

  const isHalfDayLeave =
    leaveStatus === TIME_ENTRY_LEAVE_TYPES.HALF_DAY_APPLIED ||
    leaveStatus === TIME_ENTRY_LEAVE_TYPES.HALF_DAY_APPROVED

  if ((isFullDayLeave && total < 8) || (isHalfDayLeave && total < 4)) {
    return TIME_ENTRY_COLORS.WARNING
  }

  return TIME_ENTRY_COLORS.SUCCESS
}
