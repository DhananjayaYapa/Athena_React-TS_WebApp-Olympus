// import { APP_CONFIGS } from '../utilities/constants'
// const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1

import { APP_CONFIGS } from '../utilities/constants'

export const msalConfig = {
  auth: {
    clientId: APP_CONFIGS.CLIENT_ID,
    authority: APP_CONFIGS.AUTHORITY, // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    redirectUri: APP_CONFIGS.REDIRECT_URL,
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
}

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: APP_CONFIGS.APP_SCOPES,
}

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  // graphMeEndpoint: 'Enter_the_Graph_Endpoint_Here/v1.0/me'
}
