import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class ToDoAccess {
  constructor(
    client = AWSXRay.captureAWSv3Client(new DynamoDBClient()),
    todosTable = process.env.TODOS_TABLE,
    userIdIndex = process.env.TODOS_USERID_INDEX
  ) {
    this.client = client
    this.todosTable = todosTable
    this.userIdIndex = userIdIndex
    this.docClient = DynamoDBDocumentClient.from(this.client)
  }

  async getTodos(userId) {
    console.log(`Getting all todo item for userId ${userId}`)

    const command = new QueryCommand({
      TableName: this.todosTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    })

    const result = await this.docClient.send(command)

    return result.Items
  }

  async getTodo(todoId) {
    console.log(`Getting a todo item with id ${todoId}`)

    const command = new QueryCommand({
      TableName: this.todosTable,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    })

    const result = await this.docClient.send(command)

    if (result.Count !== 0) {
      return result.Items[0]
    }

    return null
  }

  async createTodo(todo) {
    console.log(`Creating a todo item with id ${todo.todoId}`)

    const command = new PutCommand({
      TableName: this.todosTable,
      Item: todo
    })

    await this.docClient.send(command)

    return todo
  }

  async updateTodo(todo) {
    console.log(`Updating a todo item with id ${todo.todoId}`)
    console.log('Todo', todo)

    const command = new PutCommand({
      TableName: this.todosTable,
      Item: todo
    })

    await this.docClient.send(command)

    return todo
  }

  async deleteTodo(todoId) {
    console.log(`Deleting a todo item with id ${todoId}`)

    const command = new DeleteCommand({
      TableName: this.todosTable,
      Key: {
        todoId: todoId
      }
    })

    const response = await this.docClient.send(command)

    return response
  }
}
