import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge } from 'react-bootstrap'
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { url } from '../url'
import Loader1 from "../Loader/Loader-1/index";
import parse from 'html-react-parser';
import Message from "../Message/index";

function AdminIssues() {
    const navigate = useNavigate();
    const [error, seterror] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [user, setuser] = useState(null);

    const localData = localStorage.getItem("iCMSUserInfo");
    const userInfo = localData ? JSON.parse(localData) : null;

    useEffect(() => {
        if (!userInfo && !user) {
            navigate("/");
        }
    }, []);


    return (
        <>
            {error && <Message variant={"danger"}>{error}</Message>}
            {success && (
                <Message variant={"success"}>{successMessage}</Message>
            )}

            <div id={styles.currentBranches}>
                {/* branch fetch logic will come here */}
                <h5 style={{ fontWeight: 'bold' }}>Active Issues</h5>

            </div>
            {/* second sec ends */}
        </>
    )
}

export default AdminIssues