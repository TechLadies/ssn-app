import React, { Component } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  MenuItem,
  Menu,
  Avatar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ssnLogo from 'assets/ssn-logo.png';
import adminAvatar from 'assets/placeholder-avatar.jpg';
import { withContext } from 'util/context';
import { AppContext } from 'components/main/AppContext';
import { Role } from 'components/shared/enums/Role';

const NavBarDisplayMapping = {
  [Role.ADMIN]: 'SSN ADMIN',
  [Role.PROJECT_OWNER]: 'PROJECT OWNER',
};

class _NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({anchorEl: null });
  };
  
  getNavbarText = () => {
    const { isAuthenticated } = this.props.context;
    const { authenticator } = this.props.context.utils;
    const currentUser = authenticator.getCurrentUser();

    if (!isAuthenticated || !currentUser) {
      return '';
    }

    return `${NavBarDisplayMapping[currentUser.role]} DASHBOARD`;
  }
  
  renderAvatar = () => { 
    const { classes } = this.props;
    const { isAuthenticated } = this.props.context;
    const { authenticator } = this.props.context.utils;
    const currentUser = authenticator.getCurrentUser();

    if (!isAuthenticated || !currentUser) {
      return '';
    }

    return currentUser.role === Role.admin && (
      <React.Fragment>
        <Button
          aria-owns={this.state.anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          color="inherit"
          className={classes.logout}
        >
          <Avatar alt="Admin photo" src={adminAvatar} className={classes.avatar}></Avatar>
          {currentUser.email}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose}>Edit Profile</MenuItem>
          <MenuItem onClick={this.handleClose}>Logout</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }

  render() {
    const { classes } = this.props; 

    return this.props.location.pathname !== '/admin' && (
      <AppBar position="static">
        <Toolbar variant="dense" className={classes.toolBar}>
          <img src={ssnLogo} alt="ssn-logo" className={classes.logo} />
          <Typography variant="body2" color="inherit" className={classes.barTitle}>
            {this.getNavbarText()}
          </Typography>
          {this.renderAvatar()}
        </Toolbar>
      </AppBar>
    );
  }
}

const styles = {
  toolBar: {
    width: '80vw',
    margin: '0 auto',
    padding: '0',
  },
  logo: {
    height: '25px',
  },
  barTitle: {
    paddingLeft: '15px',
  },
  logout: {
    position: 'absolute',
    right: '0',
  },
  avatar: {
    margin: '0 15px',
  },
};

export const NavBar = withStyles(styles)(
  withContext(AppContext)(
    (_NavBar)
  ),
);