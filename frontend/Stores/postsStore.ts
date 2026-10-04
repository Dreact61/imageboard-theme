import { create } from 'zustand'
import axios, {AxiosRequestConfig} from 'axios'
import type { Post, PostRequest, Store_Posts } from '../../types'

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

            const formData = new FormData()
            formData.append('content', data.content)
            formData.append('parent', String(data.parent))
            formData.append('author', data.author)
            formData.append('image', (data.image instanceof Blob ? data.image : ''))

            const res = await axios.post(`${CUSTOM_API}/posts/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
                console.log(res.data.post)
            return {
                status: res.status,
                success: res.data.success,
                data: res.data.post,
                msg: ''
            }
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            set({error: errorMsg})
            return {
                status: err?.response.status || 500,
                success: false,
                msg: errorMsg
            }
        } finally {
            set({loading:false})
        }
    },
    
    deletePost: async (id) => {
        try {
            set({loading: true, error: null})

            const res = await axios.post(`${CUSTOM_API}/posts/delete`, {id}, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
            return {
                status: res.status,
                id: res.data.post_id,
                success: true
            }
        } catch(err:any) {
            const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
            console.error(errorMsg)
            set({error: errorMsg})

            return {
                msg: errorMsg,
                status: err?.response.status || 500,
                success: false
            }
        } finally {
            set({loading:false})
        }
    }
}))

export default storePosts