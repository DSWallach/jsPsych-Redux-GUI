import * as actionTypes from '../../constants/ActionTypes';
import * as organizer from './organizer';
import * as jsPsychInit from './jsPsychInit';
import * as preview from './preview';
import * as editor from './editor';

export const initState = {
	experimentName: "Untitled Experiment",
	// key in db
	experimentId: null,

	// owner info
	/*{
		username: string,
		identityId: id
	}*/ 
	owner: null,

	// is private?
	private: true,
	// repository
	medias: [],

	// id of which is being previewed/editted
	previewId: null,
	// if want to play all
	previewAll: false,

	// id counts
	timelineCount: 0,
	trialCount: 0,

	// the main timeline. array of ids
	mainTimeline: [],

	// init properties
	jsPsychInit: jsPsychInit.initState,
}


const setExperimentName = (state, action) => {
	return Object.assign({}, state, {
		experimentName: action.name
	})
}

export default function experimentReducer(state=initState, action) {
	switch(action.type) {
		// organizer starts
		case actionTypes.ADD_TIMELINE:
			return organizer.addTimeline(state, action);
		case actionTypes.DELETE_TIMELINE:
			return organizer.deleteTimeline(state, action);
		case actionTypes.ADD_TRIAL:
			return organizer.addTrial(state, action);
		case actionTypes.DELETE_TRIAL:
			return organizer.deleteTrial(state, action);
		case actionTypes.INSERT_NODE_AFTER_TRIAL:
			return organizer.insertNodeAfterTrial(state, action);
		case actionTypes.DUPLICATE_TRIAL:
			return organizer.duplicateTrial(state, action);
		case actionTypes.DUPLICATE_TIMELINE:
			return organizer.duplicateTimeline(state, action);
		case actionTypes.MOVE_TO:
			return organizer.moveTo(state, action);
		case actionTypes.MOVE_INTO:
			return organizer.moveInto(state, action);
		case actionTypes.MOVE_BY_KEYBOARD:
			return organizer.moveByKeyboard(state, action);
		case actionTypes.ON_PREVIEW:
			return organizer.onPreview(state, action);
		case actionTypes.ON_TOGGLE:
			return organizer.onToggle(state, action);
		case actionTypes.SET_TOGGLE_COLLECTIVELY:
			return organizer.setToggleCollectively(state, action);
		case actionTypes.SET_COLLAPSED:
			return organizer.setCollapsed(state, action);

		// jspsych.init starts
		case actionTypes.SET_JSPSYCH_INIT:
			return jsPsychInit.setJspyschInit(state, action);

		// preview
		case actionTypes.PLAY_ALL:
			return preview.playAll(state, action);

		// name
		case actionTypes.SET_EXPERIMENT_NAME:
			return setExperimentName(state, action);

		// editor starts
		case actionTypes.SET_NAME:
			return editor.setName(state, action);
		case actionTypes.CHANGE_PLUGIN_TYPE:
			return editor.changePlugin(state, action);
		case actionTypes.TOGGLE_PARAM_VALUE:
			return editor.changeToggleValue(state, action);
		case actionTypes.CHANGE_PARAM_TEXT:
			return editor.changeParamText(state, action);
		case actionTypes.CHANGE_PARAM_INT: 
			return editor.changeParamInt(state, action);
		case actionTypes.CHANGE_PARAM_FLOAT:
			return editor.changeParamFloat(state, action);
		case actionTypes.CHANGE_HEADER:
			return editor.changeHeader(state, action);
		case actionTypes.CHANGE_CELL:
			return editor.changeCell(state, action);
		case actionTypes.ADD_COLUMN:
			return editor.addColumn(state, action);
		case actionTypes.ADD_ROW:
			return editor.addRow(state, action);
		case actionTypes.CHANGE_SAMPLING: 
			return editor.changeSampling(state, action);
		case actionTypes.CHANGE_SIZE:
		 	return editor.changeSize(state, action);
		 case actionTypes.CHANGE_RANDOMIZE: 
		 	return editor.changeRandomize(state, action); 
		 case actionTypes.DELETE_COLUMN:
		 	return editor.deleteColumn(state, action);
		 case actionTypes.DELETE_ROW:
		 	return editor.deleteRow(state, action);
		 case actionTypes.DELETE_COLUMN_HEADER:
		 	return editor.deleteColumnHeader(state, action);
		default:
			return state;
	}
}
