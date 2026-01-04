import { createTheme, styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

const primaryFontSize = 14

export const PrimaryTheme = createTheme({
  palette: {
    primary: { main: '#0166fe' },
    secondary: { main: '#fff9d1' },
  },
  typography: {
    fontFamily: ['PT Sans', 'sans-serif'].join(','),
    fontSize: primaryFontSize,
    fontWeightLight: 100,
    fontWeightRegular: 400,
    fontWeightBold: 700,
    body1: { fontSize: primaryFontSize },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: { fontSize: primaryFontSize },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: (themeParam) => ({
          boxShadow: themeParam.theme.shadows[3],
          fontSize: primaryFontSize,
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { fontSize: primaryFontSize },
      },
    },
    MuiTypography: {
      styleOverrides: {
        paragraph: { fontSize: primaryFontSize },
      },
    },
  },
})

// // Styles you can use with sx
// export const useStyles = {
//   root: { '& .MuiFormControl-root': {} },
//   pageContent: { p: 3 },
// }

// export const customStyles = {
//   control: (base: any) => ({
//     ...base,
//     height: 55,
//     minHeight: 35,
//   }),
// }

export const StyledTableCell = styled(TableCell)(() => ({
  '&.MuiTableCell-head': {
    backgroundColor: '#f4f4f4',
    fontWeight: 600,
    padding: '10px',
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
    padding: '6px',
  },
}))

export const StyledTableBoldCell = styled(TableCell)(() => ({
  backgroundColor: '#f4f4f4',
  fontSize: 14,
  fontWeight: 600,
  padding: '10px',
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}))
