import { axiosPrivateInstance } from './index';
import { TimeEntryRequest, TimeSheetRequest } from '../utilities/models';

const getTimeSheet = async (params: TimeSheetRequest) => {
  const queryString = Object.entries(params)
    ?.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return axiosPrivateInstance.get(`/athena/api/v1/timesheet?${queryString}`);
};
const manageTimeSheet = (payload: TimeEntryRequest) => {
  return axiosPrivateInstance.post('/athena/api/v1/timesheet', payload);
}

export const timeSheetService = {
  getTimeSheet,
  manageTimeSheet
};
