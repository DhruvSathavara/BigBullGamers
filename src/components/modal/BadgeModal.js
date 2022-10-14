import React, { useState } from 'react';
import { Modal, Nav } from "react-bootstrap";
import { List } from "@mui/material";

import { ToastContainer, toast } from 'react-toastify';
 
import { useMoralis,   useNewMoralisObject, useMoralisFile, useMoralisCloudFunction } from 'react-moralis';
 

export default function BadgeModal(props) {
    const { user, Moralis, isInitialized } = useMoralis();
    const { saveFile, moralisFile } = useMoralisFile();
    const { isSaving, save, error } = useNewMoralisObject("JoinContest");
    const [show, setShow] = useState(false);
    const [title, setTitle] = React.useState('');
    const [link, setLink] = React.useState('');
    const [videolink, setVideoLink] = React.useState('');

    const JoinCon = Moralis.Object.extend("JoinContest"); 
    const query = new Moralis.Query(JoinCon);


 

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async () => {
        if (!title || !link || !videolink) {
            toast.error("All the fields are require!");
            return;
        }

        const joincontestUser = {
            about: title,
            link: link,
            video: videolink,
        }
        query.equalTo("objectId", props.status.objectId);
        const result = await query.first(); 
        const contestId = props.title.objectId;
        result.set("joincontestUser", joincontestUser);
        result.set("status", "2");
        result.set("contestId", contestId);
        result.set("user", user);
        await result.save().then((monster) => {
            toast.success("Successfully Applied!", monster.message);
        }, (error) => {
            toast.error(error.message);
        });
        setShow(false);

    } 

    return (
        <div className="text-center shadow-xss  d-block d-flex border-0 mx-auto">
            <ToastContainer />
            <button onClick={handleShow}style={{border:'none',}} className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none">Submit</button>
            <Modal  show={show} onHide={handleClose} style={{ overflowY: 'scroll' }}>
                <Modal.Header className='card' closeButton>
                    <Modal.Title className='h4' style={{ fontWeight: "600" }}>{props.title.contestData.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='card' style={{ padding: "0" }}>
                    <List
                        sx={{
                            width: "100%",
                            padding: "10px 0px",
                            bgcolor: "background.paper",
                            overflowX: "hidden",
                        }}
                        className='card'
                    >

                        <div className="form-group icon-input   p-2">
                            <input onChange={(e) => setTitle(e.target.value)} type="text" className="h4  style2-input ps-3  form-control text-grey-900 font-xsss fw-600 " placeholder="About" />
                        </div>

                        <div className="form-group icon-input  p-2">
                            <input onChange={(e) => setLink(e.target.value)} type="text" className="h4 style2-input ps-3  form-control text-grey-900 font-xsss fw-600 " placeholder="Github / Google drive link" />
                        </div>

                        <div className="form-group icon-input  p-2">
                            <input onChange={(e) => setVideoLink(e.target.value)} type="text" className="h4 style2-input ps-3  form-control text-grey-900 font-xsss fw-600 " placeholder="Demo video link" />
                        </div>
                    </List>
                </Modal.Body>
                <Modal.Footer className='theme-dark-bg'>
                    <button style={{border:'none',}} className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none" onClick={handleSubmit} >
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>

        </div >
    );
}
