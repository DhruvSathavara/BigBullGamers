import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";

function PaymentButton(props) {
  const [raised, setRaised] = useState([]);

  useEffect(() => {
    const sum =
      props.fund &&
      props.fund.reduce((n, { raisedFund }) => n + parseFloat(raisedFund), 0);
    setRaised(sum);
  }, [props]);

  return (
    <Box sx={{ mt: "15px", mb: "15px", textAlign: "center" }}>
      {props.goal === props.fund ? (
        <p>Funded</p>
      ) : (
        <Button
          onClick={props.open}
          className="text-center cursor-pointer bg-primary-gradiant"
          variant="contained"
          color="success"
        >
          Add Fund
        </Button>
      )}
    </Box>
  );
}

export default PaymentButton;
