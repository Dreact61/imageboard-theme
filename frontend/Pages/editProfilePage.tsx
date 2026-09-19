import { useEffect, useState, useSyncExternalStore } from "react"
import { useNavigate } from "react-router"
import storeUsers from "../Stores/userStore"
import { _body, _button, _button_cont, _form_items_grid, _inputField, _main, _section, _text_error, _text_info, _textareaField } from "../style-presets"

export default function EditProfilePage() {
    //NAVIGATION
    const navigate = useNavigate()
    //STORE
    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)
    const editUser = storeUsers.getState().editUser
    //STATES
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [pass, setPass] = useState('')

    useEffect(() => {
        if (!currentUser?.username) return
        setName(currentUser.username)
        setDesc(currentUser.description || '')
        setPass(currentUser.password || '')
    }, [currentUser])
    //HANDLERS
    const handleFormSubmission = async (e:React.SubmitEvent) => {
        e.preventDefault()
        if (!currentUser?.id) return

        const data = {
            username: name || null,
            description: desc || null,
            password: pass || null,
            id: currentUser.id
        }

        const isExecuted = await editUser(data)

        if (isExecuted.success) {
            alert('Ваш профиль был успешно изменен!')
            navigate('/my-profile')
        } else {
            alert(isExecuted.msg || 'Что-то пошло не так при попытке изменить ваш профиль.')
        }
        return
    }
    //RENDER
    let mainContent:any

    if (!currentUser) {
        mainContent = 
        <div className={_body}>
            <p className={_text_error}>Ошибка 401</p>
            <small className={_text_info}>Вы не авторизованы.</small>
        </div>
    } else {
        mainContent = 
        <div className={_body}>
            <form className={_main} onSubmit={(e) => handleFormSubmission(e)}>
                <section className={_section}>
                    <strong>Редактирование Профиля</strong>
                </section>

                <section className={_form_items_grid}>
                    <label htmlFor="name">Имя Пользователя</label>
                    <input type="text" id="name" className={_inputField} value={name} onChange={(e) => setName(e.target.value)} />
                    <label htmlFor="desc">Описание</label>
                    <textarea id="desc" className={_textareaField} value={desc} onChange={(e) => setDesc(e.target.value)} />
                    <label htmlFor="pass">Пароль</label>
                    <input type="password" id="pass" className={_inputField} value={pass} onChange={(e) => setPass(e.target.value)} />
                </section>

                <section className={_button_cont}>
                    <button type="submit" className={_button}>Подтвердить</button>
                    <button type="button" onClick={() => navigate('/my-ptofile')} className={_button}>Назад</button>
                </section>
            </form>
        </div>
    }
    return mainContent
}