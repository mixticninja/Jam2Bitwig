/**
 * @param {TrackBank} trackBank
 * @param {int} numTracks
 * @param {int} numScenes
 */
function SceneLaunchView(trackBank, numScenes, numTracks) {
	var active = true;
	var exist = [];
	var hasclips = [];

	var sceneBank = host.createSceneBank(numScenes);
	//var allSceneBank = host.createSceneBank(0);
	
	this.enter = function() {
		active = true;
		for(var i=0;i<numTracks;i++) {
			sendToJam(i, getSceneColor(i));
		}
	};
	
	this.exit = function() {
		active = false;
	};

	for (var i = 0; i < numScenes; i++) {
		registerScene(i);
		exist.push(false);
	}

	this.update = function() {
		for(var i=0;i<numTracks;i++) {
			sendToJam(i, getSceneColor(i));
		}
	};

	this.sceneStates = function() {
		return exist;
	};

	var sendToJam = function(index, color) {
		if (!active) {
			return;
		}
		controls.sceneRow.sendValue(index, color);
	};

	function getSceneColor(sceneindex) {
		if (hasclips[sceneindex] > 0) {
			return JAMColorBase.FUCHSIA + 2;
		} else if (exist[sceneindex]) {
			return JAMColorBase.FUCHSIA;
		}
		return JAMColor.OFF;
	}

	function registerScene(sceneindex) {
		var scene = sceneBank.getScene(sceneindex);

		scene.exists().addValueObserver(function(pExists) {
			exist[sceneindex] = pExists;
			sendToJam(sceneindex, getSceneColor(sceneindex));
		});

	
	scene.addClipCountObserver(function(count){
	  hasclips[sceneindex] = count;
	  sendToJam(sceneindex, getSceneColor(sceneindex));
	}); 
	}

	this.navigate = function(direction) {
		switch (direction) {
		case DirectionPad.TOP:
			if (gGlipOrientation === ORIENTATION.TrackBased) {
				if(modifiers.isShiftDown()) {
					sceneBank.scrollUp();
				} else {
					sceneBank.scrollPageUp();
				}
			}
			break;
		case DirectionPad.DOWN:
			if (gGlipOrientation === ORIENTATION.TrackBased) {
				if(modifiers.isShiftDown()) {
					sceneBank.scrollDown();
				} else {
					sceneBank.scrollPageDown();
				}
			}
			break;
		case DirectionPad.LEFT:
			if (gGlipOrientation === ORIENTATION.SceneBased) {
				if(modifiers.isShiftDown()) {
					sceneBank.scrollUp();
				} else {
					sceneBank.scrollPageUp();
				}
			}
			break;
		case DirectionPad.RIGHT:
			if (gGlipOrientation === ORIENTATION.SceneBased) {
				if(modifiers.isShiftDown()) {
					sceneBank.scrollDown();
				} else {
					sceneBank.scrollPageDown();
				}
			}
			break;
		}
	};

	this.handleEvent = function(index, value) {
		if (exist[index]) {
			var color = getSceneColor(index);
			sendToJam(index, value === 0 ? color : color + 1);
		}
		if (value === 0) {
			return;
		}

		if(modifiers.isDpadRightDown() || !exist[index] || modifiers.isShiftDown()) {
			applicationControl.invokeAction("Create Scene");
		} else {
			sceneBank.launchScene(index);
		}
	};

	//trackBank.addSceneCountObserver( function(scenecount) {
	//  println(" Scene Counts = " + scenecount);
	//allSceneBank = host.createSceneBank(scenecount);
	//});

}
