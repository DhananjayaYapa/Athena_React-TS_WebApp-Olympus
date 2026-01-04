export const EXCEL_HEADER_COLORS = {
  ACENTURA_HEADING_COLOUR: 'black',
  ACENTURA_HEADING_FONT_COLOUR: 'FFFFFFFF',
  LEFT_COLUMNS_COLOUR: 'D9D9D9',
  LEFT_COLUMNS_FONT_COLOUR: 'black',
  DATE_HEADINGS_COLOUR: 'black',
  DATE_HEADINGS_FONT_COLOUR: 'FFFFFFFF',
  WEEK_FONT_COLOUR: 'black',
  WEEK_FILL_COLOUR: 'FFFFFF',
  COLOUR_LEGEND_FONT_COLOUR_1: 'ffffff',
  COLOUR_LEGEND_FONT_COLOUR_2: '000000',
}

export const EXCEL_LEAVES_COLORS = {
  LEAVE_COLOUR: 'FABF8F',
  LIEUE_LEAVE_COLOUR: 'FABF8F',
  APPLIED_LEAVE_COLOUR: 'FABF8F',
  APPROVED_LEAVE_COLOUR: 'FABF8F',
  WEEK_END_COLOUR: '808080',
  NONWOKINGDAY_COLOUR: '92CDDC',
  HALF_TIME_MISSING_COLOUR: 'ff0000',
  FULL_TIME_MISSING_COLOUR: 'ff0000',
  TIME_MISSING_COLOUR: 'ff0000',
  DISABLE_DATE_COLOUR: 'C6C6C6',
}

export const EXCEL_HEADINGS = {
  LEAVE: 'Leave',
  LIEUE_LEAVE: 'Lieue Leave',
  APPLIED_LEAVE: 'Applied Leave',
  APPROVED_LEAVE: 'Approved Leave',
  NONWOKINGDAY: 'Non Working Day',
  DISABLE_DATE: 'N/A',
  HALF_TIME_MISSING: 'Half Time Missing',
  FULL_TIME_MISSING: 'Full Time Missing',
  TIME_MISSING: 'Time Missing',
  MAIN_HEADING: 'Acentura-Attendance',
  WEEKEND: 'Weekend',
  WEEK: 'Week',
  IN: 'In',
  OUT: 'Out',
  START_DATE: 'Start Date',
  END_DATE: 'End Date',
  CLIENT: 'Client',
  TEAM: 'Team',
  EMPLOYEE: 'Employee',
}

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const WORKSHEET_COLUMNS = [
  { key: 'id', width: 4 },
  { key: 'joindDate', width: 16, style: { numFmt: 'dd-mmm-yy' } },
  { key: 'tier', width: 12 },
  { key: 'empno', width: 12 },
  { key: '', width: 14 },
  { key: 'name', width: 16 },
]
export const LEAVE_REPORT_WORKSHEET_COLUMNS = [
  { key: 'from', width: 16 },
  { key: 'to', width: 16 },
  { key: 'annual', width: 10 },
  { key: 'casual', width: 10 },
  { key: 'lieu', width: 10 },
  { key: 'no_pay', width: 10 },
  { key: 'special', width: 10 },
  { key: 'remarks', width: 50 },
]
export const EXCEL_DATE_FLAG = {
  DEFAULT: 0,
  WEEKEND: 1,
  FULL_NONWORKINGDAY: 2,
  HALF_NONWORKINGDAY: 3,
  DISABLE_DATE: 4,
}

export const EXCEL_LEAVE_STATUS = {
  DEFAULT: 0,
  FULL_DAY_APPLIED_LEAVE: 1,
  FULL_DAY_APPROVED_LEAVE: 2,
  HALF_DAY_APPLIED_LEAVE: 3,
  HALF_DAY_APPROVED_LEAVE: 4,
  LIEUE_LEAVE: 5,
}

export const EXCEL_COLOR_CODE_FOR_ATTENDANCE_SUMMARY = {
  WEEK_COLOR: 'FCE4D6',
}

export const EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY = {
  EMP: 'Emp ID',
  CLIENT: 'Client',
  EMPLOYEE_NAME: 'Emp Name',
  GRAND_TOTAL: 'Grand Total',
  FULL_DAYS: 'Full Days',
  HALF_DAYS: 'Half Days',
  TOTAL_WORKED_DAYS: 'Total Worked Days',
  TOTAL_LEAVE_DAYS: 'Total leave Days',
  TOTAL_WORKING_DAYS: 'Total Working Days',
}

export const EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY_PROJECT_WISE = {
  EMP: 'Emp ID',
  CLIENT: 'Client',
  PROJECT: 'Project',
  EMPLOYEE_NAME: 'Emp Name',
  PROJECT_ROLE: 'Project Role',
  GRAND_TOTAL: 'Grand Total',
  FULL_DAYS: 'Full Days',
  HALF_DAYS: 'Half Days',
  TOTAL_WORKED_DAYS: 'Total Worked Days',
  TOTAL_LEAVE_DAYS: 'Total leave Days',
  TOTAL_WORKING_DAYS: 'Total Working Days',
}

export const ATTENDANCE_SUMMARY_CONSTANTS = {
  X_SPLIT: 4,
  Y_SPLIT: 7,
  START_COLUMN_NUMBER: 5,
  END_COLUMN_NUMBER: 0,
}
export const ATTENDANCE_SUMMARY_CONSTANTS_PROJECT_WISE = {
  X_SPLIT: 6,
  Y_SPLIT: 8,
  START_COLUMN_NUMBER: 7,
  END_COLUMN_NUMBER: 0,
}

export const COMMON_COLORS = {
  WHITE: 'ffffff',
}

export const LEAVES_COLORS_ATTENDANCE_SUMMARY = {
  MISSING: 'ff0000',
  NON_WORK_DAY: '92CDDC',
  WEEKEND: '808080',
  DISABLED: 'C6C6C6',
}

export const LEAVES_HEADINGS_ATTENDANCE_SUMMARY = {
  MISSING: 'Missing Time',
  NON_WORK_DAY: 'Non Working Day',
  WEEKEND: 'Weekend',
  DISABLED: 'N/A',
}

export const EXCEL_ATTENDANCE_SUMMARY_DATE_FLAG = {
  DEFAULT: 0,
  WEEKEND: 1,
  FULL_NONWORKING_DAY: 2,
  HALF_NONWORKING_DAY: 3,
  DISABLED: 4,
}

export const EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS = {
  DEFAULT: 0,
  FULL_DAY_APPLIED_LEAVE: 1,
  FULL_DAY_APPROVED_LEAVE: 2,
  HALF_DAY_APPLIED_LEAVE: 3,
  HALF_DAY_APPROVED_LEAVE: 4,
}

export const COMMON_USES = {
  FIRST_ROW: 1,
  HEADER_ROW: 7,
  DATA_ROWS_START: 8,
  FIRST_COLUMN: 1,
}

export const COMMON_USES_SUMMERY_PROJECT_WISE = {
  FIRST_ROW: 1,
  HEADER_ROW: 8,
  DATA_ROWS_START: 9,
  FIRST_COLUMN: 1,
}

export const EXCEL_COLUMN_NAMES_FOR_LEAVE_REPORT = {
  NAME: 'Name',
  DATE_OF_APPOINTMENT: 'Date of Appointment',
  DATE_CONFIRMED: 'Date confirmed',
  CURRENT_PROJECT_STATUS: 'Current Project Status',
  DESIGNATION: 'Designation',
  LEAVE_ENTITLEMENT: 'Leave Entitlement',
  LEAVE_TAKEN_UPTO_NOW: 'Leave Taken upto now',
  LEAVE_BALANCE: 'Leave balance',
  FROM: 'From',
  TO: 'To',
}
