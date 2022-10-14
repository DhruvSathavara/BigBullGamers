import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Appfooter from "../components/Appfooter";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Popupchat from "../components/Popupchat";
import Rightchat from "../components/Rightchat";
import SkeletonCard from "../components/skeleton/Card";
import { mintNftAddres, socialAddress, tokenAddres } from "../config";

function MIntedNftPosts() {
  const { Moralis, isInitialized } = useMoralis();
  const [data, setData] = useState([]);
  const [tokenid, setTokenid] = useState([]);
  const [uriData, setUriData] = useState([]);
  const [meta, setMeta] = useState([]);
  const [isUpdated, setIsupdated] = useState(false);

  const covalent = Moralis.Plugins.covalent;
  async function getMintedNft() {
    const ids = [...tokenid];
    const result = await covalent.getNftTokenIdForContract({
      chainId: 28,
      contractAddress: tokenAddres,
    });
    console.log(result, "result");
    const dd =
      result.data.items &&
      result.data.items.map(async (e) => {
        ids.push(e.token_id);
      });
    setTokenid(ids);
  }

  useEffect(() => {
    if (isInitialized) {
      Moralis.initPlugins();
      getMintedNft();
    }
  }, []);

  useEffect(async () => {
    const getUri = [...data];
    const tokenUriData = [...uriData];
    const metadata = [...meta];

    for (let index = 0; index < tokenid.length; index++) {
      const element = tokenid[index];
      const res = await covalent.getNftExternalMetadataForContract({
        chainId: 80001,
        contractAddress: tokenAddres,
        tokenId: element,
      });
      getUri.push(res.data);
    }
    setData(getUri);
    {
      console.log(getUri, "getUri");
    }

    for (let index = 0; index < getUri.length; index++) {
      const element = getUri[index];

      tokenUriData.push(element.items[0].nft_data[0].token_url);
    }

    for (let index = 0; index < tokenUriData.length; index++) {
      const element = tokenUriData[index];

      var newStr = element.replace(
        "http://10.128.0.18",
        "https://ipfs.moralis.io:2053"
      );
      const dd = await axios.get(newStr);

      metadata.push(dd.data);
    }
    setMeta(metadata);
  }, [tokenid]);

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
              <div className="row">
                <h1>Minted Posts NFTs Collection</h1>
              </div>
              <div className="row">
                {/* <div className='col-xl-12'> */}
                {console.log(meta, "meta")}

                {meta.length != 0 ? (
                  meta.map((e, i) => {
                    return (
                      <div
                        key={meta[i].address}
                        className="col-lg-4 col-sm-6 theme-dark-bg  shadow-xss rounded-xxl border-0 p-3 mb-3"
                      >
                        <div className="card-body p-0 d-flex">
                          <h4
                            style={{
                              textOverflow: "ellipsis",
                              width: "100px",
                              overflow: "hidden",
                            }}
                            className="fw-700 text-grey-900 font-xssss mt-1 text-nowrap"
                          >
                            {" "}
                            {meta[i].address}
                          </h4>
                        </div>
                        <div className="card-body p-0 ">
                          <h4 className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-800">
                            {meta[i].title}
                          </h4>
                          <p className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                            {meta[i].tag}
                          </p>
                        </div>
                        {meta[i].postImage != null ? (
                          <div className="card-body d-block p-0 mb-3">
                            <div className="row ps-2 pe-2">
                              <div className="col-sm-12 p-1">
                                <img
                                  width="100%"
                                  height="300"
                                  src={`${meta[i].postImage}`}
                                  className="rounded-3 "
                                  alt="post"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })
                ) : (
                  <SkeletonCard />
                )}
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

export default MIntedNftPosts;
