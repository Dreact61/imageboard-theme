import { create } from "zustand";
import axios, {AxiosHeaders, AxiosRequestConfig, AxiosRequestHeaders} from "axios";
import { persist } from "zustand/middleware";
import type { Store_Users, User } from "../../types";

const CUSTOM_API = process.env.CUSTOM_API

const getAxiosConfig = () => {
    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json' as const,
        }
    } satisfies AxiosRequestConfig
}

const storeUsers = create<Store_Users>()(
    persist(
        (set, get) => ({
        error: null,
        loading: false,
        log: null,
        currentUser: null,

        fetchThisUser: async (id) => {
            try {
                set({loading: true, error: null, log: null})
                let result_log = {
                    success: false,
                    msg: '',
                    status: 0,
                    data: {}
                }

                const res = await axios.post(`${CUSTOM_API}/users/fetch`, {id})
                if(!res.data.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')

                const user = res.data.user

                result_log = {
                    success: res.data?.success,
                    msg: '',
                    status: res.status || 200,
                    data: user
                }
                set({log: result_log})
                return result_log
            } catch(err:any) {
                const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
                const Log = {
                        success: false,
                        msg: errorMsg,
                        status: err.response?.status || 500,
                        data: {}
                    }
                console.error(errorMsg)
                set({
                    error: errorMsg,
                    log: Log
                })
                return Log
            } finally {
                set({loading:false})
            }
        },

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
                return result_log
            } catch(err:any) {
                const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
                const Log = {
                        success: false,
                        msg: errorMsg,
                        status: err.response?.status || 500,
                        data: {}
                    }
                console.error(errorMsg)
                set({
                    error: errorMsg,
                    log: Log
                })
                return Log
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
                return result_log
            } catch(err:any) {
                const errorMsg = err.response?.data?.message || err.message || "Неизвестная ошибка"
                const Log = {
                        success: false,
                        msg: errorMsg,
                        status: err.response?.status || 500,
                        data: {}
                    }
                console.error(errorMsg)
                set({
                    error: errorMsg,
                    log: Log
                })
                return Log
            } finally {
                set({loading:false})
            }
        },

        logout: async () => {
            try {
                const res = await axios.get(`${CUSTOM_API}/logout`)
                if (res.data.success) {
                    set({
                        log: {
                            success: res.data.success,
                            msg: res.data.message,
                            data: 0,
                            status: res.status
                        },
                        currentUser: null
                    })
                }
                return
            } catch(err:any) {
                const errorMsg = err.message || 'Неизвестная ошибка'
                set({error: errorMsg})
                console.error(errorMsg)
            }
        },

        editUser: async (data) => {
            try {
                set({loading: true, error: null, log: null})
                let result_log = {
                    success: false,
                    msg: '',
                    status: 0,
                    data: {}
                }
                
                let editData = {
                    id: data.id,
                    username: data.username,
                    description: data.description,
                    password: data.password
                }

                if (data.username && data.username.length < 4) throw new Error('Слишком малая длина имени пользователя.')
                if (data.password && data.password.length < 6) throw new Error('Слишком малая длина пароля.')

                if (editData.username === null && editData.description === null && editData.password === null) throw new Error('Ничего не изменилось.')

                const res = await axios.put(`${CUSTOM_API}/users/edit`, editData, getAxiosConfig())
                if (!res.data.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')
            
                const user:User = res.data.user
                const editedUser = {
                    id: data.id,
                    username: user.username,
                    description: user.description,
                    role: user.role
                }

                result_log = {
                    success: res.data?.success,
                    msg: 'Пользователь был изменен успешно!',
                    status: res.status || 200,
                    data: editedUser
                }

                set({log: result_log, currentUser: editedUser})
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

        deleteUser: async (id) => {
            try {
                set({loading: true, error: null, log: null})
                let result_log = {
                    success: false,
                    msg: '',
                    status: 0,
                    data: {}
                }

                const res = await axios.post(`${CUSTOM_API}/users/delete`, {id}, getAxiosConfig())
                if (!res.data?.success) throw new Error(res.data?.message || res.data?.code || 'error_unknown')

                result_log = {
                    success: res.data?.success,
                    msg: 'Пользователь был успешно удален',
                    status: res.status || 200,
                    data: res.data.id
                }
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
        }
    }),
        {
            name: 'current-user-state', 
            partialize: (state) => ({currentUser: state.currentUser})
        }
    )
)

export default storeUsers