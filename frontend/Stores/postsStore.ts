import { create } from 'zustand'
import axios, {AxiosRequestConfig} from 'axios'
import type { Post, Store_Posts } from '../../types'

const CUSTOM_API = process.env.CUSTOM_API

const getAxiosConfig = () => {
    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json' as const,
        }
    } satisfies AxiosRequestConfig
}

const storePosts = create<Store_Posts>((set, get) => ({
    error: null,
    loading: false,

    createPost: async (data) => {
        try {
            set({loading: true, error: null})

            const postData:Post = {
                content: data.content,
                author: data.author,
                parent: data.parent
            }

            const res = await axios.post(`${CUSTOM_API}/posts/create`, postData)
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            set({error: errorMsg})
        } finally {
            set({loading:false})
        }
    },
    
    deletePost: async (id) => {
        try {
            set({loading: true, error: null})

            const res = await axios.delete(`${CUSTOM_API}/posts/post-${id}`, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            set({error: errorMsg})
        } finally {
            set({loading:false})
        }
    }
}))

export default storePosts