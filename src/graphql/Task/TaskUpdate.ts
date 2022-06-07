import { extendType, nonNull, intArg, stringArg, booleanArg } from 'nexus'

export const TaskUpdate = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateTask', {
      type: 'Task',
      args: {
        taskid: nonNull(intArg()),
        newTitle: stringArg(),
        newStatus: booleanArg(),
      },

      async resolve(parent, args, context) {
        const { taskid, newTitle, newStatus } = args

        // Used to keep old task in case some attributes not change, so it can be pulled back from here.
        const targetTask = await context.prisma.task.findUnique({
          where: {
            id: taskid,
          },
        })

        if (targetTask !== null) {
          const updatedTask = await context.prisma.task.update({
            data: {
              title:
                newTitle !== null && newTitle !== undefined
                  ? newTitle
                  : targetTask.title,
              status:
                newStatus !== null && newStatus !== undefined
                  ? newStatus
                  : targetTask.status,
            },
            where: {
              id: taskid,
            },
          })

          return updatedTask
        } else {
          return null
        }
      },
    })
  },
})
