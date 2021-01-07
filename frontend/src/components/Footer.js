import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    marginLeft: drawerWidth,
  },
  iconButton:{
    width: 30,
    height: 30,
  },
  footer: {
    marginLeft: `calc((100% - ${drawerWidth}px) / 2)`
  },
}));

function Footer() {
  const classes = useStyles();
  return (
    <AppBar position='fixed' className={classes.appBar} >
      <Toolbar>
          <Typography variant="caption" className={classes.footer}>
            © Copyright 2020
          </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;