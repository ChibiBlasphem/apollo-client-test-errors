import {
  useMutation,
  DocumentNode,
  MutationHookOptions,
  MutationFunctionOptions,
} from '@apollo/client'
import { useCallback } from 'react'

type GqlObject<Typename extends string = string> = {
  __typename: Typename
}

type InferedGqlObject<
  Object extends GqlObject,
  Typename extends Object['__typename']
> = Object extends { __typename: Typename } & infer Rest ? Rest : never

type GatewayMutationErrorConfig<TOut, TData extends GqlObject> = {
  unexpectedError: (err: any) => TOut
  cases: {
    [Key in TData['__typename']]: (obj: InferedGqlObject<TData, Key>) => TOut
  }
}

export type GatewayMutationHookOptions<
  TData extends { [k in TKeyname]: GqlObject },
  TVariables,
  TKeyname extends keyof TData,
  TOut
> = MutationHookOptions<TData, TVariables> & {
  errorConfig: GatewayMutationErrorConfig<TOut, TData[TKeyname]>
}

type GatewayMutationFunction<
  TData extends { [k in TKeyname]: GqlObject },
  TVariables,
  TKeyname extends string,
  TOut
> = (
  options: MutationFunctionOptions<TData, TVariables>
) => Promise<TOut | undefined>

export type UseGatewayMutation<
  TData extends { [k in TKeyname]: GqlObject },
  TVariables,
  TKeyname extends string,
  TOut = any
> = (
  options: GatewayMutationHookOptions<TData, TVariables, TKeyname, TOut>
) => [
  GatewayMutationFunction<TData, TVariables, TKeyname, TOut>,
  {
    data: TData[TKeyname] | undefined
  }
]

export const useGatewayMutation = <
  TData extends { [k in TKeyname]: GqlObject },
  TVariables = undefined,
  TKeyname extends string = string,
  TOut = any
>(
  mutation: DocumentNode,
  {
    errorConfig,
    ...rest
  }: GatewayMutationHookOptions<TData, TVariables, TKeyname, TOut>,
  key: TKeyname
): [
  GatewayMutationFunction<TData, TVariables, TKeyname, TOut>,
  {
    data: TData[TKeyname] | undefined
  }
] => {
  const [originalCallMut, res] = useMutation<TData, TVariables>(mutation, rest)

  const callMut = useCallback(
    async (
      options: MutationFunctionOptions<TData, TVariables>
    ): Promise<TOut | undefined> => {
      try {
        const { data, errors } = await originalCallMut(options)
        if (errors) {
          throw errors
        }
        if (!data) {
          throw new Error('No data returned from mutation')
        }

        const localizedData = data[key]
        const caseFn =
          errorConfig.cases[
            localizedData.__typename as TData[TKeyname]['__typename']
          ]

        if (!caseFn) {
          return errorConfig.unexpectedError(localizedData)
        }

        return caseFn(
          localizedData as InferedGqlObject<
            TData[TKeyname],
            TData[TKeyname]['__typename']
          >
        )
      } catch (err) {
        // Notify Sentry
        console.log('Notifying sentry an error occured', err)
        return errorConfig.unexpectedError(err)
      }
    },
    [originalCallMut]
  )

  return [callMut, { data: res.data?.[key] || undefined }]
}
