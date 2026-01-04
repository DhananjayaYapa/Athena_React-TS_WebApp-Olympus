import React, { useState, useEffect } from 'react'
import { Divider, Grid, FormControl, TextField } from '@mui/material'
import { AppLayout } from '../../templates'
import { useDispatch, useSelector } from 'react-redux'
import { leaveActions, userActions, alertActions } from '../../redux/actions'
import InsertLeaveForm from '../../components/leave-count-configure/InsertLeaveCountForm/InsertLeaveCountForm'
import LeaveCountTable from '../../components/leave-count-configure/LeaveCountTable/LeaveCountTable'
import {
  AlertDto,
  LeaveCountBriefDto,
  LeaveCountDataDto,
  AddLeaveCountDto,
  AppStateDto,
  GetUserListBriefParamsDto,
} from '../../utilities/models'
import { validateFormData } from '../../utilities/helpers'
import { Alert, Autocomplete } from '@mui/material'
import { LEAVE_TYPE_IDS } from '../../utilities/constants/app.constants'

const InsertLeave = () => {
  const dispatch = useDispatch()

  const INITIAL_EDITING_ROW_STATE = {
    rowId: { value: -1 },
    username: { value: '' },
    casual: {
      value: 0,
      leaveCountId: 0,
      validator: 'number',
      isRequired: true,
      error: null,
      disable: false,
    },
    annual: {
      value: 0,
      leaveCountId: 0,
      validator: 'number',
      isRequired: true,
      error: null,
      disable: false,
    },
    lieu: {
      value: 0,
      leaveCountId: 0,
      validator: 'number',
      isRequired: true,
      error: null,
      disable: false,
    },
  }

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [isEditingRow, setIsEditingRow] = React.useState(INITIAL_EDITING_ROW_STATE)

  // const employees = useSelector((state: AppStateDto) => state.user.userList.data);
  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser.data)
  const employees = useSelector((state: AppStateDto) => state.user.userListBrief)
  const leaveCountData = useSelector((state: AppStateDto) => state.leave.leaveCount)
  const addLeaveCountAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.addLeaveCount
  )
  const updateLeaveCountAlert: AlertDto = useSelector(
    (state: AppStateDto) => state.alerts.updateLeaveCount
  )
  const addLeaveCount = useSelector((state: AppStateDto) => state.leave.addLeaveCount)
  const updateLeaveCount = useSelector((state: AppStateDto) => state.leave.updateLeaveCount)
  const filteredUsers =
    employees.data &&
    employees.data?.data?.filter((user: any) => user.username !== authorizedUser.username)
  useEffect(() => {
    getUserListBrief()
    dispatch(leaveActions.getLeaveCount())

    return () => {
      clearAddLeaveCountAlert()
      clearUpdateLeaveCountAlert()
    }
  }, [])

  useEffect(() => {
    if (updateLeaveCountAlert.severity === 'success') {
      ignoreRowChanges()
      handleUserChange()
    }
  }, [updateLeaveCountAlert])

  useEffect(() => {
    if (addLeaveCountAlert.severity === 'success') {
      handleUserChange()
    }
  }, [addLeaveCountAlert])
  const getUserListBrief = () => {
    const userListBrief: GetUserListBriefParamsDto = {
      getAll: true,
      userRoleKey: 'EMPLOYEE',
    }
    dispatch(userActions.getUserListBrief(userListBrief))
  }
  const submitLeaveCount = (leaveCountData: AddLeaveCountDto) => {
    dispatch(leaveActions.addLeaveCount(leaveCountData))
  }

  const clearAddLeaveCountAlert = () => {
    dispatch(alertActions.clearAddLeaveCountAlert())
  }

  const clearUpdateLeaveCountAlert = () => {
    dispatch(alertActions.clearUpdateLeaveCountAlert())
  }

  const handleUserChange = (username?: string) => {
    dispatch(leaveActions.getLeaveCount(username))
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // handle pagination rows per page dropdown change event
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const getLeaveCountData = (
    data: LeaveCountBriefDto[],
    leaveTypeId: number
  ): LeaveCountDataDto => {
    const leaveData = data.map((i: LeaveCountBriefDto) => i.leaveTypeId).indexOf(leaveTypeId)
    if (leaveData > -1) {
      return {
        leaveCount: data[leaveData].entitledLeaveCount,
        leaveCountId: data[leaveData].leaveCountId,
      }
    } else {
      return { leaveCount: 0, leaveCountId: 0 }
    }
  }

  const rowEditTrigger = (data: any) => {
    const { leaveCountData } = data
    setIsEditingRow({
      ...isEditingRow,
      username: { value: data.username },
      annual: {
        ...isEditingRow.annual,
        value: getLeaveCountData(leaveCountData, LEAVE_TYPE_IDS.ANNUAL).leaveCount,
        leaveCountId: getLeaveCountData(leaveCountData, LEAVE_TYPE_IDS.ANNUAL).leaveCountId,
      },
      casual: {
        ...isEditingRow.casual,
        value: getLeaveCountData(leaveCountData, LEAVE_TYPE_IDS.CASUAL).leaveCount,
        leaveCountId: getLeaveCountData(leaveCountData, LEAVE_TYPE_IDS.CASUAL).leaveCountId,
      },
      lieu: {
        ...isEditingRow.lieu,
        value: getLeaveCountData(leaveCountData, LEAVE_TYPE_IDS.LIEU).leaveCount,
        leaveCountId: getLeaveCountData(leaveCountData, LEAVE_TYPE_IDS.LIEU).leaveCountId,
      },
    })
  }

  const handleTableRowChange = (property: string, value: any, leaveCountId: any) => {
    setIsEditingRow({
      ...isEditingRow,
      [property]: {
        ...isEditingRow[property as keyof typeof isEditingRow],
        value: value,
        error: null,
        leaveCountId,
      },
    })
  }

  const ignoreRowChanges = () => {
    setIsEditingRow(INITIAL_EDITING_ROW_STATE)
    // dispatch(userActions.clearUserTeams())
  }

  const saveTableRowChanges = async () => {
    const [validatedData, isValid] = await validateFormData(isEditingRow)
    setIsEditingRow(validatedData)

    if (isValid) {
      const payload: any = {
        username: isEditingRow.username.value,
        leaveCountData: [
          {
            leaveCountId: isEditingRow.annual.leaveCountId, //annual
            leaveCount: isEditingRow.annual.value,
          },
          {
            leaveCountId: isEditingRow.lieu.leaveCountId, //lieu
            leaveCount: isEditingRow.lieu.value,
          },
          {
            leaveCountId: isEditingRow.casual.leaveCountId, //casual
            leaveCount: isEditingRow.casual.value,
          },
        ],
      }
      dispatch(leaveActions.updateLeaveCount(payload))
    }
  }

  return (
    <React.Fragment>
      <AppLayout breadcrumb="Leave Configuration" componentTitle="Leave Configuration">
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3>Configure leave count for user</h3>
            <p>Insert annual, casual and lieu leave count in this section.</p>
            {/* <p className="appInfoMessage">The earliest start time and the latest end time will be recorded.</p> */}
          </Grid>
          <Grid size={{ md: 7 }} className="sectionTitleHolder">
            {addLeaveCountAlert.message && (
              <Alert
                className="mb-m"
                onClose={clearAddLeaveCountAlert}
                severity={addLeaveCountAlert.severity}
              >
                {addLeaveCountAlert.message}
              </Alert>
            )}
            <InsertLeaveForm
              employees={filteredUsers || []}
              isProcessing={addLeaveCount.isLoading}
              addLeaveCountAlert={addLeaveCountAlert}
              onLeaveSubmit={submitLeaveCount}
            />
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3>Leave Count Details</h3>
            <p>Check and Update the leave count of the any user.</p>

            <FormControl style={{ width: '100%', paddingBottom: '20px' }}>
              <Autocomplete
                id="employee-select"
                size="small"
                key={''}
                options={filteredUsers || []}
                getOptionLabel={(option: any) => option.username || ''}
                onChange={(_event, value) => handleUserChange(value ? value.username : '')}
                renderInput={(params) => (
                  <TextField {...params} label="Username" variant="outlined" />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ md: 9 }} className="sectionTitleHolder">
            {updateLeaveCountAlert.message && (
              <Alert
                className="mb-m"
                onClose={clearUpdateLeaveCountAlert}
                severity={updateLeaveCountAlert.severity}
              >
                {updateLeaveCountAlert.message}
              </Alert>
            )}
            <LeaveCountTable
              employees={employees}
              leaveCountData={leaveCountData.data || []}
              isLoading={leaveCountData.isLoading}
              isProcessing={updateLeaveCount.isLoading}
              isEditingRow={isEditingRow}
              onRowChange={handleTableRowChange}
              onIgnoreRowChanges={ignoreRowChanges}
              onSaveRowChanges={saveTableRowChanges}
              onRowEditTrigger={rowEditTrigger}
              page={page}
              rowsPerPage={rowsPerPage}
              onHandleChangePage={handleChangePage}
              onHandleChangeRowsPerPage={handleChangeRowsPerPage}
              // onHandleUserChange={handleUserChange}
            />
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}

export default InsertLeave
