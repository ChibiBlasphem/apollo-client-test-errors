import { gql } from '@apollo/client'
import {
  useGatewayMutation,
  GatewayMutationHookOptions,
} from '../../shared/utils/handleMutationResult'
import {
  LoginMutation,
  LoginMutationVariables,
} from './__generated__/LoginMutation'

const LOGIN_MUTATION = gql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      ... on Authentication {
        token
      }
      ... on Error {
        message

        ... on BadInputError {
          fields {
            name
          }
        }
      }
    }
  }
`

export const useLoginMutation = <TOut>(
  options: GatewayMutationHookOptions<
    LoginMutation,
    LoginMutationVariables,
    'login',
    TOut
  >
) => useGatewayMutation(LOGIN_MUTATION, options, 'login')
