import React, { Component, Fragment, useState, useEffect } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Pagetitle from "../components/Pagetitle";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import SendMsg from "../components/modal/sendMsg";

function Gamers() {
  const { Moralis, user, isInitialized } = useMoralis();
  const { data, isLoading, error } = useMoralisCloudFunction("getAllUser");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));
      setUsers(fatchContest);
    }
  }, [isLoading, error]);
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
                    {"Gamers"}
                    <form action="#" className="pt-0 pb-0 ms-auto">
                      <div className="search-form-2 ms-2">
                        <i className="ti-search font-xss"></i>
                        <input
                          type="text"
                          className="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0"
                          placeholder="Search here."
                        />
                      </div>
                    </form>
                    <a
                      href="/"
                      className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"
                    >
                      <i className="feather-filter font-xss text-grey-500"></i>
                    </a>
                  </h2>
                </div>

                <div className="row ps-2 pe-1">
                  {users &&
                    users.map((value, index) => (
                      <div key={index} className="col-md-4 col-sm-6 pe-2 ps-2">
                        {console.log(value)}
                        <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3 gamers">
                          <div className="card-body d-block w-100 p-4 text-center">
                            <figure className="avatar ms-auto me-auto mb-0 position-relative w90 z-index-1">
                              <img
                                src={
                                  value.profilePic?.url
                                    ? value.profilePic?.url
                                    : `assets/images/user.png`
                                }
                                alt="avater"
                                className="float-right p-1 bg-white rounded-circle w-100"
                              />
                            </figure>
                            <div className="clearfix"></div>
                            <h4 className="fw-700 font-xss mt-3 mb-0">
                              {value.username}{" "}
                            </h4>
                            <p className="fw-500 font-xssss text-grey-500 mt-0 mb-3">
                              {value.ethAddress}
                            </p>

                            <div className="ml-auto mailBox">
                              <SendMsg data={value.objectId} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default Gamers;
