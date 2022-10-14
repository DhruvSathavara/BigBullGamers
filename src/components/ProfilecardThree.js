import React, { useEffect, useState, Fragment } from "react";
import FollowerModal from "./modal/FollowerModal";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Postview from "../components/post/Postview";
import Nfts from "../components/nfts/AllNfts";
import Load from "./Load";
import EditProfile from "./modal/EditProfile";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";
import MyPost from "../components/post/MyPost";

import { useMoralis, useMoralisFile } from "react-moralis";
import SendMsg from "./modal/sendMsg";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ProfilecardThree() {
  const [value, setValue] = React.useState(0);

  const { user, Moralis, isInitialized } = useMoralis();
  const [total, setTotal] = useState(0);
  const [userName, setUserName] = useState("");
  const [cover, setCover] = useState("");
  const [avatar, setAvatar] = useState("");

  const users = Moralis.Object.extend("UsePointsTable");
  const query = new Moralis.Query(users);

  useEffect(async () => {
    if (
      user.attributes != null &&
      user.attributes != undefined &&
      isInitialized
    ) {
      query.equalTo("user", user.id);
      const data = await query.first();
      setTotal(data.attributes.TotalPoints);

      setUserName(user.attributes.username);
      setCover(user.attributes.cover);
      setAvatar(user.attributes.Avatar);
    }
  }, [user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content right-chat-active profile">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
              <div className="card-body h250 p-0 rounded-xxl overflow-hidden m-3">
                <img
                  height={200}
                  width="100%"
                  src={cover ? cover : "assets/images/user.png"}
                  alt="avater"
                />
              </div>
              <div className="card-body p-0 position-relative">
                <figure
                  className="avatar position-absolute w100 z-index-1"
                  style={{ top: "-40px", left: "30px" }}
                >
                  <img
                    src={avatar ? avatar : "assets/images/user.png"}
                    alt="avater"
                    className="float-right p-1 bg-white rounded-circle w-100"
                  />
                </figure>

                <h4 className="fw-700 font-sm mt-2  pl-15">
                  {userName ? userName : "username"}
                  <span className="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block">
                    @{userName ? userName : "username"}
                  </span>
                </h4>
                <h4 className="fw-700 font-sm mt-2  pl-15">
                  {" "}
                  BBG Points : {total}
                </h4>
                <div className="d-flex align-items-center justify-content-center position-absolute-md right-15 top-0 me-2">
                  <EditProfile />
                  {/*
                <SendMsg /> */}
                </div>
              </div>
              <FollowerModal />
              <div className="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
                {/* <ul className="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4" id="pills-tab"
                role="tablist">
                <li className="active list-inline-item me-5"><a
                        className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block active"
                        href="#navtabs1" data-toggle="tab">Posts</a></li>
                <li className="list-inline-item me-5"><a
                        className="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs2"
                        data-toggle="tab">My NFTs</a></li>
            </ul> */}
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab className="tabs" label="POSTS" {...a11yProps(0)} />
                      <Tab className="tabs" label="MY NFTS" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <MyPost />
                    <Load />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Nfts />
                    <Load />
                  </TabPanel>
                </Box>
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

export default ProfilecardThree;
