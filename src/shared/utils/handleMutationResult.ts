import {
  useMutation,
  gql,
  FetchResult,
  DocumentNode,
  MutationHookOptions,
  MutationFunctionOptions,
} from '@apollo/client'
import { useCallback } from 'react'

type TestObject =
  | {
      __typename: 'TestObject1'
      field1: string
    }
  | {
      __typename: 'TestObject2'
      field2: string
    }

const testObject: TestObject = {
  __typename: 'TestObject2',
  field2: 'Hello world',
}

type GqlObject<Typename extends string = string> = {
  __typename: Typename
}

type InferedGqlObject<
  Object extends GqlObject,
  Typename extends Object['__typename']
> = Object extends { __typename: Typename } & infer Rest ? Rest : never

type CallMut<TData> = (options: any) => Promise<FetchResult<TData>>
const handleMutationResult = <TData>(
  callMut: CallMut<TData>,
  key: keyof TData
) => {}

type GatewayMutationErrorConfig<TOut, TData extends GqlObject> = {
  unexpectedError: (err: any) => TOut
  cases: {
    [Key in TData['__typename']]: (obj: InferedGqlObject<TData, Key>) => TOut
  }
}

type UseGatewayMutationHookOptions<
  TData extends { [k in TKeyname]: GqlObject },
  TVariables,
  TKeyname extends keyof TData
> = MutationHookOptions<TData, TVariables> & {
  key: TKeyname
}

type GatewayMutationFunctionOptions<
  TOut,
  TData extends { [k in TKeyname]: GqlObject },
  TVariables,
  TKeyname extends keyof TData
> = MutationHookOptions<TData, TVariables> & {
  errorConfig: GatewayMutationErrorConfig<TOut, TData[TKeyname]>
}

type GatewayMutationFunction<
  TData extends { [k in TKeyname]: GqlObject },
  TVariables = undefined,
  TKeyname extends string = string
> = <TOut>(
  options: GatewayMutationFunctionOptions<TOut, TData, TVariables, TKeyname>
) => Promise<TOut | undefined>

export type UseGatewayMutation<
  TData extends { [k in TKeyname]: GqlObject },
  TVariables = undefined,
  TKeyname extends string = string
> = (
  options: UseGatewayMutationHookOptions<TData, TVariables, TKeyname>
) => [
  GatewayMutationFunction<TData, TVariables, TKeyname>,
  {
    data: TData[TKeyname] | undefined
  }
]

export const useGatewayMutation = <
  TData extends { [k in TKeyname]: GqlObject },
  TVariables = undefined,
  TKeyname extends string = string
>(
  mutation: DocumentNode,
  { key, ...rest }: UseGatewayMutationHookOptions<TData, TVariables, TKeyname>
): [
  GatewayMutationFunction<TData, TVariables, TKeyname>,
  {
    data: TData[TKeyname] | undefined
  }
] => {
  const [originalCallMut, res] = useMutation<TData, TVariables>(mutation, rest)

  const callMut = useCallback(
    async <TOut>({
      errorConfig,
      ...rest
    }: GatewayMutationFunctionOptions<
      TOut,
      TData,
      TVariables,
      TKeyname
    >): Promise<TOut | undefined> => {
      try {
        const { data, errors } = await originalCallMut(rest)
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
