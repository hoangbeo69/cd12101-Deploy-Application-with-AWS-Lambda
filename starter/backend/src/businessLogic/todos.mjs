import { ToDoAccess } from '../dataLayer/todosAccess.mjs'
import { randomUUID } from 'crypto'

const todosAccess = new ToDoAccess()

export async function getTodos(userId) {
  return await todosAccess.getTodos(userId)
}

export async function getTodo(todoId) {
  return await todosAccess.getTodo(todoId)
}

export async function createTodo(todoRequest, userId) {
  const todoId = randomUUID()

  return await todosAccess.createTodo({
    todoId: todoId,
    userId: userId,
    attachmentUrl: '',
    ...todoRequest
  })
}

export async function updateTodo(updatedTodo) {
  return await todosAccess.updateTodo(updatedTodo)
}

export async function deleteTodo(todoId) {
  return await todosAccess.deleteTodo(todoId)
}
