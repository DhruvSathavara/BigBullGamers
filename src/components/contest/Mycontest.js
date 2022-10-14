import React, { useEffect, useState } from "react";
import moment from "moment";
import { Modal } from "react-bootstrap";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import Card from "../skeleton/Card";

export default function Mycontest(props) {
  const { user, Moralis, isInitialized } = useMoralis();
  const { data, isLoading, error } = useMoralisCloudFunction(
    "getAllContestParticipate"
  );
  const [mycontest, setMycontest] = useState();
  const [contestId, setContestId] = useState();
  const [contestList, setContestList] = useState();
  const JoinCon = Moralis.Object.extend("UserContests");
  const query = new Moralis.Query(JoinCon);

  useEffect(() => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));
      // console.log(data, "datas");
      setMycontest(fatchContest);
    }
  }, [isLoading, error]);

  useEffect(() => {
    mycontest ? (
      mycontest.map((e) => {
        if (e.user.objectId == user.id) {
          setContestId(e.contestId);
        }
      })
    ) : (
      <></>
    );
  }, [mycontest, isLoading]);

  useEffect(async () => {
    if (isInitialized) {
      query.equalTo("objectId", contestId);
      const result = await query.first();
      setContestList(result);
    }
  }, [mycontest, contestId, isLoading]);

  // if(contestList !== null && contestList !== undefined){
  //     contestList.map
  // }

  if (contestList !== null && contestList !== undefined) {
    return (
      <div className="col-md-4 col-sm-6 pe-2 ps-2">
        <div className="theme-dark-bg d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
          <div className="card-body d-block w-100 p-0 text-center">
            <figure className="avatar ms-auto me-auto mb-0 position-relative  z-index-1">
              <div className="imgWidth">
                <img
                  src={contestList.attributes.contestData.img}
                  alt="avater"
                  height={200}
                  className=" bg-white w-100"
                />
              </div>
            </figure>
            <div className="p-4">
              <div className="clearfix"></div>
              <h4 className="fw-700 font-xss mt-0 mb-0">
                {contestList.attributes.contestData.title}{" "}
              </h4>
              <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">
                {contestList.attributes.user.username}
              </p>
              <ul className="   mt-1">
                <li className="m-2 d-flex justify-content-evenly">
                  <h3 className="font-s fw-500   text-grey-500 d-block">
                    Start Date :
                  </h3>
                  <h4 className="fw-700 font-xs start-date">
                    {moment(
                      contestList.attributes.contestData.start.iso
                    ).format("MMM Do YY")}{" "}
                  </h4>
                </li>
                <li className="m-2 d-flex justify-content-evenly">
                  <h3 className="font-s fw-500   text-grey-500 d-block">
                    End Date :
                  </h3>
                  <h4 className="fw-700 font-xs start-date">
                    {moment(contestList.attributes.contestData.end.iso).format(
                      "MMM Do YY"
                    )}{" "}
                  </h4>
                </li>
                <li className="m-2 d-flex justify-content-evenly">
                  <h3 className="font-s fw-500   text-grey-500 d-block">
                    Prize :
                  </h3>
                  <h4 className="fw-700 font-xs start-date">
                    {contestList.attributes.contestData.prize}{" "}
                  </h4>
                </li>
              </ul>
              <h5 className="fw-700 font-xs start-date text-center">About</h5>

              <ReactReadMoreReadLess
                className="description text-left"
                charLimit={100}
                readMoreText={<button className="btn ">Read More</button>}
                readLessText={<button className="btn ">Read Less</button>}
              >
                {contestList.attributes.contestData.description}
              </ReactReadMoreReadLess>
              <div className="d-flex justify-content-evenly mt-2">
                <button
                  style={{ border: "none" }}
                  className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
                >
                  Submited
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <h3>No join any contest yet!</h3>;
  }
}
