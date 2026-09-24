import { useNavigate, useParams, Link } from "react-router";
import { _body, _main, _text_error, _text_info, _text_loading, _hypertext, _section, _button_cont, _form_items_grid, _profiles_body, _button, _inputField, _textareaField } from "../style-presets";
import storeBoards from "../Stores/boardsStore";
import { useEffect, useState, useSyncExternalStore } from "react";

export default function EditBoardPage() {
    //NAVIGATION && PARAMS
    const navigate = useNavigate()
    const {board_mark} = useParams<{board_mark: string}>()
    //STORE
    const editBoard = storeBoards.getState().editBoard
    const fetchThisBoard = storeBoards.getState().fetchThisBoard
    const currentBoard = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().currentBoard, () => null)
    const error = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().error, () => null)
    const loading = useSyncExternalStore(storeBoards.subscribe, () => storeBoards.getState().loading, () => false)

    const currentBoardName = currentBoard?.name
    const currentBoardDesc = currentBoard?.description
    const currentBoardMark = board_mark
    //STATES
    const [isFetching, setIsFetching] = useState(true)
    const [status, setStatus] = useState(0)
    const [msg, setMsg] = useState('')

    const [boardName, setBoardName] = useState('')
    const [boardDesc, setBoardDesc] = useState('')
    const [boardMark, setBoardMark] = useState('')

    useEffect(() => {
        if (!board_mark) return

        const handleAsyncParse = async () => {
            setIsFetching(true)
            if (!currentBoard || currentBoard.mark !== board_mark) {
                const log = await fetchThisBoard(board_mark)
    
                if (!log.success || !log.data) {
                    setStatus(log.status)
                    setMsg(log.msg || error || 'error_unknown')
                }
            }
            setIsFetching(false)
        }
        handleAsyncParse()
    }, [board_mark, fetchThisBoard])

    useEffect(() => {
        if (currentBoard) {
            setBoardName(currentBoard.name || '')
            setBoardDesc(currentBoard.description || '')
            setBoardMark(currentBoard.mark || board_mark || '')
        }
    }, [currentBoard])
    //HANDLERS
    const handleFormSubmit = async (e:React.SubmitEvent) => {
        e.preventDefault()
        if (!currentBoard || !currentBoard.id || !boardMark) return
        
        const data = {
            name: boardName !== currentBoardName ? boardName : currentBoardName,
            description: boardDesc !== currentBoardDesc ? boardDesc : currentBoardDesc,
            mark: boardMark !== currentBoardMark ? boardMark : currentBoardMark,
        }
        const log = await editBoard(currentBoard.id, data)

        if (log.success) {
            alert('Доска была изменена успешно!')
            navigate(-1)
        } else {
            alert(log.msg || 'Что-то пошло не так при редактировании доски.')
        }
        return
    }
    //RENDER
    if (isFetching) {
        <div className={_body}>
            <p className={_text_loading}>Загрузка...</p>
            <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
        </div>
    }
    
    if (error || !board_mark || !currentBoard) {
        return (
            <div className={_body}>
                <p className={_text_error}>Ошибка {status}</p>
                <small className={_text_info}>{error || msg || 'Перепроверьте адрес. Возможно вы написали его с ошибкой.'}</small>
                <small><Link className={_hypertext} to="/">Вернуться назад</Link></small>
            </div>
        )
    }

    return (
        <div className={_profiles_body}>
            <form onSubmit={(e) => handleFormSubmit(e)} className={_main}>
                <section className={_section}>
                    <strong>Редактирование доски</strong>
                </section>

                <section className={_form_items_grid}>
                    <label htmlFor="name">Название Доски</label>
                    <input type="text" id="name" className={_inputField} value={boardName} onChange={(e) => setBoardName(e.target.value)} disabled={loading}/>
                    <label htmlFor="desc">Описание Доски</label>
                    <textarea id="desc" className={_textareaField} value={boardDesc} onChange={(e) => setBoardDesc(e.target.value)} disabled={loading}/>
                    <label htmlFor="mark">Метка Доски</label>
                    <input type="text" id="mark" className={_inputField} value={boardMark} onChange={(e) => setBoardMark(e.target.value)} disabled={loading}/>
                </section>

                <section className={_button_cont}>
                    <button type="submit" disabled={loading} className={_button}>Подтвердить</button>
                    <button type="button" disabled={loading} onClick={() => navigate(-1)} className={_button}>Назад</button>
                </section>
            </form>
        </div>
    )
}