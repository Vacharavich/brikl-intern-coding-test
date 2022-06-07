export const MoveTaskToOtherListQuery = `
  mutation MoveTaskToOtherListQuery($taskid: Int!, $newPosition: Int!, $newListId: Int) {
    moveTask(taskid: $taskid, newPosition: $newPosition, newListId: $newListId) {
      id
      position
    }
  }
`
