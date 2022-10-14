import React, { useEffect, useState } from "react";
import { List, TextField } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import {
  useNewMoralisObject,
  useMoralisCloudFunction,
  useMoralis,
} from "react-moralis";
import { socialAddress } from "../../config";
import { toast, ToastContainer } from "react-toastify";
import Load from "../Load";
import { BigNumber, ethers } from "ethers";
import PaidButton from "./PaidButton";
import Web3 from "web3";

function PayScholarship(props) {
  const [show, setShow] = useState(false);
  const { Moralis, user, isInitialized } = useMoralis();
  const [amount, setAmaount] = useState();

  const [bal, setBal] = useState();
  const [eth, setEth] = useState();
  const [isUpdated, setIsupdated] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [ownerAdd, setOwnerAdd] = useState();

  const { data, isLoading, error } = useMoralisCloudFunction("getAllUser");

  useEffect(async () => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));

      const dd =
        fatchContest &&
        fatchContest.filter((e) => {
          if (e.objectId === props.data) {
            setOwnerAdd(e.ethAddress);
          }
        });
    }
  }, [props, isLoading, error]);

  const handlePay = async () => {
    await Moralis.enableWeb3();
    const options = {
      type: "native",
      amount: Moralis.Units.ETH(amount, "18"),
      receiver: ownerAdd,
      contractAddress: "0x0000000000000000000000000000000000001010",
    };

    let result = await Moralis.transfer(options);
    const PayScholarship = Moralis.Object.extend("PayScholarship");
    const query = new Moralis.Query(PayScholarship);
    const payScholarship = new PayScholarship();

    payScholarship.set("from", user.attributes.username);
    payScholarship.set("to", ownerAdd);
    payScholarship.set("status", "paid");
    payScholarship.set("amount", amount);
    await payScholarship.save().then(
      (monster) => {
        toast.success("Successfully Paid!", monster.message);
      },
      (error) => {
        toast.error(error.message);
      }
    );

    handleClose();
    setIsupdated(!isUpdated);
  };

  useEffect(async () => {
    let web = new Web3(`https://api.s0.b.hmny.io`);
    let bscdata = await web.eth.getBalance(user && user.attributes.ethAddress);
    console.log(ethers.utils.formatUnits(bscdata, 18), "harmony");
    setBal(ethers.utils.formatUnits(bscdata, 18));
    // const options = { chain: "mumbai", address: user && user.attributes.ethAddress };
    // const tokenMetadata = Moralis.Web3.getAllERC20(options).then((res) => {
    //     setBal(ethers.utils.formatUnits(res[0].balance, 18));
    // });
    const opt = {
      chain: "ropsten",
      address: user && user.attributes.ethAddress,
    };
    const tmetadata = Moralis.Web3.getAllERC20(opt).then((res) => {
      setEth(ethers.utils.formatUnits(res[0].balance, 18));
    });
  }, [user, isUpdated]);

  return (
    <div>
      <PaidButton open={handleShow} data={ownerAdd} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="theme-dark-bg" closeButton>
          <Modal.Title className="h4" style={{ fontWeight: "600" }}>
            Make Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="theme-dark-bg" style={{ padding: "0" }}>
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
                <span className="fw-700">ONE Balance : </span>{" "}
                <img
                  width={20}
                  height={20}
                  src="https://assets.coingecko.com/coins/images/4344/small/Y88JAze.png?1565065793"
                />
                <span className="fw-700 text-primary mx-2 h4">
                  {parseFloat(bal).toFixed(2)}{" "}
                </span>{" "}
                <span className="fw-700 text-primary">ONE </span>
              </h4>
            </div>
            <div className="text-success fw-700 p-2">
              <h4>
                <span className="fw-700">ETH Balance : </span>{" "}
                <img
                  width={20}
                  height={20}
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
                />
                <span className="fw-700 text-primary mx-2 h4">
                  {parseFloat(eth).toFixed(2)}{" "}
                </span>{" "}
                <span className="fw-700 text-primary">ETH </span>
              </h4>
            </div>
            <div className="">
              <div className="form-group icon-input   p-2">
                <input
                  onChange={(e) => setAmaount(e.target.value)}
                  type="number"
                  className="h4 bor-0 w-100 rounded-xxl p-3    font-xsss fw-600 border-light-md card"
                  placeholder="Enter Amount"
                />
              </div>
            </div>
          </List>
        </Modal.Body>
        <Modal.Footer className="theme-dark-bg">
          <button className="btn btn-danger" onClick={handleClose}>
            Close
          </button>
          <button
            style={{ border: "none" }}
            className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
            onClick={handlePay}
          >
            Pay ETH
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PayScholarship;
