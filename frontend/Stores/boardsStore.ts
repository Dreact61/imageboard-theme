import { create } from "zustand";
import axios from "axios";
import type {Board, Store_Boards} from "../../types";

import dotenv from 'dotenv'
const CUSTOM_API = process.env.$CUSTOM_API

const getHeaders = () => {
    const nonce = (window as any)?.wpApiSettings.nonce || ''
    return {
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce
        }
    }
}

axios.defaults.withCredentials = true

const storeBoards = create<Store_Boards>((set, get) => ({
    error: null,
    loading: false,
    log: null,
    currentBoard: null,

    fetchThisBoard: async (mark) => {
        try {
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const res = await axios.get(`${CUSTOM_API}/boards/${mark}`, getHeaders())
            if (!res.data?.success) {
                throw new Error(res.data?.message || "Не удалось загрузить доску")
            }

            const board:Board = res.data.board
            if (board.createdAt instanceof Date) {
                board.createdAt = board.createdAt.toISOString()
            }

            const currentBoard = {
                id: board.id,
                name: board.name,
                description: board.description || '',
                mark: board.mark,
                author: board.author || 'Anonymous',
                createdAt: board.createdAt || 'N/A'
            }

            result_log.data = currentBoard
            result_log.success = res.data.success
            result_log.status = res.status
            result_log.msg = "Успешно загружено!"

            set({
                log: result_log,
                currentBoard: currentBoard,
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
            set({loading: false})
        }
    },

    createNewBoard: async (data) => {
        try {
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const newBoard = {
                name: data.name,
                description: data.description,
                mark: data.mark,
                author: data.author,
                createdAt: new Date().toISOString()
            }

            const res = await axios.post(`${CUSTOM_API}/boards/create`, newBoard, getHeaders())
            if (!res.data?.success) {
                throw new Error(res.data?.message || 'Не удалось создать доску')
            }

            result_log.status = res.status,
            result_log.msg = "Доска создана успешно"
            result_log.success = res.data?.success
            result_log.data = newBoard

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
            set({loading: false})
        }
    },

    editBoard: async (mark) => {
        try {
            set({loading: true, error: null, log: null})

            const res = await axios.get('')
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
            set({loading: false})
        }
    },
    
    deleteBoard: async (mark) => {
        try {
            set({loading: true, error: null, log: null})

            const res = await axios.get('')
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
            set({loading: false})
        }
    }
}))

export default storeBoards