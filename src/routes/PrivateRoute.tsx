import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '../utilities/constants'
import type { AppStateDto } from '../utilities/models'
const PrivateRoute: React.FC<{
  redirectTo: string
  children: React.ReactNode
  permissionKeys: string[]
}> = (props) => {
  const navigate = useNavigate()
  const activeUserRole = useSelector((state: AppStateDto) => state.auth.activeUserRole)
  const authorizedUser = useSelector((state: AppStateDto) => state.auth.authorizedUser)

  React.useEffect(() => {
    if (authorizedUser.isFetched && activeUserRole.isFetched) {
      if (authorizedUser.data.isAuthorized) {
        const isPermissionGranted = props.permissionKeys.every((role) =>
          activeUserRole.data.features.map((i) => i.featureKey).includes(role)
        )
        if (!isPermissionGranted) {
          navigate(APP_ROUTES.USER_PROFILE)
        }
      } else {
        navigate(APP_ROUTES.ROOT)
      }
    }
  }, [activeUserRole.isFetched, authorizedUser.isFetched])

  return (
    <React.Fragment>
      <AuthenticatedTemplate>{props.children}</AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Navigate to={props.redirectTo} />
      </UnauthenticatedTemplate>
    </React.Fragment>
  )
}

export default PrivateRoute
