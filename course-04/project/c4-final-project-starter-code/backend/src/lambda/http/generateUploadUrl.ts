import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { imagesBucket, urlExpiration } from '../../configs';
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')
const s3 = new AWS.S3({
    'signatureVersion': 'v4'
})


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    const uploadUrl = getUploadUrl(todoId)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            uploadUrl
        })
    }
}

function getUploadUrl(todoId: String) {
    logger.info('Creating a presigned PUT URL for todo %s', todoId)
    return s3.getSignedUrl('putObject', {
        Bucket: imagesBucket,
        Key: todoId,
        Expires: urlExpiration
    })
}