import { gql } from '@apollo/client'
import {
  useGatewayMutation,
  UseGatewayMutation,
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

export const useLoginMutation: UseGatewayMutation<
  LoginMutation,
  LoginMutationVariables,
  'login'
> = options => useGatewayMutation(LOGIN_MUTATION, options)
