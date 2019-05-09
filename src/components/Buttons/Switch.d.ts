import * as React from 'react'
import { RadioCheckboxBaseProps } from '../../base/RadioCheckboxBase'

export interface SwitchProps extends RadioCheckboxBaseProps {
  name?: string
}

declare const Switch: React.ComponentType<SwitchProps>

export default Switch
