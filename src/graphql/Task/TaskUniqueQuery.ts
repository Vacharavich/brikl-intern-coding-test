import { extendType, intArg, nonNull } from 'nexus'

export const TaskUniqueQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getTask', {
      type: 'Task',
      args: {
        id: nonNull(intArg()),
      },
      async resolve(parent, args, context) {
        const task = await context.prisma.task.findUnique({
          where: {
            id: args.id,
          },
        })

        return task
      },
    })
  },
})
