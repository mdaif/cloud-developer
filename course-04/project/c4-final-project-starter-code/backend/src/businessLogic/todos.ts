import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import * as uuid from 'uuid'
import { getUserId } from "../lambda/utils";
import { APIGatewayProxyEvent } from "aws-lambda";
import { TodoAccess } from '../dataLayer/todoAccess'
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { imagesBucket } from "../configs"
const todoAccess = new TodoAccess()


export async function createTodo(
    newTodo: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> {
    const todoId = uuid.v4()
    const userId = getUserId(event)
    const createdAt = new Date().toISOString()
    const attachmentUrl = `https://${imagesBucket}.s3.amazonaws.com/${todoId}`
    return await todoAccess.createTodo({
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl,
        ...newTodo
    })
}

export async function updateTodo(
    todoId: string,
    updatedTodo: UpdateTodoRequest, event: APIGatewayProxyEvent): Promise<void> {
    const userId = getUserId(event)
    return await todoAccess.updateTodoForUser(todoId, userId, updatedTodo)
}

export async function deleteTodo(
    todoId: string,
    event: APIGatewayProxyEvent
): Promise<void> {
    const userId = getUserId(event)
    return await todoAccess.deleteTodoForUser(todoId, userId)
}

export async function getAllTodos(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
    const userId = getUserId(event)
    const allTodos = todoAccess.getAllTodosForUser(userId)
    return allTodos
}
