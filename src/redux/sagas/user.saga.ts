import { teamsService } from './../../services'
import type {
  AlertActionDto,
  GetUserListParamsDto,
  TeamListParamsDto,
} from './../../utilities/models'
import { call, put, takeEvery, delay } from 'redux-saga/effects'
import { ALERT_CONFIGS, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { USER_ACTION_TYPES } from '../../utilities/constants'
import { userService } from '../../services'

// function* authorizeUser(action: any) {
//     try {
//         const cookies = new Cookies();
//         // @ts-ignore
//         const authorizedUser = yield call(userService.authorizeUser, action.payload)
//         // Set authorized user cookie
//         let authUser: AuthorizedUser = {
//             firstName: authorizedUser.data.data.firstName,
//             lastName: authorizedUser.data.data.lastName,
//             isSuperAdmin: authorizedUser.data.data.isSuperAdmin,
//             userRole: authorizedUser.data.data.userRole,
//             userRoleId: authorizedUser.data.data.userRoleId,
//             username: authorizedUser.data.data.username,
//             isAuthorized: true,
//             timeZone: 'Asia/Colombo' // set time zone for user staticly
//         }
//         const authUserTeams = authorizedUser.data.data.teams
//         // TODO: check conditins before set isAuthorized
//         const authorizedUserData = btoa(JSON.stringify(authUser));
//         const authorizedUserTeams = btoa(JSON.stringify(authUserTeams));

//         // generate cookie expire
//         let expireDate = new Date();
//         expireDate.setDate(expireDate.getDate() + 1);

//         cookies.set(APP_CONFIGS.USER_DATA_COOKIE, authorizedUserData, { path: '/', expires: expireDate });
//         localStorage.setItem(APP_CONFIGS.USER_TEAMS_COOKIE, authorizedUserTeams)

//         yield put({ type: USER_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.SUCCESS })
//         yield put({ type: USER_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.REQUEST })
//     }
//     catch (error: any) {
//         const err =  error as string;
//         yield put({ type: USER_ACTION_TYPES.AUTHORIZE_USER + COMMON_ACTION_TYPES.ERROR, error: err })
//     }
// }

// function* fetchAuthorizedUser() {
//     try {
//         const cookies = new Cookies();

//         const userDataString = cookies.get(APP_CONFIGS.USER_DATA_COOKIE)
//         let user = JSON.parse(atob(userDataString));

//         // set user tag
//         const f = user.firstName ? user.firstName?.charAt(0) : ''
//         const l = user.firstName ? user.lastName?.charAt(0) : ''
//         user[`tag`] = f + l;

//         yield put({ type: USER_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.SUCCESS, data: user })
//     }
//     catch (error) {
//         yield put({ type: USER_ACTION_TYPES.FETCH_AUTHORIZE_USER + COMMON_ACTION_TYPES.ERROR, error: 'Failed to fetch user data' })
//     }
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* getUserDetail(action: any) {
  try {
    // @ts-expect-error-ignore
    const userDetail = yield call(userService.getUserDetail, action.payload)
    yield put({
      type: USER_ACTION_TYPES.GET_USER_DETAIL + COMMON_ACTION_TYPES.SUCCESS,
      data: userDetail.data,
    })
  } catch (error) {
    yield put({ type: USER_ACTION_TYPES.GET_USER_DETAIL + COMMON_ACTION_TYPES.ERROR, error: error })
  }
}

function* getUserList(action: { type: string; payload: GetUserListParamsDto | undefined }) {
  try {
    // @ts-expect-error-ignore
    const userList = yield call(userService.getUserList, action.payload)
    yield put({
      type: USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.SUCCESS,
      data: userList.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.ERROR })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}

function* getUserTeams(action: { type: string; payload: string }) {
  try {
    const params: TeamListParamsDto = {
      Username: action.payload,
    }
    // @ts-expect-error-ignore
    const userTeams = yield call(teamsService.getTeams, params)
    yield put({
      type: USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.SUCCESS,
      data: userTeams.data.data,
    })
  } catch (error) {
    const setAlert: AlertActionDto = {
      message: error as string,
      severity: 'error',
      type: USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.SET_ALERT,
    }
    yield put({ type: USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.ERROR, error: error })
    yield put(setAlert)
  } finally {
    yield delay(ALERT_CONFIGS.TIMEOUT)
    yield put({ type: USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.CLEAR_ALERT })
  }
}
function* getUserListBrief(action: { type: string; params: string }) {
  try {
    // @ts-expect-error-ignore
    const userListBrief = yield call(userService.getUserListBrief, action.params)
    yield put({
      type: USER_ACTION_TYPES.GET_USER_LIST_BRIEF + COMMON_ACTION_TYPES.SUCCESS,
      data: userListBrief.data,
    })
  } catch (error) {
    yield put({
      type: USER_ACTION_TYPES.GET_USER_LIST_BRIEF + COMMON_ACTION_TYPES.ERROR,
      error: error,
    })
  }
}
function* userSaga() {
  yield takeEvery(
    USER_ACTION_TYPES.GET_USER_LIST_BRIEF + COMMON_ACTION_TYPES.REQUEST,
    getUserListBrief
  )
  yield takeEvery(USER_ACTION_TYPES.GET_USER_DETAIL + COMMON_ACTION_TYPES.REQUEST, getUserDetail)
  yield takeEvery(USER_ACTION_TYPES.GET_USER_LIST + COMMON_ACTION_TYPES.REQUEST, getUserList)
  yield takeEvery(USER_ACTION_TYPES.GET_USER_TEAMS + COMMON_ACTION_TYPES.REQUEST, getUserTeams)
}

export default userSaga
