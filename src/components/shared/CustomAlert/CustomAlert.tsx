import React from 'react'

import { Alert, AlertColor } from '@mui/material'

const CustomAlert: React.FC<{
  severity: AlertColor
  displayText: string
}> = (props) => {
  //const [open, setOpen] = useState(true)

  return (
    <React.Fragment>
      <Alert severity={props.severity}>{props.displayText}</Alert>
    </React.Fragment>
  )
}

export default CustomAlert
