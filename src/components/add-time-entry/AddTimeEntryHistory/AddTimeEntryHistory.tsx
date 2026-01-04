import React from 'react'
import { TableHead, Table, TableRow, TableBody, Tooltip, CircularProgress } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { StyledTableCell, StyledTableRow } from '../../../assets/theme/theme'
import { AttendanceInfoObjectDto } from '../../../utilities/models'
import styles from './AddTimeEntryHistory.module.scss'
import moment from 'moment'

const AddTimeEntryHistory: React.FC<{
  data: AttendanceInfoObjectDto[]
  isLoading?: boolean
  onRecordEdit(arg: AttendanceInfoObjectDto): void
}> = (props) => {
  const orderData = (array: AttendanceInfoObjectDto[]): AttendanceInfoObjectDto[] => {
    return array.sort(
      // @ts-expect-error ignore
      (a, b) => new Date(moment(b.attendanceDate)) - new Date(moment(a.attendanceDate))
    )
  }
  return (
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell align="left" width={100}>
            Date
          </StyledTableCell>
          <StyledTableCell align="left" width={100}>
            Start Time
          </StyledTableCell>
          <StyledTableCell align="left" width={100}>
            End Time
          </StyledTableCell>
          <StyledTableCell align="left" width={100}>
            Work From
          </StyledTableCell>
          <StyledTableCell align="center" width={100}>
            Action
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.isLoading && (
          <StyledTableRow>
            <StyledTableCell colSpan={7} align="center">
              <CircularProgress className={styles.spinnerAlign} color="primary" size={20} />{' '}
              Loading...
            </StyledTableCell>
          </StyledTableRow>
        )}

        {!props.isLoading && props.data.length === 0 && (
          <StyledTableRow>
            <StyledTableCell colSpan={7} align="left">
              No Records Available.
            </StyledTableCell>
          </StyledTableRow>
        )}

        {!props.isLoading &&
          props.data.length > 0 &&
          orderData(props.data).map((record: AttendanceInfoObjectDto, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align="left">{record.attendanceDate}</StyledTableCell>

              <StyledTableCell align="left">
                {record.startTime ? (
                  moment(record.startTime, 'HH:mm:ss').format('hh:mm A')
                ) : (
                  <span className={styles.missingInfo}>- - : - -</span>
                )}
              </StyledTableCell>

              <StyledTableCell align="left">
                {record.endTime ? (
                  moment(record.endTime, 'HH:mm:ss').format('hh:mm A')
                ) : (
                  <span className={styles.missingInfo}>- - : - -</span>
                )}
              </StyledTableCell>

              <StyledTableCell align="left">
                {record.location ? (
                  record.location
                ) : (
                  <span className={styles.missingInfo}>- -</span>
                )}
              </StyledTableCell>

              <StyledTableCell align="center">
                <Tooltip title="Update Time Entry">
                  <EditOutlinedIcon
                    className="cursorPointer"
                    onClick={() => props.onRecordEdit(record)}
                    fontSize="medium"
                  />
                </Tooltip>
              </StyledTableCell>
            </StyledTableRow>
          ))}
      </TableBody>
    </Table>
  )
}

export default AddTimeEntryHistory
