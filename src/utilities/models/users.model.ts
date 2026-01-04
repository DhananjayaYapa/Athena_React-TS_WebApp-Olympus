import type {
  ApplicationUserRelDto,
  ApplicationDto,
  Application,
  EntitlementDto,
  FeatureDto,
} from '.'
export interface AuthorizedUser {
  designation: string
  designationId: number
  firstName: string
  lastName: string
  username: string
  isClient: boolean
  isAuthorized: boolean
  applications: ApplicationDto
  authorizedApps?: Application[]
}

export interface UserSelectDto {
  username: string
  userId: number
}

export interface UserDto {
  applications: ApplicationUserRelDto[]
  firstName: string
  isEnabled: boolean
  isSuperAdmin: boolean
  joinDate: string
  lastName: string
  terminationDate?: string
  username: string
  createdBy: string
  userRoleId?: number
}

export interface GetUserListParamsDto {
  username?: string
  getDisabledUsers?: boolean
}
export interface GetUserListBriefParamsDto {
  userRoleKey?: string
  ignoreApplication?: boolean
  getAll?: boolean
  getDisabled?: boolean
}
export interface UserRolesDto {
  id: number
  role: string
}
export interface UserRoleDto {
  userRoleId: number
  userRoleName: string
  userRoleKey: string
  features: FeatureDto[]
  entitlements: EntitlementDto[]
}
