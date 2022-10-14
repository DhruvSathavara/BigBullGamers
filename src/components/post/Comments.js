import React, { useEffect, useState } from "react";
import moment from "moment";
import { List, Button, TextField, IconButton, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
  useWeb3ExecuteFunction,
  useMoralisCloudFunction,
} from "react-moralis";
import { ToastContainer, toast } from "react-toastify";
import CommentList from "./CommentList";
import { tokenAddres, socialAddress } from "../../config";
import Web3 from "web3";
import PostAbi from "../../abi/Post.json";
import TokenAbi from "../../abi/Token.json";
import { ethers } from "ethers";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faConnectdevelop } from "@fortawesome/free-brands-svg-icons";
import Tooltip from "@mui/material/Tooltip";
import SendGift from "../modal/SendGift";
export default function Comments(props) {
  const { user, Moralis, isInitialized } = useMoralis();
  // const { isSaving, save, error } = useNewMoralisObject("Comments");
  const { element } = props;
  const [like, setlike] = useState(0);
  const [dislike, setDislike] = useState(0);
  const [reward, setreward] = useState(0);
  const [comment, setComments] = React.useState([""]);
  const [showComment, setShowComment] = useState(false);
  const [getDisLikes, setDisLikes] = useState();
  const [getComment, setGetComment] = useState();
  const { data, error, isLoading } =
    useMoralisCloudFunction("getAllMintedPost");
  const [isUpdated, setIsUpdated] = useState(false);
  const [postid, setPostid] = useState();

  const Comt = Moralis.Object.extend("Comments");
  const Post = Moralis.Object.extend("UserPosts");
  const Likes = Moralis.Object.extend("likes");

  const query = new Moralis.Query(Comt);
  const myComt = new Comt();
  const myPost = new Post();
  const myLikes = new Likes();
  // const query = new Moralis.Query(myComt);
  useEffect(() => {
    if (isInitialized) {
      getAllComments();
      getAllLikes();
      const fetchedContent = JSON.parse(JSON.stringify(data));
    }
  }, [isUpdated]);

  async function getAllComments() {
    const idd = element.objectId;
    myPost.id = idd;
    query.equalTo("parent", myPost);
    const dd = await query.find();
    const getComt = JSON.parse(JSON.stringify(dd));
    setGetComment(getComt);
  }
  async function getAllLikes() {
    const idd = element.objectId;
    const queryPost = new Moralis.Query(Post);
    queryPost.equalTo("objectId", idd);
    const lk = await queryPost.first();
    // const dd = await query.find();
    // const getComt = JSON.parse(JSON.stringify(dd));
    // setGetLikes(getComt);
  }
  async function handleSubmit(element) {
    const id = element.objectId;
    // setObjectId(id);
    myPost.id = id;
    myComt.set("user", user);
    myComt.set("comment", comment);
    myComt.set("parent", myPost);
    await myComt.save();
    setIsUpdated(!isUpdated);
    //  await save({comment });
    toast.success("success!");
  }
  const upvote = async () => {
    const id = element.objectId;
    myPost.id = id;
    const query = new Moralis.Query(Likes);
    const queryPost = new Moralis.Query(Post);

    queryPost.equalTo("objectId", id);
    queryPost.equalTo("usersLike", user.id);
    const lk = await queryPost.first();

    // query.equalTo("post", myPost);
    // query.equalTo("user", user);
    // const count = await query.first();
    // console.log(count, "count");
    if (lk) {
      // count.set("post", myPost);
      // count.set("user", user);
      // count.set("upvote", true);
      // count.set("like", 1);
      lk.set("likes", element.likes + 1);
      // lk.set("dislikes", element.dislikes - 1);
      lk.addAll("usersLike", user.id);
      await lk.save();
      setIsUpdated(!isUpdated);
      // myPost.likes = 0 + 1;
      // console.log(myPost, "myPost");
      // count.save();
    } else {
      // myLikes.set("post", myPost);
      // myLikes.set("user", user);
      // myLikes.set("upvote", true);
      // myLikes.set("like", 1);
      myPost.set("likes", 1);
      myPost.addAll("usersLike", user.id);
      await myPost.save();
      setIsUpdated(!isUpdated);
      // myPost.likes = 0 + 1;
      // myLikes.save();
      // console.log(myPost, "myPost");
    }
  };

  const downvote = async () => {
    const id = element.objectId;
    myPost.id = id;
    const query = new Moralis.Query(Likes);
    const queryPost = new Moralis.Query(Post);

    queryPost.equalTo("objectId", id);
    const lk = await queryPost.first();

    // query.equalTo("post", myPost);
    // query.equalTo("user", user);
    // const count = await query.first();
    if (lk) {
      // count.set("post", myPost);
      // count.set("user", user);
      // count.set("upvote", false);
      // count.set("like", 0);
      lk.set("dislikes", element.dislikes + 1);
      lk.addAll("usersLike", user.id);
      lk.save();
      setIsUpdated(!isUpdated);
      // myPost.likes = 0 - 0;
      // console.log(myPost, "myPost d");
      // count.save();
    } else {
      // myLikes.set("post", myPost);
      // myLikes.set("user", user);
      // myLikes.set("upvote", false);
      // myLikes.set("like", 0);
      // myPost.likes = 0 - 0;
      lk.set("dislikes", 1);
      lk.addAll("usersLike", user.id);
      lk.save();
      setIsUpdated(!isUpdated);
      // console.log(myPost, "myPost d");
      // myLikes.save();
    }
  };
  const handleShowComment = () => {
    setShowComment(!showComment);
  };
  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
      <div className="card-body p-0 d-flex">
        <figure className="avatar me-3">
          <img
            src={
              element.user !== null
                ? element.user["Avatar"]
                  ? element.user["Avatar"]
                  : "assets/images/user.png"
                : "assets/images/user.png"
            }
            alt={element.user !== null ? element.user["username"] : "user"}
            className="shadow-sm rounded-circle w45"
          />
        </figure>
        <h4 className="fw-700 text-grey-900 font-xssss mt-1">
          {" "}
          {element.user !== null
            ? element.user["username"]
              ? element.user["username"]
              : element.user["objectId"]
            : ""}
          <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
            {" "}
            {moment(element.createdAt).format("MMM Do YY")}
          </span>
        </h4>
        <div className="ms-auto pointer">
          {element.saveData.tokenId ? (
            <FontAwesomeIcon
              style={{ width: "22px", height: "22px" }}
              icon={faConnectdevelop}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <ToastContainer />
      <div className="card-body p-0 d-flex mb-2">
        <span className="d-block font-xssss fw-500 mt-1 lh-3 text-dark">
          {element ? element.saveData["title"] : ""}
          <br /> {element ? element.saveData["tag"] : ""}
        </span>
      </div>
      {element.saveData.postImage != null ? (
        <div className="card-body d-block p-0 mb-3">
          <div className="row ps-2 pe-2">
            <div className="col-sm-12 p-1">
              <img
                width="100%"
                height="300"
                src={`${
                  element.saveData["postImage"]
                    ? element.saveData["postImage"]
                    : ""
                }`}
                className="rounded-3 "
                alt="post"
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="card-body d-flex p-0">
        <div
          onClick={upvote}
          className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
        >
          <i
            className="feather-heart
 text-white  me-1 btn-round-xs font-xss "
          ></i>{" "}
          <span className="mx-2">{element.likes} </span>
        </div>

        {/* <div className="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss">
    <h4 className="d-none-xss text-success fw-600">${reward.toFixed(2)}</h4>
</div> */}
        <div
          onClick={handleShowComment}
          className="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss cursor-pointer"
        >
          <i className="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"></i>
          <span className="d-none-xss">Comment</span>
        </div>
        <SendGift data={element} />
        {/* <div onClick={props.function()} className="pointer ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss "  >
                    <i className="feather-gift text-grey-900 text-dark btn-round-sm font-lg"></i>
                    <span className="d-none-xs" >Gift</span>
                </div> */}
      </div>
      <Divider />
      {showComment ? (
        <div>
          <div className="d-flex justify-content-between mt-2">
            <div className="p-0">
              <div className="avatar me-3">
                <img
                  src={
                    element.user["Avatar"]
                      ? element.user["Avatar"]
                      : "assets/images/user.png"
                  }
                  alt={element.user["username"]}
                  className="shadow-sm rounded-circle w35"
                />
              </div>
            </div>
            <form className="col-10 header-search ms-3 d-flex align-items-center">
              <div className="form-group mb-0 icon-input w-100">
                <input
                  onChange={(e) => setComments(e.target.value)}
                  type="text"
                  placeholder="Write a comment.."
                  className="bg-grey border-0  pt-2 pb-2  font-xssss fw-500  rounded-xl theme-dark-bg h4"
                  style={{ width: "100%" }}
                />
              </div>
              <IconButton onClick={() => handleSubmit(element)}>
                <SendIcon className="mx-2 h4" />
              </IconButton>
            </form>
          </div>
          {getComment
            ? getComment.map((comt) => {
                return <CommentList data={comt} postid={postid} />;
              })
            : ""}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
