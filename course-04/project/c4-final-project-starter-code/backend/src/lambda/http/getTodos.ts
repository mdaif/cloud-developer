import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'
import { ToDoIndex, ToDoTable } from '../../configs';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const userId = getUserId(event)
    logger.info('Getting todos for user %s', userId)
    const result = await docClient.query({
        TableName: ToDoTable,
        IndexName: ToDoIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
          },
        ScanIndexForward: false,
      }).promise()

    const items = result.Items
    logger.debug('Deleting userId property from items before returning results')
    items.forEach((item) => {
        delete item.userId
    })

    return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        items
    })
    }
}
