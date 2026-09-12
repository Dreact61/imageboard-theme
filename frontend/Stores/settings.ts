import {create} from 'zustand'
import type { Store_settings } from '../../types'

const storeSettings = create<Store_settings>((set, get) => ({
    currentTheme: 'light',
    logs: [],

    changeTheme: async () => {
        const {currentTheme} = get()
        const isThemeLight = currentTheme === 'light'

        if (isThemeLight) set({currentTheme: 'dark'})
        if (!isThemeLight) set({currentTheme: 'light'})
    },
    setCustomTheme: async (colors) => {},

    showLogs: () => {
        const {logs} = get()
        console.log(logs)
    },
    showLogsUntil: (num) => {
        const {logs} = get()
        console.log(logs.slice(-(Math.abs(num))))
    },
}))

export default storeSettings