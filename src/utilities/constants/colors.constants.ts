export const TIME_ENTRY_COLORS = {
  FULL_DAY: '#bfb5ff', // Full day leave (applied/approved)
  HALF_DAY: '#ffebd0', // Half day leave (applied/approved)
  HOLIDAY: 'rgba(255, 206, 159, 1)', // Holiday
  WEEKEND: '#dbeeff', // Weekend day
  DISABLED: '#7c7c7cff', // Disabled cell
  FUTURE_DATE: '#E0DEDE', // Future date
  DEFAULT: 'transparent', // Default

  ERROR: 'rgba(255, 0, 20, 0.8)', // > 24 hrs
  EMPTY: 'rgba(251, 155, 148, 1)', // <= 0 hrs
  WARNING: 'rgb(255, 230, 124)', // under target
  SUCCESS: 'rgba(0, 255, 0, 0.3)', // valid
}

export const legends = [
  { color: TIME_ENTRY_COLORS.FULL_DAY, label: 'Full day Leave' },
  { color: TIME_ENTRY_COLORS.HALF_DAY, label: 'Half day Leave' },
  { color: TIME_ENTRY_COLORS.HOLIDAY, label: 'Mercantile Holiday' },
  { color: TIME_ENTRY_COLORS.WEEKEND, label: 'Weekend' },
  { color: TIME_ENTRY_COLORS.FUTURE_DATE, label: 'Future Date' },
  { color: TIME_ENTRY_COLORS.DISABLED, label: 'Deallocation' },
]
