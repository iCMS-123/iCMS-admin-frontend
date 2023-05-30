import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge } from 'react-bootstrap'
import { FaSearch, FaUserCheck, FaUserTimes, FaCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { url } from '../url'
import Loader1 from "../Loader/Loader-1/index";
import parse from 'html-react-parser';
import Message from "../Message/index";

function UnverifiedTeachers() {
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


    const [branchList, setBranchList] = useState(null);
    const [loadingForFilter, setLoadingForFilter] = useState(false);
    const [teacherDetailsModalShow, setTeacherDetailsModalShow] = useState(false);
    const [teacherDetailsForModal, setTeacherDetailsForModal] = useState(false);
    const [branchSelected, setBranchSelected] = useState('');
    const [unverifiedTeachersList, setUnverifiedTeachersList] = useState(null);
    const [unverifiedTeachersListCopy, setUnverifiedTeachersListCopy] = useState(null);

    const getUnverifiedTeachersListBranchWise = async () => {
        try {
            const { data } = await axios.get(`${url}/api/v1/admin/get-unverified-teacher?branchName=${branchSelected}`);
            console.log(data, "dataaaaaaaaaaa");
            if (data && data.success) {
                if (data.data.teacherList.length) {
                    setUnverifiedTeachersList(data.data.teacherList);
                    setUnverifiedTeachersListCopy(data.data.teacherList);
                }
                else {
                    setUnverifiedTeachersList(null);
                    setUnverifiedTeachersListCopy(null);
                }
                console.log(data, "data");
                setLoadingForFilter(false);
                // setSuccess(true);
            }
        } catch (e) {
            console.log(e, "e");
            seterror(e.message);
            setTimeout(() => seterror(null), 3000);
        }

        setLoadingForFilter(false);
    };

    useEffect(() => {
        setLoadingForFilter(true);

        const getBranchList = async () => {
            try {
                const { data } = await axios.get(`${url}/api/v1/admin/get-branch-list`);

                if (data && data.success) {
                    // setSuccess(true);
                    setBranchList(data.data.branchList);
                    console.log(branchList, "Branch LIST");
                }
            } catch (e) {
                console.log(e, "e");
                seterror(e.response.data.msg);
                setTimeout(() => seterror(null), 3000);
            }
        };

        getBranchList();

        getUnverifiedTeachersListBranchWise();
    }, [branchSelected]);

    const filterByName = async (filter) => {
        setBranchSelected(branchSelected);
        let myTeachersList = unverifiedTeachersList.filter((teacher) => {
            return ((teacher.firstName + " " + teacher.lastName).toUpperCase().indexOf(filter.toUpperCase()) > -1)
        })

        console.log(myTeachersList, "myTeachersList");
        if (myTeachersList.length)
            setUnverifiedTeachersListCopy(myTeachersList);
        else
            setUnverifiedTeachersListCopy(null);
    }

    async function getTeacherDetailsAndShowInModal(idx) {
        console.log('getTeacherDetailsAndShowInModal');
        console.log(unverifiedTeachersList, "unverifiedTeachersList");
        setTeacherDetailsForModal(unverifiedTeachersListCopy[idx]);
        setTeacherDetailsModalShow(true);
    }

    async function terminateAccount(teacher_id) {
        //function to terminate teacher's account
        console.log(teacher_id, 'teacher_id for termination');
    }

    async function setTeacherVerified(teacher_id) {
        //function to verify teacher's account
        console.log(teacher_id, 'teacher_id for verification');

        try {
            const { data } = await axios.put(`http://localhost:8002/api/v1/admin/verify-teacher/${teacher_id}`);
            if (data && data.success) {
                console.log(data, "verified teacher response");
                setSuccess(true);
                setSuccessMessage("Teacher verified successfully!");
                setTeacherDetailsModalShow(false); getUnverifiedTeachersListBranchWise();
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (e) {
            console.log(e, "e");
            seterror(e.response.data.msg);
            setTimeout(() => seterror(null), 3000);
        }
    }

    return (
        <>
            {error && <Message variant={"danger"}>{error}</Message>}
            {success && (
                <Message variant={"success"}>{successMessage}</Message>
            )}

            <div id={styles.unverifiedBox}>
                <h5 style={{ fontWeight: 'bold' }}>Unverified Teachers</h5>
                {(unverifiedTeachersListCopy == null) && <p className='mt-4'>Currently there are no unverified teachers.</p>}

                <Row>
                    <Col xs={9}>
                        {loadingForFilter ? (
                            <Loader1></Loader1>
                        ) : ('')}

                        <Row xs={1} md={2} className="g-4" id={styles.teachersDiv}>

                            {(unverifiedTeachersListCopy != null) &&

                                unverifiedTeachersListCopy.map((teacher, index) => (
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <div style={{ display: 'flex', }}>
                                                    {teacher.isHod && <Badge bg="dark" style={{ position: 'absolute', top: '10px', right: '30px' }}>
                                                        HOD
                                                    </Badge>}
                                                    {teacher.isVerified && <FaUserCheck style={{ position: 'absolute', top: '10px', right: '10px', color: 'green' }} />}
                                                    {!teacher.isVerified && <FaUserTimes style={{ position: 'absolute', top: '10px', right: '10px', color: 'red' }} />}

                                                    <Image src={teacher.profileImg} rounded={true} style={{ height: "90px", width: 'auto' }} className="me-3" />
                                                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <b className="text-muted">{teacher.branchName.toUpperCase()}</b>
                                                        <b className="mb-2">{teacher.firstName + " " + teacher.lastName}</b>
                                                        <span>
                                                            <Button variant="outline-info" size="sm"
                                                                onClick={e => getTeacherDetailsAndShowInModal(index)}
                                                            >
                                                                View Details
                                                            </Button>
                                                            <Button variant="success" size="sm" style={{ width: 'fit-content', marginLeft: '15px' }}
                                                                onClick={e => setTeacherVerified(teacher._id)}
                                                            >
                                                                <FaCheck />
                                                            </Button>
                                                        </span>
                                                    </span>
                                                </div>
                                                {/* <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
        </Card.Text>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link> */}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </Row>
                        {/* Modal code starts */}
                        <Modal show={teacherDetailsModalShow} fullscreen={true} onHide={() => setTeacherDetailsModalShow(false)}>
                            <Modal.Header closeButton>
                                {/* <Modal.Title>Teacher's Details</Modal.Title> */}
                            </Modal.Header>
                            <Modal.Body>
                                <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                                    <div id='left-section' style={{ width: '30%', background: 'linear-gradient(90deg, #1CB5E0 0%, #000851 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        <h5>
                                            {teacherDetailsForModal.isHod && <Badge bg="secondary" style={{ marginBottom: '20px' }}>
                                                HOD
                                            </Badge>}
                                        </h5>
                                        <Image src={teacherDetailsForModal.profileImg} roundedCircle={true} style={{ height: "100px", width: '100px' }} className="mb-3" />
                                        <h5>{teacherDetailsForModal.firstName + " " + teacherDetailsForModal.lastName}</h5>
                                        <h5> {teacherDetailsForModal.branchName?.toUpperCase()}</h5>
                                    </div>
                                    <div id='right-section' style={{ width: '70%', padding: '10px 20px' }}>
                                        <h6>Information</h6>
                                        <hr />
                                        <div style={{ padding: '10px 20px' }}>
                                            <Row>
                                                <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <h6>First Name </h6>
                                                    <p className='text-muted'>{teacherDetailsForModal.firstName}</p>
                                                </Col>
                                                <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <h6>Last Name </h6>
                                                    <p className='text-muted'>{teacherDetailsForModal.lastName}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <h6>Email </h6>
                                                    <p className='text-muted'>{teacherDetailsForModal.email}</p>
                                                </Col>
                                                <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <h6>Verification Status</h6>

                                                    {teacherDetailsForModal.isVerified &&
                                                        <p className='text-muted'>Verified
                                                            <FaUserCheck style={{ marginLeft: '10px', color: 'green' }} />
                                                        </p>
                                                    }
                                                    {!teacherDetailsForModal.isVerified &&
                                                        <p className='text-muted'>Not Verified
                                                            <FaUserTimes style={{ marginLeft: '10px', color: 'red' }} />
                                                        </p>
                                                    }

                                                </Col>
                                            </Row>
                                            <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                                <h6>College ID</h6>
                                                <Image src={teacherDetailsForModal.collegeIdCard || 'https://picturedensity.com/wp-content/uploads/2019/06/Polytechnicollege-id-card.jpg'} style={{ height: "auto", width: 'auto', maxWidth: '300px' }} className="mt-2" />
                                            </Col>

                                        </div>

                                    </div>
                                </div>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="success" onClick={e => setTeacherVerified(teacherDetailsForModal._id)}>Verify Account</Button>
                                <Button variant="dark" disabled onClick={e => terminateAccount(teacherDetailsForModal._id)}>Terminate Account</Button>
                            </Modal.Footer>
                        </Modal>
                        {/* Modal code ends */}

                    </Col>
                    <Col className="ms-2">
                        <h5>Search Teachers</h5>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Enter Teacher's Name"
                                aria-label="searchBox"
                                aria-describedby="basic-addon2"
                                onChange={e => { filterByName(e.target.value) }}
                            />
                            <InputGroup.Text id="basic-addon2"> <FaSearch /> </InputGroup.Text>
                        </InputGroup>

                        <h5>Filter </h5>
                        <div>
                            <Form.Check
                                type={`radio`}
                                id={`${''}`}
                                name={`teachersFilter`}
                                label={`All Branches`}
                                onChange={(e) => { setBranchSelected(e.target.id) }}
                            />
                            {(branchList != null) &&
                                branchList.map((branch, index) => (
                                    <Form.Check
                                        type={`radio`}
                                        id={`${branch.name}`}
                                        name={`teachersFilter`}
                                        label={`${branch.name.toUpperCase()}`}
                                        onChange={(e) => { setBranchSelected(e.target.id) }}
                                    />
                                ))
                            }
                        </div>

                    </Col>
                </Row>

            </div>

        </>
    )
}

export default UnverifiedTeachers