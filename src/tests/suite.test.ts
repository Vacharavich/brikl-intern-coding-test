import { server } from '..'
import { getTestServer } from './getTestServer'

import { GetTaskQuery } from './queries/GetTaskQuery'
import { CreateListQuery } from './queries/CreateListQuery'
import { CreateTaskQuery } from './queries/CreateTaskQuery'
import { MoveTaskQuery } from './queries/MoveTaskQuery'
import { MoveTaskToOtherListQuery } from './queries/MoveTaskToOtherListQuery'
import { GetListQuery } from './queries/GetListQuery'
import { UpdateTaskQuery } from './queries/UpdatetaskQuery'

test('Should be able to create new list', async () => {
  const server = getTestServer()

  const list1QueryResult = await server.executeOperation({
    query: CreateListQuery,
    variables: {
      title: 'Test Suite List 1',
    },
  })

  expect(list1QueryResult.data?.createList.id).toBe(1)
  expect(list1QueryResult.data?.createList.title).toBe('Test Suite List 1')

  const list2QueryResult = await server.executeOperation({
    query: CreateListQuery,
    variables: {
      title: 'Test Suite List 2',
    },
  })

  expect(list2QueryResult.data?.createList.id).toBe(2)
  expect(list2QueryResult.data?.createList.title).toBe('Test Suite List 2')
})

test('Should be able to create task', async () => {
  const server = getTestServer()

  const task1QueryResult = await server.executeOperation({
    query: CreateTaskQuery,
    variables: {
      listid: 1,
      title: 'Test Suite Task 1.1',
    },
  })

  expect(task1QueryResult.data?.createTask.id).toBe(1)
  expect(task1QueryResult.data?.createTask.position).toBe(1)
  expect(task1QueryResult.data?.createTask.title).toBe('Test Suite Task 1.1')
  expect(task1QueryResult.data?.createTask.status).toBe(false)

  await server.executeOperation({
    query: CreateTaskQuery,
    variables: {
      listid: 1,
      title: 'Test Suite Task 1.2',
    },
  })
})

test('Position of task should be 1 if create task at different list', async () => {
  const server = getTestServer()

  const task1QueryResult = await server.executeOperation({
    query: CreateTaskQuery,
    variables: {
      listid: 2,
      title: 'Test Suite Task 2.1',
    },
  })

  expect(task1QueryResult.data?.createTask.id).toBe(3)
  expect(task1QueryResult.data?.createTask.position).toBe(1)
  expect(task1QueryResult.data?.createTask.title).toBe('Test Suite Task 2.1')
  expect(task1QueryResult.data?.createTask.status).toBe(false)
})

test('Should be able to move ticket to different position in the same list when new position is higher than current position', async () => {
  const server = getTestServer()

  const createTask1_3 = await server.executeOperation({
    query: CreateTaskQuery,
    variables: {
      listid: 1,
      title: 'Test Suite Task 1.3',
    },
  })

  const createTask1_4 = await server.executeOperation({
    query: CreateTaskQuery,
    variables: {
      listid: 1,
      title: 'Test Suite Task 1.4',
    },
  })

  const moveTaskQueryResult1 = await server.executeOperation({
    query: MoveTaskQuery,
    variables: {
      taskid: 1,
      newPosition: 3,
    },
  })

  // TaskID: 1 Position 1 -> 3
  // Then expected position is [Pos -> Title(ID)] : [1 -> 1.2(2)], [2 -> 1.3(4)], [3 -> 1.1(1)], [4 -> 1.4(5)]

  expect(moveTaskQueryResult1.data?.moveTask.id).toBe(1)
  expect(moveTaskQueryResult1.data?.moveTask.position).toBe(3)

  // make sure other tasks in the same list has expected position
  const checkAnotherTaskInList1_1 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 2,
    },
  })
  expect(checkAnotherTaskInList1_1.data?.getTask.position).toBe(1)

  const checkAnotherTaskInList1_2 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 4,
    },
  })
  expect(checkAnotherTaskInList1_2.data?.getTask.position).toBe(2)

  const checkAnotherTaskInList1_3 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 5,
    },
  })
  expect(checkAnotherTaskInList1_3.data?.getTask.position).toBe(4)
})

test('Should be able to move ticket to different position in the same list when new position is lower than current position', async () => {
  const server = getTestServer()

  const moveTaskQueryResult2 = await server.executeOperation({
    query: MoveTaskQuery,
    variables: {
      taskid: 5,
      newPosition: 2,
    },
  })

  // TaskID: 5 Position 4 -> 2
  // Then expected position is [Pos -> Title(ID)] : [1 -> 1.2(2)], [2 -> 1.4(5)], [3 -> 1.3(4)], [4 -> 1.1(1)]

  expect(moveTaskQueryResult2.data?.moveTask.id).toBe(5)
  expect(moveTaskQueryResult2.data?.moveTask.position).toBe(2)

  // make sure other tasks in the same list has expected position
  const checkAnotherTaskInList2_1 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 2,
    },
  })
  expect(checkAnotherTaskInList2_1.data?.getTask.position).toBe(1)

  const checkAnotherTaskInList2_2 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 4,
    },
  })
  expect(checkAnotherTaskInList2_2.data?.getTask.position).toBe(3)

  const checkAnotherTaskInList2_3 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 1,
    },
  })
  expect(checkAnotherTaskInList2_3.data?.getTask.position).toBe(4)
})

test('Should be able to move ticket to different position in different list', async () => {
  const moveTaskQueryResult3 = await server.executeOperation({
    query: MoveTaskToOtherListQuery,
    variables: {
      taskid: 2,
      newPosition: 1,
      newListId: 2,
    },
  })

  // TaskID: 2 List 1 Position 1 -> List 2 Position 1
  // Then expected position is [Pos -> Title(ID)]
  // List 1 : [1 -> 1.4(5)], [2 -> 1.3(4)], [3 -> 1.1(1)]
  // List 2 : [1 -> 1.2(2)], [2 -> 2.1(3)]

  expect(moveTaskQueryResult3.data?.moveTask.id).toBe(2)
  expect(moveTaskQueryResult3.data?.moveTask.position).toBe(1)

  //Check the task which list it is located

  const checkListQuery = await server.executeOperation({
    query: GetListQuery,
    variables: {
      getListId: 2,
    },
  })

  expect(checkListQuery.data?.getList.tasklist[0].id).toBe(2)

  // make sure other tasks has expected position

  const checkAnotherTaskInList3_1 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 5,
    },
  })
  expect(checkAnotherTaskInList3_1.data?.getTask.position).toBe(1)

  const checkAnotherTaskInList3_2 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 4,
    },
  })
  expect(checkAnotherTaskInList3_2.data?.getTask.position).toBe(2)

  const checkAnotherTaskInList3_3 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 1,
    },
  })
  expect(checkAnotherTaskInList3_3.data?.getTask.position).toBe(3)

  const checkAnotherTaskInList3_4 = await server.executeOperation({
    query: GetTaskQuery,
    variables: {
      getTaskId: 3,
    },
  })
  expect(checkAnotherTaskInList3_4.data?.getTask.position).toBe(2)
})

test('Should be able to update ticket status', async () => {
  const server = getTestServer()

  const updateTaskQueryResult = await server.executeOperation({
    query: UpdateTaskQuery,
    variables: {
      taskid: 1,
      newTitle: 'Test Suite Updated Task 1.1',
      newStatus: true,
    },
  })

  expect(updateTaskQueryResult.data?.updateTask.id).toBe(1)
  expect(updateTaskQueryResult.data?.updateTask.title).toBe(
    'Test Suite Updated Task 1.1'
  )
  expect(updateTaskQueryResult.data?.updateTask.status).toBe(true)
})


