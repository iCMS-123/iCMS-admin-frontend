import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {url} from '../url'
import Message from "../Message/index";

function AdminLogin() {
    const [passcode, setpasscode] = useState("");
    const [error, seterror] = useState(null);
	const [success, setSuccess] = useState(false);
	const [user, setuser] = useState(null);

    const navigate = useNavigate();

    const localData = localStorage.getItem("iCMSUserInfo");
	const userInfo = localData ? JSON.parse(localData) : null;

	useEffect(() => {
		if (userInfo || user) {
			navigate("/admin/dashboard");
		}
	}, []);

	if (error) {
		setTimeout(() => {
			seterror(null);
		}, 3000);
	}

    const submitLogin = async (e) => {
		e.preventDefault();
        console.log("hello");
		try {
			const { data } = await axios.post(`${url}/api/v1/admin/auth`, {
				passCode : passcode,
			});

            console.log(data, "data");

			if (data && data.success) {
				localStorage.setItem(
					"iCMSUserInfo",
					JSON.stringify(data.data)
				);
				setSuccess(true);
				setuser(data.data);
                navigate('/admin/dashboard');
			} else {
				if (data) {
					seterror(data.message);
				} else {
					seterror("Unauthorized User");
				}
			}
		} catch (e) {
			console.log(e, "e");
			seterror("Unauthorized User");
		}
	};

    return (
        <div className={styles.maincontainer}>

            <img src='/images/icms-logo.png' alt='logo' style={{ height: '40px', position: 'relative', top: '30px', left: '30px' }} />
            <div id={styles.div1}>
                <p style={{ fontSize: '2rem' }}>Login to <strong>iCMS</strong></p>
                <p className="mb-4">Welcome back <b>Admin </b>! <br /> We have plenty of things awaiting your review.</p>
				
				{error && <Message variant={"danger"}>{error}</Message>}
				{success && (
					<Message variant={"success"}>Loggedin Successfully</Message>
				)}

                <Form onSubmit={submitLogin}>
                    <Form.Group className="mb-3" controlId="formBasicPasscode">
                        <Form.Label>Passcode</Form.Label>
                        <Form.Control type="passcode" placeholder="Enter pass code" value={passcode}
								required
								onChange={(e) => {
									setpasscode(e.target.value);
								}}/>
                        <Form.Text className="text-muted">
                            We'll never share your details with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Sign In
                    </Button>


                </Form>
            </div>

            <div id={styles.div2}>

            </div>

        </div>
    )
}

export default AdminLogin