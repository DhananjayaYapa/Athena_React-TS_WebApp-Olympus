import { Box, Divider, Grid, Tab } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { AttendanceSummaryForm, CustomAlert } from '../../../components'
import { AppLayout } from '../../../templates'
import { useDispatch, useSelector } from 'react-redux'
import { reportActions } from '../../../redux/actions'
import {
  AllClientHierachyDto,
  AppStateDto,
  AttendanceSummaryReportDisplayFilterParams,
  ResetKeys,
  TeamSelectDto,
  UserClientHierarchyDto,
  UserClientHierarchyTeamsDto,
} from '../../../utilities/models'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { attendanceSummaryGenarations } from '../../../components/ReportGeneration/attendance-summary/AttendanceSummaryReportGenaration'
import { validateFormData } from '../../../utilities/helpers'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { attendanceSummaryProjectWiseGenarations } from '../../../components/ReportGeneration/attendance-summary/AttendanceSummaryProjectWiseReportGenaration'

const AttendanceSummary = () => {
  const INITIAL_STATE = {
    endDate: {
      value: null as Date | null,
      validator: 'date',
      isRequired: true,
      disableFuture: true,
      error: null,
      futureDate: null as Date | null,
      previousDate: null as Date | null,
    },
    startDate: {
      value: null as Date | null,
      validator: 'date',
      isRequired: true,
      disableFuture: true,
      error: null,
    },
    client: {
      value: {} as UserClientHierarchyDto,
      validator: 'object',
      isRequired: true,
      error: null,
      disable: false,
    },
    project: {
      value: {} as UserClientHierarchyTeamsDto,
      validator: 'object',
      isRequired: false,
      error: null,
      disable: false,
    },
    // clientId: { value: null as any, clientName: '', validator: 'text', disable: false, isRequired: true, error: null },
    billing: {
      value: false,
      checked: false,
      validator: 'boolean',
      disable: false,
      isRequired: false,
      error: null,
    },
  }

  const RESET_KEYS: ResetKeys = {
    client: uuidv4(),
    team: uuidv4(),
  }

  const dispatch = useDispatch()
  const [resetKeys, setResetKeys] = useState(RESET_KEYS)
  const [formValues, setFormValues] = useState(INITIAL_STATE)
  const [detRetriveError, setDetRetriveError] = React.useState<boolean>(false)
  const [holdReportGen, setholdReportGen] = React.useState<boolean>(false)

  const attendanceSumReportResponse = useSelector(
    (state: AppStateDto) => state.report.attendanceSummaryReport.data.data
  )
  const isAttendanceSumReportResponseLoading = useSelector(
    (state: AppStateDto) => state.report.attendanceSummaryReport.isLoading
  )
  const attendanceSumProjectWiseReportResponse = useSelector(
    (state: AppStateDto) => state.report.attendanceSummaryReportProjectWise.data.data
  )
  const isAttendanceSumProjectWiseReportResponseLoading = useSelector(
    (state: AppStateDto) => state.report.attendanceSummaryReportProjectWise.isLoading
  )
  const clientHierachy = useSelector(
    (state: AppStateDto) => state.report.getUserClientHierarchy.data
  )
  const clientLoading = useSelector(
    (state: AppStateDto) => state.report.getUserClientHierarchy.isLoading
  )
  const dataRetrieveError = useSelector(
    (state: AppStateDto) => state.report.attendanceSummaryReport.error
  )

  useEffect(() => {
    dispatch(reportActions.resetAttendanceSummaryDetail())
    dispatch(reportActions.getUserClientHierarchy({ getAll: true, getDisabled: false }))
  }, [])

  useEffect(() => {
    if (
      attendanceSumReportResponse?.length === 0 &&
      !isAttendanceSumReportResponseLoading &&
      holdReportGen
    ) {
      setDetRetriveError(true)
      setTimeout(() => setDetRetriveError(false), 2000)
    } else {
      setDetRetriveError(false)
    }

    if (
      attendanceSumReportResponse?.length >= 1 &&
      !isAttendanceSumReportResponseLoading &&
      holdReportGen
    ) {
      const AttendanceSumReportDisplayFilterParams: AttendanceSummaryReportDisplayFilterParams = {
        startDate: moment(formValues.startDate.value).format('YYYY-MM-DD'),
        endDate: moment(formValues.endDate.value).format('YYYY-MM-DD'),
        clientName: formValues.client.value.clientName ? formValues.client.value.clientName : null,
        billing: formValues.billing.value,
      }
      // Creating & Downloading the excel report
      attendanceSummaryGenarations(
        attendanceSumReportResponse,
        AttendanceSumReportDisplayFilterParams
      )
    }
  }, [attendanceSumReportResponse, isAttendanceSumReportResponseLoading, holdReportGen])

  useEffect(() => {
    if (
      attendanceSumProjectWiseReportResponse?.length === 0 &&
      !isAttendanceSumProjectWiseReportResponseLoading &&
      holdReportGen
    ) {
      setDetRetriveError(true)
      setTimeout(() => setDetRetriveError(false), 2000)
    } else {
      setDetRetriveError(false)
    }

    if (
      attendanceSumProjectWiseReportResponse?.length >= 1 &&
      !isAttendanceSumProjectWiseReportResponseLoading &&
      holdReportGen
    ) {
      const AttendanceSumProjectWiseReportDisplayFilterParams: AttendanceSummaryReportDisplayFilterParams =
        {
          startDate: moment(formValues.startDate.value).format('YYYY-MM-DD'),
          endDate: moment(formValues.endDate.value).format('YYYY-MM-DD'),
          clientName: formValues.client.value.clientName
            ? formValues.client.value.clientName
            : null,
          projectName: formValues.project.value.teamName ? formValues.project.value.teamName : null,
          billing: formValues.billing.value,
        }
      // Creating & Downloading the excel report
      attendanceSummaryProjectWiseGenarations(
        attendanceSumProjectWiseReportResponse,
        AttendanceSumProjectWiseReportDisplayFilterParams
      )
    }
  }, [
    attendanceSumProjectWiseReportResponse,
    isAttendanceSumProjectWiseReportResponseLoading,
    holdReportGen,
  ])

  useEffect(() => {
    if (dataRetrieveError?.error) {
      setDetRetriveError(true)
      setTimeout(() => setDetRetriveError(false), 2000)
    }
  }, [dataRetrieveError])
  useEffect(() => {
    // devide  client , project, users from client hierachy api
    setClientHierarchyclientList(clientHierachy)
    const filterByClientBy = filterByClientHirachy()
    setClientHierarchyProjectList(filterByClientBy.teams)
  }, [clientHierachy])
  const onAttendanceSumSearchWithFilters = (
    filters: AttendanceSummaryReportDisplayFilterParams
  ) => {
    setholdReportGen(true)
    if (value === '1') {
      dispatch(reportActions.getAttendanceSummaryReport(filters))
    } else {
      dispatch(reportActions.getAttendanceSummaryReportProjectWise(filters))
    }
  }

  const reset = () => {
    dispatch(reportActions.resetAttendanceSummaryDetail())
  }

  const onAttendanceSumSearch = async () => {
    const [validatedData, isValid] = await validateFormData(formValues)
    setFormValues(validatedData)
    if (isValid) {
      const AttendanceReportFilterParams: AttendanceSummaryReportDisplayFilterParams = {
        startDate: moment(formValues.startDate?.value).format('YYYY-MM-DD'),
        endDate: moment(formValues.endDate?.value).format('YYYY-MM-DD'),
        clientId: formValues.client.value.clientId ? formValues.client.value.clientId : null,
        projectId: formValues.project.value.teamId ? formValues.project.value.teamId : null,
        billing: formValues.billing.value,
      }
      onAttendanceSumSearchWithFilters(AttendanceReportFilterParams)
    }
  }

  const onReset = () => {
    setResetKeys(RESET_KEYS)
    setFormValues(INITIAL_STATE)
    reset()
  }
  const handleChange = (property: string, value: any) => {
    switch (property) {
      case 'startDate':
        setFormValues({
          ...formValues,
          startDate: {
            ...formValues.startDate,
            value: value,
            error: null,
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
            error: null,
          },
        })
        break
      // case "client":
      //   // setFormValues({ ...formValues,
      //   //   clientId: {...formValues.clientId,
      //   //     value: value ? value.clientId : '',
      //   //     clientName: value ? value.clientName : '',
      //   //     error: null
      //   //    }

      //   // })
      //   break;
      case 'client':
        if (value) {
          setClientHierarchyProjectList(value.teams)
          setFormValues({
            ...formValues,
            client: {
              ...formValues['client' as keyof typeof formValues],
              value: value,
              error: null,
              disable: false,
            },
            project: {
              ...formValues['project' as keyof typeof formValues],
              value: {} as UserClientHierarchyTeamsDto,
              error: null,
              disable: false,
            },
          })
        } else {
          setFormValues({
            ...formValues,
            client: {
              ...formValues['client' as keyof typeof formValues],
              value: {} as UserClientHierarchyDto,
              error: null,
              disable: false,
            },
            project: {
              ...formValues['project' as keyof typeof formValues],
              value: {} as UserClientHierarchyTeamsDto,
              error: null,
              disable: false,
            },
          })
          const filterByClientBy = filterByClientHirachy()
          setClientHierarchyProjectList(filterByClientBy.teams)
        }
        break
      case 'project':
        if (value) {
          setFormValues({
            ...formValues,
            project: {
              ...formValues['project' as keyof typeof formValues],
              value: value,
              disable: false,
            },
          })
        } else {
          setFormValues({
            ...formValues,
            project: {
              ...formValues['project' as keyof typeof formValues],
              value: {} as UserClientHierarchyTeamsDto,
              error: null,
              disable: false,
            },
          })
          if (Object.keys(formValues.client.value).length > 0) {
            const filteredClientList = clientHierarchyClientList?.filter(
              (client: UserClientHierarchyDto) =>
                client.clientId === formValues.client.value.clientId
            )
            const projectList: UserClientHierarchyTeamsDto[] = []
            if (filteredClientList.length > 0) {
              for (const client of filteredClientList) {
                if (client.teams && client.teams.length > 0) {
                  for (const team of client.teams) {
                    const isIncluded = projectList.some((i) => i.teamId === team.teamId)
                    if (!isIncluded && team.teamId !== null) {
                      projectList.push({
                        teamId: team.teamId,
                        teamName: team.teamName,
                        users: team.users,
                      })
                    }
                  }
                }
              }
            }
            setClientHierarchyProjectList(projectList)
          }
        }
        break
      case 'billing':
        setFormValues({
          ...formValues,
          billing: { ...formValues.billing, value: value, checked: value, error: null },
        })
        break
    }
  }

  const [clientHierarchyClientList, setClientHierarchyclientList] = useState<
    UserClientHierarchyDto[]
  >([])
  const [clientHierarchyProjectList, setClientHierarchyProjectList] = useState<TeamSelectDto[]>([])
  const filterByClientHirachy = (): AllClientHierachyDto => {
    const clientHierachyObject = {} as AllClientHierachyDto
    const projectList: UserClientHierarchyTeamsDto[] = []
    if (clientHierachy?.length > 0) {
      for (const client of clientHierachy) {
        if (client.teams && client.teams.length > 0) {
          for (const team of client.teams) {
            const isIncluded = projectList.some((i) => i.teamId === team.teamId)
            if (!isIncluded && team.teamId !== null) {
              projectList.push({
                teamId: team.teamId,
                teamName: team.teamName,
                users: team.users,
              })
            }
          }
        }
      }
    }
    clientHierachyObject.teams = projectList
    return clientHierachyObject
  }
  const [value, setValue] = React.useState('1')
  const handleTabChange = (newValue: string) => {
    onReset()
    setValue(newValue)
  }
  return (
    <React.Fragment>
      <AppLayout breadcrumb="Attendance Summary Report" componentTitle="Attendance Summary Report">
        <TabContext value={value}>
          <Box>
            <TabList onChange={(_event, value) => handleTabChange(value)} indicatorColor="primary">
              <Tab label="Client" value="1" style={{ textTransform: 'capitalize' }} />
              <Tab label="Project" value="2" style={{ textTransform: 'capitalize' }} />
            </TabList>
          </Box>
          <Divider />
          <Grid container spacing={2} direction="row" className="content-padding">
            <Grid size={{ md: 3 }} className="sectionTitleHolder">
              <h3>Generate Attendance Summary Report</h3>
              {value === '1' ? (
                <p>
                  Select Start Date and End Date to filter results client wise. The Excel Report
                  will be downloaded based on the filtered results.
                </p>
              ) : (
                <p>
                  Select Start Date and End Date to filter results project wise. The Excel Report
                  will be downloaded based on the filtered results.
                </p>
              )}
            </Grid>
            <Grid size={{ md: 7 }}>
              {detRetriveError ? (
                <div style={{ paddingTop: '5px' }}>
                  <CustomAlert
                    displayText={
                      dataRetrieveError ? dataRetrieveError.msg : 'No data for the report'
                    }
                    severity="warning"
                  />
                </div>
              ) : (
                <div></div>
              )}

              <TabPanel value="1">
                <AttendanceSummaryForm
                  clientLoading={clientLoading}
                  userClientHierarchy={clientHierarchyClientList || []}
                  isAttendanceSumReportResponseLoading={isAttendanceSumReportResponseLoading}
                  reset={onReset}
                  formValues={formValues}
                  handleChange={handleChange}
                  onAttendanceSumSearch={onAttendanceSumSearch}
                  resetKeys={resetKeys}
                />
              </TabPanel>
              <TabPanel value="2">
                <AttendanceSummaryForm
                  clientLoading={clientLoading}
                  userClientHierarchy={clientHierarchyClientList || []}
                  isAttendanceSumReportResponseLoading={isAttendanceSumReportResponseLoading}
                  reset={onReset}
                  formValues={formValues}
                  handleChange={handleChange}
                  onAttendanceSumSearch={onAttendanceSumSearch}
                  resetKeys={resetKeys}
                  teamList={clientHierarchyProjectList}
                  isAttendanceSumProjectWiseReportResponseLoading={
                    isAttendanceSumProjectWiseReportResponseLoading
                  }
                />
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </AppLayout>
    </React.Fragment>
  )
}

export default AttendanceSummary
