import { Breadcrumbs, Divider, Link, Typography } from '@mui/material'
import { withStyles } from '@mui/styles'
import { APP_ROUTES } from '../../utilities/constants'
import styles from './AppLayoutHeader.module.scss'
import styled from '@emotion/styled'
interface AppLayoutHeaderProps {
  componentBreadCrumb: string
  componentTitle: string
}

const AppLayoutHeader = ({ componentBreadCrumb, componentTitle }: AppLayoutHeaderProps) => {
  const AppBreadcrumb = withStyles({
    root: {
      fontSize: '14px',
    },
  })(Breadcrumbs)

  const ComponentHeading = styled(Typography)(() => ({
    paddingBottom: 7,
    margin: 0,
    fontWeight: 400,
    fontSize: '24px',
  }))

  return (
    <div className={styles.pageTitle}>
      <AppBreadcrumb aria-label="breadcrumb">
        <Link color="inherit" underline="none" href={APP_ROUTES.DASHBOARD}>
          Dashboard
        </Link>
        <Link underline="none" color="textPrimary" aria-current="page">
          {componentBreadCrumb}
        </Link>
      </AppBreadcrumb>
      <ComponentHeading sx={{ paddingBottom: 1, margin: 0, fontWeight: 400, fontSize: '24px' }}>
        {componentTitle}
      </ComponentHeading>
      <Divider />
    </div>
  )
}

export default AppLayoutHeader
