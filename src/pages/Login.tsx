import React from 'react'
import { Form, Field } from 'react-final-form'
import { FormButton } from '../components/FormButton'
import { Feedback } from '../components/Feedback'
import { useLoginMutation } from '../apollo/hooks/useLoginMutation'
import { FORM_ERROR, SubmissionErrors } from 'final-form'

const required = (value: string) => (value ? undefined : 'required')

export function Login() {
  const [login] = useLoginMutation<SubmissionErrors | void>({
    errorConfig: {
      unexpectedError: err => {
        return { [FORM_ERROR]: 'An unexpected error occured' }
      },
      cases: {
        Authentication: ({ token }) => {
          console.log('We are authenticated', token)
        },
        BadInputError: () => {},
        InvalidCredentialsError: ({ message }) => {
          return { [FORM_ERROR]: message }
        },
      },
    },
  })

  const onSubmit = (values: any) => {
    return login({
      variables: {
        input: values,
      },
    })
  }

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, submitError }) => {
        return (
          <>
            {submitError && <div style={{ color: 'red' }}>{submitError}</div>}
            <form onSubmit={handleSubmit}>
              <Field validate={required} name="username">
                {({ input, meta }) => {
                  return (
                    <div>
                      <label htmlFor="username-field">Username</label>
                      <br />
                      <input {...input} id="username-field" />
                      <Feedback meta={meta} />
                    </div>
                  )
                }}
              </Field>
              <Field name="password">
                {({ input, meta }) => {
                  return (
                    <div>
                      <label htmlFor="password-field">Password</label>
                      <br />
                      <input {...input} type="password" id="password-field" />
                      <Feedback meta={meta} />
                    </div>
                  )
                }}
              </Field>
              <FormButton>Login</FormButton>
            </form>
          </>
        )
      }}
    </Form>
  )
}
