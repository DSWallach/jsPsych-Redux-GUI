import React from 'react';
import Draggable from 'react-draggable';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import { SpeedDial, SpeedDialItem } from 'react-mui-speeddial';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ContentAdd from 'material-ui/svg-icons/content/add';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NewTimelineIcon from 'material-ui/svg-icons/av/playlist-add';
import NewTrialIcon from 'material-ui/svg-icons/action/note-add';
import Delete from 'material-ui/svg-icons/action/delete';
import CloseDrawer from 'material-ui/svg-icons/navigation/close';
import OpenDrawer from 'material-ui/svg-icons/navigation/chevron-right';
import {
	grey200,
	grey400 as DrawerHandleColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor
} from 'material-ui/styles/colors';

import { convertPercent } from '../App';
import { isTimeline } from '../../constants/utils';
import TrialItem from '../../containers/TimelineNode/OrganizerItem/TrialItem';
import TimelineItem from '../../containers/TimelineNode/OrganizerItem/TimelineItem';

const MIN_WIDTH = 20;
const MAX_WIDTH = 60;

var dragging = false;

const enableAnimation = (flag) => ((flag) ? 'none' : 'all 0.4s ease');

const getWidthFromDragging = (e) => {
	let percent = (e.pageX / window.innerWidth) * 100;
	if (percent < MIN_WIDTH) percent = MIN_WIDTH;
	if (percent > MAX_WIDTH) percent = MAX_WIDTH;
	return percent; 
}

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}

class TimelineNodeOrganizerDrawer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dragging: false,
		}

		this.onDragStart = (e) => {
			this.setState({
				dragging: true,
			});
		}

		this.onDragEnd = (e) => {
			this.setState({
				dragging: false,
			});
		}

		this.onDrag = (e) => {
			this.props.setWidthCallback(getWidthFromDragging(e));
			pauseEvent(e)
		}

	}


	render() {
		return (
			<MuiThemeProvider>
			<div className="TimelineNode-Organizer"
				 style={{width: (this.props.open) ? convertPercent(this.props.width) : "0%", 
						left: '0px',
						overflowY: 'auto',
						height: '86.5vh', 
						display: 'flex',
						'WebkitTransition': enableAnimation(this.state.dragging),
						'MozTransition': enableAnimation(this.state.dragging),
						transition: enableAnimation(this.state.dragging),
				}}>
				<div className="TimelineNode-Organizer-Container"
					style={{height: '100%', width: '100%'}}>
					{(this.props.open) ? 
					<div className="TimelineNode-Organizer-Content">
						<div style={{display: 'flex'}}>
							<Subheader>Timeline/Trial Organizer</Subheader>
								<IconButton 
		  							hoveredStyle={{backgroundColor: CloseBackHighlightColor}}
									disableTouchRipple={true}
									onTouchTap={this.props.closeCallback}
									>
									<CloseDrawer hoverColor={CloseDrawerHoverColor}/>
								</IconButton> 
						</div>
						<Divider />
						<div className="TimelineNode-Sheet" style={{
							overflowY: "auto", 
							minWidth: "100%"
						}}>
						<List style={{maxHeight: "68vh", minHeight: "68vh"}}>
							{this.props.mainTimeline.map((id) => {
								if (isTimeline(id)) return (<TimelineItem id={id} key={id} />);
								else return (<TrialItem id={id} key={id}/>);
							})}
						</List>
						</div>
						<Divider />
						<div style={{
							bottom: 10, 
							left: convertPercent(this.props.width-6),  
							position: 'absolute',
							zIndex: 200
						}}>
							<SpeedDial
						      fabContentOpen={<ContentAdd />}
						      fabContentClose={<NavigationClose />}
						    >
						      <SpeedDialItem
						        label="New Timeline"
						        fabContent={<NewTimelineIcon />}
						        onTouchTap={this.props.insertTimeline}
						      />
						      <SpeedDialItem
						        label="New Trial"
						        fabContent={<NewTrialIcon/>}
						        onTouchTap={this.props.insertTrial}
						      />
						      <SpeedDialItem
						        label="Delete"
						        fabContent={<Delete/>}
						        onTouchTap={this.props.deleteSelected}
						      />
						    </SpeedDial>
					    </div>
					</div>: null}
				</div>
				<Draggable
			        axis="x"
			        handle=".TimelineNode-Organizer-Dragger"
			        zIndex={100}
			        position={{x: this.props.width}}
			        onStart={this.onDragStart}
			        onDrag={this.onDrag}
			        onStop={this.onDragEnd}
			        >
  				<div 	className="TimelineNode-Organizer-Dragger"
  						style={{backgroundColor: 'black',
							   height:'100%',
							   float: 'right',
							   width: '3px',
							   cursor: 'col-resize',
  							}}
  						/>
  				</Draggable>
  				{(this.props.open) ? null :
  					<IconButton 
  						className="TimelineNode-Organizer-Handle"
  						tooltip="Open Timeline/Trial Organizer"
  						hoveredStyle={{
  							backgroundColor: DrawerHandleColor,
  							left: 0,
  						}}
  						onTouchTap={this.props.openCallback}
  						tooltipPosition="bottom-right"
  						style={{
	  					position: 'fixed',
	  					left: -8,
	  					top: '50%',
	  					width: 25,
	  					backgroundColor: grey200,
	  					padding: '12px 0',
	  					zIndex: 1,
  						}}
  					><OpenDrawer /></IconButton>}
  			</div>
  			</MuiThemeProvider>
  			)
	}
}

export default TimelineNodeOrganizerDrawer;