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
    createdAt?: string
}

export type Store_Boards = {
    error: string | null,
    loading: boolean,
    log: Log | null,
    currentBoard: Board | null,
    currentBoardThreads: Thread[],
    allBoards: Board[],
    fetchAllBoards: () => Promise<void>,
    fetchThisBoard: (id: number) => Promise<void>,
    createNewBoard: (data:Board) => Promise<Log>,
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
    author: string | 'Anonymous',
    createdAt?: Date,
    parent: number // Thread.id
}

export type Store_Posts = {
    error: string | null,
    loading: boolean,
    createPost: (data: Post) => Promise<void>,
    deletePost: (id: number) => Promise<void>
}

//=========================
// OTHERS
//=========================

export type Log = {
    success: boolean,
    msg?: string | null,
    status: number,
    data?: unknown | null
}

export type logFetchingFilters = {
    success?: boolean | null,
    msg?: string | null,
    status?: number | null,
    dataType?: unknown,
    range?: [
        begin: number | null,
        end: number | null
    ] | null,
    isLast?: true
}

export type Store_settings = {
    error: string | null,
    loading: boolean,
    currentTheme: 'dark' | 'light' | 'custom',
    logs: Log[],

    changeTheme: () => Promise<void>,

    showLogs: () => Log[],
    recordLog: (data:Log) => Promise<Log | null>
}
