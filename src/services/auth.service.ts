import { APP_CONFIGS } from './../utilities/constants'
import Cookies from 'universal-cookie'
import { axiosPrivateInstance } from '.'

const cookies = new Cookies()

const authorizeUser = () => {
  localStorage.removeItem(APP_CONFIGS.USER_AUTHORIZED_ROLES)
  cookies.remove(APP_CONFIGS.USER_INFO_COOKIE)
  return axiosPrivateInstance.get('/core/api/v1/auth')
}

const setAuthorizedUserInfo = (userInfo: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // generate cookie expire
      const expireDate = new Date()
      expireDate.setDate(expireDate.getDate() + 1)

      cookies.set(APP_CONFIGS.USER_INFO_COOKIE, userInfo, { path: '/', expires: expireDate })
      resolve(true)
    } catch (e) {
      reject(new Error())
    }
  })
}

const fetchAuthorizedUserInfo = (): string | undefined => {
  return cookies.get(APP_CONFIGS.USER_INFO_COOKIE)
}

const setAuthorizedUserRoles = (userRoles: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(APP_CONFIGS.USER_AUTHORIZED_ROLES, userRoles)
      resolve(true)
    } catch (e) {
      reject(Error())
    }
  })
}

const fetchAuthorizedUserRoles = (): string | null => {
  return localStorage.getItem(APP_CONFIGS.USER_AUTHORIZED_ROLES)
}

const setActiveUserRole = (role: string) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(APP_CONFIGS.USER_ACTIVE_ROLE, role)
      resolve(true)
    } catch (e) {
      reject(Error())
    }
  })
}

const fetchActiveUserRole = (): string | null => {
  return localStorage.getItem(APP_CONFIGS.USER_ACTIVE_ROLE)
}

const logout = (): Promise<boolean> => {
  return new Promise((resolve) => {
    localStorage.removeItem(APP_CONFIGS.USER_AUTHORIZED_ROLES)
    localStorage.removeItem(APP_CONFIGS.USER_ACTIVE_ROLE)
    cookies.remove(APP_CONFIGS.USER_INFO_COOKIE)
    resolve(true)
  })
}

export const authService = {
  authorizeUser,
  fetchAuthorizedUserInfo,
  fetchAuthorizedUserRoles,
  setActiveUserRole,
  setAuthorizedUserInfo,
  setAuthorizedUserRoles,
  fetchActiveUserRole,
  logout,
}
