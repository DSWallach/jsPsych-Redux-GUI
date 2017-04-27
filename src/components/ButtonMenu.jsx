import React from 'react';
import Undo from 'material-ui/svg-icons/content/undo';
import Redo from 'material-ui/svg-icons/content/redo';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {actionAddTrial, actionRemoveTrial, actionDuplicateTrial, actionRestoreState, actionRestoreFutureState } from 'actions';

// Initialize the T.E.P. necessay for using "onTouchTap"
injectTapEventPlugin();

const undoStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.15,
    left: window.innerWidth * 0.05
};

const redoStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.15,
    left: window.innerWidth * 0.15
};

const addStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.01,
    left: window.innerWidth * 0.01
};

const removeStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.05,
    left: window.innerWidth * 0.15
};

class ButtonMenu extends React.Component {

    /* eslint-disable */
    static propTypes = {
        store: React.PropTypes.object.isRequired,
    }
    /* eslint-enable */

    add (e) {
        e.preventDefault();
        actionAddTrial(this.props.store); 
    }
    remove (e) {
        e.preventDefault();
        actionRemoveTrial(this.props.store);
    }
    fastForward (e) {
        e.preventDefault();
        actionRestoreFutureState(this.props.store);
    }
    restore (e) {
        e.preventDefault();
        actionRestoreState(this.props.store); 
    }
    duplicate (e) {
        e.preventDefault();
        actionDuplicateTrial(this.props.store);
    }
    render () {
        return (
            <IconMenu
                iconButtonElement={<IconButton> <MoreVertIcon /></IconButton>}
                style={addStyleFAB}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
            >

            <MenuItem
                primaryText="Add (ctrl+a)"
                rightIcon={<ContentAdd />}
                onTouchTap={this.add.bind(this)}
            />
            <Divider />
            <MenuItem
                primaryText="Duplicate"
                rightIcon={<ContentAdd />}
            onTouchTap={this.duplicate.bind(this)}
            />


            <Divider />
            <MenuItem
                primaryText="Remove (ctrl+x / Delete)"
                rightIcon={<ContentRemove />}
            onTouchTap={this.remove.bind(this)}
            />

            <Divider />
            <MenuItem
                primaryText="Undo (ctrl+z)"
                rightIcon={<Undo />}
            onTouchTap={this.restore.bind(this)}
            />

            <Divider />
            <MenuItem
                primaryText="Redo (ctrl+q)"
                rightIcon={<Redo />}
            onTouchTap={this.fastForward.bind(this)}
            />

            </IconMenu>
        );
    }
}
export default ButtonMenu;