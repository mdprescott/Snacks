import { ThemePropTypes } from './utils'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface WithThemeInjectedProps {
  snacksTheme: ThemePropTypes
}

interface WithThemeProps {
  snacksTheme?: ThemePropTypes
}

// helper for applying hoc props in .d.ts files
export type ApplyWithThemeProps<P extends WithThemeInjectedProps> = Omit<
  P,
  keyof WithThemeInjectedProps
> &
  WithThemeProps

declare function withTheme<P extends WithThemeInjectedProps>(
  component: React.ComponentType<P>
): React.ComponentClass<Omit<P, keyof WithThemeInjectedProps> & WithThemeProps>

export default withTheme
