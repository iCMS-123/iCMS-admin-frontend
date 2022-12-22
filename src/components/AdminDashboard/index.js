import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Button, Form, Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { url } from '../url'
import DashboardNav from "../Navbar/index";
import Loader1 from "../Loader/Loader-1/index";
import parse from 'html-react-parser';
import Message from "../Message/index";

function AdminDashboard() {
    const navigate = useNavigate();
    const [error, seterror] = useState(null);
    const [success, setSuccess] = useState(false);
    const [user, setuser] = useState(null);

    const localData = localStorage.getItem("iCMSUserInfo");
    const userInfo = localData ? JSON.parse(localData) : null;

    useEffect(() => {
        if (userInfo || user) {
            navigate("/dashboard");
        }
    }, []);

    const [showModal, setModalShow] = useState(false);
    const [createBranchFormFilled, setCreateBranchFormFilled] = useState(false);
    const [branchName, setBranchName] = useState('it');
    const [hodId, setHodId] = useState(null);
    const [hodList, setHodList] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleShow() {
        setModalShow(true);
    }

    useEffect(() => {
        setLoading(true);
        setCreateBranchFormFilled(false);
        console.log(branchName, "branchName");

        const getTeachersList = async () => {
            try {
                const { data } = await axios.get(`${url}/api/v1/teacher/get-list?branch=${branchName}`);

                if (data && data.success) {
                    setLoading(false);
                    setHodList(data.data.teacherList);
                    // setSuccess(true);
                } else {
                    if (data) {
                        seterror(data.message);
                        setTimeout(()=> seterror(null), 3000);                        
                    } else {
                        seterror("Unauthorized User");
                        setTimeout(()=> seterror(null), 3000);
                    }
                }
            } catch (e) {
                console.log(e, "e");
                seterror("Unauthorized User");
                setTimeout(()=> seterror(null), 3000);
            }
        };

        getTeachersList();
        setHodId(null);
        setHodList(null);

    }, [branchName]);

    const submitCreateBranchForm = async (e) => {
        e.preventDefault();
        try {
            setModalShow(false);
            console.log(branchName, hodId);
        	const { data } = await axios.post(`${url}/api/v1/admin/create-branch`, {
        		name : branchName,
                hodRef : hodId
        	});

        	if (data && data.success) {
        		setSuccess(true);
        	}
        } catch (e) {
        	console.log(e, "e");
        	seterror(e.response.data.msg);
            setTimeout(()=> seterror(null), 3000);
        }
    };

    return (
        <div className={styles.maincontainer}>
            <div id={styles.div1}>
                <div id={styles.sidebar}>
                    <img src='/images/icms-logo.png' alt='logo' style={{ height: '40px', position: 'absolute', top: '10px', left: '60px' }} />

                </div>
            </div>

            <div id={styles.div2}>
                <DashboardNav />
                {error && <Message variant={"danger"}>{error}</Message>}
				{success && (
					<Message variant={"success"}>Branch is created successfully</Message>
				)}

                <div id={styles.currentBranches}>
                    {/* branch fetch logic will come here */}
                    <h5 style={{ fontWeight: 'bold' }}>Current Branches</h5>
                    <p>Currently there are no branches added.</p>
                    <Button key={true} className="me-2 mb-2" onClick={() => handleShow()} variant="success">Add New Branch</Button>

                    {/* Modal code starts */}
                    <Modal show={showModal} fullscreen={true} onHide={() => setModalShow(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create New Branch</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={submitCreateBranchForm}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="selectBranch">Choose Branch to Create</Form.Label>
                                    <Form.Select id="selectBranch" onChange={(e) => { setBranchName(e.target.value) }}>
                                        <option value='it'>Information Technology</option>
                                        <option value='cs'>Computer Science Engineering</option>
                                        <option value='ce'>Civil Engineering</option>
                                        <option value='me'>Mechanical Engineering</option>
                                        <option value='ee'>Electrical Engineering</option>
                                        <option value='ece'>Electronics & Communication Engineering</option>
                                    </Form.Select>
                                </Form.Group>

                                {(hodList != null && hodList != '') ?
                                    (<Form.Group className="mb-3">
                                        <Form.Label htmlFor="selectHod">Choose Head of Department</Form.Label>
                                        <Form.Select id="selectHod" onChange={(e) => { setHodId(e.target.value); setCreateBranchFormFilled(true)}}>
                                        <option value=''>Select HOD</option>
                                            { 
                                            hodList.map((option, index) => (
                                                <option key={index} value={option._id}>
                                                  {option.firstName + " " + option.lastName}
                                                </option>
                                              ))
                                             }
                                        </Form.Select>
                                    </Form.Group>)
                                    : parse('<h6 className="mt-3 mb-3"> No Teachers Available for selection for this branch!</h6>')}

                                {loading ? (
                                    <Loader1></Loader1>
                                ) : ('')}

                                {createBranchFormFilled ? <Button variant="success" className='mt-2' type="submit">
                                    Submit
                                </Button> :
                                    <Button variant="danger" className='mt-2' disabled type="submit">
                                        Submit
                                    </Button>
                                }


                            </Form>

                        </Modal.Body>
                    </Modal>
                    {/* Modal code ends */}

                </div>


            </div>

        </div>
    )
}

export default AdminDashboard