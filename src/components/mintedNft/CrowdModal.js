import {
  useMoralis,
  useNewMoralisObject,
  useMoralisFile,
  useMoralisCloudFunction,
} from "react-moralis";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SkeletonCard from "../skeleton/Card";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, FormControl, Modal, Nav } from "react-bootstrap";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Divider,
  InputLabel,
  List,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

function CrowdModal(props) {
  const { user, Moralis, isInitialized } = useMoralis();
  const { saveFile, moralisFile } = useMoralisFile();
  const { isSaving, save, error } = useNewMoralisObject("CrowdFund");
  const [show, setShow] = useState(false);

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [avatar, setAvatar] = useState(null);
  const [title, setTitle] = React.useState("");
  const [goal, setGoal] = React.useState();
  const [description, setDescription] = React.useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [upload, setUpload] = useState(false);

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };
  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  async function onChangeAvatar(e) {
    setUpload(true);
    const file = e.target.files[0];
    let fileIpfs = await saveFile(user.attributes.username, file, {
      saveIPFS: true,
    });
    console.log(fileIpfs);
    setAvatar(fileIpfs._ipfs);
    setUpload(false);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleSubmit() {
    if (!startDate || !endDate || !avatar || !goal || !description || !title) {
      toast.error("All the fields are required!");
      return;
    }
    const crowdFund = {
      start: startDate,
      end: endDate,
      img: avatar,
      creator: user,
      goal: goal,
      title: title,
      description: description,
    };
    console.log(crowdFund, "crowdFund");
    await save({ crowdFund, user });
    setShow(false);
    toast.success("CrowdFund created!!");
    setIsUpdated(!isUpdated);
  }
  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        style={{ overflowY: "scroll" }}
      >
        <Modal.Header className="theme-dark-bg" closeButton>
          <Modal.Title className="h4" style={{ fontWeight: "600" }}>
            Crowd Fund
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0" }} className="theme-dark-bg">
          <List
            sx={{
              width: "100%",
              padding: "10px 0px",
              bgcolor: "background.paper",
              overflowX: "hidden",
            }}
            className="theme-dark-bg"
          >
            <div className="form-group icon-input  p-2">
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className=" h4 bor-0 w-100 rounded-xxl p-3 card text-grey-900 font-xsss fw-600 border-light-md"
                placeholder="Crowd fund Title"
              />
            </div>
            <div className="form-group icon-input   p-2">
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                name="message"
                className="h4 bor-0 w-100 rounded-xxl p-3 card text-grey-900 font-xsss fw-600 border-light-md"
                cols="20"
                rows="3"
                placeholder="Description"
              ></textarea>
              {/* <input onChange={(e) => setOffers(e.target.value)} type="textarea" className="h4 bor-0 w-100 rounded-xxl p-3    font-xsss fw-600 border-light-md card" placeholder="Description" /> */}
            </div>
            <div className="form-group icon-input   p-2">
              <input
                onChange={(e) => setGoal(e.target.value)}
                type="number"
                className="h4 bor-0 w-100 rounded-xxl p-3    font-xsss fw-600 border-light-md card"
                placeholder="Funding Goal"
              />
            </div>

            <div className="d-flex mx-2 my-2">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="MM/dd/yyyy"
                  value={startDate}
                  className="theme-dark-bg h4"
                  onChange={handleChangeStartDate}
                  renderInput={(params) => (
                    <TextField
                      style={{ marginRight: "10px" }}
                      className="align-self-center card"
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="End Date"
                  className="theme-dark-bg h4"
                  inputFormat="MM/dd/yyyy"
                  value={endDate}
                  onChange={handleChangeEndDate}
                  renderInput={(params) => (
                    <TextField
                      className="align-self-center h4 card"
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>

            <input
              type="file"
              name="file"
              id="file"
              className="input-file"
              onChange={onChangeAvatar}
            />
            <label
              htmlFor="file"
              className="rounded-3 text-center bg-white btn-tertiary js-labelFile p-4 w-100 border-dashed img-upload"
            >
              <i className="ti-cloud-up large-icon me-3 d-block"></i>
              <span className="js-fileName">
                {upload ? "Uploading.." : "Drag and drop or click to replace"}
              </span>
            </label>
          </List>
        </Modal.Body>
        <Modal.Footer className="theme-dark-bg">
          <button
            style={{ border: "none" }}
            className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
            onClick={handleSubmit}
            disabled={upload}
          >
            Create
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CrowdModal;
