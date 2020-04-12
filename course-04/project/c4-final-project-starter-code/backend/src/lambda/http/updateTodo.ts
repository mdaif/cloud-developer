import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { ToDoIndex, ToDoTable } from '../../configs';
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.debug('Getting createdAt for todo: %s for user %s', todoId, userId)
  const todos = await docClient.query({
    TableName: ToDoTable,
    IndexName: ToDoIndex,
    KeyConditionExpression: 'userId = :userId and todoId = :todoId',
    ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
      },
    ScanIndexForward: false,
    Limit : 1
  }).promise()

  const createdAt = todos.Items[0].createdAt
  logger.info('Updating todo: %s for user %s', todoId, userId)
  const updated = await docClient.update({
      TableName: ToDoTable,
      Key: {
        userId,
        createdAt
      },
      ConditionExpression: "todoId = :todoId",
      UpdateExpression: "set #name = :name, dueDate=:dueDate, done=:done, attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues:{
        ":name": updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done": updatedTodo.done,
        ":todoId": todoId,
        ":attachmentUrl": updatedTodo.attachmentUrl
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
