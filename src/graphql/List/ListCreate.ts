import { extendType, nonNull, stringArg } from 'nexus'

export const ListCreate = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createList', {
      type: 'List',
      args: {
        title: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const newList = await context.prisma.list.create({
          data: {
            title: args.title,
          },
        })

        return newList
      },
    })
  },
})
