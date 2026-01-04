import * as Excel from 'exceljs'
import FileSaver from 'file-saver'
import {
  DAYS,
  EXCEL_HEADER_COLORS,
  EXCEL_HEADINGS,
  EXCEL_LEAVES_COLORS,
  EXCEL_LEAVE_STATUS,
  WORKSHEET_COLUMNS,
  EXCEL_DATE_FLAG,
} from '../../../utilities/constants'
import { DetailedAttendanceReportDisplayFilterParams } from '../../../utilities/models'

const ACENTURA_HEADING_COLOUR = EXCEL_HEADER_COLORS.ACENTURA_HEADING_COLOUR
const ACENTURA_HEADING_FONT_COLOUR = EXCEL_HEADER_COLORS.ACENTURA_HEADING_FONT_COLOUR
const LEFT_COLUMNS_COLOUR = EXCEL_HEADER_COLORS.LEFT_COLUMNS_COLOUR
const LEFT_COLUMNS_FONT_COLOUR = EXCEL_HEADER_COLORS.LEFT_COLUMNS_FONT_COLOUR
const DATE_HEADINGS_COLOUR = EXCEL_HEADER_COLORS.DATE_HEADINGS_COLOUR
const DATE_HEADINGS_FONT_COLOUR = EXCEL_HEADER_COLORS.ACENTURA_HEADING_FONT_COLOUR
const WEEK_FONT_COLOUR = EXCEL_HEADER_COLORS.WEEK_FONT_COLOUR
const WEEK_FILL_COLOUR = EXCEL_HEADER_COLORS.WEEK_FILL_COLOUR
const COLOUR_LEGEND_FONT_COLOUR_1 = EXCEL_HEADER_COLORS.COLOUR_LEGEND_FONT_COLOUR_1
const COLOUR_LEGEND_FONT_COLOUR_2 = EXCEL_HEADER_COLORS.COLOUR_LEGEND_FONT_COLOUR_2

const LIEUE_LEAVE_COLOUR = EXCEL_LEAVES_COLORS.LIEUE_LEAVE_COLOUR
const APPLIED_LEAVE_COLOUR = EXCEL_LEAVES_COLORS.APPLIED_LEAVE_COLOUR
const APPROVED_LEAVE_COLOUR = EXCEL_LEAVES_COLORS.APPROVED_LEAVE_COLOUR
const WEEK_END_COLOUR = EXCEL_LEAVES_COLORS.WEEK_END_COLOUR
const DISABLE_DATE_COLOUR = EXCEL_LEAVES_COLORS.DISABLE_DATE_COLOUR
const NONWOKINGDAY_COLOUR = EXCEL_LEAVES_COLORS.NONWOKINGDAY_COLOUR
const TIME_MISSING_COLOUR = EXCEL_LEAVES_COLORS.TIME_MISSING_COLOUR
const LEAVE_COLOUR = EXCEL_LEAVES_COLORS.LEAVE_COLOUR

const LEAVE = EXCEL_HEADINGS.LEAVE
const NONWOKINGDAY = EXCEL_HEADINGS.NONWOKINGDAY
const TIME_MISSING = EXCEL_HEADINGS.TIME_MISSING
const WEEKEND = EXCEL_HEADINGS.WEEKEND
const DISABLE_DATE = EXCEL_HEADINGS.DISABLE_DATE

const START_DATE = EXCEL_HEADINGS.START_DATE
const END_DATE = EXCEL_HEADINGS.END_DATE
const CLIENT = EXCEL_HEADINGS.CLIENT
const TEAM = EXCEL_HEADINGS.TEAM
const EMPLOYEE = EXCEL_HEADINGS.EMPLOYEE

const MAIN_HEADING = EXCEL_HEADINGS.MAIN_HEADING
const WEEK = EXCEL_HEADINGS.WEEK
const IN = EXCEL_HEADINGS.IN
const OUT = EXCEL_HEADINGS.OUT

const DATE_FLAG = EXCEL_DATE_FLAG
const LEAVE_STATUS = EXCEL_LEAVE_STATUS
const days = DAYS
const worksheetColumns = WORKSHEET_COLUMNS

const LEFT_COLUMN_COUNT = 6
const START_ROW_NUMBER = 9
const START_COLUMN_FOR_COLOUR_CODE = 2
const START_ROW_FOR_COLOUR_CODE = 2
const NA_TIME = -1

let heads: any = [] //all column names for table
let headIn: any = [] // in time column names
let headOut: any = [] // out time column names
let startWeek: any = [] // start column names in each week
let endWeek: any = [] // end column names in each week

export const detailedAttendanceGenarations = (
  data: any,
  searchData: DetailedAttendanceReportDisplayFilterParams
) => {
  heads = []
  headIn = []
  headOut = []
  startWeek = []
  endWeek = []

  const sdate = searchData.startDate
  const edate = searchData.endDate
  const client = searchData.clientName
  const team = searchData.teamName
  const employee = searchData.username

  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Data')
  worksheet.views = [{ state: 'frozen', xSplit: LEFT_COLUMN_COUNT, ySplit: START_ROW_NUMBER + 3 }]
  worksheet.columns = worksheetColumns
  createExcel(workbook, worksheet, data, sdate, edate, client, team, employee)
}

// Add all colums names of the table(A,B,C...)
async function createheds(noOfColheads: number, worksheet: any) {
  for (let i = 1; i <= noOfColheads; i++) {
    heads.push(worksheet.getColumn(i).letter)
  }
}

// Merge and fill colour for cell
async function formatInAndOutCellWithMerge(
  row: any,
  invalue: any,
  outvalue: any,
  COLOUR: any,
  worksheet: any
) {
  worksheet.mergeCells(`${invalue}${row}:${outvalue}${row}`)
  colourCell(invalue, row, COLOUR, worksheet)
}

// fill colours without merge
async function formatInAndOutCellWithoutMerge(
  row: any,
  invalue: any,
  outvalue: any,
  COLOUR: any,
  worksheet: any
) {
  colourCell(invalue, row, COLOUR, worksheet)
  colourCell(outvalue, row, COLOUR, worksheet)
}

// fill colour a cell
async function colourCell(i: any, row: any, COLOUR: any, worksheet: any) {
  worksheet.getCell(`${i}${row}`).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  }
  worksheet.getCell(`${i}${row}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: COLOUR },
  }
}

// create colour legends
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
}

async function setfiltersDate(row: any, filter: any, value: any, worksheet: any) {
  worksheet.getCell(`${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE).letter}${row}`).value =
    filter
  worksheet.mergeCells(
    `${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 1).letter}${row}:${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 3).letter}${row}`
  )
  worksheet.getCell(`${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 1).letter}${row}`).value =
    new Date(value)
  worksheet.getCell(
    `${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 1).letter}${row}`
  ).numFmt = 'yyyy-mm-dd'
  worksheet.getCell(
    `${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 1).letter}${row}`
  ).alignment = {
    vertical: 'middle',
    horizontal: 'left',
  }
}
async function setfilters(row: any, filter: any, value: any, worksheet: any) {
  worksheet.getCell(`${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE).letter}${row}`).value =
    filter
  worksheet.mergeCells(
    `${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 1).letter}${row}:${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 3).letter}${row}`
  )
  worksheet.getCell(`${worksheet.getColumn(START_COLUMN_FOR_COLOUR_CODE + 1).letter}${row}`).value =
    value
}

async function missingTimeChecking(
  inTime: any,
  outTime: any,
  indata: any,
  x: any,
  i: any,
  worksheet: any
) {
  if (inTime == null && outTime == null) {
    formatInAndOutCellWithoutMerge(
      indata + Number(x),
      headIn[i],
      headOut[i],
      TIME_MISSING_COLOUR,
      worksheet
    )
  } else if (inTime == null) {
    colourCell(headIn[i], indata + Number(x), TIME_MISSING_COLOUR, worksheet)
  } else if (outTime == null) {
    colourCell(headOut[i], indata + Number(x), TIME_MISSING_COLOUR, worksheet)
  }
}

async function createExcel(
  workbook: any,
  worksheet: any,
  data: any,
  sdate: any,
  edate: any,
  client: any,
  team: any,
  employee: any
) {
  var startDate = data[0].attendance[0].date
  var Datediff = data[0].attendance.length

  //calculate no.of columns for the table
  var noOfColheads = Datediff * 2 + LEFT_COLUMN_COUNT

  //create column heads for table
  createheds(noOfColheads, worksheet)

  //Left side
  // merge a range of cells for Acentura-Attendance heading
  worksheet.mergeCells(
    `B${START_ROW_NUMBER + 1}:${heads[LEFT_COLUMN_COUNT - 1]}${START_ROW_NUMBER + 1}`
  )
  worksheet.getCell(`D${START_ROW_NUMBER + 1}`).value = MAIN_HEADING
  worksheet.getCell(`D${START_ROW_NUMBER + 1}`).alignment = {
    vertical: 'middle',
    horizontal: 'center',
  }
  worksheet.getCell(`B${START_ROW_NUMBER + 1}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: ACENTURA_HEADING_COLOUR },
  }
  // change font
  worksheet.getCell(`C${START_ROW_NUMBER + 1}`).font = {
    color: { argb: ACENTURA_HEADING_FONT_COLOUR },
    family: 2,
    size: 10,
    italic: true,
    bold: true,
  }

  worksheet.mergeCells(
    `B${START_ROW_NUMBER + 2}:${heads[LEFT_COLUMN_COUNT - 1]}${START_ROW_NUMBER + 2}`
  )
  // add left column header
  worksheet.addRow(['', 'Date Joined', 'Tier', 'EmpNo.', '', 'Name'])

  // Merge the "Name" header across E:F
  worksheet.mergeCells(`${heads[4]}${START_ROW_NUMBER + 3}:${heads[5]}${START_ROW_NUMBER + 3}`)
  worksheet.getCell(`${heads[4]}${START_ROW_NUMBER + 3}`).value = 'Name'

  // Set filter from Date Joined (heads[1]) to merged Name col (heads[5])
  worksheet.autoFilter = {
    from: { row: START_ROW_NUMBER + 3, column: 2 }, // heads[1] (Date Joined)
    to: { row: START_ROW_NUMBER + 3, column: 5 }, // 4th filter (Name), positioned on F
  }

  // Fill employee data
  const testData = data.map((e: any) => ({
    joindDate: new Date(e.joinedDate.slice(0, 10)),
    tier: e.tier,
    empno: e.employeeNumber,
    name: e.name,
  }))
  worksheet.addRows(testData)

  // Merge each employee "Name" value across E:F
  const startRow = START_ROW_NUMBER + 4
  testData.forEach((row: any, idx: any) => {
    const rowNumber = startRow + idx
    worksheet.mergeCells(`${heads[4]}${rowNumber}:${heads[5]}${rowNumber}`)
    worksheet.getCell(`${heads[4]}${rowNumber}`).value = row.name
    worksheet.getCell(`${heads[4]}${rowNumber}`).alignment = {
      vertical: 'middle',
      horizontal: 'left',
    }
  })

  // custamize Left column headers
  for (let i = 1; i < LEFT_COLUMN_COUNT; i++) {
    worksheet.getCell(`${heads[i]}${START_ROW_NUMBER + 3}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: LEFT_COLUMNS_COLOUR },
    }
    worksheet.getCell(`${heads[i]}${START_ROW_NUMBER + 3}`).font = {
      color: { argb: LEFT_COLUMNS_FONT_COLOUR },
      family: 2,
      size: 10,
      italic: true,
      bold: true,
    }
  }

  //Right side
  //set IN cell numbers and Out cell numbers
  for (let i = LEFT_COLUMN_COUNT; i < noOfColheads; i = i + 2) {
    headIn.push(heads[i])
    headOut.push(heads[i + 1])
  }
  //Attendance-date and days cell merged
  for (let i = 0; i < headIn.length; i++) {
    //date merge
    worksheet.mergeCells(`${headIn[i]}${START_ROW_NUMBER + 1}:${headOut[i]}${START_ROW_NUMBER + 1}`)
    //set date colour
    worksheet.getCell(`${headIn[i]}${START_ROW_NUMBER + 1}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: DATE_HEADINGS_COLOUR },
    }
    // set date font
    worksheet.getCell(`${headIn[i]}${START_ROW_NUMBER + 1}`).font = {
      color: { argb: DATE_HEADINGS_FONT_COLOUR },
      family: 2,
      size: 10,
      italic: true,
      bold: true,
    }
    //set date value
    worksheet.getCell(`${headIn[i]}${START_ROW_NUMBER + 1}`).value = new Date(
      data[0].attendance[i].date
    )
    worksheet.getCell(`${headIn[i]}${START_ROW_NUMBER + 1}`).numFmt = 'dd-mmm-yy'
    worksheet.getCell(`${headIn[i]}${START_ROW_NUMBER + 1}`).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    }
  }

  //get the week day index of firstdate(0:sunday-6:saturday)
  const d = new Date(`${startDate} 00:00:00`)
  let day = d.getDay()
  // merge and set week days names for cell
  for (let i = 0; i < headIn.length; i++) {
    //merge week day cell
    worksheet.mergeCells(`${headIn[i]}${START_ROW_NUMBER + 3}:${headOut[i]}${START_ROW_NUMBER + 3}`)
    //set value for week day
    worksheet.getCell(`${headIn[i]}${START_ROW_NUMBER + 3}`).value = days[day]
    worksheet.getCell(`${headIn[i]}${START_ROW_NUMBER + 3}`).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    }
    //get start column in each week
    if (i === 0 || day === 1) {
      startWeek.push(headIn[i])
    }
    //get end column in each week
    if (i === headIn.length - 1 || day === 0) {
      endWeek.push(headOut[i])
    }
    day++
    if (day === 7) {
      day = 0
    }
  }

  //set In and Out heading
  for (let i = 0; i < headIn.length; i++) {
    worksheet.getCell(`${headIn[i]}${START_ROW_NUMBER + 2}`).value = IN
    worksheet.getCell(`${headOut[i]}${START_ROW_NUMBER + 2}`).value = OUT
  }

  //set week names in week row
  for (let i = 0; i < startWeek.length; i++) {
    if (startWeek[i] != undefined && endWeek[i] !== undefined) {
      worksheet.mergeCells(`${startWeek[i]}${START_ROW_NUMBER}:${endWeek[i]}${START_ROW_NUMBER}`)
      worksheet.getCell(`${startWeek[i]}${START_ROW_NUMBER}`).value = WEEK + (i + 1)
      worksheet.getCell(`${startWeek[i]}${START_ROW_NUMBER}`).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }
      worksheet.getCell(`${startWeek[i]}${START_ROW_NUMBER}`).font = {
        color: { argb: WEEK_FONT_COLOUR },
        family: 2,
        size: 10,
        bold: true,
      }
      worksheet.getCell(`${startWeek[i]}${START_ROW_NUMBER}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: WEEK_FILL_COLOUR },
      }
    }
  }

  // fill in and out times and colours
  const indata = START_ROW_NUMBER + 4
  for (const x in data) {
    for (let i = 0; i < data[x].attendance.length; i++) {
      switch (data[x].attendance[i].dateFlag) {
        // disable dates colour fill
        case DATE_FLAG.DISABLE_DATE:
          formatInAndOutCellWithoutMerge(
            indata + Number(x),
            headIn[i],
            headOut[i],
            DISABLE_DATE_COLOUR,
            worksheet
          )
          continue
        // weekend colour fill
        case DATE_FLAG.WEEKEND:
          formatInAndOutCellWithoutMerge(
            indata + Number(x),
            headIn[i],
            headOut[i],
            WEEK_END_COLOUR,
            worksheet
          )
          break
        case DATE_FLAG.FULL_NONWORKINGDAY:
          formatInAndOutCellWithoutMerge(
            indata + Number(x),
            headIn[i],
            headOut[i],
            NONWOKINGDAY_COLOUR,
            worksheet
          )
          break
        case DATE_FLAG.HALF_NONWORKINGDAY:
          colourCell(headOut[i], indata + Number(x), NONWOKINGDAY_COLOUR, worksheet)
          // check whether has a leave in half non working day
          switch (data[x].attendance[i].leaveStatus) {
            case LEAVE_STATUS.HALF_DAY_APPLIED_LEAVE:
              colourCell(headIn[i], indata + Number(x), APPLIED_LEAVE_COLOUR, worksheet)
              break
            case LEAVE_STATUS.HALF_DAY_APPROVED_LEAVE:
              colourCell(headIn[i], indata + Number(x), APPROVED_LEAVE_COLOUR, worksheet)
              break
            case LEAVE_STATUS.LIEUE_LEAVE:
              colourCell(headIn[i], indata + Number(x), LIEUE_LEAVE_COLOUR, worksheet)
              worksheet.getCell(`${headIn[i]}${indata + Number(x)}`).value = 'FL'
              break
            case LEAVE_STATUS.DEFAULT:
              if (data[x].attendance[i].in == NA_TIME && data[x].attendance[i].out == NA_TIME) {
                colourCell(headIn[i], indata + Number(x), DISABLE_DATE_COLOUR, worksheet)
                continue
              }
              missingTimeChecking(
                data[x].attendance[i].in,
                data[x].attendance[i].out,
                indata,
                x,
                i,
                worksheet
              )
              break
          }
          break
        // check leave status
        case DATE_FLAG.DEFAULT:
          switch (data[x].attendance[i].leaveStatus) {
            case LEAVE_STATUS.FULL_DAY_APPLIED_LEAVE:
              formatInAndOutCellWithMerge(
                indata + Number(x),
                headIn[i],
                headOut[i],
                APPLIED_LEAVE_COLOUR,
                worksheet
              )
              worksheet.getCell(`${headIn[i]}${indata + Number(x)}`).value = 'FL'
              worksheet.getCell(`${headIn[i]}${indata + Number(x)}`).alignment = {
                vertical: 'middle',
                horizontal: 'center',
              }
              continue
            case LEAVE_STATUS.FULL_DAY_APPROVED_LEAVE:
              formatInAndOutCellWithMerge(
                indata + Number(x),
                headIn[i],
                headOut[i],
                APPROVED_LEAVE_COLOUR,
                worksheet
              )
              worksheet.getCell(`${headIn[i]}${indata + Number(x)}`).value = 'FL'
              worksheet.getCell(`${headIn[i]}${indata + Number(x)}`).alignment = {
                vertical: 'middle',
                horizontal: 'center',
              }
              continue
            case LEAVE_STATUS.HALF_DAY_APPLIED_LEAVE:
              colourCell(headOut[i], indata + Number(x), APPLIED_LEAVE_COLOUR, worksheet)
              if (data[x].attendance[i].in == NA_TIME && data[x].attendance[i].out == NA_TIME) {
                colourCell(headIn[i], indata + Number(x), DISABLE_DATE_COLOUR, worksheet)
                continue
              }
              missingTimeChecking(
                data[x].attendance[i].in,
                data[x].attendance[i].out,
                indata,
                x,
                i,
                worksheet
              )
              break
            case LEAVE_STATUS.HALF_DAY_APPROVED_LEAVE:
              colourCell(headOut[i], indata + Number(x), APPROVED_LEAVE_COLOUR, worksheet)
              if (data[x].attendance[i].in == NA_TIME && data[x].attendance[i].out == NA_TIME) {
                colourCell(headIn[i], indata + Number(x), DISABLE_DATE_COLOUR, worksheet)
                continue
              }
              missingTimeChecking(
                data[x].attendance[i].in,
                data[x].attendance[i].out,
                indata,
                x,
                i,
                worksheet
              )
              break
            case LEAVE_STATUS.LIEUE_LEAVE:
              formatInAndOutCellWithMerge(
                indata + Number(x),
                headIn[i],
                headOut[i],
                LIEUE_LEAVE_COLOUR,
                worksheet
              )
              worksheet.getCell(`${headIn[i]}${indata + Number(x)}`).value = 'FL'
              worksheet.getCell(`${headIn[i]}${indata + Number(x)}`).alignment = {
                vertical: 'middle',
                horizontal: 'center',
              }
              continue
            case LEAVE_STATUS.DEFAULT:
              if (data[x].attendance[i].in == NA_TIME && data[x].attendance[i].out == NA_TIME) {
                formatInAndOutCellWithoutMerge(
                  indata + Number(x),
                  headIn[i],
                  headOut[i],
                  DISABLE_DATE_COLOUR,
                  worksheet
                )
                continue
              }
              missingTimeChecking(
                data[x].attendance[i].in,
                data[x].attendance[i].out,
                indata,
                x,
                i,
                worksheet
              )
              break
          }
      }

      if (data[x].attendance[i].in != NA_TIME && data[x].attendance[i].out != NA_TIME) {
        worksheet.getCell(`${headIn[i]}${indata + Number(x)}`).value = data[x].attendance[i].in
          ? new Date(
              Date.parse(data[x].attendance[i].date + 'T' + data[x].attendance[i].in + '+0000')
            )
          : ''
        worksheet.getCell(`${headIn[i]}${indata + Number(x)}`).numFmt = 'hh:mm'
        worksheet.getCell(`${headOut[i]}${indata + Number(x)}`).value = data[x].attendance[i].out
          ? new Date(
              Date.parse(data[x].attendance[i].date + 'T' + data[x].attendance[i].out + '+0000')
            )
          : ''
        worksheet.getCell(`${headOut[i]}${indata + Number(x)}`).numFmt = 'hh:mm'
      }
    }
  }

  setfiltersDate(START_ROW_FOR_COLOUR_CODE + 2, START_DATE, sdate, worksheet)
  setfiltersDate(START_ROW_FOR_COLOUR_CODE + 3, END_DATE, edate, worksheet)
  setfilters(START_ROW_FOR_COLOUR_CODE + 4, CLIENT, client, worksheet)
  setfilters(START_ROW_FOR_COLOUR_CODE + 5, TEAM, team, worksheet)
  setfilters(START_ROW_FOR_COLOUR_CODE + 6, EMPLOYEE, employee, worksheet)

  // Process each row for beautification
  worksheet.eachRow({ includeEmpty: true }, function (row: any) {
    row.eachCell(function (cell: any) {
      // Set border of each cell
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
    })
    row.commit()
  })

  //  set colour codes
  setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE,
    DISABLE_DATE,
    DISABLE_DATE_COLOUR,
    COLOUR_LEGEND_FONT_COLOUR_2,
    worksheet
  )
  setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE + 1,
    TIME_MISSING,
    TIME_MISSING_COLOUR,
    COLOUR_LEGEND_FONT_COLOUR_1,
    worksheet
  )
  setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE + 2,
    LEAVE,
    LEAVE_COLOUR,
    COLOUR_LEGEND_FONT_COLOUR_2,
    worksheet
  )
  setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE + 3,
    WEEKEND,
    WEEK_END_COLOUR,
    COLOUR_LEGEND_FONT_COLOUR_1,
    worksheet
  )
  setColourCodes(
    START_COLUMN_FOR_COLOUR_CODE + 4,
    NONWOKINGDAY,
    NONWOKINGDAY_COLOUR,
    COLOUR_LEGEND_FONT_COLOUR_2,
    worksheet
  )

  workbook.xlsx
    .writeBuffer()
    .then((buffer: any) =>
      FileSaver.saveAs(new Blob([buffer]), `DETAILED_ATTENDANCE_REPORT_${Date.now()}.xlsx`)
    )
    // eslint-disable-next-line no-console
    .catch((err: any) => console.log('Error writing excel export', err))
}
