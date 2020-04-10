import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const ToDoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const updated = await docClient.update({
      TableName: ToDoTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: "set #name = :name, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues:{
        ":name": updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done": updatedTodo.done
    },
    ExpressionAttributeNames: {
        "#name": "name"
    },
    ReturnValues:"UPDATED_NEW"
  }).promise()
  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        updated
    })
    }
}
