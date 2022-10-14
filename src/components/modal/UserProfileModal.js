import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";
import { useMoralis } from "react-moralis";
import { Link, NavLink, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import DarkMode from "../Darkbutton";

export default function UserProfileModal() {
  const history = new useHistory();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { account, isAuthenticated, logout, user } = useMoralis();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickItems = () => {
    history.push("/userpage");
  };
  const handleClickLogout = async () => {
    await logout();
    window.location.reload();
    history.push("/");
  };
  return (
    <div className=" mx-1 ">
      <Tooltip title="Profile">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            sx={{
              background:
                "linear-gradient(to right, #00C897, #94DB13) !important",
              color: blue[600],
            }}
          >
            <PersonIcon />
          </Avatar>
          {/* <Avatar alt={user ? user.attributes.username : "Profile"} src={"assets/images/user.png"} /> */}
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px", padding: "0" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        style={{ padding: "0px" }}
      >
        <List
          style={{ minWidth: "260px", padding: "0" }}
          className="theme-dark-bg p-0"
        >
          <ListItem button>
            <ListItemAvatar>
              <Avatar
                sx={{
                  background: "linear-gradient(to right, #00C897, #94DB13)",
                  color: blue[600],
                }}
              >
                <PersonIcon />
                {/* { 
                                    user.attributes ? <img width="50" height="50" src={user.attributes.Avatar ? user.attributes.Avatar :" assets/images/user.png"} /> : <PersonIcon />
                                } */}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              className="h4"
              primary={user ? user.attributes.username : "user"}
            />
          </ListItem>
          <ListItem button onClick={handleClickItems}>
            <ListItemAvatar>
              <Avatar
                sx={{
                  background: "linear-gradient(to right, #00C897, #94DB13)",
                  color: blue[600],
                }}
              >
                <FontAwesomeIcon icon={faUser} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText className="h4" primary="Profile" />
          </ListItem>
          {/* <DarkMode /> */}
          <ListItem button onClick={handleClickLogout}>
            <ListItemAvatar>
              <Avatar
                sx={{
                  background: "linear-gradient(to right, #00C897, #94DB13)",
                  color: blue[600],
                }}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText className="h4" primary="Logout" />
          </ListItem>
        </List>

        {/* {
                    isAuthenticated ? <button className='btn btn-danger' onClick={() => logout()}>Logout</button> : ''
                } */}
      </Menu>
    </div>
  );
}
