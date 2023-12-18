import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import { getTodo, updateTodo } from '../../businessLogic/todos.mjs'
import { getUploadUrl, BUCKET_NAME } from '../../fileStorage/attachmentUtils.mjs'
import { randomUUID } from 'crypto'

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

    const todoItem = await getTodo(todoId)
    if (!todoItem) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Todo item does not exist'
        })
      }
    }

    const attachmentId = randomUUID()
    const uploadUrl = await getUploadUrl(attachmentId)

    const updatedItem = {
      ...todoItem,
      attachmentUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${attachmentId}`
    }

    await updateTodo(updatedItem)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      })
    }
  })
