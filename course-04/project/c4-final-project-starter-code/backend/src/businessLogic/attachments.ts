import { FileAccess } from '../dataLayer/fileAccess'

const fileAccess = new FileAccess()

export function getAttachmentUploadUrl(todoId: string): Promise<Object> {
    return fileAccess.getAttachmentUploadUrl(todoId)
}