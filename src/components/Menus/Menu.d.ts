import * as React from 'react'
import { MenuItemProps } from './MenuItem'

export interface MenuProps extends Pick<React.ComponentProps<'div'>, 'onBlur' | 'onKeyDown'> {
  /** aria-hidden HTML attribute */
  ariaHidden?: boolean

  /** MenuItems or Divider */
  children: React.ReactNode

  /** Callback function fired when a MenuItem is selected */
  onSelect: MenuItemProps['_onClick']

  /** Role HTML attribute */
  role?: string

  /** Customize style of menu parent */
  style?: React.CSSProperties
}

declare const Menu: React.ComponentType<MenuProps>

export default Menu
