import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { Button } from "@mui/material";
import moment from "moment";
import UserContestList from "../modal/userContestList";
import ContestApplyModal from "../modal/ContestApplyModal";
import UserProfileModal from "../modal/UserProfileModal";
import SkeletonCard from "../skeleton/Card";

export default function ContestParticipated() {
  const { user, Moralis, isInitialized } = useMoralis();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { data, isLoading, error } = useMoralisCloudFunction("getAllContest");
  const [userData, setUserData] = useState();

  useEffect(async () => {
    if (isInitialized) {
      const fatchContest = JSON.parse(JSON.stringify(data));
      setUserData(fatchContest);
    }
  }, [isLoading, error]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (userData != null && userData != undefined) {
    return (
      <Paper
        sx={{ width: "100%", overflow: "hidden" }}
        className="theme-dark-bg"
      >
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
                  Scholarship Name
                </TableCell>
                <TableCell
                  key="startdate"
                  align="left"
                  style={{ minWidth: 170 }}
                  className="theme-dark-bg h4"
                >
                  Start Date
                </TableCell>
                <TableCell
                  key="enddate"
                  align="left"
                  style={{ minWidth: 170 }}
                  className="theme-dark-bg h4"
                >
                  End Date
                </TableCell>
                <TableCell
                  key="userlist"
                  align="left"
                  style={{ minWidth: 170 }}
                  className="theme-dark-bg h4"
                >
                  Students List
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData ? (
                userData.map((element) => {
                  if (element.user.objectId == user.id) {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell align={"left"} className="theme-dark-bg h4">
                          {element.contestData.title}
                        </TableCell>
                        <TableCell align={"left"} className="theme-dark-bg h4">
                          {moment(element.contestData.start.iso).format(
                            "MMM Do YY"
                          )}
                        </TableCell>
                        <TableCell align={"left"} className="theme-dark-bg h4">
                          {moment(element.contestData.end.iso).format(
                            "MMM Do YY"
                          )}
                        </TableCell>
                        <TableCell align={"left"} className="theme-dark-bg h4">
                          {/* <button className='btn btn-primary'>Users Applied</button> */}
                          <UserContestList ele={element} />
                        </TableCell>
                      </TableRow>
                    );
                  }
                })
              ) : (
                <SkeletonCard />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    // count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
      </Paper>
    );
  } else {
    return <h3>You have not created any contest!!</h3>;
  }
}
