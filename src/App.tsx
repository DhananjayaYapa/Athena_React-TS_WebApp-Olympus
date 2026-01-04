import React from 'react'
import AppRoutes from './routes'
import { PrimaryTheme } from './assets/theme/theme'
import { ThemeProvider } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { allocationActions, authActions } from './redux/actions'
import type { AppStateDto, GetAllocationsParamsDto } from './utilities/models'
import { APP_FEATURE_KEYS } from './utilities/constants'
// import { useIsAuthenticated } from '@azure/msal-react'

const App = () => {
  const dispatch = useDispatch()
  // const isAuthenticated = useIsAuthenticated()
  const activeUserRole = useSelector((state: AppStateDto) => state.auth.activeUserRole)
  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)

  React.useEffect(() => {
    // if (isAuthenticated) {
    dispatch(authActions.fetchAuthorizeUser())
    dispatch(authActions.fetchAuthorizeUserRoles())
    dispatch(authActions.fetchActiveUserRole())
    // }
  }, [])

  React.useEffect(() => {
    if (authorizedUser.isFetched && activeUserRole.isFetched) {
      if (
        activeUserRole.data.features
          .map((f) => f.featureKey)
          .includes(APP_FEATURE_KEYS.CREATE_UPDATE_OWN_LEAVE)
      ) {
        const allocationsListParams: GetAllocationsParamsDto = {
          requestedDate: new Date().toDateString(),
          username: authorizedUser.data.username,
        }
        dispatch(allocationActions.getAllocations(allocationsListParams))
      } else {
        dispatch(allocationActions.clearAllocations())
      }
    }
  }, [activeUserRole, authorizedUser, dispatch])

  return (
    <ThemeProvider theme={PrimaryTheme}>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
