import React, { useState } from "react";
import { Modal, Nav } from "react-bootstrap";
// import "./modal.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { Button } from "react-bootstrap";
import { ToggleButton } from "@mui/material";


export default function FollowerModal() {
    const [selected, setSelected] = React.useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div className="d-flex justify-content-start " style={{padding: '0px 0px 20px 130px  '}}>
            <Nav.Link variant="primary" onClick={handleShow}  style={{padding: '0 10px'}}>
                <a className="fw-700  ">
                    <span className="font-xssss text-grey-500 mt-1  mx-2">
                        200
                    </span>
                    Followers
                </a>
                {/* Followers
          <span>200</span> */}
            </Nav.Link>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton></Modal.Header>
                {/* <Modal.Body>Woohoo,!</Modal.Body> */}
                <Modal.Title style={{ fontWeight: "600" }}>aa</Modal.Title>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* following-----------------------------------------------------------------> */}
            <Nav.Link variant="primary" onClick={handleShow}  style={{padding: '0 10px'}}>
            <a className="fw-700  ">
                    <span className="font-xssss text-grey-500 mt-1  mx-2">
                        200
                    </span>
                    Following
                </a>
            </Nav.Link>
            <Modal show={show} onHide={handleClose}>
                {/*  behind */}
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: "600" }}>Followers</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: "0" }}>
                    <List
                        sx={{
                            width: "100%",
                            padding: "10px 0px",
                            bgcolor: "background.paper",
                            height: "200px",
                            overflowX: "hidden",
                        }}
                    >
                        <ListItem
                            secondaryAction={
                                <ToggleButton
                                    style={{ color: "blue", border: "1px solid blue" }}
                                    value="check"
                                    selected={selected}
                                    onChange={() => {
                                        setSelected(!selected);
                                    }}
                                    className="follow-btn"
                                >
                                    {!selected ? "Follow" : "Followed"}
                                    <PersonAddAltOutlinedIcon  className="mx-1"/>
                                </ToggleButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar></Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Disha" secondary={"Secondary text"} />
                        </ListItem>
                        <Divider />
                        <ListItem />
                        {/*  */}
                        <ListItem
                            secondaryAction={
                                <ToggleButton
                                    style={{ color: "blue", border: "1px solid blue" }}
                                    className="follow-btn"
                                    value="check"
                                    selected={selected}
                                    onChange={() => {
                                        setSelected(!selected);
                                    }}
                                >
                                    {!selected ? "Follow" : "Followed"}{" "}
                                    <PersonAddAltOutlinedIcon className="mx-1"/>
                                </ToggleButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar></Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="2" secondary={"Secondary text"} />
                        </ListItem>
                        <Divider />
                        {/* button */}
                        <ListItem
                            secondaryAction={
                                <ToggleButton
                                    style={{ color: "blue", border: "1px solid blue" }}
                                    // className="followedBtn"
                                    value="check"
                                    selected={selected}
                                    onChange={() => {
                                        setSelected(!selected);
                                    }}
                                >
                                    {!selected ? "Follow" : "Followed"}{" "}
                                    <PersonAddAltOutlinedIcon className="mx-1"/>
                                </ToggleButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar></Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="3" secondary={"Secondary text"} />
                        </ListItem>
                        {/* button */}
                    </List>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button> 
                </Modal.Footer>
            </Modal>
        </div>
    );
} 