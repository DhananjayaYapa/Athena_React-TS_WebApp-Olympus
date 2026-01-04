import React from 'react'
import styles from './DashboardCalendar.module.scss'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { AttendanceInfoObjectDto, LeaveListItemDto, NonWorkingDay } from '../../../utilities/models'
import moment from 'moment'
import { CircularProgress } from '@mui/material'
import { APP_ROUTES, LEAVE_STATUS_IDS } from '../../../utilities/constants'
import { useNavigate } from 'react-router-dom'

const DashboardCalendar: React.FC<{
  attendanceInfo: AttendanceInfoObjectDto[]
  leaveList: LeaveListItemDto[]
  holidays: NonWorkingDay[]
  isLoading?: boolean
  onMonthChange(arg?: Date): void
  onNavigateTimeEntry(date: string): void
}> = (props) => {
  //COLOR CODE CONSTANTS
  const PAIRED_ATTENDANCE = '#77ea91e0'
  const SINGLE_SWIPES = '#ffe67c'
  const MISSING_ATTENDANCE = '#ffb4ae'
  const FULL_DAY_HOLIDAY = '#c1c1c1'
  const HALF_DAY_HOLIDAY = '#ffebd0'
  const LEAVE = '#bfb5ff'
  const TODAY = '#dbeeff'

  const calendarRef = React.createRef<FullCalendar>()
  const navigate = useNavigate()

  const formatEvents = (
    attendanceInfo: AttendanceInfoObjectDto[],
    holidays: any[],
    leaves: LeaveListItemDto[]
  ) => {
    const calendarEvents: any[] = []
    const fontColour = '#000000'

    if (attendanceInfo.length > 0) {
      attendanceInfo.map((attendenceRec: AttendanceInfoObjectDto) => {
        let clr = PAIRED_ATTENDANCE

        if (attendenceRec.startTime) {
          if (!attendenceRec.endTime) {
            clr = SINGLE_SWIPES
          }
        } else {
          clr = MISSING_ATTENDANCE
        }
        calendarEvents.push({
          title: attendenceRec.attendanceInfoId
            ? `${moment(attendenceRec.startTime, 'HH:mm:ss').format('hh:mm A')} to ${
                attendenceRec.endTime
                  ? `${moment(attendenceRec.endTime, 'HH:mm:ss').format('hh:mm A')} ${isEditableDate(attendenceRec.attendanceDate)}`
                  : `--:-- ${isEditableDate(attendenceRec.attendanceDate)}`
              }`
            : `Missing Attendance ${isEditableDate(attendenceRec.attendanceDate)}`,
          allDay: true,
          start: attendenceRec.attendanceDate,
          display: 'auto',
          backgroundColor: clr,
          borderColor: 'transparent',
          textColor: fontColour,
          eventInfo: attendenceRec,
          className: isEditableDate(attendenceRec.attendanceDate) && styles.clickable,
        })
      })
    }

    if (holidays.length > 0) {
      holidays.map((nonWorkingDay: NonWorkingDay) => {
        let clr = FULL_DAY_HOLIDAY

        if (nonWorkingDay.isEnabled) {
          if (nonWorkingDay.isHalfDay) {
            clr = HALF_DAY_HOLIDAY
          }

          calendarEvents.push({
            start: moment(nonWorkingDay.date).format('YYYY-MM-DD'),
            allDay: true,
            backgroundColor: clr,
            borderColor: 'transparent',
            textColor: fontColour,
            display: 'background',
          })
        }
      })
    }

    if (leaves.length > 0) {
      leaves.map((leave: LeaveListItemDto) => {
        if (
          leave.leaveStatusId === LEAVE_STATUS_IDS.APPROVED ||
          leave.leaveStatusId === LEAVE_STATUS_IDS.APPLIED
        ) {
          calendarEvents.push({
            title: `${leave.isHalfDay === 1 ? 'Half' : 'Full'} day leave [${leave.leaveStatus}]  ${leave.isHalfDay === 0 ? isEditableDate(leave.date) : ''}`,
            allDay: true,
            start: leave.date,
            display: 'auto',
            backgroundColor: LEAVE,
            borderColor: 'transparent',
            textColor: fontColour,
            eventInfo: leave,
            className: leave.isHalfDay && isEditableDate(leave.date) && styles.clickable,
          })
        }
      })
    }

    return calendarEvents
  }

  const changeMonth = (arg: 'next' | 'prev' | 'today') => {
    const calendarApi = calendarRef.current?.getApi()

    if (arg === 'next') {
      calendarApi?.next()
    } else if (arg === 'prev') {
      calendarApi?.prev()
    } else if (arg === 'today') {
      calendarApi?.today()
    }

    props.onMonthChange(calendarApi?.getDate())
  }

  const attTimeEntryRedirect = () => {
    navigate(APP_ROUTES.ADD_ATTENDANCE)
  }

  const isEditableDate = (date: string) => {
    const diff = moment.duration(
      moment(moment().format('YYYY-MM-DD')).diff(moment(date, 'YYYY-MM-DD'))
    )
    if (diff.days() < 5 && diff.days() >= 0) {
      return '[+]'
    } else {
      return ''
    }
  }

  const handleDateClick = (event: any) => {
    const date = event.event._def.extendedProps.eventInfo.attendanceDate

    const diff = moment.duration(
      moment(moment().format('YYYY-MM-DD')).diff(moment(date, 'YYYY-MM-DD'))
    )
    if (moment(date).isBusinessDay() && diff.days() < 5 && diff.days() >= 0) {
      const holidays = props.holidays
        .filter((holiday) => moment(holiday.date).format('YYYY-MM-DD') === date)
        .filter((date) => date.isHalfDay === Boolean(0))
      // console.log('isLength', holidays)
      !holidays.length && props.onNavigateTimeEntry(date)
      // history.push(`${APP_ROUTES.ADD_ATTENDANCE}?date=${event.dateStr}`);
    }
  }

  return (
    <React.Fragment>
      <div className={styles.calenderHolder}>
        {props.isLoading && (
          <div className={styles.calenderLoader}>
            <CircularProgress color="inherit" size={40} />
          </div>
        )}

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'addTime',
            center: 'title',
            right: 'prev,next,today',
          }}
          customButtons={{
            next: {
              text: 'Next',
              click: () => changeMonth('next'),
            },
            prev: {
              text: 'Prev',
              click: () => changeMonth('prev'),
            },
            today: {
              text: 'Today',
              click: () => changeMonth('today'),
            },
            addTime: {
              text: 'Add Attendance',
              click: attTimeEntryRedirect,
            },
          }}
          initialView="dayGridMonth"
          weekends={true}
          height={450}
          themeSystem="standard"
          events={formatEvents(props.attendanceInfo, props.holidays, props.leaveList)}
          eventClick={handleDateClick}
        />
      </div>

      <div className={styles.block_container}>
        <div className={styles.block}>
          <i className={styles.icon} style={{ backgroundColor: PAIRED_ATTENDANCE }}>
            {' '}
          </i>
          <h4 className={styles.block}>Paired Attendance</h4>
        </div>
        <div className={styles.block}>
          <i className={styles.icon} style={{ backgroundColor: SINGLE_SWIPES }}>
            {' '}
          </i>
          <h4 className={styles.block}>Single Swipe</h4>
        </div>
        <div className={styles.block}>
          <i className={styles.icon} style={{ backgroundColor: MISSING_ATTENDANCE }}>
            {' '}
          </i>
          <h4 className={styles.block}>Missing Attendance</h4>
        </div>
        <div className={styles.block}>
          <i className={styles.icon} style={{ backgroundColor: LEAVE }}>
            {' '}
          </i>
          <h4 className={styles.block}>Leave</h4>
        </div>
        <div className={styles.block}>
          <i className={styles.icon} style={{ backgroundColor: FULL_DAY_HOLIDAY }}>
            {' '}
          </i>
          <h4 className={styles.block}>Full day Holiday</h4>
        </div>
        <div className={styles.block}>
          <i className={styles.icon} style={{ backgroundColor: HALF_DAY_HOLIDAY }}>
            {' '}
          </i>
          <h4 className={styles.block}>Half day Holiday</h4>
        </div>
        <div className={styles.block}>
          <i className={styles.icon} style={{ backgroundColor: TODAY }}>
            {' '}
          </i>
          <h4 className={styles.block}>Today</h4>
        </div>
      </div>
    </React.Fragment>
  )
}

export default DashboardCalendar
