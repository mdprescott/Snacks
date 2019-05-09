import * as React from 'react'
import { RadioCheckboxBaseProps } from '../../base/RadioCheckboxBase'

export interface RadioProps extends RadioCheckboxBaseProps {
  name?: string
}

declare const Radio: React.ComponentType<RadioProps>

export default Radio
