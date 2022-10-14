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

import TokenAbi from "../../abi/Token.json";
import PostAbi from "../../abi/Post.json";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import web3 from "web3";
import { NotificationContext } from "../../context/EpnsContext";
//  import {NFTStorage} from 'nft.storage';
const apiKey = process.env.FILE_COIN_API_KEY;

// const client = new NFTStorage({ token: apiKey })

export default function CreatePostModal() {
  const notificationContext = React.useContext(NotificationContext);
  const { sendNotifications, notificationItems } = notificationContext;
  const { user, Moralis, web3EnableError } = useMoralis();
  const { saveFile, moralisFile } = useMoralisFile();
  const { isSaving, save, error } = useNewMoralisObject("BigBullPosts");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [avatar, setAvatar] = useState(null);
  const [discription, setdiscription] = useState("");
  const [tags, setTags] = useState("");
  const [userId, setUserId] = useState("");
  const [isUpdated, setIsupdated] = useState(false);
  const [upload, setUpload] = useState(false);
  const [loading, setLoaing] = useState(false);

  // const ipfsProcessor = useMoralisFile();
  const contractProcessor = useWeb3ExecuteFunction();

  const userPoints = Moralis.Object.extend("BigBullPosts");
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
    setAvatar(fileIpfs._ipfs);
    setUpload(false);
  }

  async function publishPost() {
    if (!discription) {
      alert("This field is require!");
      return;
    }
    const saveData = {
      title: discription,
      postImage: avatar,
      tag: tags,
    };

    await save({ saveData, user });

    if (user) {
      userQuery.equalTo("user", user.id);
      const usrpoint = await userQuery.first();
      if (
        usrpoint.attributes.CreatePostPoint != undefined &&
        usrpoint.attributes.CreatePostPoint != null
      ) {
        usrpoint.set(
          "CreatePostPoint",
          5 + usrpoint.attributes.CreatePostPoint
        );
      } else {
        usrpoint.set("CreatePostPoint", 5);
      }
      usrpoint.set("user", user.id);
      await usrpoint.save();
      setIsupdated(!isUpdated);
    }
    setShow(false);
    toast.success("success post");
  }

  async function mintPublishPost() {
    try {
      if (!discription) {
        toast.error("This field is require!");
        return;
      }
      setLoaing(true);
      const data = {
        title: discription,
        postImage: avatar,
        tag: tags,
        address: user.attributes.ethAddress,
      };

      const file = new Moralis.File("data.json", {
        base64: btoa(JSON.stringify(data)),
      });
      const dataUri = await file.saveIPFS();
      const uri = dataUri._ipfs;
      console.log(uri, "uri");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(tokenAddres, TokenAbi.abi, signer);
      let transaction = await contract.createToken(uri);
      let tx = await transaction.wait();
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();

      contract = new ethers.Contract(socialAddress, PostAbi.abi, signer);
      transaction = await contract.createPost(uri, tokenId);
      await transaction.wait();

      const saveData = {
        title: discription,
        postImage: avatar,
        tag: tags,
        uri: uri,
        tokenId: tokenId,
        address: user.attributes.ethAddress,
      };
      await sendNotifications({
        to: user.attributes.ethAddress,
        message: `Successfuly Mint and Published post ${discription}`,
      });
      await save({ saveData, user });

      if (user) {
        userQuery.equalTo("user", user.id);
        const usrpoint = await userQuery.first();

        if (
          usrpoint.attributes.MintNFT != undefined &&
          usrpoint.attributes.MintNFT != null
        ) {
          usrpoint.set("MintNFT", 10 + usrpoint.attributes.MintNFT);
        } else {
          usrpoint.set("MintNFT", 10);
        }
        usrpoint.set("user", user.id);
        await usrpoint.save();
      }
      setIsupdated(!isUpdated);
      toast.success("Successfully created Your Post!!");
      setShow(false);
      setLoaing(false);
    } catch (error) {
      console.log(error);
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
        Create Post
      </button>

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header className="card" closeButton>
          <Modal.Title className="h4">Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="card">
          <div className="card-body p-0 mt-3 position-relative">
            <figure className="avatar position-absolute ms-2 mt-1 top-5">
              <img
                src={"assets/images/user.png"}
                alt="icon"
                className="shadow-sm rounded-circle w30"
              />
            </figure>
            <textarea
              onChange={(e) => setdiscription(e.target.value)}
              name="message"
              className="h20 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg"
              cols="20"
              rows="5"
              placeholder="Share funny moment"
            ></textarea>
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
                {upload ? "Uploading..." : "Upload Meme(PNG, JPG, GIF, MP4.)"}
              </span>
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer className="card">
          <button
            style={{ border: "none" }}
            className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
            onClick={mintPublishPost}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
