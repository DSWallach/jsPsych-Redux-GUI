/*
This file is the reducers for timelineNode class from jsPsych (timeline, trial)

A timeline state = {
	id: string,
	type: string,
	name: string,
	// if its parent is mainTimeline, null
	parent: string, 
	childrenById: array,
	collapsed: boolean,
	enabled: boolean,
	// jsPsych timeline properties
	parameters: object,
}

A trial state = {
	id: string,
	type: string,
	name: string,
	// if its parent is mainTimeline, null
	parent: string, 
	enabled: boolean,
	// specific parameters decided by which plugin user chooses
	parameters: object,
}

*/
Array.prototype.move = function(from,to){
  this.splice(to,0,this.splice(from,1)[0]);
  return this;
};


import * as actionTypes from '../constants/ActionTypes';
import * as utils from '../constants/utils'; 

export const DEFAULT_TIMELINE_NAME = 'Untitled Timeline';
export const DEFAULT_TRIAL_NAME = 'Untitled Trial';

const initState = {
	// id of which is being previewed/editted
	previewId: null,

	// the main timeline. array of ids
	mainTimeline: [], 
}



export default function(state=initState, action) {
	switch(action.type) {
		case actionTypes.ADD_TIMELINE:
			return addTimeline(state, action);
		case actionTypes.DELETE_TIMELINE:
			return deleteTimeline(state, action);
		case actionTypes.ADD_TRIAL:
			return addTrial(state, action);
		case actionTypes.DELETE_TRIAL:
			return deleteTrial(state, action);
		case actionTypes.MOVE_NODE:
			return moveNode(state, action);
		case actionTypes.ON_PREVIEW:
			return onPreview(state, action);
		case actionTypes.ON_TOGGLE:
			return onToggle(state, action);
		case actionTypes.SET_COLLAPSED:
			return setCollapsed(state, action);
		default:
			return state;
	}
} 


/**************************  Helper functions  ********************************/

function getNodeById(state, id) {
	if (id === null) return null;
	return state[id];
}

export function getLevel(state, node) {
	if (node.parent === null)
		return 0;
	else
		return 1 + getLevel(state, getNodeById(state, node.parent));
}

export function getIndex(state, node) {
	if (node.parent === null) {
		return state.mainTimeline.indexOf(node.id);
	} else {
		return state[node.parent].childrenById.indexOf(node.id);
	}
}

/*
Decides if source node is ancestor of target node 

*/ 
function isAncestor(state, sourceId, targetId) {
	let target = getNodeById(state, targetId);

	while (target && target.parent !== null) {
		if (target.parent === sourceId)
			return true;
		target = getNodeById(target.parent);
	}

	return false;
}

/*
Decides if source node can be moved under target node
Two case it can't:
1. target node is a trial
2. source node is ancestor of target node 

If targetId is null, always true
*/ 
function canMoveUnder(state, sourceId, targetId) {
	if (targetId === null) return true;

	if (utils.isTrial(getNodeById(state, targetId)) || 
		isAncestor(state, sourceId, targetId)) {
		return false;
	}

	return true;
}

// let temp0 = 0; +" "+(temp0++)
export function createTimeline(id,  parent=null, name=DEFAULT_TIMELINE_NAME,
	childrenById=[], collapsed=true, enabled=true, parameters={}) {

	return {
		id: id,
		type: utils.TIMELINE_TYPE,
		name: name,
		parent: parent,
		childrenById: childrenById,
		collapsed: collapsed,
		enabled: enabled,
		parameters: parameters
	};
}

// define deep copy for parameters later
function copyTimeline(timeline) {
	return createTimeline(timeline.id, timeline.parent, timeline.name, 
		timeline.childrenById.slice(), timeline.collapsed,
		timeline.enabled, timeline.parameters)
}

// let temp1 = 0; +" "+(temp1++)
export function createTrial(id, parent=null, name=DEFAULT_TRIAL_NAME,
	enabled=true, parameters={}) {

	return {
		id: id,
		type: utils.TRIAL_TYPE,
		name: name,
		parent: parent,
		enabled: enabled,
		parameters: parameters
	};
}

function copyTrial(trial) {
	return createTrial(trial.id, trial.parent, trial.name, trial.enabled, trial.parameters);
}

/*
action = {
	id: id,
	parent: string, 
}
*/
function addTimeline(state, action) {
	let new_state = Object.assign({}, state);

	let id = action.id;
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = copyTimeline(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: childrenById
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let timeline = createTimeline(id, action.parent)

	new_state[id] = timeline;
 
	return new_state;
}

/*
action = {
	id: string,
	parent: string, 
}
*/
function addTrial(state, action) {
	let new_state = Object.assign({}, state);

	let id = action.id;
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = copyTimeline(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: main timeline
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let trial = createTrial(id, action.parent)

	new_state[id] = trial;
	return new_state;
}

function deleteTimelineHelper(state, id) {
	let timeline = getNodeById(state, id);

	// delete its children
	timeline['childrenById'].map((childId) => {
		if (utils.isTimeline(state[childId])) {
			state = deleteTimelineHelper(state, childId);
		} else {
			state = deleteTrialHelper(state, childId)
		}
	});

	// delete itself
	let parent = timeline.parent;
	if (parent === null) { // that is, main timeline
		state.mainTimeline = state.mainTimeline.filter((item) => (item !== id));
	} else {
		parent =  getNodeById(state, parent)
		parent = copyTimeline(parent);
		state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== id));
	}
	if (state.previewId === id) state.previewId = null;
	delete state[id];

	return state;
}

/*
action = {
	id: string
}
*/
function deleteTimeline(state, action) {
	let new_state = Object.assign({}, state);

	return deleteTimelineHelper(new_state, action.id);
}



function deleteTrialHelper(state, id) {
	let trial = getNodeById(state, id);
	let parent = trial.parent;

	if (parent === null) { // that is, main timeline
		state.mainTimeline = state.mainTimeline.filter((item) => (item !== id));
	} else {
		parent = getNodeById(state, parent);
		parent = copyTimeline(parent);
		state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== id));
	}

	if (state.previewId === id) state.previewId = null;
	delete state[id];

	return state;
}

/*
action = {
	id: string
}
*/
function deleteTrial(state, action) {
	let new_state = Object.assign({}, state);

	return deleteTrialHelper(new_state, action.id);
}


/*
action = {
	sourceId: string,
	targetId: string,
	position: number, 
}

*/
function moveNodeToTimeline(state, action) {
	if (canMoveUnder(state, action.sourceId, action.targetId)) {
		let source = getNodeById(state, action.sourceId);
		if (utils.isTimeline(source)) {
			source = copyTimeline(source);
		} else {
			source = copyTrial(source);
		}

		let target = copyTimeline(getNodeById(state, action.targetId));

		let new_state = Object.assign({}, state);
		let oldParentId = source.parent;
		if (oldParentId === target.id) {
			let from = target.childrenById.indexOf(source.id);
			target.childrenById.move(from, 0);
			new_state[target.id] = target;
			return new_state;
		}

		// remove from old parent children array
		// if source was in the main timeline
		if (oldParentId === null) {
			new_state.mainTimeline = state.mainTimeline.slice();
			new_state.mainTimeline = new_state.mainTimeline.filter((item) => (item !== source.id));
		} else {
			let newOldParent = copyTimeline(getNodeById(new_state, oldParentId));
			newOldParent.childrenById = newOldParent.childrenById.filter((item) => (item !== source.id));
			new_state[newOldParent.id] = newOldParent;
			console.log(newOldParent)
		}

		// add to new parent children array
		if (target.childrenById.indexOf(source.id) === -1)
			target.childrenById.unshift(source.id);
		target.collapsed = false;
		new_state[target.id] = target;

		source.parent = target.id;
		new_state[source.id] = source;
		return new_state;
	} else {
		return state;
	}
}

/*
action = {
	sourceId: string,
	targetId: string,
	position: number,
}

*/
function moveNodeToTrial(state, action) {
	let source = getNodeById(state, action.sourceId);
	if (utils.isTimeline(source)) {
		source = copyTimeline(source);
	} else {
		source = copyTrial(source);
	}

	let new_state = Object.assign({}, state);

	let target = getNodeById(new_state, action.targetId);
	let oldParentId = source.parent;
	let newParentId = target.parent;

	// if under same parent
	if (oldParentId === newParentId) {
		let from;
		if (oldParentId === null) {
			from = new_state.mainTimeline.indexOf(source.id);
			new_state.mainTimeline = state.mainTimeline.slice();
			new_state.mainTimeline.move(from, new_state.mainTimeline.indexOf(target.id)+1);
		} else {
			let newParent = copyTimeline(new_state[newParentId]);
			from = newParent.childrenById.indexOf(source.id);
			newParent.childrenById.move(from, newParent.childrenById.indexOf(target.id)+1);
			new_state[newParent.id] = newParent;
		}

		return new_state;
	}

	// if source was in the main timeline
	if (oldParentId === null) {
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline = new_state.mainTimeline.filter((item) => (item !== source.id));
	}

	// if target trial is in the main timeline
	let index;
	if (newParentId === null) {
		index = new_state.mainTimeline.indexOf(target.id) + 1;
		new_state.mainTimeline.splice(index, 0, source.id);
	} else {
		let newParent = copyTimeline(getNodeById(new_state, newParentId));
		index = newParent.childrenById.indexOf(target.id) + 1;
		newParent.childrenById.splice(index, 0, source.id);
		new_state[newParent.id] = newParent; 
	}

	source.parent = newParentId;
	new_state[source.id] = source;

	return new_state;
}

function moveNodeToMainTimeline(state, action) {
	let source = getNodeById(state, action.sourceId);
	if (utils.isTimeline(source)) {
		source = copyTimeline(source);
	} else {
		source = copyTrial(source);
	}

	let new_state = Object.assign({}, state, {
		mainTimeline: state.mainTimeline.slice(),
	});
	
	// it is not already in the main timeline
	if (source.parent !== null) {
		let oldParent = copyTimeline(getNodeById(new_state, source.parent));
		oldParent.childrenById.filter((item) => (item !== source.id));
		source.parent = null;

		if (new_state.mainTimeline.indexOf(source.id) === -1) {
			new_state.mainTimeline.push(source.id)
		}
	}

	new_state.mainTimeline.move(new_state.mainTimeline.indexOf(source.id), 0);

	return new_state;
}

function moveNode(state, action) {
	if (action.sourceId === action.targetId || !action.sourceId) return state;
	
	if (action.targetId === null) {
		return moveNodeToMainTimeline(state, action);
	}

	let target = getNodeById(state, action.targetId);
	if (utils.isTimeline(target)) {
		return moveNodeToTimeline(state, action);
	} else {
		return moveNodeToTrial(state, action);
	}
}

function onPreview(state, action) {
	let new_state = Object.assign({}, state, {
		previewId: action.id
	});
	console.log(new_state)
	return new_state;
}

function onToggle(state, action) {
	let node = getNodeById(state, action.id);

	let new_state = Object.assign({}, state);

	if (utils.isTimeline(node)) {
		node = copyTimeline(node);
	} else {
		node = copyTrial(node);
	}

	node.enabled = !node.enabled;
	new_state[node.id] = node;

	return new_state;
}

function setCollapsed(state, action) {
	let timeline = getNodeById(state, action.id);

	let new_state = Object.assign({}, state);

	timeline = copyTimeline(timeline);
 	timeline.collapsed = !timeline.collapsed;

	new_state[timeline.id] = timeline;

	return new_state;
}