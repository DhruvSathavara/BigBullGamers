import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function CommentList(props) {
    const { comment, parent,user } = props.data;
    // console.log(props.data, "comment");
    if (props.data) {
        return (
            <List className='card' sx={{ width: '100%' }}>
                 {/* <Divider variant="inset" component="li" /> */}
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt={user.username} src={user['Avatar']} />
                    </ListItemAvatar>
                    <ListItemText
                    className="h4"
                        primary={user.username ? user.username : user.objectId}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                    className="h4"
                                >
                                    {comment}
                                </Typography>

                            </React.Fragment>
                        }
                    />
                </ListItem> 
            </List>
        )
    } else {
        return <></>
    }
}
