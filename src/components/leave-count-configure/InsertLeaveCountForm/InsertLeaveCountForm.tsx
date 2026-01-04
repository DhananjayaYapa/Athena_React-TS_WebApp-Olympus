import React, { useState } from 'react'
import { Grid, TextField, FormControl } from '@mui/material'
import { Autocomplete } from '@mui/material'
import { PrimaryButton } from '../../shared'
import { validateFormData } from '../../../utilities/helpers'
import { AddLeaveCountDto } from '../../../utilities/models'
import { AlertDto } from '../../../utilities/models'
import { LEAVE_TYPE_IDS } from '../../../utilities/constants/app.constants'
import { v4 as uuidv4 } from 'uuid'

interface LEAVE_CONFIGURATION_STATE {
  username: { value: string; validator: string; isRequired: boolean; error: any; disable: boolean }
  casual: { value: number; validator: string; isRequired: boolean; error: any; disable: boolean }
  annual: { value: number; validator: string; isRequired: boolean; error: any; disable: boolean }
  lieu: { value: number; validator: string; isRequired: boolean; error: any; disable: boolean }
}

const InsertLeaveForm: React.FC<{
  employees: any
  isProcessing: boolean
  addLeaveCountAlert: AlertDto
  onLeaveSubmit: (leaveData: AddLeaveCountDto) => void
}> = (props) => {
  const LEAVE_CONFIGURATION: LEAVE_CONFIGURATION_STATE = {
    username: { value: '', validator: 'text', isRequired: true, error: null, disable: false },
    casual: { value: 0, validator: 'number', isRequired: true, error: null, disable: false },
    annual: { value: 0, validator: 'number', isRequired: true, error: null, disable: false },
    lieu: { value: 0, validator: 'number', isRequired: true, error: null, disable: false },
  }

  const [LeaveConfigData, setLeaveConfigData] = useState(LEAVE_CONFIGURATION)
  const [key, setKey] = useState(uuidv4())

  React.useEffect(() => {
    if (props.addLeaveCountAlert.severity === 'success') {
      setLeaveConfigData(LEAVE_CONFIGURATION)
      setKey(uuidv4())
    }
  }, [props.addLeaveCountAlert])

  const handleChange = (property: string, value: any) => {
    setLeaveConfigData({
      ...LeaveConfigData,
      [property as keyof typeof LeaveConfigData]: {
        ...LeaveConfigData[property as keyof typeof LeaveConfigData],
        value: value,
        error: null,
      },
    })
  }

  const handleSubmit = async () => {
    const [validatedData, isValid] = await validateFormData(LeaveConfigData)
    setLeaveConfigData(validatedData)
    if (isValid) {
      const payload: AddLeaveCountDto = {
        username: LeaveConfigData.username.value,
        leaveCountData: [
          {
            leaveTypeId: LEAVE_TYPE_IDS.ANNUAL,
            leaveCount: LeaveConfigData.annual.value,
          },
          {
            leaveTypeId: LEAVE_TYPE_IDS.CASUAL,
            leaveCount: LeaveConfigData.casual.value,
          },
          {
            leaveTypeId: LEAVE_TYPE_IDS.LIEU,
            leaveCount: LeaveConfigData.lieu.value,
          },
        ],
      }
      props.onLeaveSubmit(payload)
    }
  }

  return (
    <React.Fragment>
      <form>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl style={{ width: '100%' }}>
              <Autocomplete
                id="employee-select"
                size="small"
                key={key}
                options={props.employees}
                getOptionLabel={(option: any) => option.username || ''}
                disableClearable
                onChange={(_event, value) => handleChange('username', value.username)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Username"
                    variant="outlined"
                    error={!!LeaveConfigData.username.error}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              style={{ width: '100%' }}
              size="small"
              type="number"
              label="Cassual Leave"
              variant="outlined"
              value={LeaveConfigData.casual.value}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(event) => handleChange('casual', event.target.value)}
              error={!!LeaveConfigData.casual.error}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              style={{ width: '100%' }}
              size="small"
              type="number"
              label="Annual Leave"
              variant="outlined"
              value={LeaveConfigData.annual.value}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(event) => handleChange('annual', event.target.value)}
              error={!!LeaveConfigData.annual.error}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              style={{ width: '100%' }}
              size="small"
              type="number"
              label="Lieu Leave"
              variant="outlined"
              value={LeaveConfigData.lieu.value}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(event) => handleChange('lieu', event.target.value)}
              error={!!LeaveConfigData.lieu.error}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12 }}>
            <PrimaryButton
              isLoading={props.isProcessing ? props.isProcessing : false}
              onClickFunction={handleSubmit}
              buttonText="Submit"
              buttonTextLoading="Submit"
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  )
}

export default InsertLeaveForm
