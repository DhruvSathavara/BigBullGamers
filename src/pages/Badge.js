import React, { Component, Fragment, useEffect } from "react";
import { useMoralisCloudFunction, useMoralis } from "react-moralis";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Pagetitle from "../components/Pagetitle";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import moment from "moment";
import Skeleton from "@mui/material/Skeleton";
import { toast } from "react-toastify";
import ReactReadMoreReadLess from "react-read-more-read-less";

export default function Badge() {
  const { data, error, isLoading } = useMoralisCloudFunction("getAllContest");
  const { isInitialized } = useMoralis();
  const [contest, setContest] = React.useState();

  useEffect(() => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));
      // console.log(data, "data");
      setContest(fatchContest);
      // console.log(JSON.parse(JSON.stringify(data)));
    }
  }, [isLoading, error]);

  return (
    <Fragment>
      <Header />
      <Leftnav />
      {/* <Rightchat /> */}
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                <Pagetitle />
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
