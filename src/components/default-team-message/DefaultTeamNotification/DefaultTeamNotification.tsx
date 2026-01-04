import React from 'react'
import Alert from '@mui/material/Alert'
import { Grid, Link } from '@mui/material'
import { APP_ROUTES } from '../../../utilities/constants'

const DefaultTeamNotification = () => {
  return (
    <React.Fragment>
      <Grid size={{ md: 12 }}>
        <Alert severity="warning">
          There is no default team selected, Please select a default team!
          <Link href={APP_ROUTES.USER_PROFILE}> Set a default team</Link>
        </Alert>
      </Grid>
    </React.Fragment>
  )
}

export default DefaultTeamNotification
