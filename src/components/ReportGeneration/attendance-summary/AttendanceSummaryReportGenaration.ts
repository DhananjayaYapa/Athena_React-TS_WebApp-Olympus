import * as Excel from 'exceljs'
import FileSaver from 'file-saver'
import {
  ATTENDANCE_SUMMARY_CONSTANTS,
  COMMON_COLORS,
  COMMON_USES,
  EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS,
  EXCEL_ATTENDANCE_SUMMARY_DATE_FLAG,
  EXCEL_COLOR_CODE_FOR_ATTENDANCE_SUMMARY,
  EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY,
  EXCEL_HEADER_COLORS,
  EXCEL_HEADINGS,
  EXCEL_LEAVES_COLORS,
  LEAVES_COLORS_ATTENDANCE_SUMMARY,
  LEAVES_HEADINGS_ATTENDANCE_SUMMARY,
} from '../../../utilities/constants'
import {
  AttendanceSummaryDataObject,
  AttendanceSummaryReportDisplayFilterParams,
} from '../../../utilities/models'

let heads: any = [] //all column names for table
let keyHeads: any = [] //all column names for table
let weeksColumns: any = [] // week columns
let allWeeks: any = [] // all days by weeks

const WEEK_COLOR = EXCEL_COLOR_CODE_FOR_ATTENDANCE_SUMMARY.WEEK_COLOR
const EMP = EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY.EMP
const CLIENT = EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY.CLIENT
const EMPLOYEE_NAME = EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY.EMPLOYEE_NAME
const GRAND_TOTAL = EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY.GRAND_TOTAL
const FULL_DAYS = EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY.FULL_DAYS
const HALF_DAYS = EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY.HALF_DAYS
const TOTAL_WORKED_DAYS = EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY.TOTAL_WORKED_DAYS
const TOTAL_LEAVE_DAYS = EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY.TOTAL_LEAVE_DAYS
const TOTAL_WORKING_DAYS = EXCEL_COLUMN_NAMES_FOR_ATTENDANCE_SUMMARY.TOTAL_WORKING_DAYS

const X_SPLIT = ATTENDANCE_SUMMARY_CONSTANTS.X_SPLIT
const Y_SPLIT = ATTENDANCE_SUMMARY_CONSTANTS.Y_SPLIT
const START_COLUMN_NUMBER = ATTENDANCE_SUMMARY_CONSTANTS.START_COLUMN_NUMBER
const END_COLUMN_NUMBER = ATTENDANCE_SUMMARY_CONSTANTS.END_COLUMN_NUMBER

const COLOUR_LEGEND_FONT_COLOUR_1 = EXCEL_HEADER_COLORS.COLOUR_LEGEND_FONT_COLOUR_1
const COLOUR_LEGEND_FONT_COLOUR_2 = EXCEL_HEADER_COLORS.COLOUR_LEGEND_FONT_COLOUR_2
const MISSING_COLOR = LEAVES_COLORS_ATTENDANCE_SUMMARY.MISSING
const NON_WORK_DAY_COLOR = LEAVES_COLORS_ATTENDANCE_SUMMARY.NON_WORK_DAY
const WEEKEND_COLOR = LEAVES_COLORS_ATTENDANCE_SUMMARY.WEEKEND
const DISABLE_COLOR = LEAVES_COLORS_ATTENDANCE_SUMMARY.DISABLED
const LEAVE_COLOUR = EXCEL_LEAVES_COLORS.LEAVE_COLOUR

const MISSING = LEAVES_HEADINGS_ATTENDANCE_SUMMARY.MISSING
const NON_WORK_DAY = LEAVES_HEADINGS_ATTENDANCE_SUMMARY.NON_WORK_DAY
const WEEKEND = LEAVES_HEADINGS_ATTENDANCE_SUMMARY.WEEKEND
const DISABLE = LEAVES_HEADINGS_ATTENDANCE_SUMMARY.DISABLED
const LEAVE = EXCEL_HEADINGS.LEAVE

const START_DATE = EXCEL_HEADINGS.START_DATE
const END_DATE = EXCEL_HEADINGS.END_DATE

const START_ROW_FOR_COLOUR_CODE = 1
const START_COLUMN_FOR_COLOUR_CODE = 1
const NA_WORKED_HOURS = -1

export const attendanceSummaryGenarations = (
  data: AttendanceSummaryDataObject[],
  searchData: AttendanceSummaryReportDisplayFilterParams
) => {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Attendance Summary')
  worksheet.views = [{ state: 'frozen', xSplit: X_SPLIT, ySplit: Y_SPLIT }]
  createExcel(workbook, worksheet, data, searchData)
}
//Filters for Dates
async function setfiltersDate(row: any, filter: any, value: any, worksheet: any) {
  worksheet.getCell(`${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 1).letter}${row}`).value =
    filter
  worksheet.mergeCells(
    `${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 2).letter}${row}:${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 3).letter}${row}`
  )
  worksheet.getCell(`${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 2).letter}${row}`).value =
    new Date(value)
  worksheet.getCell(
    `${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 2).letter}${row}`
  ).numFmt = 'yyyy-mm-dd'
  worksheet.getCell(
    `${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 2).letter}${row}`
  ).alignment = {
    vertical: 'middle',
    horizontal: 'left',
  }
}

//Filters for text
async function setfilters(row: any, filter: any, value: any, worksheet: any) {
  worksheet.getCell(`${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 1).letter}${row}`).value =
    filter
  worksheet.mergeCells(
    `${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 2).letter}${row}:${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 3).letter}${row}`
  )
  worksheet.getCell(`${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 3).letter}${row}`).value =
    value
}

// create colour legend
async function setColourCodes(
  column: any,
  name: any,
  COLOUR: any,
  FONT_COLOUR: any,
  worksheet: any
) {
  worksheet.getCell(`${worksheet.getColumn(column).letter}${START_ROW_FOR_COLOUR_CODE}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: COLOUR },
  }
  worksheet.getCell(`${worksheet.getColumn(column).letter}${START_ROW_FOR_COLOUR_CODE}`).value =
    name
  worksheet.getCell(`${worksheet.getColumn(column).letter}${START_ROW_FOR_COLOUR_CODE}`).alignment =
    {
      vertical: 'middle',
      horizontal: 'center',
    }
  worksheet.getCell(`${worksheet.getColumn(column).letter}${START_ROW_FOR_COLOUR_CODE}`).font = {
    color: { argb: FONT_COLOUR },
    family: 2,
    size: 10,
    bold: true,
  }
  worksheet.getCell(`${worksheet.getColumn(column).letter}${START_ROW_FOR_COLOUR_CODE}`).border = {
    top: { style: 'None' },
    left: { style: 'None' },
    bottom: { style: 'thin' },
    right: { style: 'None' },
  }
}

//cell font styling and number formatting for time entries
async function filledDataFormatting(worksheet: any) {
  worksheet.eachRow({ includeEmpty: true }, function (row: any, rowNumber: number) {
    if (rowNumber > COMMON_USES.HEADER_ROW) {
      row.eachCell(function (cell: any, colNumber: number) {
        if (cell.value)
          row.getCell(colNumber).font = {
            name: 'Tahoma',
            family: 2,
            size: 9,
          }
      })

      const arrayLength = allWeeks.length
      for (let i = 0; i < arrayLength; i++) {
        allWeeks[i].forEach(function (ob: any) {
          worksheet.getCell(`${worksheet.getColumn(ob).letter}${rowNumber}`).numFmt = '0.00'
          worksheet.getCell(`${worksheet.getColumn(ob).letter}${rowNumber}`).font = {
            name: 'Tahoma',
            family: 2,
            size: 9,
          }
          worksheet.getCell(`${worksheet.getColumn(ob).letter}${rowNumber}`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          }
        })
      }
    }
  })
}

//Stylings for headings and week
async function stylingTables(worksheet: any) {
  // customize column headers
  const headerRow = worksheet.getRow(COMMON_USES.HEADER_ROW)
  headerRow.eachCell(function (cell: any) {
    cell.font = {
      name: 'Tahoma',
      family: 2,
      size: 9,
      bold: true,
    }
  })
  headerRow.height = 50

  //customize weeks
  weeksColumns.forEach(function (wk: number) {
    const wkRow = worksheet.getColumn(wk)
    wkRow.eachCell(function (cell: any) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: WEEK_COLOR },
      }
    })

    //make FIRST row white for weeks columns
    worksheet.getRow(COMMON_USES.FIRST_ROW).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COMMON_COLORS.WHITE },
    }
    worksheet.getRow(COMMON_USES.FIRST_ROW).border = {
      bottom: { style: 'thin' },
    }
  })
  // weeks columns alignment
  weeksColumns.forEach(function (obc: any) {
    worksheet.getColumn(obc).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    }
  })
  //total columns allignment
  const lastItemWKColArr = weeksColumns.pop()
  for (let k = lastItemWKColArr; k <= lastItemWKColArr + 5; k++) {
    worksheet.getColumn(k).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    }
  }
}

// Add column headers
async function createheds(searchData: any, worksheet: any) {
  heads = []
  weeksColumns = []
  allWeeks = []
  keyHeads = []
  heads.push({
    header: '',
    width: 8,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push('')
  heads.push({
    header: EMP,
    width: 15,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push(EMP)
  heads.push({
    header: CLIENT,
    width: 15,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push(CLIENT)
  heads.push({
    header: EMPLOYEE_NAME,
    width: 30,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push(EMPLOYEE_NAME)

  const startDate = new Date(`${searchData.startDate}`)
  const endDate = new Date(`${searchData.endDate}`)

  let week = 1
  let wk = []

  let endOfWeek = 0
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    endOfWeek = 0
    const day = d.getDay()
    heads.push({
      header: new Date(d),
      key: new Date(d),
      width: 7,
      style: {
        numFmt: 'mm/dd',
        alignment: {
          vertical: 'middle',
          horizontal: 'center',
        },
      },
    })
    keyHeads.push(new Date(d))
    wk.push(heads.length)
    if (day === 0) {
      endOfWeek = -1
      heads.push({
        header: 'W' + week,
        width: 7,
        style: {
          alignment: {
            vertical: 'middle',
            horizontal: 'center',
          },
        },
      })
      keyHeads.push('W' + week)
      week = week + 1
      weeksColumns.push(heads.length)
      allWeeks.push(wk)
      wk = []
    }
  }
  if (endOfWeek !== -1) {
    heads.push({
      header: 'W' + week,
      width: 7,
      style: {
        alignment: {
          vertical: 'middle',
          horizontal: 'center',
        },
      },
    })
    keyHeads.push('W' + week)
    weeksColumns.push(heads.length)
    allWeeks.push(wk)
    wk = []
  }

  weeksColumns.push(heads.length)

  heads.push({
    header: GRAND_TOTAL,
    width: 12,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push(GRAND_TOTAL)

  heads.push({
    header: TOTAL_WORKING_DAYS,
    width: 17,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push(TOTAL_WORKING_DAYS)

  heads.push({
    header: FULL_DAYS,
    width: 15,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push(FULL_DAYS)

  heads.push({
    header: HALF_DAYS,
    width: 15,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push(HALF_DAYS)
  heads.push({
    header: TOTAL_WORKED_DAYS,
    width: 17,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push(TOTAL_WORKED_DAYS)
  heads.push({
    header: TOTAL_LEAVE_DAYS,
    width: 15,
    style: {
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
      },
    },
  })
  keyHeads.push(TOTAL_LEAVE_DAYS)
  worksheet.getRow(COMMON_USES.HEADER_ROW).values = keyHeads

  for (let ob = 1; ob <= heads.length; ob++) {
    worksheet.getCell(`${worksheet.getColumn(ob).letter}${COMMON_USES.HEADER_ROW}`).numFmt =
      heads[ob - 1].style?.numFmt
    worksheet.getCell(`${worksheet.getColumn(ob).letter}${COMMON_USES.HEADER_ROW}`).alignment = {
      vertical: heads[ob - 1].style?.alignment.vertical,
      horizontal: heads[ob - 1].style?.alignment.horizontal,
    }
  }

  worksheet.columns.forEach(function (column: any, i: number) {
    column.width = heads[i].width
  })
}

// fill data
async function fillData(worksheet: any, data: AttendanceSummaryDataObject[]) {
  let rowNo = COMMON_USES.DATA_ROWS_START
  const dataArray = data
  dataArray?.forEach(function (object: AttendanceSummaryDataObject) {
    let startColumnNo = START_COLUMN_NUMBER
    let endColumnNo = END_COLUMN_NUMBER
    let sumFormat: any

    const dataRow: any = []

    dataRow.push('')
    dataRow.push(object.employeeNumber)
    dataRow.push(object.clientName)
    dataRow.push(object.name)

    const attendanceSummary = object.attendanceSummery

    let grandTotal = 0.0

    attendanceSummary?.forEach(function (objectDays: any) {
      let weekTotal = 0.0
      objectDays.day?.forEach(function (days: any) {
        if (
          days.workedHours === null ||
          days.workedHours === undefined ||
          days.workedHours === NA_WORKED_HOURS
        ) {
          dataRow.push('-')
        } else {
          dataRow.push(days.workedHours)
          weekTotal = weekTotal + days.workedHours
        }
      })
      endColumnNo = startColumnNo + objectDays.day.length - 1
      dataRow.push({
        formula: `SUM(${worksheet.getColumn(startColumnNo).letter}${rowNo}:${worksheet.getColumn(endColumnNo).letter}${rowNo})`,
        result: weekTotal,
      })
      sumFormat =
        (sumFormat ? sumFormat + ',' : '') +
        worksheet.getColumn(startColumnNo + objectDays.day.length).letter +
        rowNo

      startColumnNo = startColumnNo + objectDays.day.length + 1
      grandTotal = grandTotal + weekTotal
    })
    dataRow.push({ formula: `SUM(${sumFormat})`, result: grandTotal })
    dataRow.push(object.totalWorkingDays)
    dataRow.push(object.fullDays)
    dataRow.push(object.halfDays)
    dataRow.push(object.totalWorkedDays)
    dataRow.push(object.totalLeaveDays)
    worksheet.addRow(dataRow)
    rowNo += 1
  })
}
//color cells according to legend colors
async function colorCellAccordingToLegend(
  worksheet: any,
  colNo: number,
  rowNo: number,
  color: string
) {
  worksheet.getCell(`${worksheet.getColumn(colNo).letter}${rowNo}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: color },
  }
}

//add legend colors
async function addLegendColorsToEntry(
  worksheet: any,
  colNo: any,
  rowNo: any,
  dataFlag: number,
  leaveStatus: number,
  workedHours: any
) 
{
  switch (dataFlag) {
    //disabled
    case EXCEL_ATTENDANCE_SUMMARY_DATE_FLAG.DISABLED:
      colorCellAccordingToLegend(worksheet, colNo, rowNo, DISABLE_COLOR)
      break
    //weekend
    case EXCEL_ATTENDANCE_SUMMARY_DATE_FLAG.WEEKEND:
      colorCellAccordingToLegend(worksheet, colNo, rowNo, WEEKEND_COLOR)
      break
    //full non working days
    case EXCEL_ATTENDANCE_SUMMARY_DATE_FLAG.FULL_NONWORKING_DAY:
      colorCellAccordingToLegend(worksheet, colNo, rowNo, NON_WORK_DAY_COLOR)
      break
    //half non working days
    case EXCEL_ATTENDANCE_SUMMARY_DATE_FLAG.HALF_NONWORKING_DAY:
      switch (leaveStatus) {
        // Any Leave (Approved / Applied)
        case EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS.FULL_DAY_APPROVED_LEAVE:
        case EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS.FULL_DAY_APPLIED_LEAVE:
        case EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS.HALF_DAY_APPROVED_LEAVE:
        case EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS.HALF_DAY_APPLIED_LEAVE:
          colorCellAccordingToLegend(worksheet, colNo, rowNo, LEAVE_COLOUR)
          break

        // Default Case — Missing or Disabled
        default:
          if (workedHours === null || workedHours === undefined) {
            colorCellAccordingToLegend(worksheet, colNo, rowNo, MISSING_COLOR)
          } else if (workedHours === NA_WORKED_HOURS) {
            colorCellAccordingToLegend(worksheet, colNo, rowNo, DISABLE_COLOR)
          } else {
            colorCellAccordingToLegend(worksheet, colNo, rowNo, NON_WORK_DAY_COLOR)
          }
          break
      }
      break

    //default
    case EXCEL_ATTENDANCE_SUMMARY_DATE_FLAG.DEFAULT:
      switch (leaveStatus) {
        // Any Leave (Approved / Applied / Half Day)
        case EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS.FULL_DAY_APPROVED_LEAVE:
        case EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS.FULL_DAY_APPLIED_LEAVE:
        case EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS.HALF_DAY_APPROVED_LEAVE:
        case EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS.HALF_DAY_APPLIED_LEAVE:
          colorCellAccordingToLegend(worksheet, colNo, rowNo, LEAVE_COLOUR)
          break

        //  Missing or Disabled Attendance
        case EXCEL_ATTENDANCE_SUMMARYLEAVE_STATUS.DEFAULT:
          if (workedHours === null || workedHours === undefined) {
            colorCellAccordingToLegend(worksheet, colNo, rowNo, MISSING_COLOR)
          } else if (workedHours === NA_WORKED_HOURS) {
            colorCellAccordingToLegend(worksheet, colNo, rowNo, DISABLE_COLOR)
          }
          break
        default:
          break
      }
      break

    default:
      break
  }
}

//color filling based on legend color
async function colorFilledDataBasedOnLegend(worksheet: any, data: AttendanceSummaryDataObject[]) {
  let rowNo = COMMON_USES.DATA_ROWS_START
  const dataArray = data
  dataArray?.forEach(function (object: AttendanceSummaryDataObject) {
    let startColumnNo = START_COLUMN_NUMBER
    const attendanceSummary = object.attendanceSummery
    attendanceSummary?.forEach(function (objectDays: any) {
      let colNo = startColumnNo
      objectDays.day?.forEach(function (days: any) {
        // Color [time duration cell] according to legend
        addLegendColorsToEntry(
          worksheet,
          colNo,
          rowNo,
          days.dateFlag,
          days.leaveStatus,
          days.workedHours
        )
        colNo = colNo + 1
      })
      startColumnNo = startColumnNo + objectDays.day.length + 1
    })
    rowNo += 1
  })
}

async function createExcel(
  workbook: any,
  worksheet: any,
  data: any,
  searchData: AttendanceSummaryReportDisplayFilterParams
) {
  await createheds(searchData, worksheet)
  await fillData(worksheet, data)
  await stylingTables(worksheet)
  await colorFilledDataBasedOnLegend(worksheet, data)
  await filledDataFormatting(worksheet)

  //Display Filters
  setfiltersDate(START_ROW_FOR_COLOUR_CODE + 2, START_DATE, searchData.startDate, worksheet)
  setfiltersDate(START_ROW_FOR_COLOUR_CODE + 3, END_DATE, searchData.endDate, worksheet)
  setfilters(START_ROW_FOR_COLOUR_CODE + 4, CLIENT, searchData.clientName, worksheet)

  // Process each row for beautification
  worksheet.eachRow({ includeEmpty: true }, function (row: any) {
    row.eachCell(function (cell: any, colNumber: number) {
      // Set border of each cell
      if (colNumber !== COMMON_USES.FIRST_COLUMN) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
      }
    })
    row.commit()
  })

  //  set colour codes -- Display Legend
  setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE,
    DISABLE,
    DISABLE_COLOR,
    COLOUR_LEGEND_FONT_COLOUR_2,
    worksheet
  )
  setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE + 1,
    MISSING,
    MISSING_COLOR,
    COLOUR_LEGEND_FONT_COLOUR_1,
    worksheet
  )
  setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE + 2,
    WEEKEND,
    WEEKEND_COLOR,
    COLOUR_LEGEND_FONT_COLOUR_1,
    worksheet
  )
    setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE + 3,
    NON_WORK_DAY,
    NON_WORK_DAY_COLOR,
    COLOUR_LEGEND_FONT_COLOUR_2,
    worksheet
  )
      setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE + 4,
    LEAVE,
    LEAVE_COLOUR,
    COLOUR_LEGEND_FONT_COLOUR_2,
    worksheet
  )


  if (searchData.billing) {
    workbook.xlsx
      .writeBuffer()
      .then((buffer: any) =>
        FileSaver.saveAs(
          new Blob([buffer]),
          `ATTENDANCE_SUMMARY_REPORT(BILLING)_${Date.now()}.xlsx`
        )
      )
      .catch((err: any) => console.log('Error writing excel export', err))
  } else {
    workbook.xlsx
      .writeBuffer()
      .then((buffer: any) =>
        FileSaver.saveAs(new Blob([buffer]), `ATTENDANCE_SUMMARY_REPORT_${Date.now()}.xlsx`)
      )
      .catch((err: any) => console.log('Error writing excel export', err))
  }
}
