import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge } from 'react-bootstrap'
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { url } from '../url'
import Loader1 from "../Loader/Loader-1/index";
import parse from 'html-react-parser';
import Message from "../Message/index";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminNav from './Navbar/index'
import AdminSidebar from './Sidebar/index'
import AdminDashboard from '../AdminDashboard/index'
import UnverifiedTeachers from '../UnverifiedTeachers/index'

function AdminPortal() {
    return (
        <div className={styles.maincontainer}>
            <AdminSidebar />
            <div id={styles.div2}>
                <AdminNav />
                <Routes>
                    <Route path='dashboard' element={<AdminDashboard />} />
                    <Route path='unverified-teachers' element={<UnverifiedTeachers />} />
                </Routes>
            </div>
        </div>
    )
}

export default AdminPortal