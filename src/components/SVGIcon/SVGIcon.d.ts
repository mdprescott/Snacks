import * as React from 'react'
import * as icons from './icons'

export interface SVGIconProps {
  color?: string
  name: keyof typeof icons
  size?: 'small' | 'standard' | 'large'
}

declare const SVGIcon: React.ComponentType<SVGIconProps>

export default SVGIcon
