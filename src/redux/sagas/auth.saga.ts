import { BROWSER_STORAGE_CONFIGS } from './../../utilities/constants/app.constants'
import { utilFunctions } from './../../utilities/helpers/utilFunctions'
import type {
  AuthorizedUserInfo,
  UserRoleDto,
  AuthorizedUser,
  ApiResponseDto,
  AppStateDto,
} from './../../utilities/models'
import { APP_CONFIGS } from '../../utilities/constants/config.constants'
import { call, put, select, takeLeading } from 'redux-saga/effects'
import { AUTH_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants/action.constants'
import type { AxiosResponse } from 'axios'
import { authService } from '../../services'
import CryptoJS from 'crypto-js'
function* authorizeUser() {
  try {
    const authorizedUser: AxiosResponse<ApiResponseDto<AuthorizedUser>> = yield call(
      authService.authorizeUser
    )
    // set user tag
    const f = authorizedUser.data.data.firstName
      ? authorizedUser.data.data.firstName?.charAt(0)
      : ''
    const l = authorizedUser.data.data.lastName ? authorizedUser.data.data.lastName?.charAt(0) : ''
    // Set authorized user cookie

    const authorizedUserRoles: UserRoleDto[] = authorizedUser.data.data.applications.userRoles
    const authorizedUserInfo: AuthorizedUserInfo = {
      designation: authorizedUser.data.data.designation,
      designationId: authorizedUser.data.data.designationId,
      firstName: authorizedUser.data.data.firstName,
      lastName: authorizedUser.data.data.lastName,
      username: authorizedUser.data.data.username,
      isAuthorized: true,
      tag: f + l,
      timeZone: 'Asia/Colombo', // set time zone for user
      authorizedApps: authorizedUser.data.data.authorizedApps, // Include authorizedApps property
    }

    const _userInfo = JSON.stringify(authorizedUserInfo)
    const _userRoles = JSON.stringify(authorizedUserRoles)

    const _encryptedUserInfo = CryptoJS.AES.encrypt(
      _userInfo,
      APP_CONFIGS.DATA_ENC_SECRET
    ).toString()
    const _encryptedUserRoles = CryptoJS.AES.encrypt(
      _userRoles,
      APP_CONFIGS.DATA_ENC_SECRET
    ).toString()

    const _userInfoSize = utilFunctions.stringToBytes(_encryptedUserInfo)
    const _userRoleSize = utilFunctions.stringToBytes(_encryptedUserRoles)

    if (
      _userInfoSize > BROWSER_STORAGE_CONFIGS.MAX_COOKIE_SIZE ||
      _userRoleSize > BROWSER_STORAGE_CONFIGS.MAX_LOCAL_STORAGE_SIZE
    ) {
      throw Error('Browser Error [Max storage size exceed]')
    }

    yield call(authService.setAuthorizedUserInfo, _encryptedUserInfo)
    yield call(authService.setAuthorizedUserRoles, _encryptedUserRoles)

    let _activeUserRole: UserRoleDto
    const _encryptedActiveUserRole: string | null = yield call(authService.fetchActiveUserRole)

    if (_encryptedActiveUserRole) {
      const bytes = CryptoJS.AES.decrypt(_encryptedActiveUserRole, APP_CONFIGS.DATA_ENC_SECRET)
      const activeUserRole = bytes.toString(CryptoJS.enc.Utf8)
      _activeUserRole = JSON.parse(activeUserRole)
      const hasActiveUserRole = authorizedUserRoles.find(
        (r) => r.userRoleId === _activeUserRole.userRoleId
      )
      if (hasActiveUserRole) {
        _activeUserRole = hasActiveUserRole
      } else {
        _activeUserRole = authorizedUserRoles[0]
      }
      // if(!authorizedUserRoles.map(r => r.userRoleId).includes(_activeUserRole.userRoleId)) {
      //   _activeUserRole = authorizedUserRoles[0]
      // }
    } else {
      _activeUserRole = authorizedUserRoles[0]
    }

    const _encActiveUserRole = CryptoJS.AES.encrypt(
      JSON.stringify(_activeUserRole),
      APP_CONFIGS.DATA_ENC_SECRET
    ).toString()
    yield call(authService.setActiveUserRole, _encActiveUserRole)

    yield put({ type: AUTH_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.SUCCESS })
    yield put({ type: AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST })
    yield put({ type: AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER_ROLES + COMMON_ACTION_TYPES.REQUEST })
    yield put({ type: AUTH_ACTION_TYPES.FETCH_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.REQUEST })
  } catch (error) {
    yield put({
      type: AUTH_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

function* fetchAuthorizedUser() {
  try {
    const _encryptedUserInfo: string | undefined = yield call(authService.fetchAuthorizedUserInfo)
    if (!_encryptedUserInfo) {
      throw Error()
    }
    const bytes = CryptoJS.AES.decrypt(_encryptedUserInfo, APP_CONFIGS.DATA_ENC_SECRET)
    const userInfo = bytes.toString(CryptoJS.enc.Utf8)
    yield put({
      type: AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.SUCCESS,
      data: JSON.parse(userInfo),
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    yield put({
      type: AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.ERROR,
      error: 'Failed to fetch user data',
    })
  }
}

function* fetchAuthorizedUserRoles() {
  try {
    const _encryptedUserRoles: string | null = yield call(authService.fetchAuthorizedUserRoles)
    if (!_encryptedUserRoles) {
      throw Error()
    }
    const bytes = CryptoJS.AES.decrypt(_encryptedUserRoles, APP_CONFIGS.DATA_ENC_SECRET)
    const userRoles = bytes.toString(CryptoJS.enc.Utf8)

    yield put({
      type: AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER_ROLES + COMMON_ACTION_TYPES.SUCCESS,
      data: JSON.parse(userRoles),
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    yield put({
      type: AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER_ROLES + COMMON_ACTION_TYPES.ERROR,
      error: 'Failed to fetch user roles',
    })
  }
}

function* setActiveUserRole(action: { type: string; payload: string }) {
  try {
    const authorizedUserRoles: UserRoleDto[] = yield select(
      (state: AppStateDto) => state.auth.authorizedUserRoles.data
    )
    const activeRoleIndex = authorizedUserRoles.map((i) => i.userRoleKey).indexOf(action.payload)
    if (activeRoleIndex < 0) {
      throw Error('Unauthorized active user role')
    }
    const _encUserRole = CryptoJS.AES.encrypt(
      JSON.stringify(authorizedUserRoles[activeRoleIndex]),
      APP_CONFIGS.DATA_ENC_SECRET
    ).toString()
    yield call(authService.setActiveUserRole, _encUserRole)
    yield put({ type: AUTH_ACTION_TYPES.SET_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.SUCCESS })
    yield put({ type: AUTH_ACTION_TYPES.FETCH_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.REQUEST })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    yield put({
      type: AUTH_ACTION_TYPES.SET_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.ERROR,
      error: 'Failed to set active user roles',
    })
  }
}

function* fetchActiveUserRole() {
  try {
    const _encryptedActiveUserRole: string | null = yield call(authService.fetchActiveUserRole)
    if (!_encryptedActiveUserRole) {
      throw Error()
    }
    const bytes = CryptoJS.AES.decrypt(_encryptedActiveUserRole, APP_CONFIGS.DATA_ENC_SECRET)
    const activeUserRole = bytes.toString(CryptoJS.enc.Utf8)
    yield put({
      type: AUTH_ACTION_TYPES.FETCH_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.SUCCESS,
      data: JSON.parse(activeUserRole),
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    yield put({
      type: AUTH_ACTION_TYPES.FETCH_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.ERROR,
      error: 'Failed to fetch Active user role',
    })
    yield put({
      type: AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.ERROR,
      error: 'Failed to fetch Active user role',
    })
  }
}

function* logout() {
  try {
    yield call(authService.logout)
    yield put({ type: AUTH_ACTION_TYPES.LOGOUT + COMMON_ACTION_TYPES.SUCCESS })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    yield put({
      type: AUTH_ACTION_TYPES.LOGOUT + COMMON_ACTION_TYPES.ERROR,
      error: 'Unable to clear browser data',
    })
  }
}
function* authSaga() {
  yield takeLeading(AUTH_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST, authorizeUser)
  yield takeLeading(
    AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST,
    fetchAuthorizedUser
  )
  yield takeLeading(
    AUTH_ACTION_TYPES.FETCH_AUTHORIZE_USER_ROLES + COMMON_ACTION_TYPES.REQUEST,
    fetchAuthorizedUserRoles
  )
  yield takeLeading(
    AUTH_ACTION_TYPES.SET_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.REQUEST,
    setActiveUserRole
  )
  yield takeLeading(
    AUTH_ACTION_TYPES.FETCH_ACTIVE_USER_ROLE + COMMON_ACTION_TYPES.REQUEST,
    fetchActiveUserRole
  )
  yield takeLeading(AUTH_ACTION_TYPES.LOGOUT + COMMON_ACTION_TYPES.REQUEST, logout)
}

export default authSaga
