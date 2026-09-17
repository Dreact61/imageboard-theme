import { StrictMode } from "react";
import {createRoot} from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router";

import MainPage from "./frontend/Pages/mainPage";
import BoardPage from "./frontend/Pages/boardPage";
import BoardCreateionPage from "./frontend/Pages/boardCreationPage";
import RegisterPage from "./frontend/Pages/userRegisterPage";
import LoginPage from "./frontend/Pages/userLoginPage";
import ProfilePage from "./frontend/Pages/profilePage";

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}></Route>
                <Route path="/boards/create" element={<BoardCreateionPage/>}></Route>
                <Route path="/boards/:board_mark" element={<BoardPage/>}></Route>

                <Route path="/register" element={<RegisterPage />}></Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/users/:user_id" element={<ProfilePage />}></Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
  )  
})