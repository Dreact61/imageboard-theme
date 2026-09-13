import {create} from 'zustand'
import type { Store_settings, Log } from '../../types'

const storeSettings = create<Store_settings>((set, get) => ({
    error: null,
    loading: false,
    currentTheme: 'light',
    logs: [],

    changeTheme: async () => {
        const {currentTheme} = get()
        const isThemeLight = currentTheme === 'light'

        if (isThemeLight) set({currentTheme: 'dark'})
        if (!isThemeLight) set({currentTheme: 'light'})
    },

    showLogs: () => {
        const {logs} = get()
        return logs
    },

    recordLog: async(data) => {
        try {
            set({loading: true, error: null})

            const logData = {
                success: data.success,
                msg: data?.msg || null,
                status: data.status,
                data: data?.data || null
            }
            set((state) => ({logs: [...state.logs, logData]}))
            return logData
        } catch(err:any) {
            set({error: 'Не удалось записать лог'})
            return null
        } finally {
            set({loading: false})
        }
    },
}))

export default storeSettings