import React, { useEffect, useState } from "react";
import { Modal, Nav } from "react-bootstrap";
import { List, Button, TextField, TextareaAutosize } from "@mui/material";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import DateTimePicker from "@mui/lab/DateTimePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
  useMoralisFile,
  useMoralisCloudFunction,
} from "react-moralis";
import ContestAbi from "../abi/Contest.json";
import PostAbi from "../abi/Post.json";
import { socialAddress, contestAddress } from "../config";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ContestList from "./contest/ContestList";
import Card from "./skeleton/Card";
import ContestParticipated from "./contest/ContestParticipated";
import Mycontest from "./contest/Mycontest";

export default function Pagetitle() {
  const { user, Moralis, isInitialized } = useMoralis();
  const { saveFile, moralisFile } = useMoralisFile();
  const { isSaving, save, error } = useNewMoralisObject("UserContests");
  const [show, setShow] = useState(false);
  const { data, isLoading } = useMoralisCloudFunction("getAllContest");
  const [contest, setContest] = React.useState();

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [avatar, setAvatar] = useState(null);
  const [types, setTypes] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [prize, setPrize] = React.useState("");
  const [contestData, setContestData] = useState();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));
      // console.log(data, "data");
      setContest(fatchContest);
      // console.log(JSON.parse(JSON.stringify(data)));
    }
  }, [isLoading, error]);

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };
  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  const handleChangeTypes = (event) => {
    setTypes(event.target.value);
  };

  async function onChangeAvatar(e) {
    const file = e.target.files[0];
    let fileIpfs = await saveFile(user.attributes.username, file, {
      saveIPFS: true,
    });

    setAvatar(fileIpfs._ipfs);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function handleSubmit() {
    if (!startDate || !endDate || !types || !avatar || !description || !prize) {
      toast.error("All the fields are required!");
      return;
    }
    const contest = {
      start: startDate,
      end: endDate,
      type: types,
      img: avatar,
      title: title,
      prize: prize,
      description: description,
    };

    const file = new Moralis.File("contest.json", {
      base64: btoa(JSON.stringify(contest)),
    });
    const dataUri = await file.saveIPFS();
    const uri = dataUri._ipfs;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();

    let contract = new ethers.Contract(contestAddress, ContestAbi.abi, signer);

    let transaction = await contract.createContestToken(uri);

    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    contract = new ethers.Contract(socialAddress, PostAbi.abi, signer);
    transaction = await contract.createContest(uri, tokenId);

    await transaction.wait();

    const contestData = {
      start: startDate,
      end: endDate,
      type: types,
      img: avatar,
      prize: prize,
      title: title,
      description: description,
      uri: uri,
      tokenId: tokenId,
    };
    await save({ contestData, user });
    setShow(false);
    toast.success("Contest created!!");
    setIsUpdated(!isUpdated);
  }

  useEffect(() => {
    contest ? (
      contest.map((cont, index) => {
        if (cont.user.objectId == user.id) {
          setContestData(cont);
        }
      })
    ) : (
      <Card />
    );
  }, [contest, isUpdated]);

  return (
    <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
      <ToastContainer />
      <div className="d-flex justify-content-between">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box
              style={{ display: "flex", justifyContent: "space-between" }}
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab className="h4" label="All" value="1" />
                <Tab className="h4" label="Participated" value="2" />
                <Tab className="h4" label="Created" value="3" />
              </TabList>
              <Nav.Link className="" variant="primary">
                <Button className=" contest h4" onClick={handleShow}>
                  Create Tournament
                </Button>
              </Nav.Link>
            </Box>

            <TabPanel style={{ padding: "20px 10px" }} value="1">
              <div className="container p-0">
                <div className="row">
                  {contest ? (
                    contest.map((cont, index) => {
                      return <ContestList key={index} data={cont} />;
                    })
                  ) : (
                    <Card />
                  )}
                </div>
              </div>
            </TabPanel>
            <TabPanel style={{ padding: "20px 10px" }} value="2">
              <div className="container p-0">
                <div className="row">
                  <Mycontest data={contestData} />
                </div>
              </div>
            </TabPanel>
            <TabPanel style={{ padding: "20px 10px" }} value="3">
              <div className="container p-0">
                <div className="row">
                  {/* <Mycontest  data={contestData} />  */}
                  <ContestParticipated />
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </Box>

        {/* <div className="d-flex">
                    <h2 className="fw-700 mb-0 mt-0 font-md d-flex align-items-center">
                        All Contest </h2>
                    <Nav.Link className="" variant="primary" >
                        <Button className=" contest ">My Contest</Button>
                    </Nav.Link>
                </div>
                <Nav.Link className="" variant="primary" >
                    <Button className=" contest" onClick={handleShow}>Create Contest</Button>
                </Nav.Link> */}
      </div>
      <Modal show={show} onHide={handleClose} style={{ overflowY: "scroll" }}>
        <Modal.Header className="theme-dark-bg" closeButton>
          <Modal.Title className="h4" style={{ fontWeight: "600" }}>
            Scholarship
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
                placeholder="Title"
              />
            </div>
            <div className="d-flex mx-2 my-2">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="MM/dd/yyyy"
                  value={startDate}
                  className="theme-dark-bg"
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
                  className="theme-dark-bg"
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
            <div className="form-group icon-input   p-2">
              <input
                onChange={(e) => setPrize(e.target.value)}
                type="number"
                className="h4 bor-0 w-100 rounded-xxl p-3    font-xsss fw-600 border-light-md card"
                placeholder="Scholarship Amount"
              />
            </div>
            <div>
              <div className="form-group icon-input  p-2">
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  name="message"
                  className="h100 h4 bor-0 w-100 rounded-xxl p-3    font-xsss fw-600 border-light-md card"
                  cols="20"
                  rows="10"
                  placeholder="Scholarship Description"
                ></textarea>
              </div>
            </div>
            <div className="form-group icon-input  p-2 mx-2 card">
              <FormControl
                sx={{ minWidth: 120, width: "100%" }}
                className="card"
              >
                <InputLabel
                  className="theme-dark-bg h4"
                  id="demo-simple-select-helper-label"
                >
                  Scholarship Types
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={types}
                  label="Contest Types"
                  className="h4"
                  onChange={handleChangeTypes}
                >
                  <MenuItem className="h4 card" value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem className="h4 card" value={1}>
                    Sports Scholarship
                  </MenuItem>
                  <MenuItem className="h4 card" value={2}>
                    Higher Studies Grant
                  </MenuItem>
                  <MenuItem className="h4 card" value={3}>
                    Fellowship Program
                  </MenuItem>
                </Select>
              </FormControl>
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
                Drag and drop or click to replace
              </span>
            </label>
          </List>
        </Modal.Body>
        <Modal.Footer className="theme-dark-bg">
          <button
            style={{ border: "none" }}
            className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
