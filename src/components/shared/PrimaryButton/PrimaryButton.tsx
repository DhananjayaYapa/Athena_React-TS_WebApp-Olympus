import React from 'react'
import { Button, CircularProgress } from '@mui/material'
import styles from './PrimaryButton.module.scss'

const PrimaryButton: React.FC<{
  buttonText: string
  className?: string
  buttonTextLoading: string
  onClickFunction(): void
  isLoading?: boolean
  disabled?: boolean
}> = (props) => {
  return (
    <Button
      variant="contained"
      className={props.className}
      color="primary"
      onClick={props.onClickFunction}
      disabled={props.disabled}
    >
      {props.isLoading && <CircularProgress sx={{ color: '#ffffff' }} size={20} />}
      <div className={styles.primaryBtn}>
        {props.isLoading ? props.buttonTextLoading : props.buttonText}
      </div>
    </Button>
  )
}

export default PrimaryButton
