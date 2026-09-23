//COLORS
export const _bg_color_main = `bg-[#382772]/50`
//OTHERS
export const _borders = `${_bg_color_main} border-2 rounded-md border-[#3f2b8a]`
export const _img = `h-25 w-25 border mt-2 border-[#3f2b8a] border-2`
export const _bio = `text-[#f3c4ff] font-bold ${_borders} w-full text-left p-2`
export const _bio_cont = `flex flex-col gap-2 text-[16px] w-full items-start justify-center px-2`
//TEXTS
export const _text = 'text-[#fff7ec] text-wrap'
export const _text_info = `text-center text-[#7e7e7e]`
export const _text_loading = `${_text_info} text-3xl animate-pulse`
export const _text_error = `text-[#a52c2c] text-center text-3xl`
export const _hypertext = `text-purple-500 underline duration-300 transition-all ease-in-out hover:text-fuchsia-400`
//BUTTONS
export const _button = `w-40 px-4 h-10 border-2 rounded-md border-[#3f2b8a] bg-[#382772] text-[#fff7ec] hover:bg-[#3f2b8a] hover:border-[#5a3ec4] hover:shadow-[0_0_15px_rgba(90,62,196,0.5)] transition-all duration-300 ease-in-out cursor-pointer`
export const _button_cont = `w-full flex items-center justify-evenly`

export const _profiles_btn_cont = `${_button_cont} grid grid-cols-2 gap-4 justify-items-center`
export const _profiles_btn = `${_button} w-full text-center`
//INPUTS
export const _inputField = `w-full px-4 py-2 border-2 rounded-md border-[#3f2b8a] bg-[#07091a]/60 text-[#fff7ec] placeholder:text-[#fff7ec]/40 focus:outline-none focus:border-[#5a3ec4] focus:shadow-[0_0_10px_rgba(90,62,196,0.3)] transition-all duration-300`
export const _textareaField = `${_inputField} resize-none h-25`
//CONTAINERS
export const _card = `${_borders} text-center flex flex-col p-5 bg-[#382772]/20 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-full`
export const _container = `${_borders} flex flex-col border p-2 px-2 m-2 w-full`
//GRID ELEMENTS
export const _list_grid = `${_borders} grid grid-cols-4 gap-1 py-2 w-full text-center bg-none`
export const _form_items_grid = `${_borders} grid grid-cols-2 gap-1 p-2 m-5 w-full font-semibold items-center justify-content text-center bg-none`
//HEADER & FOOTER
export const _header = `${_borders} flex flex-col mb-auto w-full items-center justify-between pt-2 pb-2`
export const _footer = `${_borders} flex flex-col border-2 w-full mt-auto mt-4 p-2`
//MAIN ELEMENTS
export const _main = `flex flex-col justify-center items-center p-6 border w-1/2 ${_borders}`
export const _section = `flex flex-col text-2xl w-full text-center justify-center items-center py-2 mb-5 border-b-2 ${_borders}`
export const _body = `${_text} flex flex-col absolute left-0 top-0 items-center justify-around w-screen min-h-screen bg-[#07091a] p-5`

export const _profiles_body = `${_body} justify-center gap-5`