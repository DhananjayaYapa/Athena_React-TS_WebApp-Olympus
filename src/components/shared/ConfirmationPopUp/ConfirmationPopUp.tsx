import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmationPopUp: React.FC<{
  popUpTitle: string
  confirmationMessage: string
  onClose(isConfirmed: boolean, choice: any): void
  data?: any
  open: boolean
}> = (props) => {
  const handleCancel = () => {
    props.onClose(false, null)
  }

  const handleOk = () => {
    props.onClose(true, props.data)
  }

  return (
    <React.Fragment>
      <Dialog maxWidth="xs" aria-labelledby="confirmation-dialog-title" open={props.open}>
        <DialogTitle id="confirmation-dialog-title">{props.popUpTitle}</DialogTitle>
        <DialogContent dividers>{props.confirmationMessage}</DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default ConfirmationPopUp
