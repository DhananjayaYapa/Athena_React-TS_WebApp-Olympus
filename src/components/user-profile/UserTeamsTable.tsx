import {
  Table,
  TableRow,
  TableBody,
  TableHead,
  TablePagination,
  CircularProgress,
  Button,
} from '@mui/material'
import React from 'react'
import { StyledTableCell, StyledTableRow } from '../../assets/theme/theme'
import { AllocationDto, AllocationProjectsDto } from '../../utilities/models'
import styles from './UserTeamsTable.module.scss'
import { APP_TABLE_CONFIGS } from '../../utilities/constants'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const UserTeamsTable: React.FC<{
  isLoading?: boolean
  isUpdating?: boolean
  page: number
  rowsPerPage: number
  onHandleChangePage(event: unknown, newPage: number): void
  onHandleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void
  onHandleSetDefaultTeam(relId: number): void
  allocationTeamList: Array<AllocationDto>
}> = (props) => {
  const [teamRows, setTeamRows] = React.useState<AllocationProjectsDto[]>([])
  React.useEffect(() => {
    const allocations: Array<AllocationProjectsDto> = []
    if (props.allocationTeamList.length === 1) {
      props.allocationTeamList[0].projectList.forEach((allocation) => {
        allocations.push({
          allocationId: allocation.allocationId,
          isDefault: allocation.isDefault,
          projectEndDate: allocation.projectEndDate,
          projectId: allocation.projectId,
          projectName: allocation.projectName,
          projectRoleId: allocation.projectRelId,
          projectStartDate: allocation.projectStartDate,
        })
      })
    }
    setTeamRows(allocations)
  }, [props.allocationTeamList])
  return (
    <React.Fragment>
      <div className={styles.leaveListTableHolder}>
        {/* <div className={`${styles.isUpdating} ${props.isUpdating && styles.show}`}>
                    <CircularProgress className={styles.spinnerAlign} color="primary" size={40} />
                </div> */}
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="left" width={150}>
                Team
              </StyledTableCell>
              <StyledTableCell align="left" width={150}>
                Is Default Team
              </StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.isLoading && (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="center">
                  <CircularProgress className={styles.spinnerAlign} color="primary" size={20} />{' '}
                  Loading...
                </StyledTableCell>
              </StyledTableRow>
            )}
            {!props.isLoading && teamRows.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="left">
                  No Records Available.
                </StyledTableCell>
              </StyledTableRow>
            )}
            {/* {* start here *} */}
            {teamRows
              .slice(
                props.page * props.rowsPerPage,
                props.page * props.rowsPerPage + props.rowsPerPage
              )
              .map((team: any) => (
                <StyledTableRow key={team.projectRelId}>
                  <StyledTableCell align="left">{team.projectName}</StyledTableCell>
                  <StyledTableCell align="left">
                    {team.isDefault && <span className={`statusChip approved`}>Default</span>}
                  </StyledTableCell>

                  <StyledTableCell align="center" padding="checkbox">
                    {!team.isDefault && (
                      <Button
                        className={styles.defaultTeamButton}
                        variant="outlined"
                        size="small"
                        onClick={() => props.onHandleSetDefaultTeam(team.allocationId)}
                        startIcon={
                          <CheckCircleOutlineIcon className={styles.acceptIcon} fontSize="small" />
                        }
                      >
                        Mark as Default Team
                      </Button>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={APP_TABLE_CONFIGS.DEFAULT_ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={teamRows.length}
        page={props.page}
        onPageChange={props.onHandleChangePage}
        onRowsPerPageChange={props.onHandleChangeRowsPerPage}
        rowsPerPage={props.rowsPerPage}
      />
    </React.Fragment>
  )
}

export default UserTeamsTable
