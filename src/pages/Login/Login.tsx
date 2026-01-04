import React from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { loginRequest } from '../../core'
import styles from './Login.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { APP_CONFIGS, APP_FEATURE_KEYS, APP_ROUTES } from '../../utilities/constants'
import { IPublicClientApplication } from '@azure/msal-browser'
import { acenturaLogo } from '../../assets/images'
import { authActions } from '../../redux/actions'
import { MsLoginButton } from '../../components'
import { AppStateDto } from '../../utilities/models'

const Login = () => {
  const isAuthenticated = useIsAuthenticated()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { instance, accounts } = useMsal()
  const userAuthorizing = useSelector((state: AppStateDto) => state.auth.userAuthorizing)
  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)
  const activeUserRole = useSelector((state: AppStateDto) => state.auth.activeUserRole)

  React.useEffect(() => {
      
    if (isAuthenticated) {
      
      instance.setActiveAccount(accounts[0])
      dispatch(authActions.authorizeUser())
    }
  }, [isAuthenticated])

  React.useEffect(() => {
    if (isAuthenticated && authorizedUser.data.isAuthorized) {
      if (Object.keys(activeUserRole.data).length > 0) {
        if (
          activeUserRole.data.features
            .map((i) => i.featureKey)
            .includes(APP_FEATURE_KEYS.VIEW_OWN_TIME_ENTRIES)
        ) {
          navigate(APP_ROUTES.DASHBOARD)
        } else {
          navigate(APP_ROUTES.USER_PROFILE)
        }
      }
    }
  }, [userAuthorizing, authorizedUser, activeUserRole])

  const handleLogin = (instance: IPublicClientApplication) => {
    instance.loginRedirect(loginRequest).catch((error: string) => {
      // eslint-disable-next-line no-console
      console.error(error)
    })
  }

  return (
    <section
      className={`${styles.container} content-padding container layout-row layout-wrap layout-align-center center`}
    >
      <section className={`${styles.login} layout-row`}>
        <aside className={styles.loginRandomImage} />
        <aside className={styles.loginActions}>
          <img alt="acenturaLogo" className={styles.logo} src={acenturaLogo} />
          <h1>Welcome to Olympus</h1>
          <p>Olympus is the internal application portfolio of Acentura.</p>
          <div className={styles.loginNotification}>
            {!!userAuthorizing.isLoading && <p className={styles.isAuthorizing}>Authorizing...</p>}
            {!userAuthorizing.isLoading && !!userAuthorizing.error && (
              <p className={styles.error}>
                {userAuthorizing.error}
                <a href={`${APP_CONFIGS.DASHBOARD_CLIENT}dashboard`}>[Go to Dashboard]</a>
              </p>
            )}
          </div>
          <MsLoginButton handleLogin={handleLogin} disabled={userAuthorizing.isLoading} />
          <div className={styles.loginFooter}>
            <span className="f-14">
              {' '}
              &copy; {2022} {APP_CONFIGS.APP_OWNER}
            </span>
          </div>
        </aside>
      </section>
    </section>
  )
}

export default Login
