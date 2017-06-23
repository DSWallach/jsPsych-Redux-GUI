import { connect } from 'react-redux';
import * as timelineNodeActions from '../../actions/timelineNodeActions';
import TimelineNodeOrganizer from '../../components/TimelineNodeOrganizer';
import { isTimeline, 
		getTimelineId, 
		getTrialId, } from '../../reducers/Experiment/utils';


const insertTrial = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) {
			dispatch(timelineNodeActions.addTrialAction(getTrialId(), null));
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(timelineNodeActions.addTrialAction(getTrialId(), previewId));
			// its a trial
		} else {
			let parent = experimentState[previewId].parent;
			dispatch(timelineNodeActions.addTrialAction(getTrialId(), parent));
		}
	})
}

const insertTimeline = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) {
			dispatch(timelineNodeActions.addTimelineAction(getTimelineId(), null));
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(timelineNodeActions.addTimelineAction(getTimelineId(), previewId));
			// its a trial
		} else {
			let parent = experimentState[previewId].parent;
			dispatch(timelineNodeActions.addTimelineAction(getTimelineId(), parent));
		}
	})
}

const deleteSelected = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) { 
			return;
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(timelineNodeActions.deleteTimelineAction(previewId));
			// its a trial
		} else {
			dispatch(timelineNodeActions.deleteTrialAction(previewId));
		}
	})
}

const duplicateNode = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) { 
			return;
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(timelineNodeActions.duplicateTimelineAction(getTimelineId(), previewId, getTimelineId, getTrialId));
			// its a trial
		} else {
			dispatch(timelineNodeActions.duplicateTrialAction(getTrialId(), previewId));
		}
	})
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	return {
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	insertTrial: () => { insertTrial(dispatch) },
	insertTimeline: () => { insertTimeline(dispatch) },
	deleteSelected: () => { deleteSelected(dispatch) },
	duplicateNode: () => { duplicateNode(dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeOrganizer);
