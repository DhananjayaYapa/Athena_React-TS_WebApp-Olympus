import React, { useEffect } from 'react'
import { CustomAlert } from '../../../components'
import { AppLayout } from '../../../templates'
import { Grid, Divider } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { absenteeismActions, reportActions } from '../../../redux/actions'
import {
  AbsentInfoParams,
  AppStateDto,
  getUserClientHierarchyListDto,
} from '../../../utilities/models'
import AbsenteeismReportTable from '../../../components/ReportGeneration/Absenteeism/AbsenteeismReportTable'
import AbsenteeismReportForm from '../../../components/ReportGeneration/Absenteeism/AbsenteeismReportForm'

const AbsenteeismReport = () => {
  const dispatch = useDispatch()

  // const clientList = useSelector((state: AppStateDto) => state.client.clientList.data.data)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // useEffect(() => console.log("client list", clientList));

  const absenteeismResponse = useSelector(
    (state: AppStateDto) => state.absenteeism.absenteeismInfo.data.data
  )
  const isAbsenteeismResponseLoading = useSelector(
    (state: AppStateDto) => state.absenteeism.absenteeismInfo.isLoading
  )

  const userClientHierarchy = useSelector(
    (state: AppStateDto) => state.report.getUserClientHierarchy
  )

  useEffect(() => {
    dispatch(absenteeismActions.resetAbsenteeismDetail())
    getClientHierachy()
    //  dispatch(reportActions.getUserClientHierarchy({getDisabled: true}));
  }, [])

  const [noDetails, setNoDetails] = React.useState<boolean>(false)

  React.useEffect(() => {
    //console.log("absent response no data", absenteeismResponse)
    if (absenteeismResponse?.length == 0) {
      setNoDetails(true)
      setTimeout(() => setNoDetails(false), 2000)
    } else {
      setNoDetails(false)
    }
  }, [absenteeismResponse])

  React.useEffect(() => {
    setNoDetails(false)
  }, [])

  const getClientHierachy = () => {
    const clientHeirachyParams: getUserClientHierarchyListDto = {
      getDisabled: false,
    }
    dispatch(reportActions.getUserClientHierarchy(clientHeirachyParams))
  }
  const onAbsenteeismSearch = (filters: AbsentInfoParams) => {
    if (filters.username === '') {
      filters.username = null
      //dispatch(absenteeismActions.getAbsenteeismDetail(filters));
    }
    //console.log("filters", filters);
    dispatch(absenteeismActions.getAbsenteeismDetail(filters))
  }

  const reset = () => {
    dispatch(absenteeismActions.resetAbsenteeismDetail())
    //console.log("clientssssssss", clientList);
  }

  return (
    <React.Fragment>
      <AppLayout breadcrumb="Absenteeism Report" componentTitle="Absenteeism Report">
        {noDetails ? (
          <div style={{ paddingTop: '5px' }}>
            <CustomAlert displayText="No details to display!" severity="warning" />
          </div>
        ) : (
          <div></div>
        )}
        <Grid container spacing={2} direction="row" className="content-padding">
          <Grid size={{ md: 3 }} direction="column" className="sectionTitleHolder">
            <h3 className="font-weight-bold">Generate Absenteeism Report</h3>
            <p>Select a Client, Start Date and End Date to filter results.</p>
            <p>
              Team and End Date fields are disabled until after Client and Start Date selection.
            </p>
          </Grid>
          <Grid
            size={{ md: 7 }}
            sx={{ direction: 'column', spacing: 4, justify: 'center', alignItems: 'center' }}
          >
            <AbsenteeismReportForm
              onAbsenteeismSearch={onAbsenteeismSearch}
              isUsersListLoading={userClientHierarchy.isLoading}
              userClientHierarchy={userClientHierarchy.data || []}
              isAbsenteeismReportResponseLoading={isAbsenteeismResponseLoading}
              reset={reset}
            />
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0px 30px 0px', width: '100%' }} />
        {absenteeismResponse != undefined &&
        absenteeismResponse?.length > 0 &&
        isAbsenteeismResponseLoading === false ? (
          <AbsenteeismReportTable absenteeismReportResponse={absenteeismResponse} />
        ) : (
          <div></div>
        )}
      </AppLayout>
    </React.Fragment>
  )
}
export default AbsenteeismReport
