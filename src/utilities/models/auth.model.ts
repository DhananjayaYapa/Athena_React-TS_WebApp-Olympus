import type { ApplicationDto, UserRoleDto } from '.'

export interface AuthStateDto {
  userAuthorizing: {
    isAuthorized: boolean
    isLoading: boolean
    error: string | null
  }
  authorizedUser: {
    data: AuthorizedUserInfo
    isLoading: boolean
    isFetched: boolean
    error: string | null
  }
  authorizedUserRoles: {
    data: UserRoleDto[]
    isLoading: boolean
    isFetched: boolean
    error: string | null
  }
  activeUserRole: {
    data: UserRoleDto
    isLoading: boolean
    isFetched: boolean
  }
}

export interface AuthorizedUserInfo {
  designation: string
  designationId: number
  firstName: string
  lastName: string
  username: string
  tag: string
  isAuthorized: boolean
  timeZone: string
  authorizedApps?: Application[]
}
export interface Application {
  applicationId: number
  applicationName: string
}
export interface AuthorizedUserApps {
  applications: ApplicationDto[]
}
