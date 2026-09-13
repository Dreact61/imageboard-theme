import { create } from "zustand";
import axios, {AxiosRequestConfig} from "axios";
import type {Board, Store_Boards, Thread} from "../../types";

const CUSTOM_API = process.env.CUSTOM_API

const getAxiosConfig = () => {
    return {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json' as const,
        }
    } satisfies AxiosRequestConfig
}

const storeBoards = create<Store_Boards>((set, get) => ({
    error: null,
    loading: false,
    log: null,
    currentBoard: null,
    currentBoardThreads: [],
    allBoards: [],

    fetchAllBoards: async () => {
        try{
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const res = await axios.get(`${CUSTOM_API}/boards/all`)
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')

            const boards:Board[] = res.data.boards

            result_log = {
                success: res.data.success,
                msg: 'Доска успешно загружена!',
                status: res.status,
                data: boards
            }

            set({
                log: result_log,
                allBoards: boards
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

    fetchThisBoard: async (id) => {
        try {
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const res = await axios.get(`${CUSTOM_API}/boards/${id}`)
            if (!res.data?.success) throw new Error(res.data?.details || res.data?.message || 'error_unknown')

            const board:Board = res.data.board
            const threads:Thread[] = res.data.threads
            if (board.createdAt instanceof Date) board.createdAt = board.createdAt.toISOString()

            const currentBoard = {
                id: id,
                name: board.name,
                description: board.description || '',
                mark: board.mark,
                author: board.author || 'Anonymous',
                createdAt: board.createdAt || 'N/A'
            }
            
            result_log = {
                success: res.data.success,
                msg: 'Доска успешно загружена!',
                status: res.status,
                data: board
            }

            set({
                log: result_log,
                currentBoard: currentBoard,
                currentBoardThreads: threads
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
                author: data.author
            }

            const res = await axios.post(`${CUSTOM_API}/boards/create`, newBoard, getAxiosConfig())
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

    editBoard: async (id, data) => {
        try {
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: {}
            }

            const dataToEdit:Board = {
                id: id,
                name: data.name,
                mark: data.mark,
                description: data.description
            }

            const res = await axios.put(`${CUSTOM_API}/boards/${id}`, dataToEdit, getAxiosConfig())
            if (!res.data?.success) {
                throw new Error(res.data?.message || 'Не удалось изменить доску')
            }

            const board = res.data.board
            const editedBoard = {
                id: board.id,
                name: board.name,
                description: board.description,
                mark: board.mark,
                author: board.author,
                createdAt: board.createdAt
            }

            result_log = {
                success: true,
                msg: 'Доска успешно обновлена!',
                status: 200,
                data: editedBoard
            }

            const {currentBoard} = get()
            if (currentBoard && currentBoard.id === board.id) {
                set({currentBoard: board})
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
            set({loading: false})
        }
    },
    
    deleteBoard: async (mark) => {
        try {
            set({loading: true, error: null, log: null})
            let result_log = {
                success: false,
                msg: '',
                status: 0,
                data: 0
            }

            const res = await axios.delete(`${CUSTOM_API}/boards/${mark}/delete`, getAxiosConfig())
            if (!res.data?.success) {
                throw new Error(res.data?.message || 'Не удалось удалить доску')
            }

            result_log = {
                success: res.data.success,
                msg: 'Доска успешно удалена',
                status: res.status,
                data: res.data.id
            }
            const {currentBoard} = get()
            if (currentBoard && currentBoard.id === res.data.id) set({currentBoard: null, currentBoardThreads: []})
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
            set({loading: false})
        }
    }
}))

export default storeBoards