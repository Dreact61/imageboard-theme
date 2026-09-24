import { StrictMode } from "react";
import {createRoot} from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router";

import MainPage from "./frontend/Pages/mainPage";
import BoardPage from "./frontend/Pages/boardPage";
import BoardCreateionPage from "./frontend/Pages/boardCreationPage";
import RegisterPage from "./frontend/Pages/userRegisterPage";
import LoginPage from "./frontend/Pages/userLoginPage";
import ProfilePage from "./frontend/Pages/profilePage";
import MyProfilePage from "./frontend/Pages/myProfilePage";
import EditProfilePage from "./frontend/Pages/editProfilePage";
import ThreadCreationPage from "./frontend/Pages/threadCreationPage";
import ThreadPage from "./frontend/Pages/threadPage";
import EditBoardPage from "./frontend/Pages/editBoardPage";
import EditThreadPage from "./frontend/Pages/editThreadPage";

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}></Route>

                <Route path="/boards/create" element={<BoardCreateionPage/>}></Route>
                <Route path="/boards/:board_mark" element={<BoardPage/>}></Route>
                <Route path="/boards/:board_mark/edit" element={<EditBoardPage />}></Route>

                <Route path="/boards/:board_mark/threads/create" element={<ThreadCreationPage />}></Route>
                <Route path="/boards/:board_mark/threads/:thread_id" element={<ThreadPage />}></Route>
                <Route path="/boards/:board_mark/threads/:thread_id/edit" element={<EditThreadPage />}></Route>

                <Route path="/my-profile" element={<MyProfilePage />}></Route>
                <Route path="/my-profile/edit" element={<EditProfilePage />}></Route>
                <Route path="/register" element={<RegisterPage />}></Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/users/:user_id" element={<ProfilePage />}></Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
  )  
})