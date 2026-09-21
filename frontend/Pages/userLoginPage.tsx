import { _body, _button, _button_cont, _form_items_grid, _inputField, _main, _section } from "../style-presets"
import { Link, useNavigate } from "react-router"

import storeUsers from "../Stores/userStore"
import { useSyncExternalStore, useState } from "react"

export default function LoginPage() {
    //NAVIGATION
    const navigate = useNavigate()
    //STORE
    const loading = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getInitialState().loading)
    const login = storeUsers.getState().login
    //STATES
    const [userName, setUserName] = useState('')
    const [userPass, setUserPass] = useState('')
    //HANDLER
    const handleFormSubmit = async (e:React.SubmitEvent) => {
        e.preventDefault()

        const isExecuted = await login(userName, userPass)

        if (isExecuted.success) {
            alert(`Вы успешно вошли под именем ${userName}!`)
            navigate("/")
        } else {
            alert(isExecuted.msg || 'Что-то пошло не так при попытке входа в аккаунт')
        }
        return
    }
    //RENDER
    return (
        <div className={_body}>
            <form className={_main} onSubmit={(e) => handleFormSubmit(e)}>
                <section className={_section}>
                    <strong>Вход</strong>
                </section>

                <section className={_form_items_grid}>
                    <label htmlFor="name">Имя Пользователя</label>
                    <input type="text" id="name" className={_inputField} required disabled={loading} value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <label htmlFor="password">Пароль</label>
                    <input type="password" id="password" className={_inputField} required disabled={loading} value={userPass} onChange={(e) => setUserPass(e.target.value)} />
                </section>

                <section className={_button_cont}>
                    <button type="submit" className={_button}>Войти</button>
                    <Link to="/">
                    <button type="button" className={_button}>Назад</button>
                    </Link>
                </section>
            </form>
        </div>
    )
}