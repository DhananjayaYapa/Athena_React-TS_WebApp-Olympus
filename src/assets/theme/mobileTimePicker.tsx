const TimePickerStyles = {
  leftArrowIcon: {
    sx: { display: 'none' },
  },
  rightArrowIcon: {
    sx: { display: 'none' },
  },
  previousIconButton: {
    disabled: true,
  },
  nextIconButton: {
    disabled: true,
  },
  toolbar: {
    sx: {
      backgroundColor: '#0166fe',
      '& .MuiTypography-overline': {
        display: 'none',
      },
      '& .MuiTypography-root': {
        color: 'rgba(255, 255, 255, 0.54)',
      },
      '& .MuiPickersToolbarText-root[data-selected]': {
        color: '#fff',
      },
      '& .MuiPickersToolbar-content': {
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'fit-content',
      },
    },
  },
}

export default TimePickerStyles
