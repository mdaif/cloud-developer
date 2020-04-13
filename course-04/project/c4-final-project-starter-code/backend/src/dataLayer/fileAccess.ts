import * as AWS  from 'aws-sdk'
import { imagesBucket, urlExpiration } from '../configs';
import { createLogger } from '../utils/logger'

const logger = createLogger('getTodos')



export class FileAccess {
    constructor(
        private readonly s3Client = createS3Client()) {
    }
    getAttachmentUploadUrl(todoId: string) {
        logger.debug('Creating a pre-signed url for todo %s', todoId)
        return this.s3Client.getSignedUrl('putObject', {
            Bucket: imagesBucket,
            Key: todoId,
            Expires: urlExpiration
        })
    }
}

function createS3Client(){
    // Can be modified to mock offline S3 behavior
    return new AWS.S3({
        'signatureVersion': 'v4'
    })
}