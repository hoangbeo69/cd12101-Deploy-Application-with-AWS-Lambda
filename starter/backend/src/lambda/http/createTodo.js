import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const userId = getUserId(event)
    const newTodoRequest = JSON.parse(event.body)
    const newTodo = await createTodo(newTodoRequest, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newTodo
      })
    }
  })
