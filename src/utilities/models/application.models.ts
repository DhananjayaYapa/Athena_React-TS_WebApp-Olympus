import type { UserRoleDto } from '.'

export interface ApplicationUserRelDto {
  applicationId: number
  applicationKey: string
  applicationName: string
  isSuperAdmin: boolean
  relId: number
  userAppIsEnabled: number
  userRole?: string
  userRoleId?: number
}
export interface ApplicationDto {
  applicationId: number
  userRoles: UserRoleDto[]
}
