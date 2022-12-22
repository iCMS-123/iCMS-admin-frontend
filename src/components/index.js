import React from 'react'
import AdminLogin from './AdminLogin/index'
import AdminDashboard from './AdminDashboard/index'
import 'bootstrap/dist/css/bootstrap.min.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'

function Combined(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<AdminLogin />} />
                <Route path='/dashboard' element={<AdminDashboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Combined