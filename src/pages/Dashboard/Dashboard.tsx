import { Grid } from '@mui/material'
import moment from 'moment-timezone'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DashboardCalendar } from '../../components'
import { AppLayout } from '../../templates'
import { attendanceActions, leaveActions, nonWorkingDayActions } from '../../redux/actions'
import {
  AppStateDto,
  GetAttendanceInfoParamsDto,
  GetLeaveListParamsDto,
} from '../../utilities/models'
import { APP_ROUTES } from '../../utilities/constants/'
import styles from './Dashboard.module.scss'
import { useNavigate } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)
  const dispatch = useDispatch()
  const attendanceInfo = useSelector((state: AppStateDto) => state.attendance.attendanceInfo)
  const nonWorkingDays = useSelector((state: AppStateDto) => state.nonWorkingDays.nonWorkingDay)
  const leaveList = useSelector((state: AppStateDto) => state.leave.leaveList)
  const [activeYear, setActiveYear] = React.useState<number>()
  //Get user attendanca data
  useEffect(() => {
    const currentYear = moment().tz(authorizedUser.data.timeZone).year()
    setActiveYear(currentYear)
    getAttendanceInfo()
    getLeaveList()
    getNonWorkingDaysInfo(currentYear)
    return () => {
      dispatch(attendanceActions.clearAttendanceInfo())
      dispatch(nonWorkingDayActions.clearNonWorkingDays())
      dispatch(leaveActions.clearLeaveList())
    }
  }, [])

  const getAttendanceInfo = (date?: Date) => {
    const currentDate = moment().tz(authorizedUser.data.timeZone).format('YYYY-MM-DD')
    const endDate = date
      ? moment(date).tz(authorizedUser.data.timeZone).endOf('month').format('YYYY-MM-DD')
      : currentDate
    const startDate = date
      ? moment(date).tz(authorizedUser.data.timeZone).startOf('month').format('YYYY-MM-DD')
      : moment().tz(authorizedUser.data.timeZone).startOf('month').format('YYYY-MM-DD')

    if (moment(currentDate).isSameOrAfter(startDate)) {
      const attendanceParams: GetAttendanceInfoParamsDto = {
        username: authorizedUser.data.username,
        startDate: startDate,
        endDate: moment(endDate).isAfter(currentDate) ? currentDate : endDate,
      }
      dispatch(attendanceActions.getAttendanceInfo(attendanceParams))
    }
  }

  const getNonWorkingDaysInfo = (year?: number) => {
    const currentYear = year ? year : moment().tz(authorizedUser.data.timeZone).year()
    dispatch(nonWorkingDayActions.getNonWorkingDays(currentYear))
  }

  const onMonthChange = (date: Date) => {
    const year = moment(date).tz(authorizedUser.data.timeZone).year()
    // console.log(activeYear, year)
    if (year !== activeYear) {
      getNonWorkingDaysInfo(year)
      setActiveYear(year)
    }
    getAttendanceInfo(date)
    getLeaveList(date)
  }

  const getLeaveList = (date?: Date) => {
    const endDate = date
      ? moment(date).tz(authorizedUser.data.timeZone).endOf('month').format('YYYY-MM-DD')
      : moment().tz(authorizedUser.data.timeZone).endOf('month').format('YYYY-MM-DD')
    const startDate = date
      ? moment(date).tz(authorizedUser.data.timeZone).startOf('month').format('YYYY-MM-DD')
      : moment().tz(authorizedUser.data.timeZone).startOf('month').format('YYYY-MM-DD')

    const leaveListParams: GetLeaveListParamsDto = {
      username: authorizedUser.data.username,
      from: startDate,
      to: endDate,
    }
    dispatch(leaveActions.getLeaveList(leaveListParams))
  }

  const navigateToTimeEntry = (date: string) => {
    navigate(`${APP_ROUTES.ADD_ATTENDANCE}?date=${date}`)
  }

  return (
    <React.Fragment>
      <AppLayout breadcrumb="" componentTitle="Dashboard">
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 7 }}>
            <h1 className={styles.title}>
              Hi {`${authorizedUser.data.firstName} ${authorizedUser.data.lastName}`}
            </h1>
            <p className={styles.info}>
              Welcome to Olympus Athena. A summary of your time entries can be view using the below
              calendar.
            </p>
          </Grid>
          <Grid size={{ md: 12 }}>
            <DashboardCalendar
              holidays={nonWorkingDays.data || []}
              leaveList={leaveList.data || []}
              isLoading={attendanceInfo.isLoading || nonWorkingDays.isLoading}
              onMonthChange={onMonthChange}
              attendanceInfo={attendanceInfo.data?.data || []}
              onNavigateTimeEntry={navigateToTimeEntry}
            />
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}

export default Dashboard
