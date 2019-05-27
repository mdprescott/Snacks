/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import * as Validator from 'validator'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type ParametersAfterFirst<T extends (value: string, ...args: any[]) => any> = T extends (
  value: string,
  ...args: infer P
) => any
  ? P
  : never

type Validators = Omit<typeof Validator, 'toString' | 'version' | 'extend'>
type Validations = { [Key in keyof Validators]: ParametersAfterFirst<Validators[Key]> }

interface FormComponentProps {
  /** Model name for Form */
  name: string

  /** Disable the input; Will be removed from model in Form onSubmit callback */
  disabled?: boolean

  /** Uniq id for input */
  id?: string

  /** Mark input as required */
  required?: boolean

  /** Regex Validation pattern */
  regexValidation?: string

  /** Validations from validator.js */
  validations?: Validations
}

export interface FormComponentInjectedProps extends FormComponentProps {
  isValid: boolean
  ref(node: React.Component): void
  serverError: null | string
  hasError: boolean
  id: string
}

// helper for applying hoc props in .d.ts files
export type ApplyFormComponentProps<P extends FormComponentInjectedProps> = Omit<
  P,
  keyof FormComponentInjectedProps
> &
  Partial<Pick<FormComponentInjectedProps, 'serverError' | 'hasError' | 'id' | 'isValid'>> &
  FormComponentProps

declare function formComponent<P extends FormComponentInjectedProps>(
  component: React.ComponentType<P>
): React.ComponentClass<Omit<P, keyof FormComponentInjectedProps> & FormComponentProps>

export default formComponent
