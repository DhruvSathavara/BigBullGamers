import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  useMoralis,
  useChain,
  useNewMoralisObject,
  useMoralisFile,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { ToastContainer, toast } from "react-toastify";
import { tokenAddres, socialAddress } from "../../config";
import { create as ipfsHttpClient } from "ipfs-http-client";

import TokenAbi from "../../abi/Token.json";
import PostAbi from "../../abi/Post.json";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import web3 from "web3";
import { NotificationContext } from "../../context/EpnsContext";
import { MarketplaceContext } from "../../context/MarketplaceContext";
//  import {NFTStorage} from 'nft.storage';
const apiKey = process.env.FILE_COIN_API_KEY;

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

// const client = new NFTStorage({ token: apiKey })

export default function CreateGroup({ show, handleClose, createGroup }) {
  const notificationContext = React.useContext(NotificationContext);
  const { sendNotifications, notificationItems } = notificationContext;

  const marketplaceContext = React.useContext(MarketplaceContext);
  const { listNFTForSale } = marketplaceContext;

  const { user, Moralis, web3EnableError } = useMoralis();
  const { saveFile, moralisFile } = useMoralisFile();
  const { isSaving, save, error } = useNewMoralisObject("UserPosts");
  const [fileurl, setFileUrl] = useState(null);
  const [name, setName] = useState("");
  const [tName, setTName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [members, setMembers] = useState([]);
  const [isUpdated, setIsupdated] = useState(false);
  const [upload, setUpload] = useState(false);
  const [loading, setLoaing] = useState(false);

  async function onChangeAvatar(e) {
    setUpload(true);
    const file = e.target.files[0];
    let fileIpfs = await saveFile(user.attributes.username, file, {
      saveIPFS: true,
    });
    setFileUrl(fileIpfs._ipfs);
    setUpload(false);
  }

  // const ipfsProcessor = useMoralisFile();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    if (web3EnableError) {
      toast.error(web3EnableError.message);
    }
  }, [isUpdated, isSaving]);

  return (
    <div>
      <ToastContainer />

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header className="card" closeButton>
          <Modal.Title className="h4">Create Group</Modal.Title>
        </Modal.Header>
        <Modal.Body className="card">
          <div className="form-group icon-input mb-3">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className=" h4 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-900 fw-500 border-light-md theme-dark-bg"
              placeholder="Group Name"
            />
          </div>

          <div className="card-body p-0 mt-3 position-relative">
            <input
              type="text"
              onChange={(e) => setTName(e.target.value)}
              className=" h4 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-900 fw-500 border-light-md theme-dark-bg"
              placeholder="Token Name"
            />
          </div>
          <div className="card-body p-0 mt-3 position-relative">
            <input
              type="text"
              onChange={(e) => setSymbol(e.target.value)}
              className=" h4 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-900 fw-500 border-light-md theme-dark-bg"
              placeholder="Token Symbol"
            />
          </div>
          <div className="form-group icon-input mb-3">
            <input
              type="number"
              onChange={(e) => setQuantity(e.target.value)}
              className=" h4 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-900 fw-500 border-light-md theme-dark-bg"
              placeholder="Quantity"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* <img
                            className="rounded object-cover h-60 w-full mb-2"
                            src={avatar == null ? "https://via.placeholder.com/800x950.png" : avatar} width="70%" height="200"
                        /> */}

            {/* <div className='d-flex '> */}
            <input
              type="file"
              name="file"
              id="file"
              className="input-file"
              onChange={onChangeAvatar}
            />
            <label
              htmlFor="file"
              className="rounded-3 text-center bg-white btn-tertiary js-labelFile p-4 w-20 border-dashed img-upload"
            >
              <i className="ti-cloud-up large-icon me-3 d-block"></i>
              <span className="js-fileName">
                {upload ? "Uploading..." : "Upload(PNG, JPG)"}
              </span>
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer className="card">
          <button
            style={{ border: "none" }}
            className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
            onClick={async () => {
              setLoaing(true);
              await createGroup({
                name,
                tName,
                symbol,
                quantity,
                members,
                fileurl
              });
              setLoaing(false);
            }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
