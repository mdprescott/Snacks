import * as React from 'react'
import { RadiumStyles, ElementAttributes } from '../..'
import { WithThemeInjectedProps, ApplyWithThemeProps } from '../../styles/themer/withTheme'

export interface LinkProps extends WithThemeInjectedProps {
  /** The link's text content. */
  children?: React.ReactNode

  /** `href` attribute for the anchor tag. */
  href?: string

  /** Callback fired when the link is clicked. */
  onClick(e: React.MouseEvent<HTMLAnchorElement>, props: LinkProps): void

  /** Any additonal props */
  elementAttributes?: ElementAttributes<React.ComponentPropsWithoutRef<'a'>>

  style?: RadiumStyles
}

declare const Link: React.ComponentType<ApplyWithThemeProps<LinkProps>>

export default Link
