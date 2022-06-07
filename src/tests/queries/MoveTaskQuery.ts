export const MoveTaskQuery = `
  mutation MoveTaskQuery($taskid: Int!, $newPosition: Int!) {
    moveTask(taskid: $taskid, newPosition: $newPosition) {
      id
      position
    }
  }
`
