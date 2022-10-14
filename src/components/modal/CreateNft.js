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

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0/");

// const client = new NFTStorage({ token: apiKey })

export default function CreateNft() {
  const notificationContext = React.useContext(NotificationContext);
  const { sendNotifications, notificationItems } = notificationContext;

  const marketplaceContext = React.useContext(MarketplaceContext);
  const { listNFTForSale } = marketplaceContext;

  const { user, Moralis, web3EnableError } = useMoralis();
  const { saveFile, moralisFile } = useMoralisFile();
  const { isSaving, save, error } = useNewMoralisObject("UserPosts");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [fileurl, setFileUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [discription, setdiscription] = useState("");
  const [tags, setTags] = useState("");
  const [userId, setUserId] = useState("");
  const [isUpdated, setIsupdated] = useState(false);
  const [upload, setUpload] = useState(false);
  const [loading, setLoaing] = useState(false);

  // const ipfsProcessor = useMoralisFile();
  const contractProcessor = useWeb3ExecuteFunction();

  const userPoints = Moralis.Object.extend("UsePointsTable");
  const userQuery = new Moralis.Query(userPoints);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    if (web3EnableError) {
      toast.error(web3EnableError.message);
    }
  }, [isUpdated, isSaving]);

  async function onChangeAvatar(e) {
    setUpload(true);
    const file = e.target.files[0];
    let fileIpfs = await saveFile(user.attributes.username, file, {
      saveIPFS: true,
    });
    setFileUrl(fileIpfs._ipfs);
    setUpload(false);
  }

  async function mintNFT() {
    setLoaing(true);
    if (!title || !discription || !price || !fileurl) return;
    /* first, upload to IPFS */

    try {
      const data = {
        title,
        discription,
        image: fileurl,
      };

      const toBtoa = Buffer.from(JSON.stringify(data)).toString("base64");
      const file = new Moralis.File(`${user.attributes.username}nft.json`, {
        base64: toBtoa,
      });
      await file.saveIPFS({ useMasterKey: true });
      // const added = await client.add(data);
      // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      await listNFTForSale(file.ipfs(), price);
      setLoaing(false);
      setShow(false);
    } catch (error) {
      console.log("Error uploading file: ", error);
      setLoaing(false);
    }
  }

  useEffect(() => {}, [isUpdated]);

  return (
    <div>
      <ToastContainer />
      <button
        style={{ border: "none" }}
        className="p-2 bg-gold-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
        variant="primary"
        onClick={() => setShow(true)}
      >
        Create NFT
      </button>

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header className="card" closeButton>
          <Modal.Title className="h4">Create NFTs</Modal.Title>
        </Modal.Header>
        <Modal.Body className="card">
          <div className="form-group icon-input mb-3">
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              className=" h4 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-900 fw-500 border-light-md theme-dark-bg"
              placeholder="Name"
            />
          </div>

          <div className="card-body p-0 mt-3 position-relative">
            <textarea
              onChange={(e) => setdiscription(e.target.value)}
              name="description"
              className="h20 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg"
              cols="20"
              rows="5"
              placeholder="Description"
            ></textarea>
          </div>
          <div className="form-group icon-input mb-3">
            <input
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              className=" h4 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-900 fw-500 border-light-md theme-dark-bg"
              placeholder="Price"
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
                {upload ? "Uploading..." : "Upload NFT(PNG, JPG, GIF, MP4.)"}
              </span>
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer className="card">
          <button
            style={{ border: "none" }}
            className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
            onClick={mintNFT}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
