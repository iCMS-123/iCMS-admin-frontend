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

function AdminDashboard() {
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

    const [showModal, setModalShow] = useState(false);
    const [branchName, setBranchName] = useState('it');
    const [hodId, setHodId] = useState(null);
    const [branchList, setBranchList] = useState(null);
    const [hodList, setHodList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingForFilter, setLoadingForFilter] = useState(false);

    const [teachersList, setTeachersList] = useState(null);
    const [teachersListCopy, setTeachersListCopy] = useState(null);
    const [branchSelected, setBranchSelected] = useState('');

    const [teacherDetailsModalShow, setTeacherDetailsModalShow] = useState(false);
    const [teacherDetailsForModal, setTeacherDetailsForModal] = useState(false);
    const [branchDetailsModalShow, setBranchDetailsModalShow] = useState(false);
    const [branchDetailsForModal, setBranchDetailsForModal] = useState(false);
    const [branchNameForHodAssign, setBranchNameForHodAssign] = useState(null);
    const [hodIdForHodAssign, setHodIdForHodAssign] = useState(false);

    function handleShow() {
        setModalShow(true);
    }

    useEffect(() => {
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

    }, []);

    useEffect(() => {
        setLoading(true);
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
                        setTimeout(() => seterror(null), 3000);
                    } else {
                        seterror("Unauthorized User");
                        setTimeout(() => seterror(null), 3000);
                    }
                }
            } catch (e) {
                console.log(e, "e");
                seterror("Unauthorized User");
                setTimeout(() => seterror(null), 3000);
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
                name: branchName,
                hodRef: hodId
            });

            if (data && data.success) {
                setSuccessMessage("Branch created successfully!")
                console.log(data, "branch creation response");
                setBranchList([...branchList, data.data.branchData])
                setSuccess(true);
            }
        } catch (e) {
            console.log(e, "e");
            seterror(e.response.data.msg);
            setTimeout(() => seterror(null), 3000);
        }
    };

    const submitAssignHODForm = async () => {
        try {
            console.log(branchNameForHodAssign, hodIdForHodAssign);
            const { data } = await axios.post(`${url}/api/v1/admin/assign-hod`, {
                branchName: branchNameForHodAssign,
                id: hodIdForHodAssign
            });
            console.log(data, "ddaattaa");
            if (data && data.success) {
                setBranchDetailsModalShow(false)
                let otherBranches = branchList.filter((item) => item.name !== data.data.branchData.name);
                setBranchList([...otherBranches, data.data.branchData])
                setSuccessMessage("HOD assigned successfully!")
                setSuccess(true);
            }
        } catch (e) {
            console.log(e, "e");
            seterror(e.response.data.msg);
            setTimeout(() => seterror(null), 3000);
        }
    };

    useEffect(() => {
        setLoadingForFilter(true);

        const getTeachersListBranchWise = async () => {
            console.log(branchSelected, "bS....");
            try {
                const { data } = await axios.get(`${url}/api/v1/teacher/get-list?branch=${branchSelected}`);

                if (data && data.success) {
                    console.log(data.data.teacherList, "data.data.teacherList");
                    if (data.data.teacherList.length) {
                        setTeachersList(data.data.teacherList);
                        setTeachersListCopy(data.data.teacherList);
                    }
                    else {
                        setTeachersList(null);
                        setTeachersListCopy(null);
                    }

                    setLoadingForFilter(false);
                    // setSuccess(true);
                } else {
                    if (data) {
                        seterror(data.message);
                        setTimeout(() => seterror(null), 3000);
                    } else {
                        seterror("Unauthorized User");
                        setTimeout(() => seterror(null), 3000);
                    }
                }
            } catch (e) {
                console.log(e, "e");
                seterror("Unauthorized User");
                setTimeout(() => seterror(null), 3000);
            }
        };

        getTeachersListBranchWise();
    }, [branchSelected]);

    const filterByName = async (filter) => {
        setBranchSelected(branchSelected);
        let myTeachersList = teachersList.filter((teacher) => {
            return ((teacher.firstName + " " + teacher.lastName).toUpperCase().indexOf(filter.toUpperCase()) > -1)
        })

        console.log(myTeachersList, "myTeachersList");
        if (myTeachersList.length)
            setTeachersListCopy(myTeachersList);
        else
            setTeachersListCopy(null);
    }

    async function getTeacherDetailsAndShowInModal(idx) {
        console.log('getTeacherDetailsAndShowInModal');
        console.log(teachersListCopy, "teachersListCopy");
        setTeacherDetailsForModal(teachersListCopy[idx]);
        setTeacherDetailsModalShow(true);
    }

    async function branchDetailsModalTrigger(idx) {
        console.log('branchDetailsModalTrigger');
        console.log(branchList, "branchList");
        setBranchName(branchList[idx].name);
        setBranchDetailsForModal(branchList[idx]);
        setBranchNameForHodAssign(branchList[idx].name);
        setBranchDetailsModalShow(true);
    }

    async function terminateAccount(teacher_id) {
        //function to terminate teacher's account
        console.log(teacher_id, 'teacher_id for termination');
    }

    return (
        <>
            {error && <Message variant={"danger"}>{error}</Message>}
            {success && (
                <Message variant={"success"}>{successMessage}</Message>
            )}

            <div id={styles.currentBranches}>
                {/* branch fetch logic will come here */}
                <h5 style={{ fontWeight: 'bold' }}>Current Branches</h5>
                {(branchList == null) && <p>Currently there are no branches added.</p>}
                <Row xs={1} md={4} className="g-4">

                    {(branchList != null) &&

                        branchList.map((branch, index) => (
                            <Col>
                                <Card className={styles.branchCards} onClick={e => branchDetailsModalTrigger(index)}>
                                    <Card.Body>
                                        <Card.Title>{branch.name.toUpperCase()}</Card.Title>
                                        {branch.hodRef &&
                                            <div style={{ display: 'flex' }}>
                                                <Image src={branch?.hodRef?.profileImg} roundedCircle={true} style={{ height: "40px", width: '40px' }} className="me-3" />
                                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <b>{branch?.hodRef?.firstName + " " + branch?.hodRef?.lastName}</b>
                                                    <b className="mb-2 text-muted">HOD </b>
                                                </span>
                                            </div>
                                        }
                                        {!branch.hodRef &&
                                            <div style={{ display: 'flex' }}>
                                                <h6 className='pt-3'>No HOD assigned yet!</h6>
                                            </div>
                                        }
                                        {/* <Card.Text>
                                            Some quick example text to build on the card title and make up the
                                            bulk of the card's content.
                                        </Card.Text>
                                        <Card.Link href="#">Card Link</Card.Link>
                                        <Card.Link href="#">Another Link</Card.Link> */}
                                        <div className={styles.gocorner} href="#">
                                            <div className={styles.goarrow}>
                                                →
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>

                {/* Modal (For branch details and HOD update) code starts */}
                <Modal show={branchDetailsModalShow} fullscreen={true} onHide={() => setBranchDetailsModalShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Branch Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* {branchDetailsForModal} */}
                        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                            <div id='left-section' style={{ width: '30%', background: 'linear-gradient(90deg, #1CB5E0 0%, #000851 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <h5>
                                    <Badge bg="secondary" style={{ marginBottom: '20px' }}>
                                        HOD
                                    </Badge>
                                </h5>
                                {!branchDetailsForModal.hodRef &&
                                    <div style={{ display: 'flex' }}>
                                        <h6 className='pt-3'>No HOD assigned yet!</h6>
                                    </div>
                                }
                                {branchDetailsForModal.hodRef &&
                                    <>
                                        <Image src={branchDetailsForModal.hodRef?.profileImg} roundedCircle={true} style={{ height: "100px", width: '100px' }} className="mb-3" />
                                        <h5>{branchDetailsForModal.hodRef?.firstName + " " + branchDetailsForModal.hodRef?.lastName}</h5>


                                        {branchDetailsForModal.hodRef?.isVerified &&
                                            <p>VERIFIED
                                                <FaUserCheck style={{ marginLeft: '10px', color: 'green' }} />
                                            </p>
                                        }
                                        {!branchDetailsForModal.hodRef?.isVerified &&
                                            <p>NOT VERIFIED
                                                <FaUserTimes style={{ marginLeft: '10px', color: 'red' }} />
                                            </p>
                                        }

                                    </>
                                }
                            </div>
                            <div id='right-section' style={{ width: '70%', padding: '10px 20px' }}>
                                <h6>Information</h6>
                                <hr />
                                <div style={{ padding: '10px 20px' }}>
                                    <Row>
                                        <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h6>Branch</h6>
                                            <p className='text-muted'>{branchDetailsForModal.name?.toUpperCase()}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h6>Students</h6>
                                            <p className='text-muted'>{branchDetailsForModal.students?.length}</p>
                                        </Col>
                                        <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h6>Teachers </h6>
                                            <p className='text-muted'>{branchDetailsForModal.teachers?.length}</p>
                                        </Col>
                                    </Row>
                                    <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                        <h6>Update / Assign HOD</h6>

                                        <Form onSubmit={e => submitCreateBranchForm}>

                                            {(hodList != null && hodList != '') ?
                                                (<Form.Group className="mb-3">
                                                    <Form.Label htmlFor="selectHod">Choose Head of Department</Form.Label>
                                                    <Form.Select id="selectHod" onChange={(e) => {setBranchNameForHodAssign(branchDetailsForModal.name); setHodIdForHodAssign(e.target.value) }}>
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
                                            <Button variant="dark" onClick={e => submitAssignHODForm()}>Assign HOD</Button>
                                        </Form>

                                    </Col>

                                </div>

                            </div>
                        </div>

                    </Modal.Body>
                    {/* <Modal.Footer>
                        
                    </Modal.Footer> */}
                </Modal>
                {/* Modal (for branch details) code ends */}

                <Button key={true} className="me-2 mt-3 mb-2" onClick={() => handleShow()} variant="success">Add New Branch</Button>

                {/* Modal code starts */}
                <Modal show={showModal} fullscreen={true} onHide={() => setModalShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Branch</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={submitCreateBranchForm}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="selectBranch">Choose Branch to Create
                                    <FaAsterisk style={{ color: 'red', fontSize: '0.5rem', marginLeft: '10px' }} />
                                </Form.Label>
                                <Form.Select id="selectBranch" onChange={(e) => { setBranchName(e.target.value) }}>
                                    <option value='it'>Information Technology</option>
                                    <option value='cse'>Computer Science Engineering</option>
                                    <option value='ce'>Civil Engineering</option>
                                    <option value='me'>Mechanical Engineering</option>
                                    <option value='ee'>Electrical Engineering</option>
                                    <option value='ece'>Electronics & Communication Engineering</option>
                                </Form.Select>
                            </Form.Group>

                            {(hodList != null && hodList != '') ?
                                (<Form.Group className="mb-3">
                                    <Form.Label htmlFor="selectHod">Choose Head of Department</Form.Label>
                                    <Form.Select id="selectHod" onChange={(e) => { setHodId(e.target.value) }}>
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

                            <Button variant="secondary" className='mt-2' type="submit">
                                Submit
                            </Button>

                        </Form>

                    </Modal.Body>
                </Modal>
                {/* Modal code ends */}

            </div>

            {/* second sec starts */}
            <div id={styles.currentBranches}>
                {/* branch fetch logic will come here */}
                <h5 style={{ fontWeight: 'bold' }}>Teachers</h5>
                {(teachersListCopy == null) && <p className='mt-4'>Currently there are no such registered teachers.</p>}

                <Row>
                    <Col xs={9}>
                        {loadingForFilter ? (
                            <Loader1></Loader1>
                        ) : ('')}

                        <Row xs={1} md={3} className="g-4" id={styles.teachersDiv}>

                            {(teachersListCopy != null) &&

                                teachersListCopy.map((teacher, index) => (
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
                                                        <Button variant="outline-info" size="sm"
                                                            onClick={e => getTeacherDetailsAndShowInModal(index)}
                                                        >
                                                            View Details
                                                        </Button>
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
                                <Button variant="dark" onClick={e => terminateAccount(teacherDetailsForModal._id)}>Terminate Account</Button>
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
            {/* second sec ends */}
        </>
    )
}

export default AdminDashboard