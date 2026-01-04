import React from 'react'
import { FeatureDto } from '../../../utilities/models'

const AppAuthorizer: React.FC<{
  activeRoleFeatures: FeatureDto[]
  authorizedFeatureKey: string[]
  authorizeCondition?: 'AND' | 'OR'
  children: React.ReactNode
}> = (props) => {
  switch (props.authorizeCondition) {
    case 'AND':
      return (
        <React.Fragment>
          {props.authorizedFeatureKey.every((role) =>
            props.activeRoleFeatures.map((i) => i.featureKey).includes(role)
          ) ? (
            props.children
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </React.Fragment>
      )

    case 'OR':
      return (
        <React.Fragment>
          {props.authorizedFeatureKey.some((role) =>
            props.activeRoleFeatures.map((i) => i.featureKey).includes(role)
          ) ? (
            props.children
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </React.Fragment>
      )

    default:
      return (
        <React.Fragment>
          {props.authorizedFeatureKey.every((role) =>
            props.activeRoleFeatures.map((i) => i.featureKey).includes(role)
          ) ? (
            props.children
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </React.Fragment>
      )
  }
}
export default AppAuthorizer
