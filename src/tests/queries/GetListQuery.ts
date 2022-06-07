export const GetListQuery = `
  query GetListQuery ($getListId: Int!) {
    getList(id: $getListId) {
        id
        title
        tasklist {
          id
          position
          title
          status
        }
    }
  }
`