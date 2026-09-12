import { create } from "zustand";
import axios from "axios";
import type {Thread, Store_Threads, Post} from '../../types'

const CUSTOM_API = process.env.CUSTOM_API

const getAxiosConfig = () => {
    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }
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
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const res = await axios.get(`${CUSTOM_API}/threads/${id}`)
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
            const thread:Thread = res.data.thread
            const posts = res.data.posts
            if (thread.createdAt instanceof Date) thread.createdAt = thread.createdAt.toISOString()

            result_log = {
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
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            set({
                error: errorMsg,
                log: {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                    data: {}
                }
            })
        } finally {
            set({loading:false})
        }
    },

    createNewThread: async (data) => {
        try {
            set({error: null, loading: true, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const newThread:Thread = {
                name: data.name,
                parent: data.parent,
                description: data.description,
                status: data.status || 'PUBLIC',
                author: data.author
            }

            const res = await axios.post(`${CUSTOM_API}/threads/create`, newThread, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
            const thread:Thread = res.data.thread

            const createdThread:Thread = {
                id: thread.id,
                name: thread.name,
                description: thread.description,
                parent: thread.parent,
                author: thread.author,
                createdAt: thread.createdAt,
                status: thread.status
            }

            result_log = {
                success: res.data.success,
                msg: 'Тред успешно создан!',
                status: res.status,
                data: createdThread
            }

            set({
                log: result_log
            })
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            set({
                error: errorMsg,
                log: {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                    data: {}
                }
            })
        } finally {
            set({loading:false})
        }
    },

    editThread: async (id, data) => {
        try {
            set({error: null, loading: true, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const dataToEdit = {
                id: id,
                name: data.name || null,
                description: data.description || null,
                status: data.status || null
            }

            const res = await axios.put(`${CUSTOM_API}/threads/`, dataToEdit, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
            const thread:Thread = res.data.thread

            const editedThread = {
                id: thread.id,
                name: thread.name,
                description: thread.description,
                parent: thread.parent,
                author: thread.author,
                createdAt: thread.createdAt,
                status: thread.status
            }

            result_log = {
                success: res.data.success,
                msg: 'Тред успешно обновлен',
                status: res.status,
                data: editedThread
            }

            const {currentThread} = get()
            if(currentThread && currentThread.id === editedThread.id) set({currentThread: editedThread})
            set({log: result_log})
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            set({
                error: errorMsg,
                log: {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                    data: {}
                }
            })
        } finally {
            set({loading:false})
        }
    },

    deleteThread: async (id) => {
        try {
            set({error: null, loading: true, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const res = await axios.delete(`${CUSTOM_API}/threads/${id}`, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
            const thread = res.data.thread_id

            result_log = {
                success: res.data.success,
                msg: 'Тред успешно удален',
                status: res.status,
                data: id
            }
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            set({
                error: errorMsg,
                log: {
                    success: false,
                    msg: errorMsg,
                    status: err.response?.status || 500,
                    data: {}
                }
            })
        } finally {
            set({loading:false})
        }
    }
}))

export default storeThreads