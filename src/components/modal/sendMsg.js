import { Button, Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-bootstrap';
import { useMoralis, useMoralisFile } from "react-moralis";
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Link, NavLink, useHistory } from 'react-router-dom';

function SendMsg(props) {
    const history = new useHistory();
    const { saveFile, moralisFile } = useMoralisFile();
    const { user, Moralis, isInitialized } = useMoralis();
    const [open, setOpen] = useState(false);
    const [message, setMessages] = React.useState('');
    const [isUpdated, setIsUpdated] = useState(false);

    const Msg = Moralis.Object.extend("Messages");
    const msg = new Msg();


    const handleOpen = () => history.push({
        pathname: "/defaultmessage",
        state: {
            id: props.data
        }
    });
    const handleSumitClose = () => setOpen(false);

    const handleSubmit = async () => {
        history.push({
            pathname: "/defaultmessage",
            state: {
                response: props.data
            }
        });
        history.push("/defaultmessage", { state: 'sample data' });
        // console.log(message, "message");
        // msg.set("message", message);
        // msg.set("sender", user.id);
        // msg.set("reciever", props.data);
        // await msg.save();
        // setIsUpdated(!isUpdated);
        // setOpen(false);
    }


  

    useEffect(() => {

    }, [isUpdated, props]); 

    return (
        <div className="">
            <ToastContainer />
            <a style={{ height: '50px', width: '50px' }} className="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700" onClick={handleOpen}><i className="feather-mail font-md"></i></a>
            <Modal show={open} onHide={handleSumitClose} style={{ overflowY: 'scroll' }}>
                <Modal.Header className="card" closeButton >
                    <Modal.Title className="h4" style={{ fontWeight: "600" }}> Send Message</Modal.Title>
                </Modal.Header>
                <Modal.Body className="card " style={{ padding: "20px" }}>

                    <div className='d-flex justify-content-between mt-2'>
                        <div className="p-0">
                            < div className="avatar me-3"><img src={user != null ? user.attributes['Avatar'] : "assets/images/user.png"} alt={"username"} className="shadow-sm rounded-circle w35" /></ div>
                        </div>
                        <form className="col-10 header-search ms-3 d-flex align-items-center">
                            <div className="form-group mb-0 icon-input w-100">
                                <input onChange={(e) => setMessages(e.target.value)} type="text" placeholder="Write a message.." className="bg-grey border-0  pt-2 pb-2  font-xssss fw-500  rounded-xl theme-dark-bg h4" style={{ width: "100%" }} />
                            </div>
                            <IconButton onClick={handleSubmit}>
                                <SendIcon
                                    className="mx-2 h4"
                                />
                            </IconButton>
                        </form>
                    </div>

                </Modal.Body>
                {/* <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Update
                    </button>
                </Modal.Footer> */}
            </Modal>
        </div >
    );
}

export default SendMsg;
