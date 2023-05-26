import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  Button,
  Form,
  Modal,
  Card,
  Image,
  Col,
  Row,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../url";
import Loader1 from "../Loader/Loader-1/index";
import parse from "html-react-parser";
import Message from "../Message/index";

function AdminIssues() {
  const navigate = useNavigate();
  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [user, setuser] = useState(null);
  const [issuesData, setIssuesData] = useState([]);
  const [activeIssues, setActiveIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  // For issue Modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueModalData, setIssueModalData] = useState({});
  const handleIssueModalClose = () => setShowIssueModal(false);
  const handleIssueModalShow = () => setShowIssueModal(true);
  const localData = localStorage.getItem("iCMSUserInfo");
  // console.log(JSON.parse(localData), 'whole localstorage');
  const userInfo = localData ? JSON.parse(localData) : null;
  // console.log(userInfo);

  function handleIssueModal(index) {
    const target = issuesData[index];
    console.log(target);
    setIssueModalData(target);
    handleIssueModalShow(true);
  }

  useEffect(() => {
    if (!userInfo && !user) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const getClassroomData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8002/api/v1/admin/get-issues`
        );
          console.log(data);
        if (data && data.success) {
          let allIssues = data.data;
          setIssuesData(allIssues);
          setActiveIssues(allIssues.filter((issue) => !issue.isAttended));
          setResolvedIssues(allIssues.filter((issue) => issue.isAttended));
        }
      } catch (e) {
        console.log(e, "e");
      }
    };
    getClassroomData();
  }, []);

  async function handleIssueStatusModal(decision) {
    try {
      const { data } = await axios.put(
        `http://localhost:8002/api/v1/admin/resolve-issue`,
        {
          issueId: issueModalData._id,
          status: decision,
        }
      );
      console.log(data, "data")
      if (data.success) {
        if (decision === true) {
          setSuccess(true);
          setSuccessMessage("Issue Resolved!");
          setTimeout(() => setSuccess(false), 5000);
          let allIssues = data.data.issues;
          console.log(allIssues, "all issues")
          // setIssuesData(allIssues);
          // setActiveIssues(allIssues.filter((issue) => !issue.isAttended))
          // setResolvedIssues(allIssues.filter((issue) => issue.isAttended))
        } else {
          seterror("Issue Rejected!");
          setTimeout(() => seterror(null), 3000);
        }
      }
      console.log(data.data.issues, "heloo");
      setIssuesData(data.data.issues);
    } catch (err) {
      console.log(error);
    }
    handleIssueModalClose();
  }

  return (
    <>
      {error && <Message variant={"danger"}>{error}</Message>}
      {success && <Message variant={"success"}>{successMessage}</Message>}

      <div id={styles.currentBranches}>
        {/* branch fetch logic will come here */}
        <h5 style={{ fontWeight: "bold" }}>Active Issues</h5>
        <section className="active-issues-section">
          <div className="active-issues-container">
            {activeIssues?.length < 1 && <p>No active issues, Hurray!</p>}
            {activeIssues?.map((issue, idx) => {
              return (
                <div key={idx} className="card issue-card">
                  <div className="card-body">
                    <Badge
                      style={{ float: "right" }}
                      bg={
                        (issue.priority == 1 && "danger") ||
                        (issue.priority == 2 && "primary") ||
                        (issue.priority == 3 && "warning")
                      }
                    >
                      {(issue.priority == 1 && "High") ||
                        (issue.priority == 2 && "Low") ||
                        (issue.priority == 3 && "Medium")}
                    </Badge>
                    <div className="d-flex justify-content-between mt-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            issue.issueSubmittedByStudent?.profileImg ||
                            "https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png"
                          }
                          alt="profile"
                          className="rounded-circle"
                          style={{ width: "60px", height: "60px" }}
                        />
                        <div className="ms-3">
                          <p className="mb-0">
                            {" "}
                            {issue.issueSubmittedByStudent?.firstName +
                              " " +
                              issue.issueSubmittedByStudent?.lastName ||
                              "Full Name"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <h5 className="card-title">
                      {" "}
                      {issue.title || "title to be added"}
                    </h5>
                    <p className="card-text">
                      {issue.issueMsg.slice(0, 50) + "..."}{" "}
                    </p>
                    <a
                      href="#"
                      className="btn btn-primary"
                      onClick={() => {
                        handleIssueModal(idx);
                      }}
                    >
                      View Issue
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View Issue Card Modal*/}

          <Modal
            id="unresolved-issues"
            show={showIssueModal}
            onHide={handleIssueModalClose}
          >
            <Modal.Header closeButton>
              <Modal.Title>{issueModalData.title || "Title"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h6>
                Submitted By :{" "}
                {issueModalData.issueSubmittedByStudent?.firstName +
                  " " +
                  issueModalData.issueSubmittedByStudent?.lastName ||
                  "Full Name"}
              </h6>
              <p>
                Description : {issueModalData.issueMsg || "Issue Description"}
              </p>
            </Modal.Body>
            {!issueModalData.isAttended && (
              <Modal.Footer
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  onClick={() => {
                    handleIssueStatusModal(true);
                  }}
                  variant="success"
                >
                  Resolve
                </Button>
                <Button
                  onClick={() => {
                    handleIssueStatusModal(false);
                  }}
                  variant="danger"
                >
                  Reject
                </Button>
              </Modal.Footer>
            )}
          </Modal>
        </section>
        {/* Resolved issues */}
        <h5>Resolved Issues</h5>
        <section className="active-issues-section">
          <div className="active-issues-container">
            {resolvedIssues?.length < 1 && (
              <p>No resolved issue, checkout active issues</p>
            )}
            {resolvedIssues?.map((issue, idx) => {
              return (
                <div key={idx} className="card issue-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <Badge bg="success">Resolved</Badge>
                      <Badge
                        bg={
                          (issue.priority == 1 && "danger") ||
                          (issue.priority == 2 && "primary") ||
                          (issue.priority == 3 && "warning")
                        }
                      >
                        {(issue.priority == 1 && "High") ||
                          (issue.priority == 2 && "Low") ||
                          (issue.priority == 3 && "Medium")}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            issue.issueSubmittedByStudent?.profileImg ||
                            "https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png"
                          }
                          alt="profile"
                          className="rounded-circle"
                          style={{ width: "60px", height: "60px" }}
                        />
                        <div className="ms-3">
                          <p className="mb-0">
                            {" "}
                            {issue.issueSubmittedByStudent?.firstName +
                              " " +
                              issue.issueSubmittedByStudent?.lastName ||
                              "Full Name"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <h5 className="card-title">
                      {" "}
                      {issue.title || "title to be added"}
                    </h5>
                    <p className="card-text">
                      {issue.issueMsg.slice(0, 50) + "..."}{" "}
                    </p>
                    <a
                      href="#"
                      className="btn btn-primary"
                      onClick={() => {
                        handleIssueModal(idx);
                      }}
                    >
                      View Issue
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Same modal is being used to show details of resolved issues */}
        </section>
      </div>
      {/* second sec ends */}
    </>
  );
}

export default AdminIssues;
