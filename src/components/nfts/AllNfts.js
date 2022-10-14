import React, { Component, Fragment, useEffect } from "react";
import Header from "../Header";
import Leftnav from "../Leftnav";
import Rightchat from "../Rightchat";
import Appfooter from "../Appfooter";
import Popupchat from "../Popupchat";

import GoogleMapReact from "google-map-react";

import { MarketplaceContext } from "../../context/MarketplaceContext";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Nfts() {
  const marketplaceContext = React.useContext(MarketplaceContext);
  const { loadMyNFTs, myNfts, PutOnSale, updated } = marketplaceContext;

  useEffect(() => {
    loadMyNFTs();
  }, [updated]);

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content right-chat-active nfts">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              {myNfts &&
                myNfts.length > 0 &&
                myNfts.map((value, index) => (
                  <div key={index} className="col-lg-4 col-md-6 pe-2 ps-2">
                    <div className="card p-3 bg-white w-100 hover-card border-0 shadow-xss rounded-xxl border-0 mb-3 overflow-hidden marketItem">
                      <div className="card-image w-100">
                        <img
                          src={value.image}
                          alt="event"
                          className="w-100 rounded-3"
                        />
                      </div>
                      <div className="card-body d-flex ps-0 pe-0 pb-0">
                        <h2 className="fw-700 lh-3 font-xss">
                          {value.name}
                          <span className="d-flex font-xssss fw-500 mt-2 lh-3 text-grey-500">
                            {value.description}{" "}
                          </span>
                          <span className="d-flex font-xssss fw-500 mt-2 lh-3 text-grey-500">
                            {value.price} KLAY{" "}
                          </span>
                        </h2>
                      </div>
                      <div className="card-body p-0">
                        <a
                          className="font-xsssss fw-700 ps-3 pe-3 lh-32 float-right mt-4 text-uppercase rounded-3 ls-2 bg-success d-inline-block text-white me-1"
                          onClick={() => PutOnSale(value)}
                        >
                          RESell
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Popupchat />
      <Appfooter />
    </Fragment>
  );
}

export default Nfts;
