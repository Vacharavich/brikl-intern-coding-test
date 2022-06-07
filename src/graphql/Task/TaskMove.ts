import { extendType, nonNull, intArg } from 'nexus'

export const TaskMove = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('moveTask', {
      type: 'Task',
      args: {
        taskid: nonNull(intArg()),
        newListId: intArg(),
        newPosition: nonNull(intArg()),
      },

      async resolve(parent, args, context) {
        const targetTask = await context.prisma.task.findUnique({
          where: {
            id: args.taskid,
          },
          select: {
            position: true,
            inListid: true,
          },
        })

        if (targetTask === null) return null

        const oldListId = targetTask.inListid
        const targetListId = args.newListId ? args.newListId : oldListId

        /*
                Check whether newPosition is less than current Position in the same list
                If yes, move the tasks upward:
                    Task: ID 5 position 5 -> 3
                    Current List [Pos | ID] : [1 | 1], [2 | 2], [3 | 3], [4 | 4], [5 | 5]
                    - Decrease Position of the task that position above (less than) new position
                    State 1: [0 | 1], [1 | 2], [3 | 3], [4 | 4], [5 | 5]
                    - Replace Target State with new position -1
                    State 2: [0 | 1], [1 | 2], [3 | 3], [4 | 4], [2 | 5]
                    - Sort
                    State 3: [0 | 1], [1 | 2], [2 | 5], [3 | 3], [4 | 4]
                    - Re-value Position by the order of the current position
                    State 4: [1 | 1], [2 | 2], [3 | 5], [4 | 3], [5 | 4]

                If no, move the tasks downward:
                    Task: ID 1 position 1 -> 3
                    Current List [Pos | ID] : [1 | 1], [2 | 2], [3 | 3], [4 | 4], [5 | 5]
                    - Increase Position of the task that position below (high than) new position
                    State 1: [1 | 1], [2 | 2], [3 | 3], [5 | 4], [6 | 5]
                    - Replace Target State with new position +1
                        However, in case of moving to other list, it will not +1 to the new position
                        to cancel the shift happened to the task used to occupied that position,
                        or else, there will be two task in the list with same position
                    State 2: [4 | 1], [2 | 2], [3 | 3], [5 | 4], [6 | 5]
                    - Sort
                    State 3: [2 | 2], [3 | 3], [4 | 1], [5 | 4], [6 | 5]
                    - Re-value Position by the order of the current position
                    State 4: [1 | 2], [2 | 3], [3 | 1], [4 | 4], [5 | 5]
              */

        if (
          (args.newListId === undefined || args.newListId === null) &&
          args.newPosition < targetTask.position
        ) {
          const tasksInList = await context.prisma.task.findMany({
            where: {
              AND: [
                {
                  inListid: {
                    equals: targetListId,
                  },
                },
                {
                  position: {
                    lt: args.newPosition,
                  },
                },
              ],
            },
          })

          await Promise.all(
            tasksInList.map(async task => {
              await context.prisma.task.update({
                where: {
                  id: task.id,
                },
                data: {
                  position: task.position - 1,
                },
              })
            })
          )

          const movedTask = await context.prisma.task.update({
            where: {
              id: args.taskid,
            },
            data: {
              inListid: targetListId,
              position: args.newPosition - 1,
            },
          })
        } else {
          const tasksInList = await context.prisma.task.findMany({
            where: {
              AND: [
                {
                  inListid: {
                    equals: targetListId,
                  },
                },
                {
                  position: {
                    gt: args.newPosition,
                  },
                },
              ],
            },
          })

          await Promise.all(
            tasksInList.map(async task => {
              await context.prisma.task.update({
                where: {
                  id: task.id,
                },
                data: {
                  position: task.position + 1,
                },
              })
            })
          )

          const movedTask = await context.prisma.task.update({
            where: {
              id: args.taskid,
            },
            data: {
              inListid: targetListId,
              position:
                args.newPosition + (args.newListId === undefined ? 1 : 0),
            },
          })
        }

        // reset position when task moved to new list
        const listIdsToOperate = [
          targetListId,
          ...(targetListId !== oldListId ? [oldListId] : []),
        ]
        await Promise.all(
          listIdsToOperate.map(async listId => {
            const tasksInMessedUpOrder = await context.prisma.task.findMany({
              where: {
                inListid: listId,
              },
              orderBy: {
                position: 'asc',
              },
            })

            await Promise.all(
              tasksInMessedUpOrder.map(async (task, index) => {
                const expectedIndex = index + 1

                // update task if position is not what to expected
                if (task.position !== expectedIndex) {
                  await context.prisma.task.update({
                    where: {
                      id: task.id,
                    },
                    data: {
                      position: expectedIndex,
                    },
                  })
                }
              })
            )
          })
        )

        return context.prisma.task.findUnique({
          where: { id: args.taskid },
        })
      },
    })
  },
})
