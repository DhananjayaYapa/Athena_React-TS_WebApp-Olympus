/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
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

type AbsenteeismEmployee = {
  employeeId: string
  firstName: string
  lastName: string
  username: string
  absentDates?: Array<{ date: string }>
}

const AbsenteeismReportTable: FC<{ absenteeismReportResponse: AbsenteeismEmployee[] }> = (
  props
) => {
  // Sort: by first absent date (if any), then by employeeId — do not mutate props
  const sorted = React.useMemo(() => {
    const copy = [...(props.absenteeismReportResponse ?? [])]
    copy.sort((A, B) => {
      const aDate = A.absentDates?.[0]?.date ?? ''
      const bDate = B.absentDates?.[0]?.date ?? ''
      const byDate = aDate.localeCompare(bDate)
      if (byDate !== 0) return byDate
      return (A.employeeId ?? '').localeCompare(B.employeeId ?? '')
    })
    return copy
  }, [props.absenteeismReportResponse])

  // Build table rows: one row per absent date per employee
  type TableRowT = {
    empId: string
    firstName: string
    lastName: string
    username: string
    date: string
  }

  const tableDatas: TableRowT[] = React.useMemo(
    () =>
      sorted.flatMap((e) =>
        (e.absentDates ?? []).map((d) => ({
          empId: e.employeeId,
          firstName: e.firstName,
          lastName: e.lastName,
          username: e.username,
          date: String(d.date ?? ''),
        }))
      ),
    [sorted]
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

  // Dataset for Excel — derive directly from current tableDatas
  const datasetForExcel = React.useMemo(
    () =>
      tableDatas.map((e) => ({
        empId: e.empId,
        fname: e.firstName,
        lname: e.lastName,
        employee: e.username,
        date: e.date ? new Date(e.date) : null, // Excel date cell
      })),
    [tableDatas]
  )

  const cols: Partial<Excel.Column>[] = [
    { key: 'empId', width: 20, header: 'Employee ID' },
    { key: 'fname', width: 20, header: 'First Name' },
    { key: 'lname', width: 20, header: 'Last Name' },
    { key: 'employee', width: 40, header: 'Email' },
    { key: 'date', width: 20, header: 'Absent Date', style: { numFmt: 'yyyy-mm-dd' } },
  ]

  const exportToExcel = async (dataset: any[], columns: Partial<Excel.Column>[]) => {
    const workbook = new Excel.Workbook()
    const worksheet = workbook.addWorksheet('Absenteeism Report')
    workbook.creator = 'Acentura Pvt Ltd'
    workbook.created = new Date()

    worksheet.columns = columns as Excel.Column[]
    const idCol = worksheet.getColumn('empId')
    idCol.alignment = { vertical: 'middle', horizontal: 'center' }

    // Normalize date cells: if null/invalid, keep as text
    const normalizedRows = dataset.map((r) => ({
      ...r,
      date: r.date instanceof Date && !isNaN(r.date.getTime()) ? r.date : (r.date ?? ''),
    }))

    worksheet.addRows(normalizedRows)

    // Style header + body
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        if (rowNumber === 1) {
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
        } else {
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

    const buffer = await workbook.xlsx.writeBuffer()
    FileSaver.saveAs(new Blob([buffer]), `ABSENTEEISM_REPORT_${Date.now()}.xlsx`)
  }

  const hasData = tableDatas.length > 0
  const pagedRows = tableDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <div>
      {hasData ? (
        <div style={{ float: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 30, marginBottom: 20 }}
            onClick={() => exportToExcel(datasetForExcel, cols)}
          >
            Download report
          </Button>
        </div>
      ) : (
        <div />
      )}

      {hasData ? (
        <TableContainer component={Paper}>
          <Table>
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <StyledTableCell>Employee ID</StyledTableCell>
                <StyledTableCell>First Name</StyledTableCell>
                <StyledTableCell>Last Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Absent Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedRows.map((row) => {
                const key = `${row.empId}-${row.date}`
                return (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={key}>
                    <StyledTableCell>{row.empId}</StyledTableCell>
                    <StyledTableCell>{row.firstName}</StyledTableCell>
                    <StyledTableCell>{row.lastName}</StyledTableCell>
                    <StyledTableCell>{row.username}</StyledTableCell>
                    <StyledTableCell>{row.date}</StyledTableCell>
                  </StyledTableRow>
                )
              })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={tableDatas.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <div />
      )}
    </div>
  )
}

export default AbsenteeismReportTable
