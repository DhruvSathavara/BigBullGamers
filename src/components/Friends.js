import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import SendMsg from "./modal/sendMsg";

const friendList = [
  {
    imageUrl: "user.png",
    name: "Anthony Daugloi",
    friend: "12",
  },
  {
    imageUrl: "user.png",
    name: "Mohannad Zitoun",
    friend: "18",
  },
  {
    imageUrl: "user.png",
    name: "Hurin Seary",
    friend: "28",
  },
];

function Friends() {
  const { Moralis, user, isInitialized } = useMoralis();
  const { data, isLoading, error } = useMoralisCloudFunction("getAllUser");
  const [users, setUsers] = useState([]);

  async function getAllUsers() {}

  useEffect(() => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));
      setUsers(fatchContest);
    }
  }, [isLoading, error]);

  return (
    <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3 pr-2">
      <div className="card-body d-flex align-items-center p-4">
        <h4 className="fw-700 mb-0 font-xssss text-grey-900">Users</h4>
        <a
          href="/defaultmember"
          className="fw-600 ms-auto font-xssss text-primary"
        >
          See all
        </a>
      </div>

      {users &&
        users
          .filter((u, i) => i < 6)
          .map((value, index) => (
            <div
              className="wrap d-flex "
              key={index}
              style={{ alignSelf: "start" }}
            >
              <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 bor-0">
                <figure className="avatar me-3">
                  <img
                    src={
                      value.Avatar != null
                        ? value.Avatar
                        : "assets/images/user.png"
                    }
                    alt="avater"
                    className="shadow-sm rounded-circle w45"
                  />
                </figure>
                <div>
                  <h4
                    style={{
                      textOverflow: "ellipsis",
                      width: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                    className="fw-700 text-grey-900 font-xssss mt-1 "
                  >
                    {value.username}
                  </h4>
                  <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                    {"10"} mutual friends
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                <SendMsg data={value.objectId} />
              </div>
            </div>
          ))}
    </div>
  );
}

export default Friends;
