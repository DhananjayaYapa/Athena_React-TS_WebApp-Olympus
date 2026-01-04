import React from 'react'
import { APP_CONFIGS } from '../../../utilities/constants'

const AppCopyright: React.FC = () => {
  const date = new Date()
  const year = date.getFullYear()

  return (
    <span className="f-14">
      {' '}
      &copy; {year} {APP_CONFIGS.APP_OWNER}
    </span>
  )
}

export default AppCopyright
