export type User = {
    id?: number,
    username: string,
    name?: string,
    description?: string,
    role: 'user' | 'admin',
    password?: string
}

export type Board = {
    id?: number,
    name: string,
    description: string,
    mark: string,
    author: string,
    createdAt: Date
}

export type Thread = {
    id?: number,
    name: string,
    description: string,
    parent: number | string, //id | mark
    author: string,
    createdAt: Date,
    status: 'PRIVATE' | 'PUBLIC'
}

export type Post = {
    id?: number,
    content: string,
    author: string | 'Anonymous',
    createdAt: Date,
    parent: number // Thread.id
}