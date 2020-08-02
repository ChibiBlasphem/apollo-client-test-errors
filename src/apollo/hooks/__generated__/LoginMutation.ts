/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: LoginMutation
// ====================================================

export interface LoginMutation_login_Authentication {
  __typename: "Authentication";
  token: string;
}

export interface LoginMutation_login_BadInputError_fields {
  __typename: "RuleInputFieldError";
  name: string;
}

export interface LoginMutation_login_BadInputError {
  __typename: "BadInputError";
  message: string;
  fields: LoginMutation_login_BadInputError_fields[];
}

export interface LoginMutation_login_InvalidCredentialsError {
  __typename: "InvalidCredentialsError";
  message: string;
}

export type LoginMutation_login = LoginMutation_login_Authentication | LoginMutation_login_BadInputError | LoginMutation_login_InvalidCredentialsError;

export interface LoginMutation {
  login: LoginMutation_login;
}

export interface LoginMutationVariables {
  input: LoginInput;
}
