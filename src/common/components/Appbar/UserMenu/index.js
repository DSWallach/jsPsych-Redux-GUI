import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

import Profile from 'material-ui/svg-icons/social/person';
import ExperimentIcon from 'material-ui/svg-icons/action/book';
import SignOut from 'material-ui/svg-icons/action/exit-to-app';

import Login from '../../../containers/Login';
import ExperimentList from '../../../containers/Appbar/ExperimentList';

import AppbarTheme from '../theme.js';

const style = AppbarTheme.UserMenu;

export default class UserMenu extends React.Component {
  state = {
      open: false,
      experimentListOpen: false,
  }


  handleTouchTap = (event) => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    })
  }

  openExperimentList = () => {
    this.setState({
      experimentListOpen: true
    })
  }

  closeExperimentList = () => {
    this.setState({
      experimentListOpen: false
    })
  }

  renderMenu = (login) => {
    if (!login) {
      return (
        <Menu>
            <MenuItem
              primaryText={"Sign In"}
              onClick={() => { this.props.handleSignIn(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Create Account"}
              onClick={() => { this.props.handleCreateAccount(); this.handleRequestClose(); }} />
        </Menu>
      )
    } else {
      return (
        <Menu>
            <MenuItem
              leftIcon={<Profile {...style.icon}/>}
              primaryText={"Your profile"}
              onClick={() => { this.handleRequestClose(); }} />
            <MenuItem
              primaryText={"Your experiments"}
              leftIcon={<ExperimentIcon {...style.icon} />}
              onClick={() => { this.openExperimentList(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Sign out"}
              leftIcon={<SignOut {...style.icon} />}
              onClick={() => { this.props.handleSignOut(); this.handleRequestClose(); }} />
        </Menu>
      )
    }
  }

  renderUserPic = (login, size=36) => {
    return ((!login) ? 
            null:
            <Avatar 
              size={size} 
              {...style.avatar}
            >
              {this.props.username.charAt(0)}
            </Avatar>)
  }

  render() {
    let login = this.props.username !== null;
    let buttonLabel = (!login) ? 'Your Account' : this.props.username;

    return (
      <div>
      <div style={{float: 'right', paddingRight: 1}}>
        <ListItem 
          primaryText={buttonLabel} 
          onClick={this.handleTouchTap} 
          style={style.username}
          leftAvatar={this.renderUserPic(login)}
        />
      </div>
       <Login />
       <ExperimentList 
        open={this.state.experimentListOpen} 
        handleOpen={this.openExperimentList}
        handleClose={this.closeExperimentList}
       />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          anchorOrigin={{horizontal:"right",vertical:"bottom"}}
          targetOrigin={{horizontal:"right",vertical:"top"}}
          >
          {this.renderMenu(login)}
        </Popover>
    </div>
    )
  }
}
