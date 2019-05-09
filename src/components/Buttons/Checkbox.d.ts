import * as React from 'react'
import { RadioCheckboxBaseProps } from '../../base/RadioCheckboxBase'

export interface CheckboxProps extends RadioCheckboxBaseProps {
  name?: string
}

declare const Checkbox: React.ComponentType<CheckboxProps>

export default Checkbox
