import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CustomAlert, DetailedAttendanceReportForm } from '../../../components'
import { AppLayout } from '../../../templates'
import { useDispatch, useSelector } from 'react-redux'
import { reportActions } from '../../../redux/actions'
import { detailedAttendanceGenarations } from '../../../components/ReportGeneration/detailed-attendance/DetailedAttendanceReportGenaration'
import {
  AppStateDto,
  DetailedAttendanceReportDisplayFilterParams,
  DetailedAttendanceReportFilterParams,
  getUserClientHierarchyListDto,
  ResetKeys,
} from '../../../utilities/models'
import { UserClientHierarchyUserDto, UserClientHierarchyTeamsDto } from '../../../utilities/models'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

const DetailedAttendanceReport = () => {
  const INITIAL_STATE = {
    username: { value: '', validator: 'text', disable: false },
    endDate: {
      value: null as Date | null,
      validator: 'date',
      isRequired: true,
      disableFuture: true,
      error: false,
      futureDate: null as Date | null,
      previousDate: null as Date | null,
    },
    startDate: {
      value: null as Date | null,
      validator: 'date',
      isRequired: true,
      disableFuture: true,
      error: false,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    teamId: { value: null as any, teamName: '', validator: 'text', error: null, disable: false },
    clientId: { value: '', clientName: '', validator: 'text', disable: false },
    getDisabled: {
      value: false,
      checked: false,
      validator: 'boolean',
      disable: false,
      isRequired: false,
      error: null,
    },
  }

  const RESET_KEYS: ResetKeys = {
    employee: uuidv4(),
    client: uuidv4(),
    team: uuidv4(),
  }

  const dispatch = useDispatch()
  const [resetKeys, setResetKeys] = useState(RESET_KEYS)
  const [formValues, setFormValues] = useState(INITIAL_STATE)
  const [users, setUsers] = useState<UserClientHierarchyUserDto[]>([])
  const [clientTeamsLocal, setClientTeamsLocal] = useState<UserClientHierarchyTeamsDto[]>([])
  const [detRetriveError, setDetRetriveError] = React.useState<boolean>(false)
  const [holdReportGen, setholdReportGen] = React.useState<boolean>(false)

  const detAttendanceReportResponse = useSelector(
    (state: AppStateDto) => state.report.detailedAttendanceReport.data.data
  )
  const isdetAttendanceReportResponseLoading = useSelector(
    (state: AppStateDto) => state.report.detailedAttendanceReport.isLoading
  )
  const userClientHierarchy = useSelector(
    (state: AppStateDto) => state.report.getUserClientHierarchy
  )
  const dataRetrieveError = useSelector(
    (state: AppStateDto) => state.report.detailedAttendanceReport.error
  )

  useEffect(() => {
    dispatch(reportActions.resetDetailedAttendanceDetail())
    getClientHierachy()
    // dispatch(reportActions.getUserClientHierarchy({getDisabled: true}));
  }, [])

  useEffect(() => {
    if (
      detAttendanceReportResponse?.length === 0 &&
      !isdetAttendanceReportResponseLoading &&
      holdReportGen
    ) {
      setDetRetriveError(true)
      setTimeout(() => setDetRetriveError(false), 2000)
    } else {
      setDetRetriveError(false)
    }

    if (
      detAttendanceReportResponse?.length >= 1 &&
      !isdetAttendanceReportResponseLoading &&
      holdReportGen
    ) {
      const DetAttendanceReportDisplayFilterParams: DetailedAttendanceReportDisplayFilterParams = {
        username: formValues.username.value ? formValues.username.value : '',
        startDate: moment(formValues.startDate.value).format('YYYY-MM-DD'),
        endDate: moment(formValues.endDate.value).format('YYYY-MM-DD'),
        teamName: formValues.teamId.teamName ? formValues.teamId.teamName : null,
        clientName: formValues.clientId.clientName ? formValues.clientId.clientName : null,
      }
      detailedAttendanceGenarations(
        detAttendanceReportResponse,
        DetAttendanceReportDisplayFilterParams
      )
    }
  }, [detAttendanceReportResponse, isdetAttendanceReportResponseLoading, holdReportGen])

  useEffect(() => {
    if (dataRetrieveError?.error) {
      setDetRetriveError(true)
      setTimeout(() => setDetRetriveError(false), 2000)
    }
  }, [dataRetrieveError])

  useEffect(() => {
    getClientHierachy()
    onPartiallyReset()
  }, [formValues.getDisabled.value])

  const onDetAttendanceSearchWithFilters = (filters: DetailedAttendanceReportFilterParams) => {
    if (filters.username === '') {
      filters.username = null
    }
    setholdReportGen(true)
    dispatch(reportActions.getDetailedAttendanceReport(filters))
  }

  const reset = () => {
    dispatch(reportActions.resetDetailedAttendanceDetail())
  }
  const getClientHierachy = () => {
    const clientHeirachyParams: getUserClientHierarchyListDto = {
      getDisabled: !formValues.getDisabled.value,
      getAll: true,
    }
    dispatch(reportActions.getUserClientHierarchy(clientHeirachyParams))
  }

  const onDetAttendanceSearch = () => {
    const DetAttendanceReportFilterParams: DetailedAttendanceReportFilterParams = {
      username: formValues.username.value ? formValues.username.value : '',
      startDate: moment(formValues.startDate.value).format('YYYY-MM-DD'),
      endDate: moment(formValues.endDate.value).format('YYYY-MM-DD'),
      teamId: formValues.teamId.value ? formValues.teamId.value : null,
      clientId: formValues.clientId.value ? formValues.clientId.value : null,
      getDisabled: !formValues.getDisabled.value,
    }

    if (formValues.startDate.value === null || formValues.endDate.value === null) {
      setFormValues({
        ...formValues,
        endDate: { ...formValues.endDate, error: formValues.endDate.value === null ? true : false },
        startDate: {
          ...formValues.startDate,
          error: formValues.startDate.value === null ? true : false,
        },
      })
    } else {
      onDetAttendanceSearchWithFilters(DetAttendanceReportFilterParams)
      setFormValues({
        ...formValues,
        startDate: { ...formValues.startDate, error: false },
        endDate: { ...formValues.endDate, error: false },
      })
    }
  }

  const onReset = () => {
    setResetKeys(RESET_KEYS)
    setFormValues(INITIAL_STATE)
    setUsers([])
    reset()
  }

  const onPartiallyReset = () => {
    setResetKeys(RESET_KEYS)
    setFormValues({
      ...formValues,
      clientId: { ...formValues.clientId, value: '', clientName: '' },
      teamId: { ...formValues.teamId, value: '', teamName: '' },
    })
    setUsers([])
    reset()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onClientSelect = (_event: any, value: any) => {
    setResetKeys({
      ...resetKeys,
      team: uuidv4(),
      employee: uuidv4(),
    })

    setFormValues({
      ...formValues,
      teamId: { ...formValues.teamId, value: '', teamName: '' },
      clientId: {
        ...formValues.clientId,
        value: value ? value.clientId : '',
        clientName: value ? value.clientName : '',
      },
      username: { ...formValues.username, value: '' },
    })

    if (value !== '' && value !== null) {
      const clientTeams = userClientHierarchy.data?.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (client: any) => client.clientId === value.clientId
      )
      setClientTeamsLocal(clientTeams[0].teams)

      const usersList: UserClientHierarchyUserDto[] = []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      clientTeams[0].teams.map((team: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        team.users.map((user: any) => {
          if (usersList.findIndex((listUser) => listUser.userId === user.userId) === -1) {
            usersList.push(user)
          }
        })
      )

      setUsers(usersList)
    }
  }

  const onTeamChange = (_event: any, value: UserClientHierarchyTeamsDto) => {
    setResetKeys({
      ...resetKeys,
      employee: uuidv4(),
    })
    if (!value) {
      const clientTeams = userClientHierarchy.data?.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (client: any) => client.clientId === Number(formValues.clientId.value)
      )
      onClientSelect(null, clientTeams[0])
    }
    setFormValues({
      ...formValues,
      teamId: {
        ...formValues.teamId,
        value: value ? value.teamId : '',
        teamName: value ? value.teamName : '',
      },
    })
    if (value) {
      setUsers(value.users)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (property: string, value: any) => {
    switch (property) {
      case 'username':
        setFormValues({
          ...formValues,
          username: {
            ...formValues.username,
            value: value ? value.username : '',
          },
        })
        break
      case 'startDate':
        setFormValues({
          ...formValues,
          startDate: {
            ...formValues.startDate,
            value: value,
            error: false,
          },
          endDate: {
            ...formValues.endDate,
            value: null,
            // futureDate: addDays(new Date(value), 44),
            // previousDate: addDays(new Date(value), 0),
            futureDate: moment(value).add(44, 'days').toDate(),
            previousDate: moment(value).add(0, 'days').toDate(),
          },
        })
        break
      case 'endDate':
        setFormValues({
          ...formValues,
          endDate: {
            ...formValues.endDate,
            value: value,
            error: false,
          },
        })
        break
      case 'client':
        onClientSelect(null, value)
        break
      case 'team':
        onTeamChange(null, value)
        break
      case 'getDisabled':
        setFormValues({
          ...formValues,
          getDisabled: {
            ...formValues.getDisabled,
            value: value,
            checked: value,
            error: null,
          },
        })
        break
      default:
        setFormValues({
          ...formValues,
        })
    }
  }

  return (
    <React.Fragment>
      <AppLayout
        breadcrumb="Detailed Attendance Report"
        componentTitle="Detailed Attendance Report"
      >
        <Grid container spacing={2} direction="row" className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3>Generate Detailed Attendance Report</h3>
            <p>
              Select Start Date and End Date to filter results. The Excel Report will be downloaded
              based on the filtered results.
            </p>
          </Grid>
          <Grid size={{ md: 7 }}>
            {detRetriveError ? (
              <div style={{ paddingTop: '5px' }}>
                <CustomAlert
                  displayText={dataRetrieveError ? dataRetrieveError.msg : 'No data for the report'}
                  severity="warning"
                />
              </div>
            ) : (
              <div></div>
            )}
            <DetailedAttendanceReportForm
              isUsersListLoading={userClientHierarchy.isLoading}
              userClientHierarchy={userClientHierarchy.data || []}
              isdetAttendanceReportResponseLoading={isdetAttendanceReportResponseLoading}
              reset={onReset}
              formValues={formValues}
              handleChange={handleChange}
              clientTeamsLocal={clientTeamsLocal || []}
              users={users || []}
              onDetAttendanceSearch={onDetAttendanceSearch}
              resetKeys={resetKeys}
            />
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}

export default DetailedAttendanceReport
