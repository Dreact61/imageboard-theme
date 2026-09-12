export type User = {
    id?: number,
    username: string,
    description?: string,
    role?: 'user' | 'admin',
    password?: string | null
}

export type Store_Users = {
    error: string | null,
    loading: boolean,
    log: Log | null,
    currentUser: User | null,
    register: (data:User) => Promise<void>,
    login: (username: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
    editUser: (data:User) => Promise<void>,
    deleteUser: (id: number) => Promise<void>
}

//=========================
// BOARDS
//=========================

export type Board = {
    id?: number,
    name: string,
    description?: string,
    mark: string,
    author?: number | string,
    createdAt?: Date | string
}

export type Store_Boards = {
    error: string | null,
    loading: boolean,
    log: Log | null,
    currentBoard: Board | null,
    currentBoardThreads: Thread[],
    fetchThisBoard: (id: number) => Promise<void>,
    createNewBoard: (data:Board) => Promise<void>,
    editBoard: (id: number, data: Board) => Promise<void>,
    deleteBoard: (id: number) => Promise<void>
}

//=========================
// THREADS
//=========================

export type Thread = {
    id?: number,
    name: string,
    description?: string,
    parent: string, // mark
    author?: string | number | null,
    createdAt?: Date | string,
    status: 'PRIVATE' | 'PUBLIC'
}

export type Store_Threads = {
    error: string | null,
    loading: boolean,
    log: Log | null,
    currentThread: Thread | null,
    currentThreadPosts: Post[],
    fetchThisThread: (id:number) => Promise<void>,
    createNewThread: (data:Thread) => Promise<void>,
    editThread: (id: number, data: Thread) => Promise<void>,
    deleteThread: (id: number) => Promise<void>
}

//=========================
// POSTS
//=========================

export type Post = {
    id?: number,
    content: string,
    author?: string | 'Anonymous',
    createdAt: Date,
    parent: number // Thread.id
}

//=========================
// OTHERS
//=========================

export type Log = {
    success: boolean,
    msg?: string,
    status: number,
    data?: unknown
}
