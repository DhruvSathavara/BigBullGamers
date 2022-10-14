import React, { Component, Fragment, useEffect } from "react";
import Friends from "../components/Friends";
import Contacts from "../components/Contacts";
import Friendsilder from "../components/Friendsilder";
import Postview from "../components/post/Postview";
import Load from "../components/Load";
import { useMoralis } from "react-moralis";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";

function Home() {
  const { Moralis, user } = useMoralis();
  const userPoints = Moralis.Object.extend("UsePointsTable");
  const userQuery = new Moralis.Query(userPoints);

  useEffect(async () => {
    if (user) {
      userQuery.equalTo("user", user.id);
      const usrpoint = await userQuery.first();
      if (usrpoint !== undefined) {
        if (
          usrpoint.attributes.ConnectWalletPoints === "" &&
          usrpoint.attributes.ConnectWalletPoints === undefined
        ) {
          usrpoint.set("ConnectWalletPoints", 10);
          await usrpoint.save();
        }
      } else {
        const cwd = new userPoints();
        cwd.set("ConnectWalletPoints", 10);
        cwd.set("user", user.id);
        await cwd.save();
      }
    }
  }, []);

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <Postview />

                <Load />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
