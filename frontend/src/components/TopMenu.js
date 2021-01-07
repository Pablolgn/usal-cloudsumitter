import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";




const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  appBar: {
    marginLeft: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  links: {
    color: 'inherit',
    textDecoration: 'none'
  },
  title: {
    flexGrow: 1,
  },
}));


function TopMenu(props) {
    const classes = useStyles();

    return (
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Link to="/">
            <Icon
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='home'
            >
              <HomeIcon/>
            </Icon>
          </Link>
            <Typography variant="h6">
              {props.title}
          </Typography>
        </Toolbar>
      </AppBar>


    );
  }
  
  export default TopMenu;