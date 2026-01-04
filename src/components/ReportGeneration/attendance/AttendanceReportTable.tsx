import React, { FC, useState } from 'react'
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { StyledTableCell, StyledTableRow } from '../../../assets/theme/theme'
import * as Excel from 'exceljs'
import FileSaver from 'file-saver'
import { AttendanceReportDto, TableRowAttendance } from '../../../utilities/models'

const AttendanceReportTable: FC<{
  attendanceReportResponse: AttendanceReportDto[]
}> = (props) => {
  const [tableData2] = useState<TableRowAttendance[]>(
    props.attendanceReportResponse.flatMap((attendance) =>
      attendance.attendanceInfo.map((row) => ({
        employeeId: attendance.employeeId,
        username: attendance.username,
        firstName: attendance.firstName,
        lastName: attendance.lastName,
        attendanceInfoId: row.attendanceInfoId,
        date: row.date,
        startTime: row.startTime,
        endTime: row.endTime,
      }))
    )
  )

  tableData2.sort(
    (A, B) => A.date?.localeCompare(B.date) || A.employeeId?.localeCompare(B.employeeId)
  )

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const attendanceDataset = tableData2.map((e) => ({
    attendanceId: e.attendanceInfoId,
    empId: e.employeeId,
    fname: e.firstName,
    lname: e.lastName,
    employee: e.username,
    date: new Date(e.date),
    startTime: e.startTime ? new Date(Date.parse(e.date + 'T' + e.startTime + '+0000')) : '',
    endTime: e.endTime ? new Date(Date.parse(e.date + 'T' + e.endTime + '+0000')) : '',
  }))

  const colWithoutTodo = [
    { key: 'attendanceId', width: 20, header: 'Attendance Id' },
    { key: 'empId', width: 20, header: 'Employee ID' },
    { key: 'fname', width: 20, header: 'First Name' },
    { key: 'lname', width: 20, header: 'Last Name' },
    { key: 'employee', width: 40, header: 'Email' },
    { key: 'date', width: 20, header: 'Attendance Date', style: { numFmt: 'yyyy-mm-dd' } },
    { key: 'startTime', width: 20, header: 'Start Time', style: { numFmt: 'hh:mm:ss' } },
    { key: 'endTime', width: 20, header: 'End Time', style: { numFmt: 'hh:mm:ss' } },
  ]

  const exportToExcell = (dataset: any, cols: any) => {
    const workbook = new Excel.Workbook()
    const worksheet = workbook.addWorksheet('Attendance_report"')
    workbook.creator = 'Acentura Pvt Ltd'
    workbook.created = new Date()

    worksheet.columns = cols
    const idCol = worksheet.getColumn('attendanceId')

    idCol.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.addRows(dataset)

    worksheet.eachRow(function (_row, rowNumber) {
      worksheet.getRow(rowNumber).eachCell(function (cell) {
        if (rowNumber == 1) {
          worksheet.getCell(cell.address).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C7C7C7' },
          }
          worksheet.getCell(cell.address).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          }
          worksheet.getCell(cell.address).font = {
            name: 'Arial',
            family: 2,
            bold: true,
            size: 11,
          }
          worksheet.getCell(cell.address).border = {
            top: { style: 'thin', color: { argb: '696969' } },
            left: { style: 'thin', color: { argb: '696969' } },
            bottom: { style: 'thin', color: { argb: '696969' } },
            right: { style: 'thin', color: { argb: '696969' } },
          }
        }
        if (rowNumber != 1) {
          worksheet.getCell(cell.address).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F9F9F9' },
          }
          worksheet.getCell(cell.address).border = {
            top: { style: 'thin', color: { argb: 'ededed' } },
            left: { style: 'thin', color: { argb: 'ededed' } },
            bottom: { style: 'thin', color: { argb: 'ededed' } },
            right: { style: 'thin', color: { argb: 'ededed' } },
          }
        }
      })
    })

    workbook.xlsx
      .writeBuffer()
      .then((buffer) =>
        FileSaver.saveAs(new Blob([buffer]), `ATTENDANCE_REPORT_${Date.now()}.xlsx`)
      )
      .catch((err) => console.log('Error writing excel export', err))
  }

  return (
    <div>
      {props.attendanceReportResponse != undefined && props.attendanceReportResponse?.length > 0 ? (
        <div style={{ float: 'right' }}>
          <div>
            <Button
              variant="contained"
              color="primary"
              aria-haspopup="true"
              onClick={() => exportToExcell(attendanceDataset, colWithoutTodo)}
              style={{ marginRight: 30, marginBottom: 20 }}
            >
              Download report
            </Button>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {props.attendanceReportResponse?.length > 0 ? <div> </div> : <div></div>}
      <TableContainer component={Paper}>
        <Table>
          <colgroup>
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '12.5%' }} />
            <col style={{ width: '12.5%' }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <StyledTableCell>Attendance Id</StyledTableCell>
              <StyledTableCell>Employee ID</StyledTableCell>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell>Last Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Attendance Date</StyledTableCell>
              <StyledTableCell>Start Time</StyledTableCell>
              <StyledTableCell>End Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData2
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{row.attendanceInfoId}</StyledTableCell>
                    <StyledTableCell>{row.employeeId}</StyledTableCell>
                    <StyledTableCell>{row.firstName}</StyledTableCell>
                    <StyledTableCell>{row.lastName}</StyledTableCell>
                    <StyledTableCell>{row.username}</StyledTableCell>
                    <StyledTableCell>{row.date}</StyledTableCell>
                    <StyledTableCell>{row.startTime}</StyledTableCell>
                    <StyledTableCell>{row.endTime ?? '-'}</StyledTableCell>
                  </StyledTableRow>
                )
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={tableData2.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  )
}

export default AttendanceReportTable
