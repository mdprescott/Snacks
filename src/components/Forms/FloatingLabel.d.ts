import * as React from 'react'
import { WithThemeInjectedProps, ApplyWithTheme } from '../../styles/themer/withTheme'
import { RadiumStyles } from '../..'

export interface FloatingLabelProps extends WithThemeInjectedProps {
  /** Disabled styling for the label */
  disabled?: boolean

  /** Float the label */
  float?: boolean

  /** Show error styling */
  hasError?: boolean

  /** HTML for attribute */
  htmlFor?: string

  /** Is the input in an active state */
  isActive?: boolean

  /** Override styles */
  style?: RadiumStyles

  /** Label text */
  text?: string
}

declare const TextField: ApplyWithTheme<React.ComponentType<FloatingLabelProps>>

export default TextField
