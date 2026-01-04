import React, { useEffect, useState } from 'react'
import {
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Switch,
  Card,
  Typography,
} from '@mui/material'
import { Clear } from '@mui/icons-material'

import { NonWorkingDay } from '../../../utilities/models'
import styles from './NonWorkingDayForm.module.scss'

const NonWorkingDayForm: React.FC<{
  thisNonWorkingDay: NonWorkingDay
  removeDay(date: Date): void
  setNonWorkingDays(nonWorkingDay: NonWorkingDay): void
}> = (props) => {
  const [nonWorkingDay, setNonWorkingDay] = useState(props.thisNonWorkingDay)

  useEffect(() => {
    props.setNonWorkingDays(nonWorkingDay)
  }, [nonWorkingDay])

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setNonWorkingDay((currentDetails: NonWorkingDay) => {
      return {
        ...currentDetails,
        [e.target.id]: e.target.value,
      }
    })
  }

  const handleChangeCheckBox = (e: { target: { id: any; checked: boolean } }) => {
    setNonWorkingDay((currentDetails: NonWorkingDay) => {
      return {
        ...currentDetails,
        [e.target.id]: e.target.checked,
      }
    })
  }

  return (
    <Card className={styles.card} variant="outlined">
      <Grid direction="column">
        <FormGroup>
          <Grid size={{}} container direction="row" className={styles.formTopRow}>
            <div className={styles.dateDisplay}>
              <Typography>
                <span
                  className={
                    props.thisNonWorkingDay.nonWorkingDayId !== -1
                      ? styles.updateDay
                      : styles.newDay
                  }
                >
                  {props.thisNonWorkingDay.nonWorkingDayId !== -1 ? 'UPDATE' : 'NEW'}
                </span>
              </Typography>
              <Typography>
                <span className={styles.dateText}>
                  {props.thisNonWorkingDay.date.toDateString()}
                </span>
              </Typography>
            </div>
            <div onClick={() => props.removeDay(nonWorkingDay.date)}>
              <Clear className={styles.clearDayFormBtn} fontSize="small" color="disabled" />
            </div>
          </Grid>
        </FormGroup>
        <FormGroup>
          <div className={styles.checkbox}>
            <FormControlLabel
              className={styles.disableToggle}
              labelPlacement="start"
              label={
                <span className={styles.toggleLabel}>
                  {props.thisNonWorkingDay.isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              }
              control={
                <Switch
                  color="primary"
                  checked={nonWorkingDay.isEnabled}
                  onChange={handleChangeCheckBox}
                  id="isEnabled"
                />
              }
            />
          </div>
          <div className={styles.checkbox}>
            <FormControlLabel
              labelPlacement="start"
              label={<span className={styles.toggleLabel}>Half day Holiday</span>}
              control={
                <Checkbox
                  id="isHalfDay"
                  value={nonWorkingDay.isHalfDay}
                  checked={nonWorkingDay.isHalfDay}
                  onChange={handleChangeCheckBox}
                  name="halfDay"
                  color="primary"
                />
              }
            />
          </div>
          <TextField
            required
            multiline
            variant="outlined"
            color="primary"
            rows={1}
            inputProps={{
              maxLength: 255,
            }}
            onChange={handleChange}
            id="holidayDesc"
            value={nonWorkingDay.holidayDesc}
            placeholder="Holiday Description"
          />
        </FormGroup>
      </Grid>
    </Card>
  )
}

export default NonWorkingDayForm
