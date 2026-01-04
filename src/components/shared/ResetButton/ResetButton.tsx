import React from 'react'
import { Button } from '@mui/material'

const ResetButton: React.FC<{
  buttonText: String
  onClickFunction(): void
}> = (props) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={props.onClickFunction}
      style={{ marginLeft: '5px', width: '80px' }}
    >
      {props.buttonText}
    </Button>
  )
}

export default ResetButton
