import { Divider, Grid } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnnualDetailedLeaveReportForm, CustomAlert } from '../../../components'
import { detailedLeaveGeneration } from '../../../components/ReportGeneration/annual-detail-leave/AnnualDetailedLeaveReportGeneration'
import AnnualDetailedLeaveReportTable from '../../../components/ReportGeneration/annual-detail-leave/AnnualDetailedLeaveReportTable'
import { reportActions, userActions } from '../../../redux/actions'
import { AppLayout } from '../../../templates'
import { validateFormData } from '../../../utilities/helpers'
import { AppStateDto, GetUserListBriefParamsDto } from '../../../utilities/models'
import { AnnualDetailedLeaveReportFilterParams } from '../../../utilities/models/ReportGeneration/AnnualDetailedLeaveReport.model'
import moment from 'moment'

const AnnualDetailedLeaveReport = () => {
  const INITIAL_STATE = {
    username: { value: '', validator: 'text', disable: false, isRequired: true, error: null },
    year: { value: null, validator: 'date', disable: false, isRequired: true, error: null },
  }
  const dispatch = useDispatch()
  const userList = useSelector((state: AppStateDto) => state.user.userListBrief)
  const [formValues, setFormValues] = useState(INITIAL_STATE)
  const [filterValues, setFilter] = useState<any>()
  const [holdReportGen, setholdReportGen] = React.useState<boolean>(false)
  const [detRetriveError, setDetRetriveError] = React.useState<boolean>(false)

  const detailedLeaveReportResponse = useSelector(
    (state: AppStateDto) => state.report.annualDetailedLeavesReport.data
  )
  const isdetailedLeaveReportResponseLoading = useSelector(
    (state: AppStateDto) => state.report.annualDetailedLeavesReport.isLoading
  )
  const dataRetrieveError = useSelector(
    (state: AppStateDto) => state.report.annualDetailedLeavesReport.error
  )
  React.useEffect(() => {
    getUserListBrief()
  }, [])
  React.useEffect(() => {
    if (dataRetrieveError?.error) {
      setDetRetriveError(true)
      setTimeout(() => setDetRetriveError(false), 2000)
    }
  }, [dataRetrieveError])
  React.useEffect(() => {
    if (dataRetrieveError?.error) {
      setDetRetriveError(true)
      setTimeout(() => setDetRetriveError(false), 2000)
    }
    if (
      detailedLeaveReportResponse?.length <= 0 &&
      !isdetailedLeaveReportResponseLoading &&
      holdReportGen
    ) {
      setDetRetriveError(true)
      setTimeout(() => setDetRetriveError(false), 2000)
    }

    //  if ( (detailedLeaveReportResponse?.length >= 1 && !isdetailedLeaveReportResponseLoading) && holdReportGen ) {
    //   if (detailedLeaveReportResponse[0]?.leaves?.length > 0){
    //     const AnnualDetailedLeaveReportFilterParams: AnnualDetailedLeaveReportFilterParams = {
    //       username: formValues.username.value ? formValues.username.value : '',
    //       year: formValues.year.value ? formValues.year.value : null
    //     }
    //     detailedLeaveGeneration(detailedLeaveReportResponse, AnnualDetailedLeaveReportFilterParams)
    //   }else{
    //     setDetRetriveError(true);
    //     setTimeout(() => setDetRetriveError(false), 2000);
    //   }
    //  }
  }, [isdetailedLeaveReportResponseLoading, holdReportGen, detailedLeaveReportResponse])

  const viewReport = async () => {
    const [validatedData, isValid] = await validateFormData(formValues)
    setFormValues(validatedData)
    if (isValid) {
      const AnnualDetailedLeaveReportFilterParam: AnnualDetailedLeaveReportFilterParams = {
        username: formValues.username.value ? formValues.username.value : '',
        year: formValues.year.value
          ? moment(formValues.year.value).format('YYYY').toString()
          : null,
      }
      onDetLeaveSearchWithFilters(AnnualDetailedLeaveReportFilterParam)
      setFilter(AnnualDetailedLeaveReportFilterParam)
      setFormValues({ ...formValues, username: { ...formValues.username } })
    }
  }

  const getUserListBrief = () => {
    const userListBrief: GetUserListBriefParamsDto = {
      getAll: true,
      userRoleKey: 'EMPLOYEE',
      getDisabled: true,
    }
    dispatch(userActions.getUserListBrief(userListBrief))
  }
  const onDetLeaveSearchWithFilters = (filters: AnnualDetailedLeaveReportFilterParams) => {
    dispatch(reportActions.getAnnualDetailedLeavesInfo(filters))
    setholdReportGen(true)
  }
  const downloadReport = async () => {
    if (
      detailedLeaveReportResponse?.length >= 1 &&
      !isdetailedLeaveReportResponseLoading &&
      holdReportGen
    ) {
      // if (detailedLeaveReportResponse[0]?.leaves?.length > 0){
      const AnnualDetailedLeaveReportFilterParams: AnnualDetailedLeaveReportFilterParams = {
        username: formValues.username.value ? formValues.username.value : '',
        year: formValues.year.value ? moment(formValues.year.value).year().toString() : null,
      }
      // eslint-disable-next-line no-console
      console.log('testing', detailedLeaveReportResponse, AnnualDetailedLeaveReportFilterParams)
      detailedLeaveGeneration(detailedLeaveReportResponse, AnnualDetailedLeaveReportFilterParams)
      // }else{
      //   setDetRetriveError(true);
      //   setTimeout(() => setDetRetriveError(false), 2000);
      // }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (property: string, value: any) => {
    switch (property) {
      case 'username':
        setFormValues({
          ...formValues,
          username: {
            ...formValues.username,
            value: value ? value : '',
            error: null,
          },
        })
        break
      case 'year':
        setFormValues({
          ...formValues,
          year: {
            ...formValues.year,
            value: value ? value : '',
            error: null,
          },
        })
        break
    }
  }
  return (
    <React.Fragment>
      <AppLayout breadcrumb="Annual Leave Report" componentTitle="Annual Leave Report">
        <Grid container spacing={2} direction="row" className="content-padding">
          <Grid size={{ md: 3 }} className="sectionTitleHolder">
            <h3>Generate Annual Leave Report</h3>
            <p>
              Select an employee and year to filter results. The Excel Report will be downloaded for
              selected employee.
            </p>
          </Grid>
          <Grid size={{ md: 7 }}>
            {detRetriveError ? (
              <div style={{ paddingTop: '5px', paddingBottom: '10px' }}>
                <CustomAlert
                  displayText={
                    dataRetrieveError?.error ? dataRetrieveError.msg : 'No data for the report'
                  }
                  severity="warning"
                />
              </div>
            ) : (
              <div></div>
            )}
            <AnnualDetailedLeaveReportForm
              viewReport={viewReport}
              userList={userList.data?.data || []}
              handleChange={handleChange}
              formValues={formValues}
              isProcessing={isdetailedLeaveReportResponseLoading}
            />
          </Grid>
          <Divider style={{ margin: '20px 0px 20px 0px', width: '100%' }} />
          <Grid size={{ md: 12 }}>
            <AnnualDetailedLeaveReportTable
              filterData={filterValues}
              reportData={detailedLeaveReportResponse ? detailedLeaveReportResponse : null}
              downloadReport={downloadReport}
              isProcessing={isdetailedLeaveReportResponseLoading}
            />
          </Grid>
        </Grid>
      </AppLayout>
    </React.Fragment>
  )
}
export default AnnualDetailedLeaveReport
