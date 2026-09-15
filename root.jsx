import { StrictMode } from "react";
import {createRoot} from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router";

import MainPage from "./frontend/Pages/mainPage";
import BoardPage from "./frontend/Pages/boardPage";

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}></Route>
                <Route path="/boards/:board_mark" element={<BoardPage/>}></Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
  )  
})