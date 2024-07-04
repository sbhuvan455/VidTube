import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { IconButton } from "@mui/material";
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { RxHamburgerMenu } from "react-icons/rx";
import HomeIcon from '@mui/icons-material/Home';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import BoltIcon from '@mui/icons-material/Bolt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HistoryIcon from '@mui/icons-material/History';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Link } from 'react-router-dom';

export default function () {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const List1 = [
    {
      name: 'Home',
      icon: <HomeIcon fontSize='medium'/>
    },
    {
      name: 'Shorts',
      icon: <BoltIcon fontSize='medium'/>
    },
    {
      name: 'Subscriptions',
      icon: <VideoSettingsIcon fontSize='medium'/>
    }
  ]

  const List2 = [
    {
      name: 'Your Channel',
      icon: <AccountBoxIcon fontSize='medium'/>
    },
    {
      name: 'History',
      icon: <HistoryIcon fontSize='medium'/>
    },
    {
      name: 'Playlists',
      icon: <PlaylistPlayIcon fontSize='medium'/>
    },
    {
      name: 'Your Videos',
      icon: <SlideshowIcon fontSize='medium'/>
    },
    {
      name: 'Liked videos',
      icon: <ThumbUpIcon fontSize='medium'/>
    }
  ]

  const toggleDrawer =
    (anchor, open) =>
    (event) => {
      if (
        event.type === 'keydown' &&
        ((event).key === 'Tab' ||
          (event).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
          <Link to='/' className='py-2'>
            <img src="youTube.png" alt="logo" className="w-28 cursor-pointer text-center py-4 mx-6" />
          </Link>
        {List1.map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {text.icon}
              </ListItemIcon>
              <ListItemText primary={text.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {List2.map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {text.icon}
              </ListItemIcon>
              <ListItemText primary={text.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className='hidden md:block'>
      {(['left']).map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)} className='rounded-full'><RxHamburgerMenu size={25} color='black'/></IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
