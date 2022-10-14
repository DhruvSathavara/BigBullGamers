import styled from "@emotion/styled";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisCloudFunction,
  useNewMoralisObject,
} from "react-moralis";
import { mintNftAddres, socialAddress, tokenAddres } from "../../config";
import Appfooter from "../Appfooter";
import Header from "../Header";
import Leftnav from "../Leftnav";
import Popupchat from "../Popupchat";
import Rightchat from "../Rightchat";
import SkeletonCard from "../skeleton/Card";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
import { BigNumber, ethers } from "ethers";
import Web3 from "web3";
import converter from "bech32-converting";
import { ToastContainer, toast } from "react-toastify";

import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  CardContent,
  Container,
  Grid,
  Chip,
  Button,
  List,
} from "@mui/material";
import { Modal } from "react-bootstrap";
import CrowdModal from "./CrowdModal";
import RaiseFund from "./RaiseFund";
import FundPro from "./FundPro";
import PaymentButton from "./PaymentButton";

const ProductImgStyle = styled("img")({
  top: 0,
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "10px",
});

function MintedNft() {
  const { data, isLoading } = useMoralisCloudFunction("getAllFunds");
  const { save } = useNewMoralisObject("CrowdFund");

  const { Moralis, user, isInitialized } = useMoralis();
  const [meta, setMeta] = useState([]);
  const [isUpdated, setIsupdated] = useState(false);
  const [progress, setProgress] = React.useState(10);

  const [bal, setBal] = useState();
  const [eth, setEth] = useState();
  const [amount, setAmaount] = useState();
  const [show, setShow] = useState(false);
  const [showFUnd, setShowFund] = useState(false);

  const Fund = Moralis.Object.extend("CrowdFund");
  const fund = new Fund();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));
      setMeta(fatchContest);
    }
  }, [isLoading, isUpdated]);

  const handlePay = async (add) => {
    await Moralis.enableWeb3();
    const options = {
      type: "native",
      amount: Moralis.Units.ETH(amount, "18"),
      receiver: add.user.ethAddress,
      contractAddress: "0x0000000000000000000000000000000000001010",
    };
    let result = await Moralis.transfer(options);

    const CrowdFund = Moralis.Object.extend("CrowdFund");
    const query = new Moralis.Query(CrowdFund);
    query.equalTo("objectId", add.objectId);
    const fetchedScores = await query.first();

    fetchedScores.add("funds", {
      raisedFund: amount,
      raisedBy: user.attributes.username,
    });
    const updatedScores = await fetchedScores.save();
    toast.success("Successfully Transfer!");
    handleClose();
    setIsupdated(!isUpdated);
  };

  useEffect(async () => {
    // const options = { chain: "mumbai", address: user && user.attributes.ethAddress };
    // const tokenMetadata = Moralis.Web3.getAllERC20(options).then((res) => {
    //     setBal(ethers.utils.formatUnits(res[0].balance, 18));
    // });
    const opt = {
      chain: "ropsten",
      address: user && user.attributes.ethAddress,
    };
    // const tmetadata = Moralis.Web3.getAllERC20(opt).then((res) => {
    //   setEth(ethers.utils.formatUnits(res[0].balance, 18));
    // });
    let web = new Web3(`https://api.baobab.klaytn.net:8651`);
    let bscdata = await web.eth.getBalance(user && user.attributes.ethAddress);
    console.log(ethers.utils.formatUnits(bscdata, 18), "boba");
    setBal(ethers.utils.formatUnits(bscdata, 18));
  }, [user, isUpdated]);

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />
      <ToastContainer />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                  <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">
                    {"Crowd Funds"}
                    <div className="search-form-2 ms-2 pt-0 pb-0 ms-auto">
                      <button
                        style={{ border: "none" }}
                        className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
                        onClick={() => setShowFund(true)}
                      >
                        Create Crowd Fund
                      </button>
                    </div>
                  </h2>
                </div>
                <CrowdModal
                  show={showFUnd}
                  handleClose={() => setShowFund(false)}
                />

                <div className="row ps-2 pe-1">
                  {meta ? (
                    meta.map((e, i) => {
                      return (
                        <div
                          key={i}
                          className="col-lg-4 col-sm-6 theme-dark-bg  shadow-xss rounded-xxl border-0 p-3 mb-3"
                        >
                          <Card
                            className="card"
                            sx={{ border: "0px solid #eee" }}
                          >
                            <CardContent>
                              <Box>
                                <ProductImgStyle
                                  alt="img "
                                  src={e.crowdFund.img}
                                />
                              </Box>
                              <Box sx={{ marginTop: "10px" }}>
                                {/* <Typography
                                  color="textPrimary text-white"
                                  gutterBottom
                                  variant="h5"
                                >
                                  {e.crowdFund.title}
                                </Typography> */}

                                <Typography
                                  color="textPrimary text-white"
                                  gutterBottom
                                  variant="body"
                                  className="crowDetails"
                                >
                                  {e.crowdFund.description}
                                </Typography>

                                <ul className="   mt-1">
                                  <li className="m-2 d-flex justify-content-between">
                                    <h5 className="font-s fw-500   text-grey-500 d-block">
                                      Start Date :
                                    </h5>
                                    <h5 className="fw-700  start-date ml-4">
                                      {moment(e.crowdFund.start.iso).format(
                                        "MMM Do YY"
                                      )}{" "}
                                    </h5>
                                  </li>
                                  <li className="m-2 d-flex justify-content-between">
                                    <h5 className="font-s fw-500   text-grey-500 d-block">
                                      End Date :
                                    </h5>
                                    <h5 className="fw-700  start-date ml-4">
                                      {moment(e.crowdFund.end.iso).format(
                                        "MMM Do YY"
                                      )}{" "}
                                    </h5>
                                  </li>
                                </ul>
                                <Box
                                  sx={{
                                    mt: "0px",
                                    mb: "0px",
                                    display: "flex",
                                  }}
                                >
                                  <figure className="avatar me-3">
                                    <img
                                      src={
                                        e.user !== null
                                          ? e.user["Avatar"]
                                            ? e.user["Avatar"]
                                            : "assets/images/user.png"
                                          : "assets/images/user.png"
                                      }
                                      alt={
                                        e.user !== null
                                          ? e.user["username"]
                                          : "user"
                                      }
                                      className="shadow-sm rounded-circle w45"
                                    />
                                  </figure>
                                  <Typography
                                    color="textPrimary"
                                    gutterBottom
                                    variant="h5"
                                    style={{ fontSize: "15px" }}
                                  >
                                    by {e.user.username}
                                  </Typography>
                                </Box>
                                <Box sx={{ mt: "0px", mb: "5px" }}>
                                  <FundPro
                                    goal={e.crowdFund.goal}
                                    data={e.funds}
                                  />
                                </Box>

                                <PaymentButton
                                  fund={e.funds}
                                  goal={e.crowdFund.goal}
                                  open={handleShow}
                                />

                                <Modal show={show} onHide={handleClose}>
                                  <Modal.Header
                                    className="theme-dark-bg"
                                    closeButton
                                  >
                                    <Modal.Title
                                      className="h4"
                                      style={{ fontWeight: "600" }}
                                    >
                                      Contribute
                                    </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body
                                    className="theme-dark-bg"
                                    style={{ padding: "0" }}
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
                                      <div className="root"></div>
                                      <div className="text-success fw-700 p-2">
                                        <h4>
                                          <span className="fw-700">
                                            KLAY Balance :{" "}
                                          </span>{" "}
                                          <span className="fw-700 text-primary mx-2 h4">
                                            {parseFloat(bal).toFixed(2)}{" "}
                                          </span>{" "}
                                          <span className="fw-700 text-primary">
                                          KLAY{" "}
                                          </span>
                                        </h4>
                                      </div>
                                      {/* <div className="text-success fw-700 p-2">
                                      <h4>
                                        <span className="fw-700">
                                          KLAY Balance :{" "}
                                        </span>{" "}
                                        <img
                                          width={20}
                                          height={20}
                                          src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
                                        />
                                        <span className="fw-700 text-primary mx-2 h4">
                                          {parseFloat(bal).toFixed(2)}{" "}
                                        </span>{" "}
                                        <span className="fw-700 text-primary">
                                          ETH{" "}
                                        </span>
                                      </h4>
                                    </div> */}
                                      <div className="">
                                        <div className="form-group icon-input   p-2">
                                          <input
                                            onChange={(e) =>
                                              setAmaount(e.target.value)
                                            }
                                            type="number"
                                            className="h4 bor-0 w-100 rounded-xxl p-3    font-xsss fw-600 border-light-md card"
                                            placeholder="Enter Amount"
                                          />
                                        </div>
                                      </div>
                                    </List>
                                  </Modal.Body>
                                  <Modal.Footer className="theme-dark-bg">
                                    <button
                                      className="btn btn-danger"
                                      onClick={handleClose}
                                    >
                                      Close
                                    </button>
                                    <button
                                      style={{ border: "none" }}
                                      className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
                                      onClick={() => handlePay(e)}
                                    >
                                      Pay KLAY
                                    </button>
                                  </Modal.Footer>
                                </Modal>
                              </Box>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })
                  ) : (
                    <SkeletonCard />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popupchat />
      <Appfooter />
    </Fragment>
  );
}

export default MintedNft;
