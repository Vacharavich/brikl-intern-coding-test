export const CreateTaskQuery = `
  mutation CreateTaskQuery($listid: Int!, $title: String!) {
    createTask(listid: $listid, title: $title) {
      id
      position
      title
      status
    }
  }
`