import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TrialItem from '../../../components/TimelineNode/SortableTreeMenu/TrialItem';
import { getTimelineId, getTrialId } from '../../../reducers/timelineNodeUtils';

const onPreview = (dispatch, ownProps) => {
	// console.log(e.nativeEvent.which)
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let previewId = timelineNodeState.previewId;
		if (previewId === null || previewId !== ownProps.id) {
			dispatch(timelineNodeActions.onPreviewAction(ownProps.id));
			ownProps.openTimelineEditorCallback();
		} else {
			dispatch(timelineNodeActions.onPreviewAction(null));
			ownProps.closeTimelineEditorCallback();
		}
	})
}

const onToggle = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.onToggleAction(ownProps.id));
}

const insertTimeline = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.insertNodeAfterTrialAction(getTimelineId(), ownProps.id, true));
}

const insertTrial = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.insertNodeAfterTrialAction(getTrialId(), ownProps.id, false));
}

const deleteTrial = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.deleteTrialAction(ownProps.id));
}

const duplicateTrial = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.duplicateTrialAction(getTrialId(), ownProps.id));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];

	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: node.enabled,
		name: node.name,
		parent: node.parent,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatch: dispatch,
	onClick: () => { onPreview(dispatch, ownProps) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	insertTimeline: () => { insertTimeline(dispatch, ownProps)},
	insertTrial: () => { insertTrial(dispatch, ownProps)},
	deleteTrial: () => { deleteTrial(dispatch, ownProps)},
	duplicateTrial: () => { duplicateTrial(dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialItem);