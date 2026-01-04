import { Alert, Button, CircularProgress, Grid } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getWeekRangeForDate } from '../../utilities/helpers/commonFunctions'
import { AppAuthorizer } from '../../components'
import { AppLayout } from '../../templates'
import moment from 'moment'
import {
  APP_FEATURE_KEYS,
  TIME_ENTRY_DATE_TYPES,
  TIME_ENTRY_LEAVE_TYPES,
} from '../../utilities/constants'
import TimeSheetForm from '../../components/time-sheet-management/TimeSheetForm'
import { timeSheetActions } from '../../redux/actions'
import styles from './AddTimeSheet.module.scss'
import {
  AppStateDto,
  TimeSheet,
  TimeSheetRequest,
  TimeEntryRequest,
  TaskTimeSheet,
  Task,
  TimeEntry,
  // TimeEntryFormDto,
} from '../../utilities/models'
import TimeEntryChangePopup, {
  SavePayload,
} from '../../components/time-sheet-management/TimeEntryChangePopup'

const AddTimeSheet = () => {
  const dispatch = useDispatch()

  // get from local storage
  const activeUserRole = useSelector((state: AppStateDto) => state.auth.activeUserRole)
  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)

  const timeSheet = useSelector((state: AppStateDto) => state.timeSheet.timeSheet.data?.data?.data)
  const getTimeSheetResponse = useSelector((state: AppStateDto) => state.timeSheet.timeSheet)
  const updateTimeSheetResponse = useSelector(
    (state: AppStateDto) => state.timeSheet.updateTimeSheet
  )
  const [timeSheetForm, setTimeSheetForm] = useState<TimeSheet[]>([])
  const [timeSheetFormUpdated, setTimeSheetFormUpdated] = useState<TimeSheet[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedDateRange, setSelectedDateRange] = useState<TimeSheetRequest | null>(null)
  const [mergedTasks, setMergedTasks] = useState<Task[]>([])
  const [maxHoursExceedError, setMaxHoursExceedError] = useState<boolean>(false)
  // const [summaryTotalHrs, setSummaryTotalHrs] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  //COMMENT
  const [isTimeEntryOpen, setIsTimeEntryOpen] = useState(false)
  const [tempTeamId, setTempTeamId] = useState<number | null>(null)
  const [tempDate, setTempDate] = useState<string | null>(null)
  const [tempTaskId, setTempTaskId] = useState<number | null>(null)
  const [tempTaskName, setTempTaskName] = useState<string | null>(null)
  const [tempWorkedHrs, setTempWorkedHrs] = useState<number | null>(null)
  const [tempComments, setTempComments] = useState<string | null>(null)
  const [currentSelectedDate] = useState<Date | null>(new Date())
  // const INITIAL_TIME_ENTRY_STATE: TimeEntryFormDto = {
  //   workedHrs: {
  //     value: null,
  //     validator: '',
  //     isRequired: true,
  //     error: null,
  //     disable: false
  //   },
  //   comment: {
  //     value: null,
  //     validator: '',
  //     isRequired: false,
  //     error: null,
  //     disable: false
  //   }
  // }
  // const [timeEntryRow, setTimeEntryRow] = useState(INITIAL_TIME_ENTRY_STATE)

  React.useEffect(() => {
    if (selectedDate) {
      const params: TimeSheetRequest = {
        to: getWeekRangeForDate(selectedDate).endOfWeek,
        from: getWeekRangeForDate(selectedDate).startOfWeek,
        username: authorizedUser?.data?.username,
      }
      setSelectedDateRange(params)
      dispatch(timeSheetActions.getTimeSheet(params))
    }
  }, [])

  React.useEffect(() => {
    if (timeSheet && timeSheet.length > 0) {
      const editableCopy = timeSheet?.map((team: TimeSheet) => ({
        ...team,
        dayAllocation: team.dayAllocation.map((day: TaskTimeSheet) => ({
          ...day,
          taskList: day.taskList.map((task: Task) => ({
            ...task,
          })),
        })),
      }))
      setTimeSheetForm(editableCopy)
    } else {
      setTimeSheetForm([])
    }
  }, [timeSheet])

  React.useEffect(() => {
    if (selectedDate) {
      const params: TimeSheetRequest = {
        to: getWeekRangeForDate(selectedDate).endOfWeek,
        from: getWeekRangeForDate(selectedDate).startOfWeek,
        username: authorizedUser?.data?.username,
      }
      setSelectedDateRange(params)
      dispatch(timeSheetActions.getTimeSheet(params))
    }

    return () => {
      setMergedTasks([])
    }
  }, [selectedDate])

  React.useEffect(() => {
    if (updateTimeSheetResponse?.response && selectedDateRange) {
      setTimeout(() => {
        dispatch(timeSheetActions.clearUpdateTimeSheet())
        if (updateTimeSheetResponse?.severity === 'success') {
          dispatch(timeSheetActions.getTimeSheet(selectedDateRange))
          setTimeSheetFormUpdated([])
        }
      }, 4000) //from 5000
    }

    return () => {
      setMergedTasks([])
    }
  }, [updateTimeSheetResponse])

  const handleWorkedHoursChange = (
    teamId: number,
    date: string,
    taskId: number,
    newHours: number,
    newComment?: string | null
  ) => {
    setTempWorkedHrs(newHours)
    setTimeSheetForm((prev) =>
      prev.map((team) =>
        team.teamId === teamId
          ? {
              ...team,
              dayAllocation: team?.dayAllocation.map((day) => {
                if (day.date === date) {
                  const taskExists = day?.taskList.some((t) => t.taskId === taskId)
                  const updatedTaskList = taskExists
                    ? day?.taskList?.map((task) =>
                        task.taskId === taskId
                          ? { ...task, comment: newComment ?? null, workedHrs: newHours }
                          : task
                      )
                    : [
                        ...day.taskList,
                        { taskId, comment: newComment ?? null, workedHrs: newHours },
                      ]

                  return { ...day, taskList: updatedTaskList }
                }
                return day
              }),
            }
          : team
      )
    )
    setTimeSheetFormUpdated((prev) => {
      const teamExists = prev.some((team) => team.teamId === teamId)

      if (teamExists) {
        return prev.map((team) => {
          if (team.teamId === teamId) {
            const dayExists = team.dayAllocation.some((day) => day.date === date)

            if (dayExists) {
              return {
                ...team,
                dayAllocation: team.dayAllocation.map((day) => {
                  if (day.date === date) {
                    const taskExists = day.taskList.some((t) => t.taskId === taskId)
                    const updatedTaskList = taskExists
                      ? day.taskList.map((task) =>
                          task.taskId === taskId
                            ? { ...task, comment: newComment ?? null, workedHrs: newHours }
                            : task
                        )
                      : [
                          ...day.taskList,
                          { taskId, comment: newComment ?? null, workedHrs: newHours },
                        ]

                    return { ...day, taskList: updatedTaskList }
                  }
                  return day
                }),
              }
            } else {
              // Day does not exist, add it
              return {
                ...team,
                dayAllocation: [
                  ...team.dayAllocation,
                  {
                    date,
                    dateType: TIME_ENTRY_DATE_TYPES.DEFAULT,
                    leaveStatus: TIME_ENTRY_LEAVE_TYPES.DEFAULT,
                    taskList: [{ taskId, comment: newComment ?? null, workedHrs: newHours }],
                  },
                ],
              }
            }
          }
          return team
        })
      } else {
        // Team does not exist, add it
        return [
          ...prev,
          {
            teamId,
            teamName: '',
            allocationStartDate: '',
            allocationEndDate: '',
            dayAllocation: [
              {
                date,
                dateType: TIME_ENTRY_DATE_TYPES.DEFAULT,
                leaveStatus: TIME_ENTRY_LEAVE_TYPES.DEFAULT,
                taskList: [{ taskId, comment: newComment ?? null, workedHrs: newHours }],
              },
            ],
          },
        ]
      }
    })
  }

  const handleTimeEntryChange = (
    teamId: number,
    date: string,
    taskId: number,
    workedHrs: number | null | undefined,
    comments: string | null | undefined
  ) => {
    setTempTeamId(teamId)
    setTempDate(date)
    setTempTaskId(taskId)

    // Find the task name from the timeSheetForm
    const team = timeSheetForm.find((t) => t.teamId === teamId)
    const day = team?.dayAllocation.find((d) => d.date === date)
    const task = day?.taskList.find((task) => task.taskId === taskId)
    setTempTaskName(task?.taskName || null)

    if (workedHrs) {
      setTempWorkedHrs(workedHrs)
    }
    if (comments) {
      setTempComments(comments)
    }
    setIsTimeEntryOpen(true)
  }

  const onSaveTimeSheet = (isExceed: boolean) => {
    if (isExceed === false) {
      const result: TimeEntryRequest = {
        username: authorizedUser?.data?.username,
        projects: timeSheetFormUpdated
          ?.map((team) => {
            const timeSheet = team.dayAllocation.flatMap((day) =>
              day.taskList
                .filter((task) => task.workedHrs !== null)
                .map((task) => ({
                  teamTaskId: task.taskId,
                  date: day.date,
                  workedHours: task.workedHrs as number,
                  comment: task.comment ?? undefined,
                }))
            )

            return {
              teamId: team.teamId,
              timeSheet,
            }
          })
          .filter((project) => project.timeSheet.length > 0) as unknown as [
          {
            teamId: number
            timeSheet: TimeEntry[]
          },
        ], // remove empty projects
      }

      dispatch(timeSheetActions.updateTimeSheet(result))
    }
  }

  const handleOnNextWeek = () => {
    if (selectedDate) {
      const endOfWeekMoment = moment(getWeekRangeForDate(selectedDate).endOfWeek, 'YYYY-MM-DD')

      const nextDay = endOfWeekMoment.clone().add(1, 'day')

      const newSelectedDate = nextDay.toDate()
      setSelectedDate(newSelectedDate)
      const params: TimeSheetRequest = {
        to: getWeekRangeForDate(newSelectedDate).endOfWeek,
        from: getWeekRangeForDate(newSelectedDate).startOfWeek,
        username: authorizedUser?.data?.username,
      }
      setSelectedDateRange(params)
      dispatch(timeSheetActions.getTimeSheet(params))
    }
  }

  const handleOnPreviousWeek = () => {
    if (selectedDate) {
      const endOfWeekMoment = moment(getWeekRangeForDate(selectedDate).startOfWeek, 'YYYY-MM-DD')
      const nextDay = endOfWeekMoment.clone().subtract(1, 'day')
      const newSelectedDate = nextDay.toDate()
      setSelectedDate(newSelectedDate)
      const params: TimeSheetRequest = {
        to: getWeekRangeForDate(newSelectedDate).endOfWeek,
        from: getWeekRangeForDate(newSelectedDate).startOfWeek,
        username: authorizedUser?.data?.username,
      }
      setSelectedDateRange(params)
      dispatch(timeSheetActions.getTimeSheet(params))
    }
  }

  const onReset = () => {
    if (selectedDateRange && currentSelectedDate) {
      const endOfWeekMoment = moment(
        getWeekRangeForDate(currentSelectedDate).startOfWeek,
        'YYYY-MM-DD'
      )
      const currentNewSelectedDate = endOfWeekMoment.toDate()
      setSelectedDate(currentNewSelectedDate)

      const selectedCurrentDateRange: TimeSheetRequest = {
        to: getWeekRangeForDate(currentNewSelectedDate).endOfWeek,
        from: getWeekRangeForDate(currentNewSelectedDate).startOfWeek,
        username: authorizedUser?.data?.username,
      }
      setSelectedDateRange(selectedCurrentDateRange)

      setMergedTasks([])
      setIsRefreshing(true)
      dispatch(timeSheetActions.getTimeSheet(selectedCurrentDateRange))
      // Keep loading state for additional time after API call
      setMaxHoursExceedError(false)
      setTimeout(() => {
        setIsRefreshing(false)
      }, 1500)
    }
  }

  const onCloseErrorAlert = () => {
    dispatch(timeSheetActions.clearUpdateTimeSheet())
  }

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newMerged: any[] = []

    timeSheetForm.forEach((timeSheet) => {
      timeSheet.dayAllocation.forEach((day) => {
        const existing = newMerged.find((item) => item.date === day.date)
        if (existing) {
          existing.taskList = [...existing.taskList, ...day.taskList]
          existing.workedHrs = existing.taskList.reduce(
            (sum: number, task: Task) => sum + (task.workedHrs ?? 0),
            0
          )
        } else {
          newMerged.push({
            date: day.date,
            dateType: day.dateType,
            taskList: [...day.taskList],
            workedHrs: day.taskList.reduce((sum, task) => sum + (task.workedHrs ?? 0), 0),
          })
        }
      })
    })

    setMergedTasks(newMerged)
  }, [timeSheetForm])

  const onSubmit = () => {
    const exceeded = mergedTasks.some((day) => (day.workedHrs ?? 0) > 24)

    setMaxHoursExceedError(exceeded)
    onSaveTimeSheet(exceeded)
  }

  const onCloseMaxHoursExceedError = () => {
    setMaxHoursExceedError(false)
  }

  const handleTimeEntryCancel = () => {
    setIsTimeEntryOpen(false)
    setTempTeamId(null)
    setTempDate(null)
    setTempTaskId(null)
    setTempTaskName(null)
    setTempWorkedHrs(null)
    setTempComments(null)
  }

  const handleTempWorkedHrs = (workedHrs: number) => {
    setTempWorkedHrs(workedHrs)
  }

  const handleTempComments = (comment: string) => {
    setTempComments(comment)
  }

  const saveTimeEntryChange = ({ workedHrs, comments }: SavePayload): void => {
    if (tempTeamId == null || tempTaskId == null || !tempDate) return
    const normalizedComment = (comments ?? '').trim()
    handleWorkedHoursChange(tempTeamId, tempDate, tempTaskId, workedHrs, normalizedComment)
    setIsTimeEntryOpen(false)
    setTempWorkedHrs(null)
    setTempComments('')
  }
  return (
    <React.Fragment>
      <AppLayout breadcrumb="Manage Time Entries" componentTitle="Manage Time Entries">
        <Grid container spacing={1} pl={2}>
          <Grid size={{ sm: 12, md: 12, lg: 12 }}>
            <h3>Enter Time Entries</h3>
            <p>Log time for the tasks, based on the Project/s that you are allocated.</p>
          </Grid>
        </Grid>
        <AppAuthorizer
          activeRoleFeatures={activeUserRole.data.features}
          authorizedFeatureKey={[APP_FEATURE_KEYS.UPDATE_OWN_TIME_SHEET]}
        >
          <Grid container spacing={1} pl={2}>
            {(updateTimeSheetResponse?.response || getTimeSheetResponse?.data?.message) && (
              <Grid size={{ md: 12 }}>
                <Alert
                  className="mb-m"
                  onClose={onCloseErrorAlert}
                  severity={
                    updateTimeSheetResponse?.severity || getTimeSheetResponse?.severity || 'error'
                  }
                >
                  {updateTimeSheetResponse?.response?.message ||
                    getTimeSheetResponse?.data?.message}
                </Alert>
              </Grid>
            )}
            <Grid size={{ md: 12 }} style={{ position: 'relative' }}>
              {(getTimeSheetResponse?.isLoading || isRefreshing) && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    padding: '10px',
                    borderRadius: '4px',
                  }}
                >
                  <CircularProgress size={36} />
                </div>
              )}
              <TimeSheetForm
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                handleOnPreviousWeek={handleOnPreviousWeek}
                handleOnNextWeek={handleOnNextWeek}
                timeSheet={timeSheetForm}
                handleOnRefresh={onReset}
                isTimeExceeded={maxHoursExceedError}
                onCloseMaxHoursExceedError={onCloseMaxHoursExceedError}
                handleTimeEntryChange={handleTimeEntryChange}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 12 }}
              justifyContent="end"
              display="flex"
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '1rem',
                width: '100%',
              }}
            >
              <Button
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '1rem',
                  marginRight: '1rem',
                }}
                color="primary"
                variant="outlined"
                // className={styles.tableAction}
                // disabled={(!!props.isEditingRow.rowId && props.isEditingRow.rowId.value !== record.rowId) || props.isAttendnaceSubmitting}
                onClick={() => onReset()}
              >
                Reset
              </Button>
              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[APP_FEATURE_KEYS.UPDATE_OWN_TIME_SHEET]}
              >
                <Button
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '1rem',
                  }}
                  color="primary"
                  variant="contained"
                  // className={styles.tableAction}
                  disabled={
                    getTimeSheetResponse.isLoading ||
                    updateTimeSheetResponse.isLoading ||
                    getTimeSheetResponse?.data?.length <= 0 ||
                    timeSheetFormUpdated?.length <= 0
                  }
                  onClick={() => onSubmit()}
                >
                  {updateTimeSheetResponse.isLoading && (
                    <CircularProgress size="13px" className={styles.loading} />
                  )}
                  Save Time Entries
                </Button>

                <TimeEntryChangePopup
                  timeEntryOpen={isTimeEntryOpen}
                  taskDate={tempDate}
                  teamId={tempTeamId}
                  taskId={tempTaskId}
                  taskName={tempTaskName}
                  workedHrs={tempWorkedHrs}
                  taskComments={tempComments}
                  handleTempWorkedHrs={handleTempWorkedHrs}
                  handleTempComments={handleTempComments}
                  saveTimeEntryChange={saveTimeEntryChange}
                  handleTimeEntryCancel={handleTimeEntryCancel}
                />
              </AppAuthorizer>
            </Grid>
          </Grid>
        </AppAuthorizer>
      </AppLayout>
    </React.Fragment>
  )
}

export default AddTimeSheet
