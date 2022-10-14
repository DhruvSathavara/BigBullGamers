import React, { Component, Fragment, useState, useEffect } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Pagetitle from "../components/Pagetitle";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import Load from "../components/Load";
import CreateGroup from "../components/modal/CreateGroup";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { ethers } from "ethers";

import { bulkMintTokenContract, multisendTokenContract } from "../config";
import bulkMintABI from "../abi/BulkMint.json";
import multisendABI from "../abi/MultiSend.json";
import DERC721ABI from "../abi/DERC721.json";
import CreateStream from "../components/modal/CreateStream";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

function Group() {
  const [show, setShow] = useState(false);
  const [updated, setUpdated] = useState(false);
  const { user, Moralis, web3EnableError, isInitialized } = useMoralis();
  const { data, isLoading, fetch } = useMoralisCloudFunction("getGroups");
  const { fetch: fetch1, data: data1 } = useMoralisCloudFunction(
    "getAllStreams",
    {
      autoFetch: true,
    }
  );

  const [groupsData, setGroups] = useState([]);
  const [buying, setBuying] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const [streams, setStreams] = useState([]);

  const Groups = Moralis.Object.extend("Groups");
  const groups = new Groups();

  useEffect(() => {
    if (isInitialized) {
      setData();
    }
  }, [data, updated, user]);

  async function setData() {
    const groupData = await JSON.parse(JSON.stringify(data));
    const streamsData = await JSON.parse(JSON.stringify(data1));
    data &&
      groupData.map((group) => {
        const exist = group.members.includes(user?.attributes?.ethAddress);
        if (exist) {
          group.status = "Following";
        } else {
          group.status = "Buy";
        }
      });
    data && setStreams(streamsData);
    data && setGroups(groupData);
  }

  useEffect(() => {
    fetch();
    fetch1();
  }, [updated, user]);

  const handleClose = () => {
    setShow(false);
  };

  async function createGroup(data) {
    if (
      !data.name ||
      !data.tName ||
      !data.symbol ||
      !data.quantity ||
      !data.fileurl
    )
      return;
    /* first, upload to IPFS */

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const bulkMintContract = new ethers.Contract(
        bulkMintTokenContract,
        bulkMintABI.abi,
        signer
      );
      let transaction = await bulkMintContract.createToken(
        data.tName,
        data.symbol
      );
      let tx = await transaction.wait();
      let event = tx.events[0];
      let tokenContractAddress = event?.address;
      await bulkMintContract.bulkMintERC721(
        tokenContractAddress,
        0,
        data.quantity
      );
      const tokenCon = new ethers.Contract(
        tokenContractAddress,
        DERC721ABI.abi,
        signer
      );
      await tokenCon.setApprovalForAll(multisendTokenContract, true);

      data.tokenContract = tokenContractAddress;

      const toBtoa = Buffer.from(JSON.stringify(data)).toString("base64");
      const file = new Moralis.File(`${user.attributes.username}Group.json`, {
        base64: toBtoa,
      });

      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      groups.set("gName", data.name);
      groups.set("tName", data.tName);
      groups.set("symbol", data.symbol);
      groups.set("quantity", parseInt(data.quantity));
      groups.set("members", data.members);
      groups.set("file", data.fileurl);
      groups.set("tokenContract", tokenContractAddress);
      groups.set("creator", user?.attributes?.ethAddress);
      await groups.save();
      setShow(false);
      setUpdated(!updated);
    } catch (error) {
      console.log("Error creating Group: ", error);
      setShow(false);
    }
  }

  async function buyGroupNFT(group) {
    setBuying(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const multisendContract = new ethers.Contract(
        multisendTokenContract,
        multisendABI.abi,
        signer
      );

      if (group.quantity >= 0) {
        await multisendContract.sendToken(
          group.tokenContract,
          group.creator,
          [user?.attributes?.ethAddress],
          [group.quantity - 1]
        );

        const members = group.members;
        members.push(user?.attributes.ethAddress);
        const Group = Moralis.Object.extend("Groups");
        const query = new Moralis.Query(Group);
        query.equalTo("tokenContract", group.tokenContract);
        const g = await query.first();
        g.set("members", members);
        g.set("quantity", parseInt(group.quantity - 1));
        await g.save();
      } else {
        alert("Sold Out Nfts!");
      }
      setBuying(false);
      setUpdated(!updated);
    } catch (error) {
      setBuying(false);
      console.log(error);
    }
  }

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                  <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">
                    {"Streams"}

                    <div className="search-form-2 ms-2 pt-0 pb-0 ms-auto">
                      <button
                        style={{ border: "none" }}
                        className="p-2 bg-gold-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
                        variant="primary"
                        onClick={() => setShow(true)}
                      >
                        Create Group
                      </button>
                    </div>
                  </h2>
                </div>
                <CreateGroup
                  show={show}
                  handleClose={handleClose}
                  createGroup={createGroup}
                />

                <div className="row ps-2 pe-1">
                  {groupsData.map((value, index) => (
                    <div key={index} className="col-md-6 col-sm-6 pe-2 ps-2">
                      <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-0 mt-2">
                        <div
                          className="card-body position-relative h100 bg-image-cover bg-image-center"
                          style={{
                            backgroundImage: `url("${value.file}")`,
                          }}
                        ></div>
                        <div className="card-body d-block w-100 pl-10 pe-4 pb-4 pt-0 text-left position-relative">
                          <figure
                            className="avatar position-absolute w75 z-index-1 left-15"
                            style={{ marginTop: `-40px` }}
                          >
                            <img
                              src={value.file}
                              alt="avater"
                              className="float-right p-1 bg-white rounded-circle w-100 "
                            />
                          </figure>
                          <div className="clearfix"></div>
                          <h4 className="fw-700 font-xsss mt-3 mb-1">
                            {value.gName}
                          </h4>
                          <p className="fw-500 font-xsssss text-grey-500 mt-0 mb-3 lh-3">
                            {value.tName}
                          </p>
                          {value.creator == user?.attributes?.ethAddress ? (
                            <span className="position-absolute right-15 top-0 d-flex align-items-center">
                              <button
                                onClick={() => setShowStream(true)}
                                className="text-center p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-primary-gradiant font-xsssss fw-700 ls-lg text-white"
                              >
                                Add stream
                              </button>
                              <CreateStream
                                show={showStream}
                                handleClose={() => setShowStream(false)}
                                group={value}
                              />
                            </span>
                          ) : (
                            <span className="position-absolute right-15 top-0 d-flex align-items-center">
                              <button
                                className="text-center p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-primary-gradiant font-xsssss fw-700 ls-lg text-white"
                                onClick={() => buyGroupNFT(value)}
                                disabled={
                                  value.status == "Following" ? true : false
                                }
                              >
                                {value.status}
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                      {streams &&
                        streams.map((stream) => {
                          if (
                            value.objectId == stream.group ||
                            value.status == "Following"
                          ) {
                            return (
                              <div
                                key={index}
                                className="card-body bg-transparent-card d-flex p-3 bg-greylight ms-3 me-3 rounded-3 mb-3"
                              >
                                <figure className="avatar me-2 mb-0">
                                  <img
                                    src={stream.image}
                                    alt="avater"
                                    className="shadow-sm rounded-circle w45"
                                  />
                                </figure>
                                <h4 className="fw-700 text-grey-900 font-xssss mt-2">
                                  {stream.title}
                                  <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                                    {stream.url}
                                  </span>
                                </h4>
                                <a
                                  href={stream.url}
                                  target="blank"
                                  className="btn-round-sm bg-white ms-auto mt-2"
                                >
                                  <span className="feather-chevron-right font-xss text-grey-900"></span>
                                </a>
                              </div>
                            );
                          }
                        })}
                    </div>
                  ))}

                  <Load />
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

export default Group;
