import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/login"
import GeneralLayout from "./components/layouts/generalLayout/generalLayout";


function App() {    
  return(
  <Routes>
    <Route path="/" element={<GeneralLayout />} />
    <Route path="/login" element={<LoginPage />} />

  </Routes>   
  )
}

export default App
