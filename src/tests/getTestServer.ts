import { ApolloServer } from 'apollo-server-express'

import { schema } from '../schema'
import { context } from '../context'

export const getTestServer = (): ApolloServer => {
  const server = new ApolloServer({
    schema,
    context,
  })

  return server
}
