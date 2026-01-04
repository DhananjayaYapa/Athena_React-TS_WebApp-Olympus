import React, { useState } from 'react'
import {
  acenturaLogo,
  allAppsIcon,
  athenaIcon,
  hermesIcon,
  heraIcon,
  demeterIcon,
} from '../../assets/images'
import {
  APP_ROUTES,
  APP_CONFIGS,
  APP_FEATURE_KEYS,
  APPLICATION_IDS,
} from '../../utilities/constants'
import { AppLayoutHeader } from '../index'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Tooltip from '@mui/material/Tooltip'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { Accordion, AppAuthorizer, DefaultTeamNotification } from '../../components/index'
import styles from './AppLayout.module.scss'
import { List } from '@mui/material'
import { AppStateDto, Application } from '../../utilities/models'
import { authActions } from '../../redux/actions'
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined'
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined'
import { IPublicClientApplication } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
const AppLayout: React.FC<{
  children: React.ReactNode
  breadcrumb: string
  componentTitle: string
}> = (props) => {
  const { instance } = useMsal()
  const dispatch = useDispatch()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorizedUserDetail = useSelector((state: any) => state.auth.authorizedUser.data)
  const [sideNavigation, setSideNavigation] = useState(true)
  const [isDefaultTeamMissing, setIsDefaultTeamMissing] = useState(false)
  const [navClass, setNavClass] = useState('')
  const [roleListOpen, setRoleListOpen] = React.useState(false)

  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)
  const activeUserRole = useSelector((state: AppStateDto) => state.auth.activeUserRole)

  const authorizedUserRoles = useSelector((state: AppStateDto) => state.auth.authorizedUserRoles)
  const allocations = useSelector((state: AppStateDto) => state.allocation.allocations)

  React.useEffect(() => {
    if (!sideNavigation) {
      setNavClass('collapsed')
    } else {
      setNavClass('')
    }
  }, [sideNavigation])

  React.useEffect(() => {
    if (allocations.data.length > 0) {
      setIsDefaultTeamMissing(
        !allocations.data[0].projectList.map((p) => p.isDefault).includes(true)
      )
    } else {
      setIsDefaultTeamMissing(false)
    }
  }, [allocations])

  const setActiveUserRole = (key: string) => {
    window.location.reload()
    dispatch(authActions.setActiveUserRole(key))
  }

  const handleClickRoleList = () => {
    setRoleListOpen(!roleListOpen)
  }

  const handleSignOut = (instance: IPublicClientApplication) => {
    dispatch(authActions.logout())
    instance.logoutRedirect().catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Sign-out Error', e)
    })
  }
  return (
    <React.Fragment>
      <div className={`layout-row authorizedContainer`}>
        <aside className={`layout-row sideNavigation ${navClass}`}>
          <aside className="navBar">
            <div className={`menuBox ${navClass}`}>
              <a className="menuIcon" onClick={() => setSideNavigation(!sideNavigation)}>
                <span></span>
              </a>
            </div>

            <div className="appLinkIconGroup">
              {authorizedUserDetail.authorizedApps?.some(
                (item: Application) => item.applicationId === APPLICATION_IDS.DASHBOARD
              ) && (
                <div>
                  <div className="appLinkIcon">
                    <Tooltip title="All Apps" placement="right">
                      <a href={`${APP_CONFIGS.DASHBOARD_CLIENT}dashboard`}>
                        <img src={allAppsIcon} />
                      </a>
                    </Tooltip>
                  </div>
                  <hr />
                </div>
              )}

              {authorizedUserDetail.authorizedApps?.some(
                (item: Application) => item.applicationId === APPLICATION_IDS.HERMES
              ) && (
                <div>
                  <div className="appLinkIcon">
                    <Tooltip title="Hermes" placement="right">
                      <a href={`${APP_CONFIGS.HERMES_CLIENT}dashboard`}>
                        <img src={hermesIcon} />
                      </a>
                    </Tooltip>
                  </div>
                  <hr />
                </div>
              )}

              {authorizedUserDetail.authorizedApps?.some(
                (item: Application) => item.applicationId === APPLICATION_IDS.ATHENA
              ) && (
                <div>
                  <div className="appLinkIcon">
                    <Tooltip title="Athena" placement="right">
                      <a href={`${APP_CONFIGS.ATHENA_CLIENT}dashboard`}>
                        <img src={athenaIcon} />
                      </a>
                    </Tooltip>
                  </div>
                </div>
              )}

              {authorizedUserDetail.authorizedApps?.some(
                (item: Application) => item.applicationId === APPLICATION_IDS.HERA
              ) && (
                <div>
                  <hr />
                  <div className="appLinkIcon">
                    <Tooltip title="Hera" placement="right">
                      <a href={`${APP_CONFIGS.HERA_CLIENT}dashboard`}>
                        <img src={heraIcon} />
                      </a>
                    </Tooltip>
                  </div>
                </div>
              )}

              {authorizedUserDetail.authorizedApps?.some(
                (item: Application) => item.applicationId === APPLICATION_IDS.DEMETER
              ) && (
                <div>
                  <hr />
                  <div className="appLinkIcon">
                    <Tooltip title="Demeter" placement="right">
                      <a href={`${APP_CONFIGS.DEMETER_CLIENT}dashboard`}>
                        <img src={demeterIcon} />
                      </a>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            <div className={`cursorPointer profile`}>
              <span className={`infoCircle layout-row layout-align-center center`}>
                <sup>{authorizedUser.data.tag}</sup>
              </span>
              <div className="infoMenu">
                <span className={styles.activeUserRole}>{activeUserRole.data.userRoleName}</span>
                <p className="name">
                  {authorizedUser.data.firstName} {authorizedUser.data.lastName}
                </p>
                <span className="email">{authorizedUser.data.username}</span>
                {authorizedUserRoles.data &&
                  authorizedUserRoles.data.length &&
                  authorizedUserRoles.data.length > 1 && (
                    <div className={'switchRole layout-row'}>
                      <div className={'layout-row'}>
                        <a onClick={handleClickRoleList}>Switch Role</a>
                        <ArrowRightOutlinedIcon className="switchRoleArrow" />
                      </div>

                      <div className={'roleMenu layout-row'}>
                        <List disablePadding>
                          {authorizedUserRoles.data
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .map((i: any) => ({ role: i.userRoleName, key: i.userRoleKey }))
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .map((role: any, index: number) => (
                              <div key={index} onClick={() => setActiveUserRole(role.key)}>
                                <div
                                  className={
                                    authorizedUserRoles.data.length === index + 1
                                      ? 'switchRoleDiv_last layout-row'
                                      : 'switchRoleDiv layout-row'
                                  }
                                >
                                  <span>{role.role} </span>
                                  <br></br>
                                </div>
                              </div>
                            ))}
                        </List>
                      </div>
                    </div>
                  )}
                <Link to={APP_ROUTES.USER_PROFILE}>My Profile</Link>
                <a>Help</a>
                <a
                  className="signOut"
                  onClick={() => {
                    handleSignOut(instance)
                  }}
                >
                  Sign Out
                </a>
              </div>
            </div>
          </aside>
          <aside className={`navBarContent ${navClass}`}>
            <div className="contentGroup">
              <img className="logo" src={acenturaLogo} />
              <h1>Olympus Athena</h1>

              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[
                  APP_FEATURE_KEYS.VIEW_OWN_LEAVES,
                  APP_FEATURE_KEYS.VIEW_OWN_TIME_ENTRIES,
                ]}
              >
                <Link className="navLink" to={APP_ROUTES.DASHBOARD}>
                  <DashboardOutlinedIcon />
                  Dashboard
                </Link>
              </AppAuthorizer>

              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[APP_FEATURE_KEYS.CREATE_UPDATE_OWN_TIME_ENTRY]}
              >
                <Link className="navLink" to={APP_ROUTES.ADD_ATTENDANCE}>
                  <QueryBuilderOutlinedIcon />
                  Manage Attendance
                </Link>
              </AppAuthorizer>

              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[APP_FEATURE_KEYS.UPDATE_OWN_TIME_SHEET]}
              >
                <Link className="navLink" to={APP_ROUTES.MANAGE_TIME_ENTRIES}>
                  <HowToRegOutlinedIcon />
                  Manage Time Entries
                </Link>
              </AppAuthorizer>

              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[APP_FEATURE_KEYS.CREATE_UPDATE_ALL_TIME_ENTRY]}
              >
                <Link className="navLink" to={APP_ROUTES.EDIT_TIME_ENTRY}>
                  <EventAvailableOutlinedIcon />
                  Edit Time Entries
                </Link>
              </AppAuthorizer>

              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[APP_FEATURE_KEYS.CREATE_UPDATE_OWN_LEAVE]}
              >
                <Link className="navLink" to={APP_ROUTES.MARKING_LEAVE}>
                  <EventOutlinedIcon />
                  Marking Leave
                </Link>
              </AppAuthorizer>

              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[
                  APP_FEATURE_KEYS.APPROVE_REJECT_LEAVES,
                  APP_FEATURE_KEYS.CREATE_UPDATE_ALL_LEAVE,
                  APP_FEATURE_KEYS.UPDATE_LEAVE_COUNT_CONFIGURATION,
                ]}
                authorizeCondition="OR"
              >
                <Accordion icon={AssignmentIndOutlinedIcon} title={'Leave Management'}>
                  <ul className={styles.nestedList}>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[APP_FEATURE_KEYS.APPROVE_REJECT_LEAVES]}
                      >
                        <Link className={styles.nestedNav} to={APP_ROUTES.LEAVE_MANAGEMENT}>
                          Approve Leaves
                        </Link>
                      </AppAuthorizer>
                    </li>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[APP_FEATURE_KEYS.CREATE_UPDATE_ALL_LEAVE]}
                      >
                        <Link className={styles.nestedNav} to={APP_ROUTES.MARKING_LEAVE_HR}>
                          Insert Leave(HR)
                        </Link>
                      </AppAuthorizer>
                    </li>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[APP_FEATURE_KEYS.UPDATE_LEAVE_COUNT_CONFIGURATION]}
                      >
                        <Link className={styles.nestedNav} to={APP_ROUTES.LEAVE_CONFIGURATION}>
                          Leave Configuration
                        </Link>
                      </AppAuthorizer>
                    </li>
                  </ul>
                </Accordion>
              </AppAuthorizer>

              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[
                  APP_FEATURE_KEYS.ATHENA_ABSENTEEISM_REPORT,
                  APP_FEATURE_KEYS.ATHENA_ATTENDANCE_REPORT,
                  APP_FEATURE_KEYS.ATHENA_DETAILED_ATTENDANCE_REPORT,
                  APP_FEATURE_KEYS.ATHENA_ATTENDANCE_SUMMARY_REPORT,
                  APP_FEATURE_KEYS.ATHENA_ANNUAL_LEAVE_REPORT,
                ]}
                authorizeCondition="OR"
              >
                <Accordion icon={DescriptionOutlinedIcon} title={'Reports'}>
                  <ul className={styles.nestedList}>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[APP_FEATURE_KEYS.ATHENA_ABSENTEEISM_REPORT]}
                      >
                        <Link className={styles.nestedNav} to={APP_ROUTES.ABSENTEEISM_REPORT}>
                          Absenteeism
                        </Link>
                      </AppAuthorizer>
                    </li>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[APP_FEATURE_KEYS.ATHENA_ATTENDANCE_REPORT]}
                      >
                        <Link className={styles.nestedNav} to={APP_ROUTES.ATTENDANCE_REPORT}>
                          Attendance
                        </Link>
                      </AppAuthorizer>
                    </li>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[APP_FEATURE_KEYS.ATHENA_DETAILED_ATTENDANCE_REPORT]}
                      >
                        <Link
                          className={styles.nestedNav}
                          to={APP_ROUTES.DETAILED_ATTENDANCE_REPORT}
                        >
                          Attendance Detail
                        </Link>
                      </AppAuthorizer>
                    </li>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[APP_FEATURE_KEYS.ATHENA_ATTENDANCE_SUMMARY_REPORT]}
                      >
                        <Link
                          className={styles.nestedNav}
                          to={APP_ROUTES.ATTENDANCE_SUMMARY_REPORT}
                        >
                          Attendance Summary
                        </Link>
                      </AppAuthorizer>
                    </li>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[APP_FEATURE_KEYS.ATHENA_ANNUAL_LEAVE_REPORT]}
                      >
                        <Link
                          className={styles.nestedNav}
                          to={APP_ROUTES.ANNUAL_DETAILED_LEAVE_REPORT}
                        >
                          Annual Leave
                        </Link>
                      </AppAuthorizer>
                    </li>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[APP_FEATURE_KEYS.ATHENA_EXCEPTION_REPORT]}
                      >
                        <Link
                          className={styles.nestedNav}
                          to={APP_ROUTES.EXCEPTION_ATTENDANCE_REPORT}
                        >
                          Exception Report
                        </Link>
                      </AppAuthorizer>
                    </li>
                    <li>
                      <AppAuthorizer
                        activeRoleFeatures={activeUserRole.data.features}
                        authorizedFeatureKey={[]}
                      >
                        <Link className={styles.nestedNav} to={APP_ROUTES.TIME_ENTRY_REPORT}>
                          Time Entry Report
                        </Link>
                      </AppAuthorizer>
                    </li>
                  </ul>
                </Accordion>
              </AppAuthorizer>

              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[APP_FEATURE_KEYS.MANAGE_HOLIDAY_CALENDAR]}
              >
                <Link className="navLink" to={APP_ROUTES.NON_WORKING_DAYS}>
                  <CalendarTodayIcon />
                  Non Working Days
                </Link>
              </AppAuthorizer>
              <AppAuthorizer
                activeRoleFeatures={activeUserRole.data.features}
                authorizedFeatureKey={[APP_FEATURE_KEYS.USER_PROFILE]}
              >
                <Link className="navLink" to={APP_ROUTES.USER_PROFILE}>
                  <AccountCircleOutlinedIcon />
                  Profile
                </Link>
              </AppAuthorizer>
            </div>
          </aside>
        </aside>
        <aside className="content">
          <AppLayoutHeader
            componentBreadCrumb={props.breadcrumb}
            componentTitle={props.componentTitle}
          />
          <AppAuthorizer
            activeRoleFeatures={activeUserRole.data.features}
            authorizedFeatureKey={[APP_FEATURE_KEYS.CONFIGURE_OWN_DEFAULT_TEAM]}
          >
            {isDefaultTeamMissing && <DefaultTeamNotification />}
          </AppAuthorizer>

          {props.children}
        </aside>
      </div>
    </React.Fragment>
  )
}

export default AppLayout
