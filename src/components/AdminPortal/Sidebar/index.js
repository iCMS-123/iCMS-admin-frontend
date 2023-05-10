import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
    return (
        <div id={styles.sidebar}>
            <img src='/images/icms-logo.png' alt='logo' style={{ height: '40px', position: 'absolute', top: '10px', left: '60px' }} />

            <div style={{ padding: '75px 20px', }}>
                <Link to="dashboard" style={{ textDecoration: "none", color: "black", marginBottom: '30px' }}>
                    <h5>Dashboard</h5>
                </Link>
                <Link to="unverified-teachers" style={{ textDecoration: "none", color: "black", marginBottom: '30px' }}>
                    <h5>Unverified Teachers</h5>
                </Link>
                <Link to="issues" style={{ textDecoration: "none", color: "black", marginBottom: '30px' }}>
                    <h5>Issues</h5>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar