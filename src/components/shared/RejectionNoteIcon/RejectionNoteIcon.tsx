import { Dialog, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material'
import { HelpOutline } from '@mui/icons-material'
import React, { useState } from 'react'

// The status label component of the leave table
const RejectionNoteIcon: React.FC<{
  rejectionNote: string
}> = (props) => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'inline' }}>
      <Tooltip title="Rejection reason">
        <HelpOutline className="rejectionNoteIcon" fontSize="small" onClick={() => setOpen(true)} />
      </Tooltip>
      <Dialog maxWidth="sm" open={open} onClose={() => setOpen(false)}>
        <DialogTitle style={{ marginBottom: '-10px' }}>
          <p style={{ fontWeight: 'bolder', margin: '0px' }}>Reason for leave rejection</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: 'black' }}>{props.rejectionNote}</DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RejectionNoteIcon
