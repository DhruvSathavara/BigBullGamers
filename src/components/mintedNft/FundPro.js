import { Box, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import RaiseFund from "./RaiseFund";

function FundPro(props) {
  const [progress, setProgress] = React.useState(0);
  const [raised, setRaised] = useState([]);

  useEffect(() => {
    const sum =
      props.data &&
      props.data.reduce((n, { raisedFund }) => n + parseFloat(raisedFund), 0);
    setRaised(sum);

    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= props.goal ? raised : prevProgress
      );
    });
    return () => {
      clearInterval(timer);
    };
  }, [props]);
  console.log(progress);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1, padding: "10px" }}>
        {console.log(parseInt(raised) * 10)}
        <LinearProgress variant="determinate" value={raised * 10} />{" "}
        <RaiseFund data={props.data} goal={props.goal} />
      </Box>
    </Box>
  );
}

export default FundPro;
