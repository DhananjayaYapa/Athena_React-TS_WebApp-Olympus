export interface TeamListParamsDto {
  Username?: string
  getTeamRoles?: boolean
  getDisabledTeams?: boolean
  applicationKey?: string
}
export interface TeamListV2ParamsDto {
  getDisabledTeams?: boolean
  getAllProjects?: boolean
}
export interface TeamSelectDto {
  teamName: string
  teamId: number
}

export interface SetDefaultTeamDto {
  allocationId: number
  username: string
}

export interface TeamDto {
  teamName: string
  teamId: number
  relId: number
  isEnabled: boolean
  isDefaultTeam: boolean
  teamDesc: string
  teamIcon: string
  client: TeamClientDto[]
  applications: TeamApplicationsDto[]
}

export interface TeamClientDto {
  clentName: string
  clientId: number
  relId: number
}

export interface TeamApplicationsDto {
  applicationIcon: string
  applicationKey: string
  applicationName: string
}
