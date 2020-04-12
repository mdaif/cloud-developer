import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const ToDoTable = process.env.TODO_TABLE
const ToDoIndex = process.env.TODO_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  
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
