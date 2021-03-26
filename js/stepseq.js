let sounds = [];
let startTimes = [];

let numSteps = 16;
let numNotes = 4;
let bpm = 80;
let interval;

let rectWidth;
let rectHeight;
let seqOrigin;
let seqSize;

let curStep = 0;
let curTime = 0;
let prevTime = 0;

let notes = [];

let bpmSlider;
let startSliders = [];
let fileSelects = [];

let margin = 10;
let colMargin = 100;

let titleTextSize = 14;
let valueTextSize = 10;

let titleHeight = 50;
let sliderWidth = 200;
let sliderHeight = 10;
let buttonHeight = 20;

let uiOriginY = margin;
let bpmOriginY = uiOriginY;
let fileSelectTitleOriginY = uiOriginY;
let fileSelectOriginY = [];
let startTimeTitleOriginY = uiOriginY;
let startTimeOriginY = [];

let clearButton;
let exportButton;

let touchValid = true;
let touchedTime;

let mic;

let urls;
let soundIds = [];

function preload() {
	urls = loadStrings('filename.txt', preloadSounds);
}

function preloadSounds(urls) {
	for (let url of urls) {
		let snd = loadSound(url);
		sounds.push(snd);
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	for (let i = 0; i < numNotes; i++) {
		soundIds.push(int(random(urls.length)));
	}

	prevTime = millis();
	curTime = millis();

	rectWidth = width / numSteps;
	rectHeight = height * 0.5 / numNotes;
	if (rectHeight > rectWidth) {
		rectHeight = rectWidth;
	} else if (rectWidth > rectHeight) {
		rectWidth = rectHeight;
	}

	seqSize = createVector(rectWidth * numSteps, rectHeight * numNotes);
	seqOrigin = createVector(0, height - seqSize.y);

	for (let i = 0; i < numSteps * numNotes; i++) {
		notes.push(false);
	}

	bpmOrignY = uiOriginY;
	bpmSlider = createSlider(20, 200, 80, 0);
	bpmSlider.position(margin + textWidth('BPM'), uiOriginY);
	bpmSlider.size(sliderWidth - textWidth('BPM'), sliderHeight);
	uiOriginY += sliderHeight + margin;

	bpm = int(bpmSlider.value());
	interval = 60000 / bpm / 4;

	clearButton = createButton('Clear');
	clearButton.position(margin, uiOriginY);
	clearButton.size(sliderWidth, buttonHeight);
	clearButton.style('font-size', titleTextSize);
	clearButton.mousePressed(clearNotes);
	uiOriginY += buttonHeight + margin / 2;

	exportButton = createButton('Save');
	exportButton.position(margin, uiOriginY);
	exportButton.size(sliderWidth, buttonHeight);
	exportButton.style('font-size', titleTextSize);
	exportButton.mousePressed(exportFile);
	uiOriginY += buttonHeight + margin;

	fileSelectTitleOriginY = uiOriginY;
	uiOriginY += titleTextSize + margin;

	for (let i = 0; i < numNotes; i++) {
		let sel = createSelect();
		fileSelectOriginY.push(uiOriginY);

		for (let url of urls) {
			let arr = split(url, '/');
			let file = arr[arr.length - 1];
			sel.option(file, url);
		}

		sel.position(margin + textWidth('99'), uiOriginY);
		sel.size(sliderWidth - textWidth('99'), buttonHeight);
		sel.id(i);
		sel.selected(urls[soundIds[i]]);
		sel.changed(fileChange);
		uiOriginY += buttonHeight + margin / 2;
		fileSelects.push(sel);
	}
	uiOriginY += margin;

	startTimeTitleOriginY = uiOriginY;
	uiOriginY += titleTextSize + margin;

	for (let i = 0; i < numNotes; i++) {
		let slider = createSlider(0, sounds[soundIds[i]].duration(), 0, 0);
		startTimeOriginY.push(uiOriginY);
		slider.position(margin + textWidth('99'), uiOriginY);
		slider.size(sliderWidth - textWidth('99'), sliderHeight);
		uiOriginY += sliderHeight + margin;
		startSliders.push(slider);
		startTimes.push(0);
	}

	mic = new p5.AudioIn();
	mic.start();
	mic.stop();
}

function draw() {
	background(0);

	fill(255);
	noStroke();
	rect(0, 0, width, seqOrigin.y);

	bpm = int(bpmSlider.value());
	interval = 60000 / bpm / 4;
	for (let i = 0; i < startSliders.length; i++) {
		startTimes[i] = startSliders[i].value();
	}

	fill(0);
	textSize(valueTextSize);
	text('BPM', margin, valueTextSize + bpmOriginY);

	textSize(valueTextSize);
	text(bpm, sliderWidth + margin * 2, valueTextSize + bpmOriginY);

	textSize(titleTextSize);
	text('Sound File', margin, titleTextSize + fileSelectTitleOriginY);

	textSize(valueTextSize);
	for (let i = 0; i < fileSelects.length; i++) {
		text('0' + (i + 1), margin, valueTextSize + fileSelectOriginY[i]);
	}

	textSize(titleTextSize);
	text('Start Time', margin, titleTextSize + startTimeTitleOriginY);

	textSize(valueTextSize);
	for (let i = 0; i < startSliders.length; i++) {
		text('0' + (i + 1), margin, valueTextSize + startTimeOriginY[i]);
		text(round(startTimes[i], 1) + ' 秒', sliderWidth + margin * 2, valueTextSize + startTimeOriginY[i]);
	}

	stroke(255);
	for (let i = 0; i <= numSteps; i++) {
		line(i * rectWidth + seqOrigin.x, seqOrigin.y, i * rectWidth + seqOrigin.x, seqOrigin.y + seqSize.y);
	}
	for (let i = 0; i <= numNotes; i++) {
		line(seqOrigin.x, i * rectHeight + seqOrigin.y, seqOrigin.x + seqSize.x, i * rectHeight + seqOrigin.y);
	}

	stroke(0);
	fill(255);
	for (let i = 0; i < numSteps * numNotes; i++) {
		if (notes[i]) {
			rect(int(i / numNotes) * rectWidth + seqOrigin.x, int(i % numNotes) * rectHeight + seqOrigin.y, rectWidth, rectHeight);
		}
	}

	curTime = millis();
	if (curTime >= prevTime + interval) {
		curStep++;
		curStep %= numSteps;
		prevTime = curTime;

		for (let i = 0; i < numNotes; i++) {
			if (notes[curStep * numNotes + i]) {
				if (sounds[soundIds[i]].isPlaying()) {
					sounds[soundIds[i]].stop();
					delete sounds[soundIds[i]].bufferSourceNode;
				}
				if (startTimes[i] >= sounds[soundIds[i]].duration()) {
					startTimes[i] = 0;
				}
				sounds[soundIds[i]].play(0, 1, 1, startTimes[i]);
			} else {
				if (sounds[soundIds[i]].isPlaying()) {
					sounds[soundIds[i]].stop();
				}
			}
		}

	}

	noStroke();
	fill(255, 0, 0, 50);
	rect(curStep * rectWidth + seqOrigin.x, seqOrigin.y, rectWidth, seqSize.y);

	if (!touchValid && millis() > touchedTime + 200) {
		touchValid = true;
	}
}

function touchStarted() {
	if (touchValid) {
		if (getAudioContext().state !== 'running') {
			// getAudioContext().resume();
			userStartAudio();
			sounds[0].play();
			sounds[0].stop();
		}
		if (mouseX >= seqOrigin.x && mouseX <= seqOrigin.x + seqSize.x && mouseY >= seqOrigin.y && mouseY <= seqOrigin.y + seqSize.y) {
			let noteId = int((mouseX - seqOrigin.x) / rectWidth) * numNotes + int((mouseY - seqOrigin.y) / rectHeight);
			notes[noteId] = !notes[noteId];
		}
		touchValid = false;
		touchedTime = millis();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

	rectWidth = width / numSteps;
	rectHeight = height / numNotes;
	if (rectHeight > rectWidth) {
		rectHeight = rectWidth;
	} else if (rectWidth > rectHeight) {
		rectWidth = rectHeight;
	}

	seqSize = createVector(rectWidth * numSteps, rectHeight * numNotes);
	seqOrigin = createVector(0, height - seqSize.y);
}

function clearNotes() {
	for (let i = 0; i < notes.length; i++) {
		notes[i] = false;
	}
}

function exportFile() {
	let stepLength = ceil(interval / 1000 * getAudioContext().sampleRate);
	let fileLength = stepLength * numSteps;
	let outBuffer = new Float32Array(fileLength);

	for (let note = 0; note < numNotes; note++) {
		let inStart = floor(startTimes[note] * getAudioContext().sampleRate);
		for (let step = 0; step < numSteps; step++) {
			if (notes[step * numNotes + note]) {
				let outStart = stepLength * step;
				for (let i = 0; i < stepLength; i++) {
					let inFrame = (inStart + i) % sounds[soundIds[note]].frames();
					outBuffer[outStart + i] += sounds[soundIds[note]].buffer.getChannelData(0)[inFrame];
				}
			}
		}
	}
	let outFile = new p5.SoundFile();
	outFile.setBuffer([outBuffer]);
	outFile.save(year() + ('00' + month()).slice(-2) + ('00' + day()).slice(-2) + ('00' + hour()).slice(-2) + ('00' + minute()).slice(-2) + ('00' + second()).slice(-2));
}

function fileChange() {
	soundIds[this.elt.id] = this.elt.selectedIndex;
	if (sounds[soundIds[this.elt.id]].isPlaying()) {
		sounds[soundIds[this.elt.id]].stop();
	}
	startTimes[this.elt.id] = 0;
	startSliders[this.elt.id].elt.value = 0;
	startSliders[this.elt.id].elt.max = sounds[soundIds[this.elt.id]].duration();
}
