import React, { ReactElement, PropsWithChildren } from 'react'
import { useFormState } from 'react-final-form'

type FormButtonProps = PropsWithChildren<{}>

export function FormButton({ children }: FormButtonProps): ReactElement | null {
  const { pristine, hasValidationErrors } = useFormState()
  return (
    (!pristine && !hasValidationErrors && (
      <button type="submit">{children}</button>
    )) ||
    null
  )
}
