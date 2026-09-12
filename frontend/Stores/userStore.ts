import { create } from "zustand";
import axios from "axios";
import type { Store_Users, User } from "../../types";

const CUSTOM_API = process.env.CUSTOM_API

const getAxiosConfig = () => {
    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }
} 

const storeUsers = create<Store_Users>((set, get) => ({
    error: null,
    loading: false,
    log: null,
    currentUser: null,
    refreshToken: null,
    accessToken: null,

    register: async (data) => {
        try {
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const res = await axios.post(`${CUSTOM_API}/register`, data)
            if(!res.data.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')

            const user = res.data.user

            result_log = {
                success: res.data?.success,
                msg: 'Пользователь создан успешно!',
                status: res.status || 201,
                data: {
                    id: user.id,
                    username: user.username,
                    description: user.description,
                    role: user.role
                }
            }

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

    login: async (username, password) => {
        try {
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const data = {username, password}
            const res = await axios.post(`${CUSTOM_API}/login`, data)
            if (!res.data?.success) {
                throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            }

            const user = res.data.user
            const currentUser = {
                id: user.id,
                username: user.username,
                description: user.description,
                role: user.role
            }

            result_log = {
                success: true,
                msg: `Вы успешно вошли в аккаунт ${user.username}`,
                status: res.status || 200,
                data: currentUser
            }
            set({log: result_log, currentUser: currentUser})
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

    logout: async () => set({currentUser: null}),

    editUser: async (data) => {
        try {
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }
            
            const editData = {
                id: data.id,
                username: data.username || null,
                description: data.description || null,
                password: data.password || null
            }
            const res = await axios.put(`${CUSTOM_API}/users/${data.id}/edit`, editData, getAxiosConfig())
            if (!res.data.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
        
            const user:User = res.data.user
            const editedUser = {
                id: data.id,
                username: user.username,
                description: user.description,
                role: user.role,
                password: editData?.password ? user.password : null
            }

            result_log = {
                success: res.data?.success,
                msg: 'Пользователь был изменен успешно!',
                status: res.status || 200,
                data: editedUser
            }

            const {currentUser} = get()
            if (currentUser?.id === user.id) {
                set({currentUser: editedUser})
            }
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

    deleteUser: async (id) => {
        try {
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const res = await axios.delete(`${CUSTOM_API}/users/${id}/delete`, getAxiosConfig())
            if (!res.data?.success) throw new Error(res.data?.message || res.data?.code || 'error_unknown')

            result_log = {
                success: res.data?.success,
                msg: 'Пользователь был успешно удален',
                status: res.status || 200,
                data: res.data.id
            }
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
}))

export default storeUsers