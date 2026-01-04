export interface UserClientHierarchyDto {
  clientId: number
  clientName: string
  teams: UserClientHierarchyTeamsDto[]
}

export interface UserClientHierarchyTeamsDto {
  teamId: number
  teamName: string
  users: UserClientHierarchyUserDto[]
}

export interface UserClientHierarchyUserDto {
  userId: number
  username: string
}

export interface getUserClientHierarchyListDto {
  getAll?: boolean
  getDisabled?: boolean
}
export interface AllClientHierachyDto {
  teams: UserClientHierarchyTeamsDto[]
}

export interface GetDisabledSbuParamDto {
  getDisabled?: string
  getAll?: boolean
}

export interface GetAllSbuListDataDto {
  sbuId: number
  sbuName: string
  sbuDesc: string
  isEnabled: boolean
}

export interface InitialSbuDto {
  sbuId: number
  sbuName: string
}

export interface SbuTeamsDto {
  teamId: number
  teamIsEnabled?: true
  teamName: string
  users?: SbuTeamUsersDto[]
}

export interface SbuTeamUsersDto {
  userId: number
  username: string
  firstName: string
  lastName: string
}
