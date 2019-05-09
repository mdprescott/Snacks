import { ThemePropTypes } from './utils'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface WithThemeInjectedProps {
  snacksTheme?: ThemePropTypes
}

interface WithThemeProps {
  snacksTheme: ThemePropTypes
}

// helper for applying hoc in .d.ts files
export type ApplyWithTheme<
  T extends React.ComponentType<P>,
  P extends WithThemeInjectedProps = React.ComponentProps<T>
> = React.ComponentType<Omit<P, keyof WithThemeInjectedProps> & WithThemeProps>

declare function withTheme<P extends WithThemeInjectedProps>(
  component: React.ComponentType<P>
): React.ComponentClass<Omit<P, keyof WithThemeInjectedProps> & WithThemeProps>

export default withTheme
