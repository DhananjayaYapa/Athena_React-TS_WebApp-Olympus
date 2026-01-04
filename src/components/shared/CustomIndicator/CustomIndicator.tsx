import { FC } from 'react'
import CircularProgress from '@mui/material/CircularProgress'

const CustomIndicator: FC = () => {
  return (
    <div>
      <CircularProgress style={{ marginTop: 10 }} />
    </div>
  )
}

export default CustomIndicator
