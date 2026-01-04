import React from 'react'
import { microsoftLogo } from '../../../assets/images'
import styles from './MsLoginButton.module.scss'
import { useMsal } from '@azure/msal-react'
import { IPublicClientApplication } from '@azure/msal-browser'
const MsLoginButton: React.FC<{
  disabled?: boolean
  handleLogin(instance: IPublicClientApplication): void
}> = (props) => {
  const { instance } = useMsal()
  return (
    <div className={styles.loginBtn}>
      <button
        disabled={props.disabled}
        onClick={() => props.handleLogin(instance)}
        className={styles.microsoftLoginBtn}
      >
        <img alt="microsoftLogo" src={microsoftLogo} />
        Sign in with Microsoft
      </button>
    </div>
  )
}

export default MsLoginButton
