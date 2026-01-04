import React from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  Tooltip,
} from '@mui/material'
import { StyledTableCell, StyledTableRow } from '../../../../assets/theme/theme'
import styles from './TimeEntryReportTable.module.scss'
import RefreshOutlined from '@mui/icons-material/RefreshOutlined'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { DownloadForOfflineOutlined } from '@mui/icons-material'
import moment from 'moment'
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  EXCEPTION_REPORT_STATUS,
  APP_TABLE_CONFIGS,
} from '../../../../utilities/constants'
import { TimeEntryReportDto } from '../../../../utilities/models/ReportGeneration/TimeEntryReport.model'

const TimeEntryReportTable: React.FC<{
  filterRows: TimeEntryReportDto[]
  reportsIsLoading: boolean
  page: number
  rowsPerPage: number
  onHandleChangePage(event: unknown, newPage: number): void
  onHandleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void
  reportId: number
  refreshGrid: () => void
  downloadReport: (reportId: number, startDate: string) => void
  downloading: boolean
}> = (props) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 12 }}>
        <Box display="flex" justifyContent="flex-end" sx={{ marginTop: '1px' }}>
          <Button variant="contained" color="primary" onClick={props.refreshGrid}>
            <RefreshOutlined />
            Refresh
          </Button>
          <Tooltip
            style={{ marginLeft: '5px', marginTop: '1px' }}
            title="Click this to refresh the grid."
            placement="top"
          >
            <InfoOutlined fontSize="small" />
          </Tooltip>
        </Box>
      </Grid>
      <Grid size={{ md: 3 }} className="sectionTitleHolder">
        <h3>Manage Reports</h3>
        <p>Click the download icon under Action to download Time Entry Report. </p>
      </Grid>
      <Grid size={{ md: 9 }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="left" width={200}>
                Created At
              </StyledTableCell>
              <StyledTableCell align="left" width={150}>
                Start Date
              </StyledTableCell>
              <StyledTableCell align="left" width={150}>
                End Date
              </StyledTableCell>
              <StyledTableCell align="left" width={150}>
                SBU
              </StyledTableCell>
              <StyledTableCell align="left" width={150}>
                Employee
              </StyledTableCell>
              <StyledTableCell align="center" width={140}>
                Status
              </StyledTableCell>
              <StyledTableCell align="center" width={120}>
                Action
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {!props.reportsIsLoading &&
              props.filterRows.length > 0 &&
              (props.rowsPerPage > 0
                ? props.filterRows.slice(
                    props.page * props.rowsPerPage,
                    props.page * props.rowsPerPage + props.rowsPerPage
                  )
                : props.filterRows
              ).map((row: TimeEntryReportDto) => (
                <StyledTableRow key={row.reportId}>
                  <StyledTableCell align="left">
                    {moment(row.createdAt).format(DATE_TIME_FORMAT)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {moment(row.filters.startDate).format(DATE_FORMAT)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {moment(row.filters.endDate).format(DATE_FORMAT)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {row.filters.sbuName ? row.filters.sbuName : '-'}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {Array.isArray(row.filters.employee) && row.filters.employee.length > 0
                      ? row.filters.employee.map((emp: string, index: number) => (
                          <div key={index}>{emp}</div>
                        ))
                      : '-'}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <span className={`${styles.status} ${styles[row.status?.toLowerCase()]}`}>
                      {' '}
                      {row.status}{' '}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {!row.hasReportData ? (
                      row.status === EXCEPTION_REPORT_STATUS.COMPLETED ? (
                        'No Data Found'
                      ) : (
                        '-'
                      )
                    ) : (
                      <Tooltip title="Download File">
                        {row.reportId === props.reportId && props.downloading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : (
                          <DownloadForOfflineOutlined
                            color="inherit"
                            onClick={() => props.downloadReport(row.reportId, row.createdAt)}
                          />
                        )}
                      </Tooltip>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            {!props.reportsIsLoading && props.filterRows.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="left">
                  No Records To Display.
                </StyledTableCell>
              </StyledTableRow>
            )}
            {props.reportsIsLoading && (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="center">
                  <CircularProgress color="primary" size={20} /> Loading...
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={APP_TABLE_CONFIGS.DEFAULT_ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={props.filterRows.length}
          page={props.page}
          onPageChange={props.onHandleChangePage}
          onRowsPerPageChange={props.onHandleChangeRowsPerPage}
          rowsPerPage={props.rowsPerPage}
        />
      </Grid>
    </Grid>
  )
}

export default TimeEntryReportTable
