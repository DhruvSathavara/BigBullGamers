import React, { useState, useEffect } from "react";
import { Modal, Nav } from "react-bootstrap";
import { List, Button, TextField, IconButton, Divider } from "@mui/material";
import {
  useMoralisQuery,
  useMoralisCloudFunction,
  useMoralis,
} from "react-moralis";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Load from "../Load";
import SendIcon from "@mui/icons-material/Send";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import Comments from "./Comments";
import Skeleton from "@mui/material/Skeleton";

function Postview() {
  // const { isLoading, data, error } = useMoralisQuery("UserPost");
  const { user, Moralis, isInitialized } = useMoralis();
  const { data, error, isLoading } = useMoralisCloudFunction("getAllBigBullPosts");
  const [postData, setPostData] = useState();
  var load;

  useEffect(() => {
    if (isInitialized) {
      const fetchedContent = JSON.parse(JSON.stringify(data));

      setPostData(fetchedContent);

      if (error) {
        toast.error(error.message);
      }
      if (isLoading) {
        return (load = <Load />);
      }
    }
  }, [data, error, isLoading]);

  return (
    <div className="">
      {postData ? (
        postData.map((element) => {
          // console.log(element, "element");
          return <Comments key={element.objectId} element={element} />;
        })
      ) : (
        <div className="row mt-2">
          <div className="col-12 pe-2 ps-2">
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="40%" />
            <Skeleton variant="rectangular" height={118} />
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Postview;
