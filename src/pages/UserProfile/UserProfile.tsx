import React, { useEffect, useState } from 'react'
import { Grid, Divider, Chip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { AppLayout } from '../../templates'
import { teamsActions, alertActions, allocationActions } from '../../redux/actions'
import { SetDefaultTeamDto, GetAllocationsParamsDto, AppStateDto } from '../../utilities/models/'
import { AppAuthorizer, UserTeamsTable } from '../../components/'
import styles from './UserProfile.module.scss'
import { Alert } from '@mui/material'
import { APP_FEATURE_KEYS } from '../../utilities/constants'

const UserProfile: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)
  // const updateDefaultTeam = useSelector((state: AppStateDto) => state.teams.teamList);
  const updateDefaultTeamAlert = useSelector((state: AppStateDto) => state.alerts.updateDefaultTeam)
  const allocationTeamList = useSelector((state: AppStateDto) => state.allocation.allocations)
  // get from local storage
  const activeUserRole = useSelector((state: AppStateDto) => state.auth.activeUserRole)
  useEffect(() => {
    dispatch(allocationActions.clearAllocations())
    getAllocationTeamList()
  }, [])

  useEffect(() => {
    if (updateDefaultTeamAlert.severity === 'success') {
      getAllocationTeamList()
    }
  }, [updateDefaultTeamAlert])

  const getAllocationTeamList = () => {
    const allocationsListParams: GetAllocationsParamsDto = {
      requestedDate: new Date().toDateString(),
      username: authorizedUser.data.username,
    }
    dispatch(allocationActions.getAllocations(allocationsListParams))
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const onDefaultTeamUpdate = (allocationId: number) => {
    const payload: SetDefaultTeamDto = {
      allocationId: allocationId,
      username: authorizedUser.data.username,
    }
    dispatch(teamsActions.setDefaultTeam(payload))
  }

  const clearUpdateDefaultTeamAlert = () => {
    dispatch(alertActions.clearUpdateDefaultTeamAlert())
  }

  return (
    <React.Fragment>
      <AppLayout breadcrumb="User Profile" componentTitle="User Profile">
        <Grid container spacing={3} className="content-padding">
          <Grid size={{ md: 6 }} className="sectionTitleHolder">
            <div className={styles.userInfoContainer}>
              <div className={styles.userTag}>
                <span>{authorizedUser.data.tag}</span>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.name}>
                  {`${authorizedUser.data.firstName} ${authorizedUser.data.lastName}`}
                </span>
                {/* <br/> */}
                <span className={styles.username}>{authorizedUser.data.username}</span>
                <Chip className={styles.tecChipStyle} label={activeUserRole.data.userRoleName} />
              </div>
            </div>
          </Grid>
        </Grid>
        <Divider />
        <AppAuthorizer
          activeRoleFeatures={activeUserRole.data.features}
          authorizedFeatureKey={[APP_FEATURE_KEYS.CONFIGURE_OWN_DEFAULT_TEAM]}
        >
          <Grid container spacing={3} className="content-padding">
            <Grid size={{ md: 3 }} className="sectionTitleHolder">
              <h3>User Entitlements</h3>
              <span>You can change the default team from the listed teams in this section.</span>
            </Grid>
            <Grid size={{ md: 9 }} className="sectionTitleHolder">
              {updateDefaultTeamAlert.message && (
                <Alert
                  className="mb-m"
                  onClose={clearUpdateDefaultTeamAlert}
                  severity={updateDefaultTeamAlert.severity}
                >
                  {updateDefaultTeamAlert.message}
                </Alert>
              )}
              <UserTeamsTable
                page={page}
                rowsPerPage={rowsPerPage}
                isLoading={allocationTeamList.isLoading}
                isUpdating={false}
                onHandleChangePage={handleChangePage}
                onHandleChangeRowsPerPage={handleChangeRowsPerPage}
                onHandleSetDefaultTeam={onDefaultTeamUpdate}
                allocationTeamList={allocationTeamList.data || []}
              />
            </Grid>
          </Grid>
        </AppAuthorizer>
      </AppLayout>
    </React.Fragment>
  )
}

export default UserProfile
