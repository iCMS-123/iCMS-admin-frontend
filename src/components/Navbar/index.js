import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { Button, Nav, Navbar } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';

function DashboardNav(params) {
    const navigate = useNavigate();

    function logoutUser() {
        localStorage.removeItem("iCMSUserInfo");
        navigate('/');
    }

    return(<div id={styles.navbar}>
        <Navbar>
            <Nav>
                <Link to="/dashboard" style={{textDecoration : 'none', fontWeight : 'bold'}}>
                    <Nav.Item>
                        <Nav.Link>Dashboard</Nav.Link>
                    </Nav.Item>
                </Link>
            </Nav>
            <Nav className="justify-content-end" style={{ width: "100%" }}
                activeKey="/home"
                onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
            >

                <Nav.Item className="ml-auto">
                    <Nav.Link onClick={(e) => {
                        logoutUser();
                    }}>
                        Logout
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>

    </div>);
}

export default DashboardNav