import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

export type SavePayload = { workedHrs: number; comments: string }

const TimeEntryChangePopup: React.FC<{
  timeEntryOpen: boolean
  taskDate: string | null
  taskId: number | null
  teamId: number | null
  taskName: string | null
  workedHrs: number | null
  taskComments: string | null
  handleTempWorkedHrs: (workedHrs: number) => void
  handleTempComments: (comments: string) => void
  saveTimeEntryChange: (payload: SavePayload) => void | Promise<void>
  handleTimeEntryCancel: () => void
}> = (props) => {
  const [errorMsg, setErrorMsg] = React.useState<string>('')
  const [localHrs, setLocalHrs] = React.useState<number | null>(props.workedHrs ?? null)
  const [localComments, setLocalComments] = React.useState<string>(props.taskComments ?? '')

  React.useEffect(() => {
    if (props.timeEntryOpen) {
      setLocalHrs(props.workedHrs ?? null)
      setLocalComments(props.taskComments ?? '')
      setErrorMsg('')
    }
  }, [props.timeEntryOpen])

  const validateComments = (value: string) => {
    const len = value.trim().length
    if (len < 10) {
      setErrorMsg('Comment is too short. Please enter at least 10 characters')
    } else if (value.length > 255) {
      setErrorMsg('Comment is too long. Please limit your entry to 255 characters.')
    } else {
      setErrorMsg('')
    }
  }

  const zeroHoursWithComment = localHrs === 0 && localComments.trim().length > 0
  const isConfirmDisabled =
    localHrs == null || !!errorMsg || zeroHoursWithComment

  const handleCancel = () => {
    setErrorMsg('')
    props.handleTimeEntryCancel()
  }

  const handleReset = () => {
    setLocalHrs(0)
    setLocalComments('')
    setErrorMsg('')
  }

  const onConfirm = () => {
       if (zeroHoursWithComment) {
     setErrorMsg('You can not save task details with 0 worked hours.')
     return
   }
    const hrs = localHrs ?? 0
    const comments = localComments
    props.saveTimeEntryChange({ workedHrs: hrs, comments })
  }

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      disableRestoreFocus
      fullWidth
      open={props.timeEntryOpen}
      onClose={handleCancel}
    >
      <DialogTitle id="customized-dialog-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={800}>
            Time Entry - {props.taskDate}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCancel}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography fontSize={18} fontWeight={500}>
          Task Name : {props.taskName || '-'}
        </Typography>
      </DialogTitle>
      <DialogContent dividers className="dialogContainer">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12, sm: 12, lg: 12 }} sx={{ display: 'flex' }}>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <Typography variant="body1" fontWeight={600}>
                Time Spent (Worked Hours)*:
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <TextField
                variant="standard"
                fullWidth
                autoFocus
                value={localHrs ?? ''}
                type="number"
                onChange={(e) => {
                  const v = e.target.value
                  if (v === '') {
                    setLocalHrs(null)
                    setErrorMsg('')
                    return
                  }
                  const normalized = v.replace(',', '.')
                  let num = Number(normalized)
                  if (Number.isNaN(num)) return
                  num = Math.max(0, Math.min(24, num))
                  const rounded = Math.round(num * 100) / 100

                  setLocalHrs(rounded)
                  if (rounded === 0) setErrorMsg('')
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                  if (e.key === '.' && String(e.currentTarget.value).includes('.'))
                    e.preventDefault()
                }}
                slotProps={{
                  htmlInput: {
                    inputMode: 'decimal',
                    step: 1,
                    min: 0,
                    max: 24,
                    style: { textAlign: 'center' as const },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 12, sm: 12, lg: 12 }} sx={{ mt: 1, pt: 1 }}>
          <div>
            <Typography variant="body1" fontWeight={600}>
              Task Details:
            </Typography>
          </div>
          <TextField
            variant="outlined"
            fullWidth
            sx={{ mt: 0.5 }}
            value={localComments}
            placeholder="Comment"
            multiline
            minRows={3}
            disabled={localHrs == null}
            onChange={(e) => {
              const value = e.target.value
              setLocalComments(value)
              if ((localHrs ?? 0) > 0) {
                validateComments(value)
              } else {
                setErrorMsg('')
              }
            }}
            error={!!errorMsg || zeroHoursWithComment}
            helperText={
              zeroHoursWithComment ? 'You can not save task details with 0 worked hours.' : errorMsg
            }
          />
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button
          onClick={handleReset}
          variant="text"
          disabled={(localHrs == null || localHrs === 0) && localComments === '' && !errorMsg}
        >
          Reset
        </Button>
        <Box>
          <Button onClick={handleCancel} variant="text" color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="text" disabled={isConfirmDisabled}>
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default TimeEntryChangePopup
