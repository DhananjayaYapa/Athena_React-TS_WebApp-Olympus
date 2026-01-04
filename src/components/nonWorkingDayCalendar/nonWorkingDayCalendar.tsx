import React from 'react'
import styles from './nonWorkingDayCalendar.module.scss'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { DateSelectArg, EventClickArg } from '@fullcalendar/core'
import { NonWorkingDay } from '../../utilities/models'

const NonWorkingDayCalendar: React.FC<{
  addDay(date: Date): void
  editDay(thisNonWorkingDay: NonWorkingDay): void
  calendarReference: any
  holidays: any
}> = (props) => {
  const viewHoliday = () => {
    const today = new Date()
    today.setDate(today.getDate() - 1)

    if (props.holidays.data.length > 0) {
      const viewEvents = props.holidays.data.map(
        (holiday: {
          nonWorkingDayId: number
          date: Date
          holidayDesc: string
          isHalfDay: boolean
          isEnabled: boolean
        }) => {
          const fontColour = '#000000'
          let clr = '#5DCF77BF'

          const isPastDate = new Date(holiday.date) > today ? 'cursorPointer' : 'cursorDisabled'
          if (holiday.isHalfDay == true) {
            clr = '#5CD0C7BF'
          }

          if (!holiday.isEnabled) {
            clr = '#e3e1e1'
          }

          return {
            nonWorkingDayId: holiday.nonWorkingDayId,
            date: holiday.date,
            title: holiday.holidayDesc,
            allDay: true,
            isHalfDay: holiday.isHalfDay,
            isEnabled: holiday.isEnabled,
            classNames: [isPastDate],
            backgroundColor: clr,
            borderColor: 'transparent',
            textColor: fontColour,
          }
        }
      )

      return viewEvents
    }
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const currdate = selectInfo.start

    props.addDay(currdate)
    const calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventExtendedProps = clickInfo.event.extendedProps

    const selectedNonWorkingDay: NonWorkingDay = {
      nonWorkingDayId: eventExtendedProps.nonWorkingDayId,
      date: clickInfo.event.start ?? new Date(),
      holidayDesc: clickInfo.event.title,
      isEnabled: eventExtendedProps.isEnabled,
      isHalfDay: eventExtendedProps.isHalfDay,
    }

    props.editDay(selectedNonWorkingDay)
  }

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'today',
        }}
        buttonText={{ today: 'Today' }}
        initialView="dayGridMonth"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        select={handleDateSelect}
        height={450}
        eventClick={handleEventClick}
        events={viewHoliday()}
        ref={props.calendarReference}
        windowResize={() => {
          if (window.innerWidth < 514) {
            props.calendarReference.current.getApi().changeView('dayGridWeek')
          } else {
            props.calendarReference.current.getApi().changeView('dayGridMonth')
          }
        }}
      />
      <div className={styles.block_container}>
        <div className={styles.block}>
          <i className={styles.blue}> </i>
          <h4 className={styles.block}>Full Day</h4>
        </div>
        <div className={styles.block}>
          <i className={styles.lightblue}> </i>
          <h4 className={styles.block}>Half Day</h4>
        </div>
        <div className={styles.block}>
          <i className={styles.disabledDates}> </i>
          <h4 className={styles.block}>Disabled Days</h4>
        </div>
      </div>
    </div>
  )
}

export default NonWorkingDayCalendar
