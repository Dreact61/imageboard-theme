import { useEffect, useState, useSyncExternalStore } from "react"
import { useNavigate, Link } from "react-router"
import storeUsers from "../Stores/userStore"
import { ui } from "../style-presets"


export default function EditProfilePage() {
    //NAVIGATION
    const navigate = useNavigate()
    //STORE
    const currentUser = useSyncExternalStore(storeUsers.subscribe, () => storeUsers.getState().currentUser, () => null)
    const editUser = storeUsers.getState().editUser
    //STATES
    const currentName = currentUser?.username
    const currentDesc = currentUser?.description
    const currentPassword = currentUser?.password


    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [pass, setPass] = useState('')


    useEffect(() => {
        if (!currentUser?.username) return
        setName(currentUser.username)
        setDesc(currentUser.description || '')
        setPass(currentUser.password || '')
    }, [])
    //HANDLERS
    const handleFormSubmission = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!currentUser?.id) return


        const data = {
            username: name !== currentName ? name : null,
            description: desc !== currentDesc ? desc : null,
            password: pass !== currentPassword ? pass : null,
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
    let mainContent: any


    if (!currentUser) {
        mainContent =
            <div className={ui.errorPage}>
                <p className={ui.errorTitle}>Ошибка 401</p>
                <small className={ui.errorText}>Вы не авторизованы.</small>
                <small><Link className={ui.link} to="/">Вернуться назад</Link></small>
            </div>
    } else {
        mainContent =
            <div className={ui.page}>
                <form className={`${ui.card} mx-auto max-w-2xl`} onSubmit={(e) => handleFormSubmission(e)}>
                    <section className={`${ui.threadInfo} mb-5 rounded-md`}>
                        <strong className={ui.threadTitle}>Редактирование Профиля</strong>
                    </section>


                    <section className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
                        <label htmlFor="name" className={ui.text}>Имя Пользователя</label>
                        <input type="text" id="name" className={ui.input} value={name} onChange={(e) => setName(e.target.value)} />
                        <label htmlFor="desc" className={ui.text}>Описание</label>
                        <textarea id="desc" className={`${ui.input} h-32 resize-none`} value={desc} onChange={(e) => setDesc(e.target.value)} />
                        <label htmlFor="pass" className={ui.text}>Пароль</label>
                        <input type="password" id="pass" className={ui.input} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Введите новый пароль" />
                    </section>


                    <section className="mt-5 flex w-full items-center justify-evenly gap-4">
                        <button type="submit" className={ui.button}>Подтвердить</button>
                        <button type="button" onClick={() => navigate('/my-profile')} className={ui.button}>Назад</button>
                    </section>
                </form>
            </div>
    }
    return mainContent
}