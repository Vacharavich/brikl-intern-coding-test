export const UpdateTaskQuery = `
    mutation UpdateTaskQuery($taskid: Int!, $newStatus: Boolean, $newTitle: String) {
        updateTask(taskid: $taskid, newStatus: $newStatus, newTitle: $newTitle) {
            id
            position
            title
            status
        }
    }
`
