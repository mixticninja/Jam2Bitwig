/**
 * @classdesc Mode in which the Pads are used to play Notes
 * @class
 * @augments JamMode
 * 
 * @param {NoteView} noteView 
 * @param {DrumPadView} drumPadView 
 * @param {TrackViewContainer} trackView reference to Clip Mode object
 * @param {SceneView} sceneView reference to Clip Mode object
 * @param {Clip} cursorClip
 *
 * @returns {PadMode}
 */

function PadMode(noteView, drumPadView, trackView, sceneView, cursorClip) {
	JamMode.call(this, noteView, trackView, sceneView);
		
	this.updatePitchNames = function(size, mapping, key, name) {
		drumPadView.updatePitchNames(size, mapping, key, name);
	};
	
	this.isColorFromName = function() {
		return drumPadView.isColorFromName();
	};
	
	this.setColorFromName = function(fromName) {
		 drumPadView.setColorFromName(fromName);
	};
	
	
	
	this.updatePadColor = function(index,color) {
		drumPadView.updatePadColor(index,color);
	};
	
	
	this.receiveNote = function(on, note, velocity ) {
		this.mainView.receiveNote(on, note, velocity);
	};
	
	this.updateTrackColor = function(color) {
		noteView.updateTrackColor(color);
		drumPadView.updateTrackColor(color);
	};
	
	this.inNoteView = function() {
		return this.mainView === noteView;
	};
	
	this.scaleUp = function() {
		 noteView.changeScale(-1);
	};
	
	this.scaleDown = function() {
		noteView.changeScale(+1);
	};
	
	
	this.scaleRootUp = function() {
		 noteView.doTranspose(-1);
	};
	
	this.scaleRootDown = function() {
		noteView.doTranspose(+1);
	};
	
	this.inDrumView = function() {
		return this.mainView === drumPadView;
	};
	
	this.setToNoteView = function() {
		if(this.mainView !== noteView) {
			this.mainView.exit();
			this.mainView = noteView;
			this.mainView.enter();
		}
	};
	
	this.setToDrumView = function() {
		drumPadView.setStepMode(false);
		if(this.mainView !== drumPadView) {
			this.mainView.exit();
			this.mainView = drumPadView;
			this.mainView.enter();
		}
	};
	
	this.selectionModAction = function() {
		noteView.selectionModAction();
	};

	this.update = function() {
		sceneView.update();
		this.mainView.update();
	};


	this.notifyShift = function(shiftDown) {
		this.mainView.notifyShift(shiftDown);
	};
	
	this.notifyModifier = function(modifierState) {
		this.mainView.notifyModifier(modifierState);
	};

	/**
	 * @return {NoteView}
	 */
	this.getNoteView = function() {
		return noteView;
	};

	this.navigate = function(direction) {
		this.mainView.navigate(direction);
	};
	
	this.notifyClear = function(clearDown) {
		if(clearDown)
			cursorClip.clearSteps();
	};

	this.postEnter = function() {
		modifiers.setLockButtonState(false);
		modifiers.setLockButtonHandler(function(value) {
			
		});
	};
	
}

