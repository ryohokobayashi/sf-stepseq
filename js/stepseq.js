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

let margin = 10;
let colMargin = 100;

let titleTextSize = 24;
let valueTextSize = 14;

let titleHeight = 50;
let sliderWidth = 200;
let sliderHeight = 45;

let clearButton;

function preload() {
	for (let i = 0; i < numNotes; i++) {
		let snd = loadSound('snd/0' + (i + 1) + '.mp3');
		sounds.push(snd);
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	prevTime = millis();
	curTime = millis();

	rectWidth = width / numSteps;
	rectHeight = height / numNotes;
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

	bpmSlider = createSlider(20, 200, 80, 0);
	bpmSlider.position(margin, titleTextSize + margin * 2);
	bpmSlider.style('width', sliderWidth + 'px');

	bpm = int(bpmSlider.value());
	interval = 60000 / bpm / 4;

	clearButton = createButton('Clear');
	clearButton.position(margin, titleTextSize + margin * 2 + sliderHeight);
	clearButton.style('width', '200px');
	clearButton.style('font-size', '16pt');
	clearButton.style('padding', '10px 50px');
	clearButton.mousePressed(clearNotes);

	for (let i = 0; i < numNotes; i++) {
		let slider = createSlider(0, sounds[i].duration(), 0, 0);
		slider.position(sliderWidth + margin * 2 + colMargin + textWidth('99'), titleTextSize + margin * 2 + sliderHeight * i);
		slider.style('width', sliderWidth + 'px');
		startSliders.push(slider);
		startTimes.push(0);
	}

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
	textSize(titleTextSize);
	text('BPM', margin, titleTextSize + margin);

	textSize(valueTextSize);
	text(bpm, sliderWidth + margin * 2, titleTextSize + valueTextSize + margin * 2);

	textSize(titleTextSize);
	text('Start Time', sliderWidth + margin + colMargin, titleTextSize + margin);

	textSize(valueTextSize);
	for (let i = 0; i < startSliders.length; i++) {
		text('0' + (i + 1), sliderWidth + margin + colMargin, titleTextSize + valueTextSize + margin * 2 + sliderHeight * i);
		text(round(startTimes[i], 1) + ' 秒', sliderWidth * 2 + margin * 4 + colMargin, titleTextSize + valueTextSize + margin * 2 + sliderHeight * i);
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
				if (sounds[i].isPlaying()) {
					sounds[i].pause();
				}
				sounds[i].loop();
				sounds[i].jump(startTimes[i], min(1, sounds[i].duration() - startTimes[i]));
			} else {
				if (sounds[i].isPlaying()) {
					sounds[i].pause();
				}
			}
		}

	}

	noStroke();
	fill(255, 0, 0, 50);
	rect(curStep * rectWidth + seqOrigin.x, seqOrigin.y, rectWidth, seqSize.y);
}

function mousePressed() {
	if (getAudioContext().state !== 'running') {
		getAudioContext().resume();
		userStartAudio();
		sounds[0].loop();
		sounds[0].pause();
	}
	if (mouseX >= seqOrigin.x && mouseX <= seqOrigin.x + seqSize.x && mouseY >= seqOrigin.y && mouseY <= seqOrigin.y + seqSize.y) {
		let noteId = int((mouseX - seqOrigin.x) / rectWidth) * numNotes + int((mouseY - seqOrigin.y) / rectHeight);
		notes[noteId] = !notes[noteId];
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
