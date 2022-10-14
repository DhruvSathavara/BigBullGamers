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

import { TextField } from "@mui/material";

import web3 from "web3";
import { NotificationContext } from "../../context/EpnsContext";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
//  import {NFTStorage} from 'nft.storage';
const apiKey = process.env.FILE_COIN_API_KEY;

// const client = new NFTStorage({ token: apiKey })

export default function CreateStream({ show, handleClose, group }) {
  const notificationContext = React.useContext(NotificationContext);
  const { sendNotifications, notificationItems } = notificationContext;
  const { user, Moralis, web3EnableError } = useMoralis();
  const { saveFile, moralisFile } = useMoralisFile();

  const [avatar, setAvatar] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isUpdated, setIsupdated] = useState(false);
  const [upload, setUpload] = useState(false);
  const [loading, setLoaing] = useState(false);

  const [startDate, setStartDate] = React.useState(new Date());

  // const ipfsProcessor = useMoralisFile();
  const contractProcessor = useWeb3ExecuteFunction();

  const Streams = Moralis.Object.extend("streams");
  const streams = new Streams();

  async function onChangeAvatar(e) {
    setUpload(true);
    const file = e.target.files[0];
    let fileIpfs = await saveFile(user.attributes.username, file, {
      saveIPFS: true,
    });
    setAvatar(fileIpfs._ipfs);
    setUpload(false);
  }

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };

  async function CreateStreamData() {
    if (!title || !url || !avatar || !startDate) return;

    try {
      setLoaing(true);
      streams.set("title", title);
      streams.set("url", url);
      streams.set("startDate", startDate);

      streams.set("image", avatar);
      streams.set("group", group.objectId);

      await streams.save();
      setLoaing(false);
      handleClose();
    } catch (error) {
      console.log("Error creating Group: ", error);
      setLoaing(false);
      handleClose();
    }
  }

  return (
    <div>
      <ToastContainer />

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header className="card" closeButton>
          <Modal.Title className="h4">Create Stream</Modal.Title>
        </Modal.Header>
        <Modal.Body className="card">
          <div className="card-body p-0 mt-3 position-relative">
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              className=" h4 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-900 fw-500 border-light-md theme-dark-bg"
              placeholder="Stream Title"
            />
          </div>
          <div className="card-body p-0 mt-3 position-relative">
            <input
              type="text"
              onChange={(e) => setUrl(e.target.value)}
              className=" h4 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-900 fw-500 border-light-md theme-dark-bg"
              placeholder="Stream Url"
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
                {upload
                  ? "Uploading..."
                  : "Upload Cover Image(PNG, JPG, GIF, MP4.)"}
              </span>
            </label>
          </div>
          <div className="card-body p-0 mt-3 position-relative">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Stream start date and time"
                value={startDate}
                onChange={handleChangeStartDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </Modal.Body>
        <Modal.Footer className="card">
          <button
            style={{ border: "none" }}
            className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
            disabled={loading}
            onClick={() => CreateStreamData()}
          >
            {loading ? "Adding..." : "Add Stream"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
