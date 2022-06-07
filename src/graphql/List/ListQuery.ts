import { extendType } from 'nexus'

export const ListQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('getLists', {
      type: 'List',
      resolve(parent, args, context, info) {
        return context.prisma.list.findMany()
      },
    })
  },
})
