import { extendType, nonNull, intArg } from 'nexus'

export const ListUniqueQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getList', {
      type: 'List',
      args: {
        id: nonNull(intArg()),
      },
      async resolve(parent, args, context) {
        const list = await context.prisma.list.findUnique({
          where: {
            id: args.id,
          },
        })

        return list
      },
    })
  },
})
