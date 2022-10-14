import { List } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactReadMoreReadLess from "react-read-more-read-less";
import BadgeModal from "../modal/BadgeModal";
import ContestApplyModal from "../modal/ContestApplyModal";
import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
  useMoralisFile,
  useMoralisCloudFunction,
} from "react-moralis";
import { toast, ToastContainer } from "react-toastify";

export default function ContestList(props) {
  const { user, Moralis, isInitialized } = useMoralis();
  // const { isSaving, save, error } = useNewMoralisObject("JoinContest");
  // const { data, isLoading } = useMoralisCloudFunction("getAllContestParticipate");

  const { data, isLoading } = useMoralisQuery("JoinContest", (query) =>
    query.matches("user", user.id)
  );

  const JoinCon = Moralis.Object.extend("JoinContest");
  const qr = new JoinCon();

  const [show, setShow] = useState(false);
  const [contest, setContest] = useState(false);
  const [status, setStatus] = useState();
  const [apply, setApply] = useState("Participate");

  useEffect(async () => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));
      setContest(fatchContest);
    }
  }, [data]);

  useEffect(() => {
    contest ? (
      contest.map((e) => {
        if (e.user.objectId == user.id && e.contestId == props.data.objectId) {
          setApply("Applyed");
          setStatus(e);
        }
      })
    ) : (
      <></>
    );
  }, [contest]);

  const handleOpenModal = () => {
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const handleSubmit = async () => {
    setApply("Applyed");
    const status = 1;
    const objectId = props.data.objectId;

    qr.set("status", "1");
    qr.set("contestId", objectId);
    qr.set("user", user);
    qr.save().then(
      (monster) => {
        toast.success("Successfully Applied!");
      },
      (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        toast.error(error.message);
      }
    );

    // await save({ status, objectId, user });
    setShow(false);
  };

  return (
    <div className="col-md-4 col-sm-6 pe-2 ps-2">
      <ToastContainer />
      <div className="theme-dark-bg d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
        <div className="card-body d-block w-100 p-0 text-center">
          <figure className="avatar ms-auto me-auto mb-0 position-relative  z-index-1">
            <div className="imgWidth">
              <img
                src={props.data.contestData.img}
                alt="avater"
                height={200}
                className=" bg-white w-100"
              />
            </div>
          </figure>
          <div className="p-4">
            <div className="clearfix"></div>
            <h4 className="fw-700 font-xss mt-0 mb-0">
              {props.data.contestData.title}{" "}
            </h4>
            <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">
              {props.data.user.username}
            </p>
            <ul className="   mt-1">
              <li className="m-2 d-flex justify-content-evenly">
                <h3 className="font-s fw-500   text-grey-500 d-block">
                  Start Date :
                </h3>
                <h4 className="fw-700 font-xs start-date">
                  {moment(props.data.contestData.start.iso).format("MMM Do YY")}{" "}
                </h4>
              </li>
              <li className="m-2 d-flex justify-content-evenly">
                <h3 className="font-s fw-500   text-grey-500 d-block">
                  End Date :
                </h3>
                <h4 className="fw-700 font-xs start-date">
                  {moment(props.data.contestData.end.iso).format("MMM Do YY")}{" "}
                </h4>
              </li>
              <li className="m-2 d-flex justify-content-evenly">
                <h3 className="font-s fw-500   text-grey-500 d-block">
                  Scholarship :
                </h3>
                <h4 className="fw-700 font-xs start-date">
                  ${props.data.contestData.prize}{" "}
                </h4>
              </li>
            </ul>
            <h5 className="fw-700 font-xs start-date text-center">About</h5>

            {/* <ReactReadMoreReadLess
                            className="h4"
                            charLimit={100}
                            readMoreText={<button className="btn ">Read More</button>}
                            readLessText={<button className="btn ">Read Less</button>}
                        >
                            {props.data.contestData.description}
                        </ReactReadMoreReadLess> */}
            <div className="d-flex justify-content-evenly mt-2">
              {apply == "Submit" ? (
                <BadgeModal title={props.data} status={status} />
              ) : (
                <button
                  onClick={handleOpenModal}
                  style={{ border: "none" }}
                  className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
                >
                  {apply}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} style={{ overflowY: "scroll" }}>
        <Modal.Header className="theme-dark-bg" closeButton>
          <Modal.Title className="h4" style={{ fontWeight: "600" }}>
            Title : {props.data.contestData.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="theme-dark-bg" style={{ padding: "0" }}>
          <h3 className="p-3 ">Are you sure you want to apply?</h3>
        </Modal.Body>
        <Modal.Footer className="theme-dark-bg">
          <button className="btn btn-danger" onClick={handleClose}>
            No
          </button>
          <button
            style={{ border: "none" }}
            className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
            onClick={handleSubmit}
          >
            Yes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
