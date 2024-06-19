import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home/Home.tsx";
import Register from "./User/Register.tsx";
import Login from "./User/Login.tsx";
import CreateWedding from "./CreateWedding/CreateWedding.tsx";
import Header from "./Header/Header.tsx";
import MainPage from "./Wedding/Main/MainPage.tsx";
import AppInfo from "./Wedding/EditInfoWedding/AppInfo.tsx";
import Logout from "./User/Logout.tsx";
import "./styles.css"
import ConfirmationForm from "./Confirmation/ConfirmationForm.tsx";
import AppGuests from "./Wedding/Guests/AppGuests.tsx";
import AppTables from "./Wedding/Tables/AppTables.tsx";
import ListWeddings from "./AdminWeddings/ListWeddings.tsx";
import { Box } from "@mui/material";

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Box id='containerDefault'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/createWedding" element={<CreateWedding />} />
          <Route path="/wedding/:id" element={<MainPage />} />
          <Route path="/wedding/info/:id" element={<AppInfo />} />
          <Route path="/wedding/info/:id/:tab" element={<AppInfo />} />
          <Route path="/wedding/guests/:id" element={<AppGuests />} />
          <Route path="/confirmation/:id" element={<ConfirmationForm />} />
          <Route path="/adminWeddings" element={<ListWeddings />} />
          <Route path="/wedding/tables/:id" element={<AppTables />} />
        </Routes >
      </Box>
    </BrowserRouter >
  )
}

export default App
