import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Dialog,
  TextField,
} from '@mui/material'
import React from 'react'
import { LeaveListItemDto, LeaveRejectReasonFormDto } from '../../../utilities/models'

const LeaveRejectPopup: React.FC<{
  onClose(isConfirmed: boolean, choice?: LeaveListItemDto): void
  onFormChange(property: string, value: any): void
  formData: LeaveRejectReasonFormDto
  data?: any
  open: boolean
}> = (props) => {
  const handleCancel = () => {
    props.onClose(false)
  }

  const handleOk = () => {
    props.onClose(true, props.data)
  }
  return (
    <React.Fragment>
      <Dialog maxWidth="xs" aria-labelledby="confirmation-dialog-title" open={props.open}>
        <DialogTitle id="confirmation-dialog-title">Reject Leave</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>To reject the leave, please enter your reason here.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reject Reason"
            value={props.formData.reason.value}
            error={!!props.formData.reason.error}
            onChange={(e) => props.onFormChange('reason', e.target.value)}
            fullWidth
          />
        </DialogContent>
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
export default LeaveRejectPopup
