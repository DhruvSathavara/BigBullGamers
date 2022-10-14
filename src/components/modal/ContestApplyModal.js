import { Button, Modal } from '@mui/material';
import React, { useState } from 'react';
import { ToastContainer } from 'react-bootstrap';

 function ContestApplyModal( ) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleSumitClose = () => setOpen(false);

    const handleSubmit = () => {
        console.log("success");
    }
    return (
        <div className="">
            <ToastContainer />
            <Button className=" contest" onClick={handleOpen}> title</Button>
            <Modal show={open} className='theme-dark-bg' onHide={handleSumitClose} style={{ overflowY: 'scroll' }}>
                <Modal.Header className='theme-dark-bg' closeButton>
                    <Modal.Title  className='h4'style={{ fontWeight: "600" }}>Title : title</Modal.Title>
                </Modal.Header>
                <Modal.Body className='theme-dark-bg' style={{ padding: "0" }}>
                    <h3 className='p-3 h4'>Are you sure you want to apply?</h3>
                </Modal.Body>
                <Modal.Footer className='theme-dark-bg'>
                    <button className="btn btn-danger" onClick={handleSumitClose}>
                        No
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Yes
                    </button>
                </Modal.Footer>
            </Modal>
        </div >
    );
}

export default ContestApplyModal;
