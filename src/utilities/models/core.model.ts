import type { AllocationStateDto, AuthStateDto } from '.'

export interface ApiResponseDto<T> {
  data: T
  message: string
}

export interface AppStateDto {
  auth: AuthStateDto
  allocation: AllocationStateDto
  [key: string]: any
}
