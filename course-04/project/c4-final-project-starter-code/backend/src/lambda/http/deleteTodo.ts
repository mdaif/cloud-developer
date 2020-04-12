import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'
import { ToDoIndex, ToDoTable } from '../../configs';
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  
  logger.info('Getting todo item %s for user %s', todoId, userId)
  const todo = await docClient.query({
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
  const createdAt = todo.Items[0].createdAt
  logger.info('Deleting todo item %s for user %s', todoId, userId)
  const deleted = await docClient.delete({
    TableName: ToDoTable,
    Key: {
      userId,
      createdAt
    },
    ConditionExpression: "todoId = :todoId",
    ExpressionAttributeValues:{
      ":todoId": todoId
    },
  }).promise()
  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      'Deleted': deleted
    })
  }
  

}
