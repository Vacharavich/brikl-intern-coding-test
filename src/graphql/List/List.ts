import { objectType } from 'nexus'

export const List = objectType({
  name: 'List',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('title')
    t.nonNull.list.nonNull.field('tasklist', {
      type: 'Task',
      async resolve(parent, args, context) {
        
        const tasks = await context.prisma.task.findMany({
          where: {
            inListid: parent.id,
          },
          orderBy: {
            position: 'asc',
          },
        })

        return tasks
      },
    })
  },
})
