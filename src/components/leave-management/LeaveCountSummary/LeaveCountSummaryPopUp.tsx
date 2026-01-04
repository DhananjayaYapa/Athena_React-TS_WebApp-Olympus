import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from '@mui/material'
import { LeaveCountSummaryDto, LeaveListItemDto } from '../../../utilities/models/'
import { DEFAULT_SELECTED_LEAVE_TYPE } from '../../../utilities/constants/index'
import LeaveCountSummary from './LeaveCountSummary'
import styles from './LeaveCountSummary.module.scss'

const LeaveCountSummaryPopUp: React.FC<{
  open: boolean
  data: LeaveListItemDto
  leaveCountSummary: LeaveCountSummaryDto
  isLoading: boolean
  onClose: () => void
}> = (props) => {
  const [selectedLeaveType, setSelectedLeaveType] = useState(DEFAULT_SELECTED_LEAVE_TYPE)

  useEffect(() => {
    props.data.leaveTypeId && setSelectedLeaveType(props.data.leaveTypeId)
  }, [props.data])

  const handleCancel = () => {
    props.onClose()
  }

  const handleLeaveTypeChange = (value: number) => {
    setSelectedLeaveType(value)
  }

  // console.log("props.data.leaveTypeId ", props.data.leaveTypeId)

  const getSelectedLeaveType = (selectedLeaveType: number) => {
    const leaveCountSummary = props.leaveCountSummary
    if (leaveCountSummary) {
      const approved = leaveCountSummary.approveLeave
        ? leaveCountSummary.approveLeave.filter(
            (leaveSummary) => leaveSummary.leaveTypeId === selectedLeaveType
          )
        : []
      const applied = leaveCountSummary.appliedLeave
        ? leaveCountSummary.appliedLeave.filter(
            (leaveSummary) => leaveSummary.leaveTypeId === selectedLeaveType
          )
        : []
      const available = leaveCountSummary.availableLeave
        ? leaveCountSummary.availableLeave.filter(
            (leaveSummary) => leaveSummary.leaveTypeId === selectedLeaveType
          )
        : []
      return [
        approved[0] ? approved[0].leaveCount : 0,
        applied[0] ? applied[0].leaveCount : 0,
        available[0] ? available[0].leaveCount : 0,
      ]
    } else {
      return []
    }
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={props.open}
        // className={styles.summaryPopUp}
      >
        <DialogTitle className={styles.summaryPopUpTitle}>
          <h3>Leave Count Summary</h3>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} className="content-padding">
            <Grid size={{ md: 6 }} className="sectionTitleHolder">
              {/* <h3 className={styles.leaveCountSummaryTitle}>Leave Count Summary</h3> */}
              <p className={styles.summaryDesc}>
                You can select leave type to get leave count summary of the user in this section.
              </p>
              <br />
              <FormControl style={{ width: '100%' }} variant="outlined">
                <TextField
                  style={{ width: '100%', marginBottom: '15px' }}
                  disabled
                  size="small"
                  label="username"
                  variant="outlined"
                  value={props.data.username}
                />
              </FormControl>
              <FormControl style={{ width: '100%' }} variant="outlined">
                <InputLabel required id="select-outlined-label">
                  Leave Type
                </InputLabel>
                <Select
                  required
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                  id="leaveType"
                  value={selectedLeaveType}
                  // onChange={handleSelectChange}
                  onChange={(event: any) => handleLeaveTypeChange(event.target.value)}
                  label="Leave Type *"
                  margin="dense"
                  labelId="select-outlined-label"
                >
                  {/* !! Get from DB */}
                  <MenuItem value={1}>Annual leave</MenuItem>
                  <MenuItem value={2}>Lieu leave</MenuItem>
                  <MenuItem value={3}>Casual leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ md: 6 }}>
              <LeaveCountSummary
                selectedLeaveType={selectedLeaveType || DEFAULT_SELECTED_LEAVE_TYPE}
                leaveSummaryData={getSelectedLeaveType(selectedLeaveType) || []}
                isLoading={props.isLoading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default LeaveCountSummaryPopUp
