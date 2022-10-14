import React, { Component, Fragment, useEffect } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";

import GoogleMapReact from "google-map-react";

import { MarketplaceContext } from "../context/MarketplaceContext";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Mraketplace() {
  const marketplaceContext = React.useContext(MarketplaceContext);
  const { loadNfts, loadingNfts, nfts, updated, buyNft } = marketplaceContext;

  useEffect(() => {
    loadNfts();
  }, [updated]);

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              {nfts &&
                nfts.length > 0 &&
                nfts.map((value, index) => (
                  <div key={index} className="col-lg-4 col-md-6 pe-2 ps-2">
                    {console.log(value)}
                    <div className="card p-3 bg-white w-100 hover-card border-0 shadow-xss rounded-xxl border-0 mb-3 overflow-hidden marketItem">
                      <div className="card-image w-100">
                        <img
                          src={value.image}
                          alt="event"
                          className="w-100 rounded-3 marketImage"
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
                          onClick={() => buyNft(value)}
                        >
                          BUY
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

export default Mraketplace;
