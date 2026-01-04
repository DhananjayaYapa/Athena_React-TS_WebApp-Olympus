import * as Excel from 'exceljs'
import FileSaver from 'file-saver'
import moment from 'moment'
import { LEAVE_REPORT_WORKSHEET_COLUMNS } from '../../../utilities/constants'
import { AnnualDetailedLeaveReportFilterParams } from '../../../utilities/models'

const DATE_COLOR = '00ffff'
const LIGHT_GREEN = 'b7e1cd'
const GREEN = '92d050'
const LIGHTER_GREEN = 'e2efd9'
const worksheetColumns = LEAVE_REPORT_WORKSHEET_COLUMNS

const LEFT_COLUMN_COUNT = 11
const START_ROW_NUMBER = 1

// let heads: any = [] //all column names for table

export const detailedLeaveGeneration = (
  data: any,
  searchData: AnnualDetailedLeaveReportFilterParams
) => {
  // heads = []

  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Data')
  worksheet.views = [{ state: 'frozen', xSplit: LEFT_COLUMN_COUNT }]
  worksheet.columns = worksheetColumns
  createExcel(workbook, worksheet, data[0], searchData)
}

// Add all colums names of the table(A,B,C...)
// async function createheds(noOfColheads: number, workbook: any, worksheet: any) {
//   for (let i = 1; i <= noOfColheads; i++) {
//     heads.push(worksheet.getColumn(i).letter)
//   }
// }
// fill colour a cell
async function colourCell(i: any, row: any, COLOUR: any, worksheet: any) {
  worksheet.getCell(`${i}${row}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: COLOUR },
  }
}

async function createExcel(workbook: any, worksheet: any, data: any, filterData: any) {
  //calculate no.of columns for the table
  // const noOfColheads = 8

  //create column heads for table
  //createheds(noOfColheads,workbook,worksheet)

  //Header section

  worksheet.getCell(`A${START_ROW_NUMBER}`).value = 'Generated Year'
  worksheet.mergeCells(`B${START_ROW_NUMBER}:E${START_ROW_NUMBER}`)
  worksheet.getCell(`B${START_ROW_NUMBER}`).value = {
    formula: 'TEXT(' + filterData.year + ',"0")',
    result: filterData.year,
  }

  worksheet.getCell(`A${START_ROW_NUMBER + 1}`).value = 'Username'
  worksheet.mergeCells(`B${START_ROW_NUMBER + 1}:E${START_ROW_NUMBER + 1}`)
  worksheet.getCell(`B${START_ROW_NUMBER + 1}`).value = filterData.username

  worksheet.getCell(`A${START_ROW_NUMBER + 2}`).value = 'Designation'
  worksheet.mergeCells(`B${START_ROW_NUMBER + 2}:E${START_ROW_NUMBER + 2}`)
  worksheet.getCell(`B${START_ROW_NUMBER + 2}`).value = data.designation

  worksheet.getCell(`F${START_ROW_NUMBER}`).value = 'Date of Appointment :'
  worksheet.getCell(`H${START_ROW_NUMBER}`).value = moment(data.joinDate).format('MMM-DD-yyyy')
  worksheet.getCell(`H${START_ROW_NUMBER}`).numFmt = 'MMM-d-yyyy'
  colourCell('H', START_ROW_NUMBER, DATE_COLOR, worksheet)

  worksheet.getCell(`F${START_ROW_NUMBER + 1}`).value = 'Date Confirmed :'
  worksheet.getCell(`H${START_ROW_NUMBER + 1}`).value = data.confirmationDate
    ? moment(data.confirmationDate).format('MMM-DD-yyyy')
    : 'Not Confimed'
  worksheet.getCell(`H${START_ROW_NUMBER + 1}`).numFmt = 'MMM-d-yyyy'
  colourCell('H', START_ROW_NUMBER + 1, DATE_COLOR, worksheet)

  worksheet.getCell(`F${START_ROW_NUMBER + 2}`).value = 'Current Project/Site :'
  worksheet.getCell(`H${START_ROW_NUMBER + 2}`).value = data.project

  worksheet.mergeCells(`A${START_ROW_NUMBER + 3}:H${START_ROW_NUMBER + 3}`)
  worksheet.getCell(`A${START_ROW_NUMBER + 3}`).value = ''
  colourCell('A', START_ROW_NUMBER + 3, LIGHTER_GREEN, worksheet)

  if (data.leaveEntitlements !== null) {
    worksheet.mergeCells(`A${START_ROW_NUMBER + 4}:B${START_ROW_NUMBER + 4}`)
    worksheet.getCell(`A${START_ROW_NUMBER + 4}`).value = 'Leave Entitlement'
    worksheet.getCell(`C${START_ROW_NUMBER + 4}`).value = data.leaveEntitlements?.annualLeave
    worksheet.getCell(`D${START_ROW_NUMBER + 4}`).value = data.leaveEntitlements?.casualLeave
    // worksheet.getCell(`E${START_ROW_NUMBER+4}`).value = data.leaveEntitlements?.lieuLeave
  } else {
    worksheet.mergeCells(`A${START_ROW_NUMBER + 4}:D${START_ROW_NUMBER + 4}`)
    worksheet.getCell(`A${START_ROW_NUMBER + 4}`).value = 'No Leave Entitlements'
  }

  worksheet.mergeCells(`A${START_ROW_NUMBER + 5}:B${START_ROW_NUMBER + 5}`)
  worksheet.getCell(`A${START_ROW_NUMBER + 5}`).value = 'Leave Utilization'

  worksheet.mergeCells(`A${START_ROW_NUMBER + 6}:B${START_ROW_NUMBER + 6}`)
  worksheet.getCell(`A${START_ROW_NUMBER + 6}`).value = 'Leave balance'

  worksheet.addRow(['From', 'To', 'A/L', 'C/L', 'L/L ', 'No pay', 'Special', 'Remarks'])
  for (let i = 0; i < 8; i++) {
    colourCell(String.fromCharCode('A'.charCodeAt(0) + i), 8, LIGHT_GREEN, worksheet)
  }

  let [al_total, cl_total, ll_total, npl_total, sl_total] = [0, 0, 0, 0, 0]
  if (data.leaves.length > 0) {
    for (let i = 0; i < data.leaves.length; i++) {
      let annual
      let casual
      let lieu
      let no_pay
      let special
      switch (data.leaves[i].leaveTypeId) {
        case 1:
          annual = data.leaves[i].leaveCount
          al_total += data.leaves[i].leaveCount
          break
        case 2:
          lieu = data.leaves[i].leaveCount
          ll_total += data.leaves[i].leaveCount
          break
        case 3:
          casual = data.leaves[i].leaveCount
          cl_total += data.leaves[i].leaveCount
          break
        case 4:
          special = data.leaves[i].leaveCount
          sl_total += data.leaves[i].leaveCount
          break
        case 5:
          no_pay = data.leaves[i].leaveCount
          npl_total += data.leaves[i].leaveCount
          break
        case 6:
          no_pay = data.leaves[i].leaveCount
          npl_total += data.leaves[i].leaveCount
          break
      }
      worksheet.addRow([
        data.leaves[i].from,
        data.leaves[i].to,
        annual,
        casual,
        lieu,
        no_pay,
        special,
        data.leaves[i].remark,
      ])
    }

    worksheet.getColumn(1).numFmt = 'yyyy-mm-dd'
    worksheet.getColumn(2).numFmt = 'yyyy-mm-dd'
    worksheet.getCell(`B${START_ROW_NUMBER}`).numFmt = '@'
    worksheet.autoFilter = 'A8:H8'

    //borders
    const last_row = 8 + data.leaves.length
    for (let j = 1; j <= 8; j++) {
      const leftBorderCell = worksheet.getCell(last_row, j)
      leftBorderCell.border = {
        bottom: { style: 'thin' },
      }
    }

    for (let j = 1; j <= last_row; j++) {
      const leftBorderCell = worksheet.getCell(j, 8)
      leftBorderCell.border = {
        right: { style: 'thin' },
      }
    }
    worksheet.getCell(`H${last_row}`).border = {
      right: { style: 'thin' },
      bottom: { style: 'thin' },
    }

    //sums
    worksheet.getCell(`C${START_ROW_NUMBER + 5}`).value = {
      formula: 'SUM(C9:C' + last_row + ')',
      result: al_total,
    } //annual sum
    worksheet.getCell(`D${START_ROW_NUMBER + 5}`).value = {
      formula: 'SUM(D9:D' + last_row + ')',
      result: cl_total,
    } //casual sum
    worksheet.getCell(`E${START_ROW_NUMBER + 5}`).value = {
      formula: 'SUM(E9:E' + last_row + ')',
      result: ll_total,
    } //lieu sum
    worksheet.getCell(`F${START_ROW_NUMBER + 5}`).value = {
      formula: 'SUM(F9:F' + last_row + ')',
      result: npl_total,
    } //no pay sum
    worksheet.getCell(`G${START_ROW_NUMBER + 5}`).value = {
      formula: 'SUM(G9:G' + last_row + ')',
      result: sl_total,
    } //special sum
  } else {
    worksheet.mergeCells(`A${START_ROW_NUMBER + 8}:H${START_ROW_NUMBER + 8}`)
    worksheet.getCell(`A${START_ROW_NUMBER + 8}`).value = 'No Leaves Taken'
    worksheet.getCell(`A${START_ROW_NUMBER + 8}`).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    }
  }

  //leave balance
  worksheet.getCell(`C${START_ROW_NUMBER + 6}`).value = {
    formula: 'C5-C6',
    result: data.leaveEntitlements?.annualLeave - al_total,
  } //annual leave balance
  colourCell('C', START_ROW_NUMBER + 6, GREEN, worksheet)
  worksheet.getCell(`D${START_ROW_NUMBER + 6}`).value = {
    formula: 'D5-D6',
    result: data.leaveEntitlements?.casualLeave - cl_total,
  } //casual leave balance
  colourCell('D', START_ROW_NUMBER + 6, GREEN, worksheet)
  //worksheet.getCell(`E${START_ROW_NUMBER+6}`).value = {formula: 'E5-E6'} //lieu leave balance
  colourCell('E', START_ROW_NUMBER + 6, GREEN, worksheet)

  const today = moment(Date.now()).format('MMM-d-yyyy')
  workbook.xlsx
    .writeBuffer()
    .then((buffer: any) =>
      FileSaver.saveAs(new Blob([buffer]), `Annual Leave Report of ${data.name} ${today}.xlsx`)
    )
    // eslint-disable-next-line no-console
    .catch((err: any) => console.log('Error writing excel export', err))
}
