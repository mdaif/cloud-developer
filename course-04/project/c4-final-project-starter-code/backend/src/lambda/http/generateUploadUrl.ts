import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

const s3 = new AWS.S3({
    'signatureVersion': 'v4'
})
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
const imagesBucket = process.env.IMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
    return s3.getSignedUrl('putObject', {
        Bucket: imagesBucket,
        Key: todoId,
        Expires: urlExpiration
    })
}