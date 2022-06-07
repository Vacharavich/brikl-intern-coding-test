export const CreateListQuery = `
  mutation CreateListQuery($title: String!) {
    createList(title: $title) {
      id
      title
    }
  }
`