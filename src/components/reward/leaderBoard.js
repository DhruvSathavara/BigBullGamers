import React, { Fragment, useEffect, useState } from "react";
import Header from "../Header";
import Leftnav from "../Leftnav";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { max } from "date-fns";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import UserData from "./UserData";

function LeaderBoard() {
  const { Moralis, user, isInitialized } = useMoralis();
  const [rankData, setRankData] = useState();
  const Points = Moralis.Object.extend("UsePointsTable");
  const query = new Moralis.Query(Points);

  useEffect(async () => {
    if (isInitialized) {
      query.descending("TotalPoints");
      let data = await query.find();
      data = JSON.parse(JSON.stringify(data));
      data.forEach((e, i) => {
        e.rank = i + 1;
      });

      setRankData(data);
    }
  }, []);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }} className="theme-dark-bg">
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                key="ContestId"
                align="left"
                style={{ minWidth: 170 }}
                className="theme-dark-bg h4"
              >
                Rank
              </TableCell>
              <TableCell
                key="startdate"
                align="left"
                style={{ minWidth: 170 }}
                className="theme-dark-bg h4"
              >
                User
              </TableCell>
              <TableCell
                key="enddate"
                align="left"
                style={{ minWidth: 170 }}
                className="theme-dark-bg h4"
              >
                Total SDT Points
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankData ? (
              rankData.map((element) => {
                return (
                  <TableRow
                    key={element.rank}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell align={"left"} className="theme-dark-bg h4">
                      {element.rank}
                    </TableCell>
                    <TableCell align={"left"} className="theme-dark-bg h4">
                      {element.user}
                    </TableCell>
                    <TableCell align={"left"} className="theme-dark-bg h4">
                      {element.TotalPoints}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <CircularProgress />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default LeaderBoard;
