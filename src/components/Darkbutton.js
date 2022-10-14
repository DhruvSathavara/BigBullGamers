import React from "react"
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { blue } from '@mui/material/colors';
import { Web3Context } from '../context/WebContext';

const DarkMode = () => {
  const webContext = React.useContext(Web3Context);
  const { switchTheme, clickedClass, theme } = webContext;
  return (
    <ListItem button onClick={e => switchTheme(e)}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
          <span className={`pointer p-2 text-center ms-3 menu-icon mx-3 chat-active-btn ${theme === "dark" ? clickedClass : ""}`} >
            <i className="feather-moon font-xl text-current "></i>
          </span>
        </Avatar>
      </ListItemAvatar>
      <ListItemText className="h4" primary="Darkmode" />
    </ListItem>

  )
}

export default DarkMode