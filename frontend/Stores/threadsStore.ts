import { create } from "zustand";
import axios, {AxiosRequestConfig} from "axios";
import type {Thread, Store_Threads, Post} from '../../types'

const CUSTOM_API = process.env.CUSTOM_API

const getAxiosConfig = () => {
    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json' as const,
        }
    } satisfies AxiosRequestConfig
}

const storeThreads = create<Store_Threads>((set, get) => ({
    error: null,
    loading: false,
    log: null,
    currentThread: null,
    currentThreadPosts: [],

    fetchThisThread: async (id) => {
        try {
            set({error: null, loading: true, log: null})

            const res = await axios.post(`${CUSTOM_API}/threads`, {id})
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
            const thread:Thread = res.data.thread
            const posts = res.data.posts

            let result_log = {
                success: res.data.success,
                msg: 'Тред успешно загружен',
                status: res.status,
                data: thread
            }

            set({
                currentThread: thread,
                currentThreadPosts: posts,
                log: result_log
            })
            return result_log
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            const Log = {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                    data: {}
                }
                set({
                    error: errorMsg,
                    log: Log
                })
                return Log
        } finally {
            set({loading:false})
        }
    },

    createNewThread: async (data) => {
        try {
            set({error: null, loading: true, log: null})

            const newThread:Thread = {
                name: data.name,
                parent: data.parent,
                description: data.description,
                status: data.status || 'PUBLIC',
                author: data.author,
                password: data.status
            }

            const res = await axios.post(`${CUSTOM_API}/threads/create`, newThread, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
            const thread:Thread = res.data.thread_data

            const createdThread:Thread = {
                id: thread.id,
                name: thread.name,
                description: thread.description,
                parent: thread.parent,
                author: thread.author,
                createdAt: thread.createdAt,
                status: thread.status,
                password: thread.password
            }

            let result_log = {
                success: res.data.success,
                msg: 'Тред успешно создан!',
                status: res.status,
                data: createdThread,
                id: createdThread.id
            }

            set({
                log: result_log
            })
            return result_log
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            const Log = {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                    data: {}
                }
            set({
                error: errorMsg,
                log: Log
            })
            return Log
        } finally {
            set({loading:false})
        }
    },

    editThread: async (id, data) => {
        try {
            set({error: null, loading: true, log: null})
            const dataToEdit = {
                id: id,
                name: data.name,
                description: data.description,
                password: data.password,
                status: data.status
            }

            const res = await axios.put(`${CUSTOM_API}/threads/edit`, dataToEdit, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
            const thread:Thread = res.data.thread

            const editedThread = {
                id: thread.id,
                name: thread.name,
                description: thread.description,
                parent: thread.parent,
                author: thread.author,
                createdAt: thread.createdAt,
                status: thread.status,
                password: thread.password
            }

            let result_log = {
                success: res.data.success,
                msg: 'Тред успешно обновлен',
                status: res.status,
                data: editedThread
            }

            const {currentThread} = get()
            if(currentThread && currentThread.id === editedThread.id) set({currentThread: editedThread})
            set({log: result_log})
            return result_log
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            const Log = {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                    data: {}
                }
            set({
                error: errorMsg,
                log: Log
            })
            return Log
        } finally {
            set({loading:false})
        }
    },

    deleteThread: async (id) => {
        try {
            set({error: null, loading: true, log: null})
            const res = await axios.post(`${CUSTOM_API}/threads/delete`, {id}, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
            const thread = res.data.thread_id

            return {
                success: res.data.success,
                msg: 'Тред успешно удален',
                status: res.status,
                data: id
            }
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            const Log = {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                }
            set({
                error: errorMsg,
                log: Log
            })
            return Log
        } finally {
            set({loading:false})
        }
    },

    handlePrivateThreadLogin: async (id, password) => {
        try {
            set({error: null, loading: true, log: null})
            const res = await axios.post(`${CUSTOM_API}/threads/private-pass`, {id, password}, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')

            return {
                success: res.data.success,
                msg: 'Тред успешно удален',
                status: res.status,
                data: id
            }
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            const Log = {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                }
            set({
                error: errorMsg,
                log: Log
            })
            return Log
        } finally {
            set({loading:false})
        }
    },

    handleThreadPasswordOutput: async (id) => {
        try {
            set({error: null, loading: true, log: null})
            const res = await axios.post(`${CUSTOM_API}/threads/password`, {id}, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')

            return {
                success: res.data.success,
                msg: 'Тред успешно удален',
                status: res.status,
                data: res.data.password
            }
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            const Log = {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                }
            set({
                error: errorMsg,
                log: Log
            })
            return Log
        } finally {
            set({loading:false})
        }
    },

    dynamicPostAddition: async (post) => set((state) => ({currentThreadPosts: [...state.currentThreadPosts, post]})),
    dynamicPostDeletion: async (id) => set((state) => ({currentThreadPosts: state.currentThreadPosts.filter(post => post.id !== id)}))
}))

export default storeThreads