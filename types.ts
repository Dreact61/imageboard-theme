export type User = {
    id?: number,
    username: string | null,
    description?: string | null,
    role?: 'user' | 'admin',
    password?: string | null
}

export type UserRequest = {
    description: string | null,
    password: string | null,
    id?: number
}

export type Store_Users = {
    error: string | null,
    loading: boolean,
    log: Log | null,
    currentUser: User | null,
    fetchThisUser: (id: number) => Promise<Log>,
    register: (data:User) => Promise<Log>,
    login: (username: string, password: string) => Promise<Log>,
    logout: () => Promise<void>,
    editUser: (data:UserRequest) => Promise<Log>,
    deleteUser: (id: number) => Promise<Log>
}

//=========================
// BOARDS
//=========================

export type Board = {
    id?: number,
    name: string,
    description?: string,
    mark: string,
    author?: string | number,
    createdAt?: string
}

export type BoardRequest = {
    name: string | null,
    description: string | null,
    mark: string | null,
    id?: number
}

export type Store_Boards = {
    error: string | null,
    loading: boolean,
    log: Log | null,
    currentBoard: Board | null,
    currentBoardThreads: Thread[],
    allBoards: Board[],
    fetchAllBoards: () => Promise<void>,
    fetchThisBoard: (mark: string) => Promise<Log>,
    createNewBoard: (data:Board) => Promise<Log>,
    editBoard: (id: number, data: BoardRequest) => Promise<Log>,
    deleteBoard: (id: number) => Promise<Log>
}

//=========================
// THREADS
//=========================

export type Thread = {
    id?: number,
    name: string,
    description?: string,
    parent: string, // mark
    author?: string | null,
    createdAt?: string,
    status: string,
    password?: string
}

export type ThreadRequest = {
    name: string,
    parent?: string | null,
    description?: string | null,
    author?: string | null,
    id?:number,
    password?: string | null,
    status: string
}

export type Store_Threads = {
    error: string | null,
    loading: boolean,
    log: Log | null,
    currentThread: Thread | null,
    currentThreadPosts: Post[],
    fetchThisThread: (id:number) => Promise<Log>,
    createNewThread: (data:Thread) => Promise<Log>,
    editThread: (id: number, data: ThreadRequest) => Promise<Log>,
    deleteThread: (id: number) => Promise<Log>,
    handlePrivateThreadLogin: (id: number, password: string) => Promise<Log>

    handleThreadPasswordOutput: (id: number) => Promise<Log>
    dynamicPostAddition: (post: Post) => Promise<void>
    dynamicPostDeletion: (id: number) => Promise<void>
}

//=========================
// POSTS
//=========================

export type Post = {
    id?: number,
    content: string,
    author: string | 'Аноним',
    createdAt?: string,
    parent: number // Thread.id,
    image?: Blob | string | null
}

export type PostRequest = {
    content: string,
    author: string | "Аноним",
    parent: number,
    image: Blob | string | null
}

export type Store_Posts = {
    error: string | null,
    loading: boolean,
    createPost: (data: PostRequest) => Promise<Log>,
    deletePost: (id: number) => Promise<Log>
}

//=========================
// OTHERS
//=========================

export type Log = {
    success: boolean,
    msg?: string | null,
    status: number,
    data?: unknown | null,
    id?: number | undefined
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
