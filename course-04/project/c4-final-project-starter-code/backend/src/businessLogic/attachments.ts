import { FileAccess } from '../dataLayer/fileAccess'

const fileAccess = new FileAccess()

export function getAttachmentUploadUrl(todoId: string) {
    return fileAccess.getAttachmentUploadUrl(todoId)
}