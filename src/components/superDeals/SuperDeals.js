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
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, FormControl, Modal, Nav } from "react-bootstrap";
import ReactReadMoreReadLess from "react-read-more-read-less";
import Contacts from "../Contacts";
import Friends from "../Friends";
import Header from "../Header";
import Leftnav from "../Leftnav";
import Rightchat from "../Rightchat";
import { ToastContainer, toast } from "react-toastify";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import {
  useMoralis,
  useNewMoralisObject,
  useMoralisFile,
  useMoralisCloudFunction,
} from "react-moralis";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SkeletonCard from "../skeleton/Card";
import moment from "moment";

function SuperDeals() {
  const { user, Moralis, isInitialized } = useMoralis();
  const { saveFile, moralisFile } = useMoralisFile();
  const { isSaving, save, error } = useNewMoralisObject("SuperDeals");
  const [show, setShow] = useState(false);
  const { data, isLoading } = useMoralisCloudFunction("getAllDeals");
  const [dealData, setDealData] = React.useState();

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [avatar, setAvatar] = useState(null);
  const [title, setTitle] = React.useState("");
  const [eligiility, setEligiility] = React.useState("");
  const [offers, setOffers] = React.useState("");
  const [deals, setDeals] = useState();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));
      setDeals(fatchContest);
      console.log(JSON.parse(JSON.stringify(data)));
    }
  }, [isLoading, isUpdated]);

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };
  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  async function onChangeAvatar(e) {
    const file = e.target.files[0];
    let fileIpfs = await saveFile(user.attributes.username, file, {
      saveIPFS: true,
    });
    console.log(fileIpfs);
    setAvatar(fileIpfs._ipfs);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleSubmit() {
    if (!startDate || !endDate || !avatar || !eligiility || !offers) {
      toast.error("All the fields are required!");
      return;
    }
    const superDeals = {
      start: startDate,
      end: endDate,
      img: avatar,
      title: title,
      offers: offers,
      eligiility: eligiility,
    };
    await save({ superDeals, user });
    setShow(false);
    toast.success("superDeals created!!");
    setIsUpdated(!isUpdated);
  }

  useEffect(() => {
    deals ? (
      deals.map((cont, index) => {
        if (cont.user.objectId == user.id) {
          setDealData(cont);
        }
      })
    ) : (
      <Card />
    );
  }, [deals, isUpdated]);

  useEffect(() => {}, [isUpdated]);

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />
      <ToastContainer />
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
              <div className="row feed-body ">
                <div className="col-12 ">
                  <button
                    style={{ border: "none" }}
                    className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
                    onClick={handleShow}
                  >
                    Create Super Deals
                  </button>
                </div>
              </div>
              <div className="row feed-body mt-2">
                {deals ? (
                  deals.map((e, i) => {
                    return (
                      <div key={i} className="col-lg-4 col-md-4 col-sm-6">
                        <div className="theme-dark-bg d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                          <div className="card-body d-block w-100 p-0 text-center">
                            <figure className="avatar ms-auto me-auto mb-0 position-relative  z-index-1">
                              <div className="imgWidth">
                                <img
                                  src={e.superDeals.img}
                                  alt="avater"
                                  height={200}
                                  className=" bg-white w-100"
                                />
                              </div>
                            </figure>
                            <div className="p-4">
                              <div className="clearfix"></div>
                              <h4 className="fw-700 font-xss mt-0 mb-0">
                                {e.superDeals.title}{" "}
                              </h4>
                              <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">
                                {e.user.username}
                              </p>
                              <ul className="   mt-1">
                                <li className="m-2 d-flex justify-content-evenly">
                                  <h3 className="font-s fw-500   text-grey-500 d-block">
                                    Start Date :
                                  </h3>
                                  <h4 className="fw-700 font-xs start-date">
                                    {moment(e.superDeals.start.iso).format(
                                      "MMM Do YY"
                                    )}{" "}
                                  </h4>
                                </li>
                                <li className="m-2 d-flex justify-content-evenly">
                                  <h3 className="font-s fw-500   text-grey-500 d-block">
                                    End Date :
                                  </h3>
                                  <h4 className="fw-700 font-xs start-date">
                                    {moment(e.superDeals.end.iso).format(
                                      "MMM Do YY"
                                    )}{" "}
                                  </h4>
                                </li>
                                <li className="m-2 d-flex justify-content-evenly">
                                  <h3 className="font-s fw-500   text-grey-500 d-block">
                                    Offers :
                                  </h3>
                                  <h4 className="fw-700 font-xs start-date">
                                    {e.superDeals.offers}{" "}
                                  </h4>
                                </li>
                                <li className="m-2 d-flex justify-content-evenly">
                                  <h3 className="font-s fw-500   text-grey-500 d-block">
                                    Eligibility :
                                  </h3>
                                  <h4 className="fw-700 font-xs start-date">
                                    {e.superDeals.eligiility}
                                  </h4>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <SkeletonCard />
                )}
                {/* </div> */}
                {/* <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
                                <Friends/>
                                <Contacts/>
                            </div> */}

                <Modal
                  show={show}
                  onHide={handleClose}
                  style={{ overflowY: "scroll" }}
                >
                  <Modal.Header className="theme-dark-bg" closeButton>
                    <Modal.Title className="h4" style={{ fontWeight: "600" }}>
                      Super Deals
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                    style={{ padding: "0" }}
                    className="theme-dark-bg"
                  >
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
                          placeholder="Super Deal Title"
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
                      <div className="form-group icon-input   p-2">
                        <input
                          onChange={(e) => setOffers(e.target.value)}
                          type="text"
                          className="h4 bor-0 w-100 rounded-xxl p-3    font-xsss fw-600 border-light-md card"
                          placeholder="Offers"
                        />
                      </div>
                      <div className="form-group icon-input   p-2">
                        <input
                          onChange={(e) => setEligiility(e.target.value)}
                          type="text"
                          className="h4 bor-0 w-100 rounded-xxl p-3    font-xsss fw-600 border-light-md card"
                          placeholder="Eligibility"
                        />
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
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default SuperDeals;
