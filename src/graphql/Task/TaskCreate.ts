import { extendType, nonNull, intArg, stringArg } from 'nexus'

// To create new Task, it need to know which list is belongs to, thus receiving "listid".

export const TaskCreate = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createTask', {
      type: 'Task',
      args: {
        listid: nonNull(intArg()),
        title: nonNull(stringArg()),
      },

      async resolve(parent, args, context) {
        //Use count to know the current last position of the tasklist
        const position = await context.prisma.task.count({
          where: {
            inListid: args.listid,
          },
        })

        const newTask = await context.prisma.task.create({
          data: {
            position: position + 1, //to append the last position of the tasklist
            title: args.title,
            status: false,
            inListid: args.listid,
          },
        })

        return newTask
      },
    })
  },
})
