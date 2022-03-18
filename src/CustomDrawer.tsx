import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';

import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LocationCity from '@material-ui/icons/LocationCity';
import Amplify from 'aws-amplify';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';

import {
 BrowserRouter as Router,
 Switch,
 Route,
 Link
} from "react-router-dom";

interface CustomDrawerProps {
  theme:any;
  open:boolean;
  classes:any;
  handleDrawerOpen:any;
  handleDrawerClose:any;
}

function handleSignout() {
  Amplify.Auth.signOut();
}


function DrawerItems (props: CustomDrawerProps) {
  return (
    <>
    <List>
      <ListItem component={Link} to="/home" button title="Subscriptions">
        <ListItemIcon><HomeIcon /></ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem button onClick={handleSignout} title="Logout">
        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
    </>
  )
}

export default function CustomDrawer (props: CustomDrawerProps) {
  const classes = props.classes;
  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [props.classes.drawerOpen]: props.open,
        [props.classes.drawerClose]: !props.open,
      })}
      classes={{
        paper: clsx({
          [props.classes.drawerOpen]: props.open,
          [props.classes.drawerClose]: !props.open,
        }),
      }}
    >
      <div className={props.classes.toolbar}>
        <IconButton onClick={props.handleDrawerClose}>
          {props.theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      <DrawerItems {...props} />
    </Drawer>
  )
}
