import React from 'react';
import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


interface HeaderProps {
  open:boolean;
  classes:any;
  handleDrawerOpen:any;
  theme: any;
  title:string;
}

export default function Header (props: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      color="default"
      className={clsx(props.classes.appBar, {
        [props.classes.appBarShift]: props.open,
      })}
    >
      <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={props.handleDrawerOpen}
        edge="start"
      >
        <MenuIcon />
      </IconButton>
        <Typography variant="h6" noWrap>
          {props.title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
