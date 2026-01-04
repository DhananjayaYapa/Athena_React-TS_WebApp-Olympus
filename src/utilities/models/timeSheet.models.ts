import { TIME_ENTRY_DATE_TYPES, TIME_ENTRY_LEAVE_TYPES } from '../constants'

export interface Task {
  taskId: number
  taskName?: string
  workedHrs: number | null
  comment: string | null
}
export interface TaskTimeSheet {
  date: string
  dateType: TIME_ENTRY_DATE_TYPES // 0 - default, 1 - weekend, 2 - full non working day, 3- half non working day , 4-disabled
  leaveStatus: TIME_ENTRY_LEAVE_TYPES // 0 - default, 1 - full day leave Applied,  2 - full day leave Approved, 3 - half day leave Applied, 4 - half day leave Approved
  taskList: Task[]
}
export interface TimeSheet {
  teamId: number
  teamName: string
  allocationStartDate: string
  allocationEndDate: string
  dayAllocation: TaskTimeSheet[]
}
export interface TimeEntry {
  teamTaskId: number
  date: string
  workedHours: number
  comments?: string
}
export interface TimeEntryRequest {
  username: string
  projects: [
    {
      teamId: number
      timeSheet: TimeEntry[]
    },
  ]
}

export interface TimeSheetRequest {
  to: string
  from: string
  username: string
}

export interface TimeSheetForms {
  date: string
  teamId: number
  tasks: [
    {
      taskId: number
      workedHrs: number
    },
  ]
}

// export interface TimeEntryFormDto {
//   workedHrs: {
//     value: number | null
//     validator: string
//     isRequired: boolean
//     error: string | null
//     disable: boolean
//   }
//   comment: {
//     value: string | null
//     validator: string
//     isRequired: boolean
//     error: string | null
//     disable: boolean
//   }
// }
