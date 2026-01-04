import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Popper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material'
import React, { useRef } from 'react'
import { StyledTableBoldCell, StyledTableCell, StyledTableRow } from '../../assets/theme/theme'
import { Task, TaskTimeSheet, TimeSheet } from '../../utilities/models'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import {
  getBackgroundColor,
  getColumnColor,
  getMondayToSundayRange,
  getWeekDaysMondayToSunday,
  getWeekRangeForDate,
  isCellDisabled,
  isFutureAllocatedDate,
} from '../../utilities/helpers/commonFunctions'
import {
  ArrowLeft,
  ArrowRight,
  CalendarToday,
  InfoOutlined,
  RefreshOutlined,
} from '@mui/icons-material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers'
import moment from 'moment'
import { Box, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import {
  legends,
  TIME_ENTRY_COLORS,
  TIME_ENTRY_DATE_TYPES,
  TIME_ENTRY_LEAVE_TYPES,
} from '../../utilities/constants'

const TimeSheetForm: React.FC<{
  selectedDate: Date | null
  setSelectedDate: (value: Date | null) => void
  handleOnPreviousWeek: () => void
  handleOnNextWeek: () => void
  timeSheet: TimeSheet[]
  handleOnRefresh: () => void
  isTimeExceeded: boolean
  onCloseMaxHoursExceedError: () => void
  handleTimeEntryChange: (
    teamId: number,
    date: string,
    taskId: number,
    workedHrs: number | null | undefined,
    comments: string | null | undefined
  ) => void
}> = (props) => {
  const {
    setSelectedDate,
    selectedDate,
    timeSheet,
    handleOnPreviousWeek,
    handleOnNextWeek,
    handleOnRefresh,
    handleTimeEntryChange,
  } = props

  const summary = Array.from(
    new Set(
      timeSheet.flatMap((team: TimeSheet) =>
        team.dayAllocation.map((day: TaskTimeSheet) => day.date)
      )
    )
  ).map((date) => {
    const totalForDay = timeSheet.reduce((sum, team) => {
      const teamDay = team.dayAllocation.find((d: TaskTimeSheet) => d.date === date)
      if (!teamDay) return sum

      return (
        sum + teamDay.taskList.reduce((taskSum: number, t: Task) => taskSum + (t.workedHrs ?? 0), 0)
      )
    }, 0)

    const teamDay = timeSheet
      .find((team) => team.dayAllocation.some((d: TaskTimeSheet) => d.date === date))
      ?.dayAllocation.find((d: TaskTimeSheet) => d.date === date)

    const dateType = teamDay?.dateType ?? TIME_ENTRY_DATE_TYPES.WEEKEND
    const leaveStatus = teamDay?.leaveStatus ?? TIME_ENTRY_LEAVE_TYPES.DEFAULT

    return { date, total: totalForDay, dateType, leaveStatus }
  })

  const [open, setOpen] = React.useState(false)

  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const DAYS = selectedDate ? getWeekDaysMondayToSunday(selectedDate) : []

  moment.updateLocale('en-gb', {
    week: {
      dow: 1,
      doy: 4,
    },
  })

  interface EllipsisCellProps {
    text: string
    taskName: string
    onShowMore: (text: string, taskName: string) => void
  }

  const EllipsisCell = ({ text, taskName, onShowMore }: EllipsisCellProps) => {
    const textRef = React.useRef<HTMLSpanElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [showMore, setShowMore] = React.useState(false)

    React.useEffect(() => {
      const checkOverflow = () => {
        const textElement = textRef.current
        const container = containerRef.current

        if (!textElement || !container) return

        // Create a temporary span to measure the actual text width
        const tempSpan = document.createElement('span')
        tempSpan.style.visibility = 'hidden'
        tempSpan.style.position = 'absolute'
        tempSpan.style.whiteSpace = 'nowrap'
        tempSpan.style.font = window.getComputedStyle(textElement).font
        tempSpan.textContent = text

        document.body.appendChild(tempSpan)
        const textWidth = tempSpan.offsetWidth
        document.body.removeChild(tempSpan)

        // Get available width (container width minus some padding for the "more" button)
        const availableWidth = container.offsetWidth - 60 // Reserve space for "more" button

        // Show "more" button if text width exceeds available width
        setShowMore(textWidth > availableWidth)
      }

      checkOverflow()
      window.addEventListener('resize', checkOverflow)
      return () => window.removeEventListener('resize', checkOverflow)
    }, [text])

    return (
      <StyledTableCell
        sx={{
          border: '1px solid #060606ff',
          width: '220px',
          maxWidth: '220px',
        }}
      >
        <Box ref={containerRef} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography
            ref={textRef}
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flexGrow: 1,
              minWidth: 0,
              fontSize: '0.7rem',
            }}
          >
            {text}
          </Typography>

          {showMore && (
            <Button
              size="small"
              onClick={() => onShowMore(text, taskName)}
              sx={{
                flexShrink: 0,
                ml: 1,
                p: 0,
                minWidth: 'auto',
                fontSize: '0.75rem',
                textTransform: 'none',
              }}
            >
              more
            </Button>
          )}
        </Box>
      </StyledTableCell>
    )
  }

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogText, setDialogText] = React.useState('')
  const [dialogTaskName, setDialogTaskName] = React.useState('')

  const handleShowMore = (text: string, taskName: string) => {
    setDialogText(text)
    setDialogTaskName(taskName)
    setDialogOpen(true)
  }

  interface TextDialogProps {
    open: boolean
    onClose: () => void
    text: string
    taskName: string
  }

  const SummaryDialog = ({ open, onClose, text, taskName }: TextDialogProps) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={700}>
              Comment Summary of{' '}
              {selectedDate &&
                `${moment(getMondayToSundayRange(selectedDate).startOfWeek).format('MMM DD')} - 
     ${moment(getMondayToSundayRange(selectedDate).endOfWeek).format('MMM DD')}`}
            </Typography>

            <IconButton
              aria-label="close"
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon onClick={onClose} />
            </IconButton>
          </Box>
          <Typography fontSize={18} fontWeight={500}>
            Task Name : {taskName}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {text.split(/(?=\d{4}-\d{2}-\d{2})/).map((line, i, arr) => {
            let cleaned = line.trim()
            if (arr.length === 1 || i === arr.length - 1) {
              cleaned = cleaned.replace(/,\s*$/, '')
            }
            const [date, ...rest] = cleaned.split(' - ')
            const comment = rest.join(' - ')
            return (
              <Typography key={i}>
                <strong>{date}</strong>
                {comment && ` - ${comment}`}
              </Typography>
            )
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="text" color={'inherit'}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  return (
    <>
      {props.isTimeExceeded && (
        <div style={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Alert className="mb-m" onClose={props.onCloseMaxHoursExceedError} severity="warning">
            Tasks total hours exceeds 24 hours!
          </Alert>
        </div>
      )}

      {/* Legend Row */}
      <Stack direction="row" spacing={4} sx={{ my: 2 }}>
        {legends.map(({ color, label }) => (
          <Stack key={label} direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 16, height: 16, bgcolor: color, border: '1px solid #000' }} />
            <Typography variant="body2">{label}</Typography>
          </Stack>
        ))}
      </Stack>

      <Table>
        <TableHead style={{ border: '1px solid #060606ff ' }}>
          <TableRow>
            <StyledTableCell
              style={{
                minWidth: '270px',
                border: '1px solid #060606ff ',
                textAlign: 'center',
                backgroundColor: TIME_ENTRY_COLORS.DEFAULT,
                fontWeight: 400,
              }}
            >
              <IconButton onClick={handleOnPreviousWeek}>
                <ArrowLeft />
              </IconButton>
              {selectedDate && getMondayToSundayRange(selectedDate).startOfWeek} to {` `}
              {selectedDate && getMondayToSundayRange(selectedDate).endOfWeek}
              <IconButton
                onClick={handleOnNextWeek}
                disabled={
                  selectedDate !== null &&
                  getWeekRangeForDate(selectedDate).endOfWeek >
                    moment(new Date()).format('YYYY-MM-DD')
                }
              >
                <ArrowRight />
              </IconButton>
              <Box sx={{ alignItem: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
                  <DatePicker
                    open={open}
                    value={selectedDate ? moment(selectedDate) : null}
                    onChange={(newValue) => {
                      setSelectedDate(newValue as Date | null)
                    }}
                    onAccept={(newValue) => {
                      setSelectedDate(newValue as Date | null)
                      setOpen(false)
                    }}
                    onClose={() => {
                      setOpen(false)
                    }}
                    maxDate={moment(new Date())}
                    slotProps={{
                      actionBar: {
                        actions: ['cancel', 'accept'],
                      },
                    }}
                    slots={{
                      field: () => null,
                      popper: (props) => (
                        <Popper
                          {...props}
                          open={open}
                          anchorEl={buttonRef.current}
                          placement="bottom-start"
                        />
                      ),
                    }}
                  />
                  <IconButton size="small" ref={buttonRef} onClick={() => setOpen(true)}>
                    <CalendarToday />
                  </IconButton>
                </LocalizationProvider>
                <IconButton onClick={handleOnRefresh} size="small">
                  <RefreshOutlined />
                </IconButton>
              </Box>
            </StyledTableCell>
            {selectedDate &&
              DAYS?.map((day, idx) => (
                <StyledTableCell
                  key={idx}
                  style={{
                    border: '1px solid #060606ff ',
                    verticalAlign: 'top',
                    backgroundColor: TIME_ENTRY_COLORS.DEFAULT,
                    width: '40px',
                    minWidth: '40px',
                    maxWidth: '40px',
                    textAlign: 'center',
                    fontWeight: 400,
                  }}
                >
                  {day.month} <br /> {day.date} <br />
                </StyledTableCell>
              ))}
            <StyledTableCell
              rowSpan={2}
              style={{
                border: '1px solid #060606ff ',
                verticalAlign: 'middle',
                textAlign: 'center',
                width: '45px',
                // minWidth: '50px',
                // maxWidth: '50px',
                backgroundColor: TIME_ENTRY_COLORS.DEFAULT,
              }}
            >
              Weekly Total
            </StyledTableCell>
            <StyledTableBoldCell
              rowSpan={2}
              style={{
                border: '1px solid #060606ff ',
                verticalAlign: 'middle',
                textAlign: 'center',
                width: '100px !important',
                backgroundColor: TIME_ENTRY_COLORS.DEFAULT,
              }}
            >
              Comments
            </StyledTableBoldCell>
          </TableRow>
          <TableRow>
            <StyledTableCell
              style={{
                border: '1px solid #060606ff ',
                backgroundColor: TIME_ENTRY_COLORS.DEFAULT,
                width: '280px',
              }}
            >
              Task
            </StyledTableCell>

            {selectedDate &&
              DAYS?.map((day, idx) => (
                <StyledTableCell
                  key={`${day.fullDate}-${idx}`}
                  style={{
                    border: '1px solid #060606ff',
                    verticalAlign: 'top',
                    textAlign: 'center',
                    // width: '55px',
                    // minWidth: '55px',
                    // maxWidth: '55px',
                    backgroundColor: TIME_ENTRY_COLORS.DEFAULT,
                  }}
                >
                  {day.day}
                </StyledTableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody style={{ border: '1px solid #060606ff ' }}>
          {timeSheet?.map((time) => (
            <React.Fragment key={time.teamId}>
              {/* Team Row */}
              <StyledTableRow>
                <StyledTableBoldCell colSpan={10} style={{ border: '1px solid #060606ff ' }}>
                  {time.teamName}
                  <Tooltip
                    title={
                      <>
                        Allocation Start: {time.allocationStartDate}
                        <br />
                        Allocation End: {time.allocationEndDate}
                      </>
                    }
                  >
                    <InfoOutlined style={{ fontSize: 14, padding: 1, alignSelf: 'center' }} />
                  </Tooltip>
                </StyledTableBoldCell>
              </StyledTableRow>

              {time.dayAllocation[0]?.taskList?.map((task) => (
                <TableRow key={task.taskId}>
                  {/* Task Name */}
                  <StyledTableCell style={{ minWidth: '325px', fontSize: '0.77rem', border: '1px solid #060606ff ' }}>
                    {task.taskName}
                  </StyledTableCell>
                  {selectedDate &&
                    DAYS?.map((day, dayIdx) => {
                      const dayEntry = time.dayAllocation.find(
                        (d) => new Date(d.date).getDate() === day.date
                      )
                      if (!dayEntry)
                        return (
                          <StyledTableCell
                            key={`empty-${task.taskId}-${day.fullDate}`}
                            sx={{
                              backgroundColor: TIME_ENTRY_COLORS.DISABLED,
                              border: '1px solid #060606ff',
                              width: '30px !important',
                            }}
                          ></StyledTableCell>
                        )

                      const taskEntry = dayEntry.taskList.find((t) => t.taskId === task.taskId)
                      const disabled = isCellDisabled(
                        time.allocationEndDate,
                        time.allocationStartDate,
                        dayEntry.date
                      )
                      const isFutureAllocated = isFutureAllocatedDate(
                        time.allocationEndDate,
                        time.allocationStartDate,
                        dayEntry.date
                      )

                      return (
                        <StyledTableCell
                          key={dayIdx}
                          style={{
                            border: '1px solid #060606ff',
                            // width: '50px !important',
                            backgroundColor: getColumnColor(
                              dayEntry?.leaveStatus,
                              dayEntry?.dateType,
                              disabled,
                              isFutureAllocated
                            ),
                          }}
                        >
                          <TextField
                            variant="standard"
                            sx={{ width: '37px' }}
                            disabled={disabled || isFutureAllocated}
                            value={taskEntry?.workedHrs === 0 ? '' : (taskEntry?.workedHrs ?? '')}
                            // onChange={(e) => {
                            //   if (!taskEntry) return
                            //   const value = e.target.value
                            //   if (!/^\d*\.?\d{0,2}$/.test(value)) return
                            //   let num = Number(value)
                            //   if (num > 24) num = 24

                            //   handleWorkedHoursChange(time.teamId, dayEntry.date, task.taskId, num)
                            // }}

                            onClick={() => {
                              if (!disabled && !isFutureAllocated) {
                                handleTimeEntryChange(
                                  time.teamId,
                                  dayEntry.date,
                                  task.taskId,
                                  taskEntry?.workedHrs,
                                  taskEntry?.comment
                                )
                              }
                            }}
                            slotProps={{
                              input: {
                                inputProps: {
                                  style: {
                                    textAlign: 'center',
                                    cursor: disabled || isFutureAllocated ? 'auto' : 'pointer',
                                    width: '60px',
                                    fontSize: '0.7rem',
                                  },
                                  type: 'text',
                                  maxLength: 5,
                                },
                                endAdornment: taskEntry?.comment ? (
                                  <InputAdornment
                                    position="end"
                                    sx={{
                                      padding: 0,
                                      margin: 0,
                                      width: 10,
                                    }}
                                  >
                                    <Tooltip title={taskEntry?.comment} placement="top-end">
                                      <IconButton disableFocusRipple disableRipple>
                                        *
                                      </IconButton>
                                    </Tooltip>
                                  </InputAdornment>
                                ) : (
                                  <Box sx={{ width: 20 }} />
                                ),
                              },
                            }}
                          />
                        </StyledTableCell>
                      )
                    })}
                  {/* Total Hours for this task */}
                  <StyledTableCell
                    style={{
                      border: '1px solid #060606ff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      // width: '50px !important',
                      // backgroundColor: '#f5f5f5',
                    }}
                  >
                    {(() => {
                      const taskTotal = time.dayAllocation.reduce((total, day) => {
                        const taskEntry = day.taskList.find((t) => t.taskId === task.taskId)
                        return total + (taskEntry?.workedHrs ?? 0)
                      }, 0)
                      return taskTotal > 0 ? taskTotal.toFixed(2) : ''
                    })()}
                  </StyledTableCell>

                  {(() => {
                    const combinedComment = time.dayAllocation.reduce((total, day) => {
                      const taskEntry = day.taskList.find((t) => t.taskId === task.taskId)
                      return (
                        total +
                        (taskEntry?.comment ? day.date + ' - ' + taskEntry.comment + ', ' : '')
                      )
                    }, '')
                    return (
                      <EllipsisCell
                        text={combinedComment}
                        taskName={task.taskName || ''}
                        onShowMore={handleShowMore}
                      />
                    )
                  })()}
                </TableRow>
              ))}

              {/* Task Rows */}
            </React.Fragment>
          ))}
          <TableRow style={{ border: '1px solid #060606ff ' }}>
            <StyledTableCell style={{ border: '1px solid #060606ff ', fontWeight: 900 }}>
              Summary
            </StyledTableCell>
            {selectedDate &&
              DAYS?.map((day) => {
                // Find the summary entry for this day
                const s = summary?.find((entry) => new Date(entry.date).getDate() === day.date)

                return (
                  <StyledTableCell
                    // sx={{
                    //   width: '70px !important',
                    //   minWidth: '70px !important',
                    //   maxWidth: '70px !important',
                    // }}
                    // key={idx}
                    key={`summary-${day.fullDate}`}
                    style={{
                      textAlign: 'center',
                      border: '1px solid #060606ff',
                      fontWeight: 900,
                      backgroundColor: s
                        ? getBackgroundColor(s.date, s.total, s.leaveStatus)
                        : TIME_ENTRY_COLORS.DISABLED,
                    }}
                  >
                    {s ? s.total.toFixed(2) : ''}
                  </StyledTableCell>
                )
              })}
            {/* Overall Total Hours */}
            <StyledTableCell
              // sx={{
              //   width: '70px !important',
              //   minWidth: '70px !important',
              //   maxWidth: '70px !important',
              // }}
              style={{
                textAlign: 'center',
                border: '1px solid #060606ff',
                fontWeight: 900,
                // backgroundColor: '#e8f5e8',
              }}
            >
              {(() => {
                const overallTotal = summary.reduce((total, day) => total + (day.total ?? 0), 0)
                return overallTotal > 0 ? overallTotal.toFixed(2) : ''
              })()}
            </StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
      <SummaryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        text={dialogText}
        taskName={dialogTaskName}
      />
    </>
  )
}
export default TimeSheetForm