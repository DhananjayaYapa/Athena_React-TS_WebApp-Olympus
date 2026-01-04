import React from 'react'
import Chart from 'react-apexcharts'
import styles from './LeaveCountSummary.module.scss'
import { CircularProgress, Card } from '@mui/material'
import { LEAVE_TYPE_LIST, SPECIAL_LEAVE_TYPES } from '../../../utilities/constants/data.constamts'
import moment from 'moment'

const LeaveCountSummary: React.FC<{
  selectedLeaveType: number
  leaveSummaryData: number[]
  isLoading: boolean
}> = (props) => {
  const options = {
    labels: ['Approved Leave', 'Applied Leave', 'Available Leave'],
    colors: ['#1877F2', '#F39C12', '#2ECC71'],
    dataLabels: {
      formatter: function (_val: any, opts: any) {
        return opts.w.config.series[opts.seriesIndex]
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10,
        },
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontWeight: 600,
              color: undefined,
              offsetY: 20,
              formatter: function (val: any) {
                return val
              },
            },
            value: {
              show: true,
              fontSize: '38px',
              fontWeight: 400,
              color: undefined,
              offsetY: -12,
              formatter: function (val: any) {
                return val
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '13px',

              fontWeight: 400,
              color: '#373d3f',
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b
                }, 0)
              },
            },
          },
        },
      },
    },
  }

  const getLeaveTypeName = (leaveTypeId: number) => {
    if (leaveTypeId) {
      const leaveType = LEAVE_TYPE_LIST.filter((leaveType) => leaveType.id === leaveTypeId)
      return leaveType[0].type
    }
  }
  return (
    <React.Fragment>
      {(props.leaveSummaryData.length === 0 && !props.isLoading) ||
      SPECIAL_LEAVE_TYPES.includes(props.selectedLeaveType) ? (
        <h3 className={styles.noData}> No Summary Data </h3>
      ) : props.isLoading ? (
        <div className={styles.loading}>
          <CircularProgress color="primary" size={20} /> Loading...
        </div>
      ) : (
        <React.Fragment>
          <h4 className={styles.summaryTitle}>
            {getLeaveTypeName(props.selectedLeaveType)} summary for {moment().format('YYYY')}
          </h4>
          <Chart
            className={styles.chart}
            options={options}
            series={props.leaveSummaryData}
            type="donut"
            width="250"
          />
          <Card className={styles.leaveSummaryDetails}>
            <div className={styles.leaveCount}>
              <h4 className={styles.available}>{props.leaveSummaryData[2]}</h4>
              <span className={styles.available}>Available</span>
            </div>
            <div className={styles.leaveCount}>
              <h4 className={styles.approved}>{props.leaveSummaryData[0]}</h4>
              <span className={styles.approved}>Approved</span>
            </div>
            <div className={styles.leaveCount}>
              <h4 className={styles.applied}>{props.leaveSummaryData[1]}</h4>
              <span className={styles.applied}>Applied</span>
            </div>
          </Card>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default LeaveCountSummary
