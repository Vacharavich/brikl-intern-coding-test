export const GetTaskQuery = `
  query GetTaskQuery ($getTaskId: Int!) {
    getTask(id: $getTaskId) {
      id
      position
      title
    }
  }
`