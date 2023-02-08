import React from 'react'
import AdminLogin from './AdminLogin/index'
import AdminPortal from './AdminPortal/index'
import 'bootstrap/dist/css/bootstrap.min.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'

function Combined(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<AdminLogin />} />
                <Route path='/admin/*' element={<AdminPortal />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Combined