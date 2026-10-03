const surface = `
    rounded-md
    border-2 border-[#261F3D]
    bg-[#161224]/50
`

const focusRing = `
    transition-all duration-300 ease-in-out
    focus:outline-none
    focus:border-[#5A3EC4]
    focus:shadow-[0_0_10px_rgba(90,62,196,0.3)]
`

const interactive = `
    transition-all duration-300 ease-in-out
    focus:outline-none
    focus:ring-2 focus:ring-[#5A3EC4]/50
    disabled:cursor-not-allowed
    disabled:opacity-50
`

export const ui = {
    // Общий текст
    text: `text-[#E2E0E7]`,
    muted: `text-[#8B869C]`,
    accent: `text-[#A78BFA]`,

    // Общая поверхность
    surface,

    card: `
        ${surface}
        flex w-full flex-col
        p-4
        shadow-[0_4px_20px_rgba(0,0,0,0.5)]
        backdrop-blur-sm
    `,

    // Страница
    page: `
        absolute left-0 top-0
        min-h-screen w-full
        bg-[#0B0813]
        px-3 py-4
        text-[#E2E0E7]
        sm:px-6 sm:py-6
        flex flex-col
        items-center justify-evenly
        m-auto
    `,

    content: `
        mx-auto flex w-full max-w-5xl
        flex-col items-center gap-5
    `,

    // Состояния страницы
    loadingPage: `
        absolute left-0 top-0
        flex min-h-screen w-screen
        flex-col items-center justify-center gap-4
        bg-[#0B0813]
        px-4
        text-[#E2E0E7]
    `,

    loadingText: `
        animate-pulse
        text-2xl
        text-[#A78BFA]
    `,

    errorPage: `
        absolute left-0 top-0
        flex min-h-screen w-screen
        flex-col items-center justify-center gap-4
        bg-[#0B0813]
        px-4
        text-center
        text-[#E2E0E7]
    `,

    errorTitle: `
        text-2xl
        font-bold
        text-red-300
    `,

    errorText: `
        max-w-lg
        text-sm
        text-[#8B869C]
    `,

    error: `
        w-full
        rounded-md
        border border-red-400/20
        bg-red-500/10
        px-3 py-2
        text-center
        text-sm
        text-red-300
        sm:w-auto
    `,

    link: `
        text-[#A78BFA]
        underline
        underline-offset-4
        transition-colors duration-200
        hover:text-fuchsia-300
    `,

    // Панель управления тредом
    headerActions: `
        ${surface}
        flex w-full max-w-4xl
        flex-col items-center justify-center
        gap-3
        p-4
        shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        backdrop-blur-md
        sm:flex-row
    `,

    // Основной блок
    main: `
        ${surface}
        w-full max-w-4xl
        overflow-hidden
        bg-[#0B0813]/80
        shadow-[0_8px_30px_rgba(0,0,0,0.4)]
    `,

    // Информация о треде
    threadInfo: `
        flex flex-col items-center
        border-b-2 border-[#261F3D]/50
        bg-[#161224]/40
        px-4 py-6
        text-center
        sm:px-8
    `,

    threadTitle: `
        break-words
        text-2xl
        font-bold
        tracking-wide
        text-[#A78BFA]
        sm:text-3xl
    `,

    threadType: `
        mt-2
        rounded-full
        border
        border-[#5A3EC4]/50
        bg-[#161224]/30
        px-3 py-1
        text-sm
        text-[#A78BFA]
    `,

    description: `
        mt-4
        max-w-2xl
        break-words
        text-base
        leading-7
        text-[#8B869C]
    `,

    metadata: `
        mt-3
        text-sm
        text-[#8B869C]
    `,

    // Посты
    posts: `
        flex flex-col
        gap-4
        p-3
        sm:p-5
    `,

    post: `
        ${surface}
        overflow-hidden
        bg-[#161224]/20
        shadow-[0_4px_18px_rgba(0,0,0,0.25)]
        transition-colors duration-200
        hover:border-[#5A3EC4]
    `,

    postHeader: `
        flex flex-col
        gap-1
        border-b-2 border-[#261F3D]/50
        px-4 py-3
        text-left
        sm:flex-row sm:items-center sm:justify-between
    `,

    author: `
        break-words
        font-semibold
        text-[#A78BFA]
    `,

    date: `
        text-xs
        text-[#8B869C]
    `,

    postBody: `
        flex items-start
        gap-3
        px-4 py-4
    `,

    avatar: `
        h-14 w-14
        shrink-0
        rounded-md
        border-2 border-[#261F3D]
        bg-[#0B0813]
        object-cover
    `,

    postText: `
        min-w-0
        flex-1
        break-words
        whitespace-pre-wrap
        text-left
        leading-7
        text-[#E2E0E7]
    `,

    empty: `
        px-4 py-10
        text-center
        text-sm
        text-[#8B869C]
    `,

    // Кнопки
    button: `
        ${interactive}
        inline-flex
        h-10
        w-full
        items-center
        justify-center
        rounded-md
        border-2 border-[#261F3D]
        bg-[#161224]
        px-4
        text-sm
        font-medium
        text-[#E2E0E7]
        hover:border-[#5A3EC4]
        hover:bg-[#261F3D]
        hover:shadow-[0_0_15px_rgba(90,62,196,0.5)]
        sm:w-auto
    `,

    deleteButton: `
        ${interactive}
        rounded-md
        border
        border-red-400/30
        bg-red-500/10
        px-4 py-2
        text-sm
        text-red-300
        hover:border-red-400/60
        hover:bg-red-500/20
        focus:ring-red-400/40
    `,

    bottomActions: `
        flex justify-center
        w-full
        items-center justify-around
        border-t-2 border-[#261F3D]/50
        px-4 py-5
    `,

    topActions: `
        flex justify-center
        w-full
        items-center justify-around
        border-b-2 border-[#261F3D]/50
        px-4 py-5
    `,

    // Форма отправки
    composer: `
        ${surface}
        sticky bottom-3
        flex w-full max-w-4xl
        flex-col
        gap-3
        bg-[#161224]/80
        p-3
        shadow-[0_8px_30px_rgba(0,0,0,0.5)]
        backdrop-blur-md
    `,

    input: `
        ${focusRing}
        min-w-0
        flex-1
        rounded-md
        border-2 border-[#261F3D]
        bg-[#0B0813]/60
        px-4 py-2.5
        text-[#E2E0E7]
        outline-none
        placeholder:text-[#E2E0E7]/40
        disabled:cursor-not-allowed
        disabled:opacity-50
    `,

    // Отдельные элементы страниц

    footerLinks: `
        grid justify-grid-cols-2
        text-sm text-left text-text-muted sm:grid-cols-4
        w-full gap-2
        items-center justify-around
        border-y-2 border-[#261F3D]/50
        px-4 py-5
    `,

    img: `
        w-inherit h-fit 
        border-2 border-[#261F3D]
        disabled:cursor-not-allowed
        disabled:opacity-50
        placeholder:text-[#E2E0E7]/40
        flex-1
        bg-cover
    `
}
