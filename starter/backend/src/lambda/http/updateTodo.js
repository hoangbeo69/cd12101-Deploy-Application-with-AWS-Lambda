import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import { getTodo, updateTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    const updateTodoRequest = JSON.parse(event.body)

    const todoItem = await getTodo(todoId)
    if (!todoItem) {
      return {
        statusCode: 404,
        body: ''
      }
    }

    const updatedTodo = {
      ...todoItem,
      ...updateTodoRequest
    }

    const updatedItem = await updateTodo(updatedTodo)

    return {
      statusCode: 200,
      body: JSON.stringify({
        updatedItem
      })
    }
  })
