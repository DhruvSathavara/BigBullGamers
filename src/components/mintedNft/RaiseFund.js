import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function RaiseFund(props) {
  const [fund, setFund] = useState();
  const [raised, setRaised] = useState([]);

  useEffect(() => {
    const sum =
      props.data &&
      props.data.reduce((n, { raisedFund }) => n + parseFloat(raisedFund), 0);
    setRaised(sum);
  }, [props]);

  return (
    <Typography
      color="textPrimary "
      gutterBottom
      variant="h5"
      style={{ fontSize: "15px" }}
    >
      {raised ? parseFloat(raised).toFixed(2) : 0} KLAY raised out of{" "}
      {props.goal} KLAY
    </Typography>
  );
}

export default RaiseFund;
