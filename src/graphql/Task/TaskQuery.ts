import { extendType } from 'nexus'

export const TaskQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('getTasks', {
      type: 'Task',
      resolve(parent, args, context, info) {
        return context.prisma.task.findMany()
      },
    })
  },
})
