import React, { ReactElement } from 'react'
import { FieldMetaState } from 'react-final-form'

type FeedbackProps = {
  meta: FieldMetaState<any>
}

export function Feedback({ meta }: FeedbackProps): ReactElement | null {
  if (!meta.error) {
    if (meta.submitError && !meta.modifiedSinceLastSubmit) {
      return <div>{meta.submitError}</div>
    }
  }
  if (!meta.modified || !meta.error) {
    return null
  }
  return <div>{meta.error}</div>
}
