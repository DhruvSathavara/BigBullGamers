import React, { useEffect, useState } from "react";
import { useMoralisCloudFunction, useMoralis } from "react-moralis";

function PaidButton(props) {
  const [ownerAdd, setOwnerAdd] = useState(false);
  const { isInitialized } = useMoralis();
  const { data, isLoading, error } = useMoralisCloudFunction("getPaidScholar");

  useEffect(async () => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));

      const dd =
        fatchContest &&
        fatchContest.filter((e) => {
          if (e.to === props.data) {
            setOwnerAdd(true);
          }
        });
    }
  }, [props, isLoading, error]);
  return (
    <button
      onClick={props.open}
      style={{ border: "none" }}
      className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
    >
      {" "}
      {ownerAdd ? "Paid" : "Approve"}
    </button>
  );
}

export default PaidButton;
