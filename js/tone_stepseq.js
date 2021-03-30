let reloadFlag = false;
let sttime = [0, 0, 0, 0];

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

const files = [
	"0ja3253w376022t01.mp3",
	"0ja3253w376022t02.mp3",
	"0ja3253w376022t03.mp3",
	"AyanaSaso01.mp3",
	"HanaKono01.mp3",
	"HanaKono02.mp3",
	"HARAMIUTA01.mp3",
	"HARAMIUTA02.mp3",
	"HARAMIUTA03.mp3",
	"harukayoda01.mp3",
	"harukayoda02.mp3",
	"Kaho01.mp3",
	"kanaisaki01.mp3",
	"kanaisaki02.mp3",
	"kanaisaki03.mp3",
	"kobayashiryo01.mp3",
	"kobayashiryo02.mp3",
	"kobayashiryo03.mp3",
	"KohtaMiyagi01_1.mp3",
	"MIYAKEReina01.mp3",
	"MIYAKEReina02.mp3",
	"MIYAKEReina03.mp3",
	"NakamuraMoa01.mp3",
	"NakamuraMoa02.mp3",
	"NakamuraMoa03.mp3",
	"Oguchisouya01.mp3",
	"Oguchisouya02.mp3",
	"OwadaSora01.mp3",
	"OwadaSora02.mp3",
	"OwadaSora03.mp3",
	"saikisota01.mp3",
	"satoayaka01.mp3",
	"satoayaka02.mp3",
	"satoayaka03.mp3",
	"sayuki01.mp3",
	"sayuki02.mp3",
	"sayuki03.mp3",
	"SerizawaAika01.mp3",
	"SerizawaAika02.mp3",
	"SerizawaAika03.mp3",
	"Shizuku01.mp3",
	"Shizuku02.mp3",
	"Shizuku03.mp3",
	"TAKAYAMASAYUKI01.mp3",
	"TakefuShiori01.mp3",
	"TakefuShiori02.mp3",
	"TakefuShiori03.mp3",
	"TANIGUCHIRIHO01.mp3",
	"TANIGUCHIRIHO02.mp3",
	"TANIGUCHIRIHO03.mp3",
	"trskihito01.mp3",
	"trskihito02.mp3",
	"TsuchimotoChihiro01.mp3",
	"TsuchimotoChihiro02.mp3",
	"umezawa01.mp3",
	"umezawa02.mp3",
	"umezawa03.mp3",
	"YamanoNagisa01.mp3",
	"YamanoNagisa02.mp3",
	"YamashitaRiina01.mp3",
	"YamashitaRiina02.mp3",
	"YamashitaRiina03.mp3",
	"appendix01.mp3",
	"appendix02.mp3",
	"appendix03.mp3",
	"appendix04.mp3",
	"appendix05.mp3",
	"appendix06.mp3",
	"appendix07.mp3",
	"appendix08.mp3",
	"appendix09.mp3",
	"appendix10.mp3"
];

let selectedIds = [0, 0, 0, 0];

for (let i = 0; i < 4; i++) {
	selectedIds[i] = Math.floor(Math.random() * files.length);
}

// Tone.Transport.bpm.value = document.querySelector("#bpm").getAttribute("value");
Tone.Transport.bpm.value = bpm;

const keys = new Tone.Players({
	urls: {
		// 0: "0ja3253w376022t01.mp3",
		// 1: "0ja3253w376022t02.mp3",
		// 2: "0ja3253w376022t03.mp3",
		// 3: "AyanaSaso01.mp3",
	},
	fadeOut: "64n",
	baseUrl: "https://ryohokobayashi.github.io/sf-stepseq/snd/"
}).toDestination();

for (let i = 0; i < files.length; i++) {
	keys.add(i, files[i]);

	// let sel01 = document.getElementById("sel01");
	// let sel02 = document.getElementById("sel02");
	// let sel03 = document.getElementById("sel03");
	// let sel04 = document.getElementById("sel04");
	// let op01 = document.createElement("option");
	// let op02 = document.createElement("option");
	// let op03 = document.createElement("option");
	// let op04 = document.createElement("option");
	// op01.text = files[i];
	// op02.text = files[i];
	// op03.text = files[i];
	// op04.text = files[i];
	// op01.value = i;
	// op02.value = i;
	// op03.value = i;
	// op04.value = i;
	// sel01.appendChild(op01);
	// sel02.appendChild(op02);
	// sel03.appendChild(op03);
	// sel04.appendChild(op04);
}

// document.getElementById("sel01").options[selectedIds[3]].selected = true;
// document.getElementById("sel02").options[selectedIds[2]].selected = true;
// document.getElementById("sel03").options[selectedIds[1]].selected = true;
// document.getElementById("sel04").options[selectedIds[0]].selected = true;
//
// document.querySelector("#st01").addEventListener("click", function() {
// 	document.getElementById("st01").setAttribute("max", keys.player(selectedIds[3]).buffer.duration);
// });
// document.querySelector("#st02").addEventListener("click", function() {
// 	document.getElementById("st02").setAttribute("max", keys.player(selectedIds[2]).buffer.duration);
// });
// document.querySelector("#st03").addEventListener("click", function() {
// 	document.getElementById("st03").setAttribute("max", keys.player(selectedIds[1]).buffer.duration);
// });
// document.querySelector("#st04").addEventListener("click", function() {
// 	document.getElementById("st04").setAttribute("max", keys.player(selectedIds[0]).buffer.duration);
// });



// document.querySelector("tone-play-toggle").addEventListener("start", () => {
// 	if (reloadFlag) {
// 		window.location.reload();
// 	}
// 	Tone.Transport.start();
// });
// document.querySelector("tone-play-toggle").addEventListener("stop", () => Tone.Transport.stop());
// document.querySelector("#bpm").addEventListener("input", (e) => Tone.Transport.bpm.value = parseFloat(e.target.value));
// document.querySelector("#sel01").addEventListener("change", function() {
// 	selectedIds[3] = this.selectedIndex;
// 	document.querySelector("#st01").setAttribute("value", 0);
// 	document.querySelector("#st01").setAttribute("max", keys.player(this.selectedIndex).buffer.duration);
// });
// document.querySelector("#sel02").addEventListener("change", function() {
// 	selectedIds[2] = this.selectedIndex;
// 	document.querySelector("#st02").setAttribute("value", 0);
// 	document.querySelector("#st02").setAttribute("max", keys.player(this.selectedIndex).buffer.duration);
// });
// document.querySelector("#sel03").addEventListener("change", function() {
// 	selectedIds[1] = this.selectedIndex;
// 	document.querySelector("#st03").setAttribute("value", 0);
// 	document.querySelector("#st03").setAttribute("max", keys.player(this.selectedIndex).buffer.duration);
// });
// document.querySelector("#sel04").addEventListener("change", function() {
// 	selectedIds[0] = this.selectedIndex;
// 	document.querySelector("#st04").setAttribute("value", 0);
// 	document.querySelector("#st04").setAttribute("max", keys.player(this.selectedIndex).buffer.duration);
// });
// document.querySelector("#st01").addEventListener("input", (e) => sttime[3] = parseFloat(e.target.value));
// document.querySelector("#st02").addEventListener("input", (e) => sttime[2] = parseFloat(e.target.value));
// document.querySelector("#st03").addEventListener("input", (e) => sttime[1] = parseFloat(e.target.value));
// document.querySelector("#st04").addEventListener("input", (e) => sttime[0] = parseFloat(e.target.value));
// document.querySelector("tone-step-sequencer").addEventListener("trigger", ({ detail }) => {
// 	keys.player(selectedIds[detail.row]).start(detail.time, sttime[detail.row], "8n");
// });

function setup() {
	createCanvas(windowWidth, windowHeight);

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

		for (let i = 0; i < files.length; i++) {
			sel.option(files[i], i);
		}
		// for (let url of urls) {
		// 	let arr = split(url, '/');
		// 	let file = arr[arr.length - 1];
		// 	sel.option(file, url);
		// }

		sel.position(margin + textWidth('99'), uiOriginY);
		sel.size(sliderWidth - textWidth('99'), buttonHeight);
		sel.id(i);
		// sel.selected(urls[soundIds[i]]);
		sel.selected(selectedIds[i]);
		sel.changed(fileChange);
		uiOriginY += buttonHeight + margin / 2;
		fileSelects.push(sel);
	}
	uiOriginY += margin;

	startTimeTitleOriginY = uiOriginY;
	uiOriginY += titleTextSize + margin;

	for (let i = 0; i < numNotes; i++) {
		let slider = createSlider(0, keys.player(selectedIds[i]).buffer.duration, 0, 0);
		startTimeOriginY.push(uiOriginY);
		slider.position(margin + textWidth('99'), uiOriginY);
		slider.size(sliderWidth - textWidth('99'), sliderHeight);
		uiOriginY += sliderHeight + margin;
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
	Tone.Transport.bpm.value = bpm;
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

		let validNotes = [];
		let validIds = [];
		for (let i = 0; i < numNotes; i++) {
			if (notes[curStep * numNotes + i]) {
				validNotes.push(selectedIds[i]);
				validIds.push(i);
			}
			// if (sounds[soundIds[i]].isPlaying()) {
			// 	sounds[soundIds[i]].stop();
			// }
			if (keys.player(selectedIds[i]).state === "started") {
				keys.player(selectedIds[i]).stop(0);
			}
		}

		for (let i = 0; i < validNotes.length; i++) {
			// sounds[validNotes[i]].play(0, 1, 1, startTimes[validIds[i]]);
			keys.player(validNotes[i]).start(0, startTimes[validIds[i]], "16n");
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
	if (reloadFlag) {
		window.location.reload();
	}

	if (startSliders[0].elt.max === "0") {
		for (let i = 0; i < startSliders.length; i++) {
			startSliders[i].elt.max = keys.player(selectedIds[i]).buffer.duration;
		}
	}

	if (touchValid) {
		// if (getAudioContext().state !== 'running') {
		// 	// getAudioContext().resume();
		// 	userStartAudio();
		// 	sounds[0].play();
		// 	sounds[0].stop();
		// }
		if (mouseX >= seqOrigin.x && mouseX <= seqOrigin.x + seqSize.x && mouseY >= seqOrigin.y && mouseY <= seqOrigin.y + seqSize.y) {
			let noteId = int((mouseX - seqOrigin.x) / rectWidth) * numNotes + int((mouseY - seqOrigin.y) / rectHeight);
			notes[noteId] = !notes[noteId];
		}
		touchValid = false;
		touchedTime = millis();
	}
}

function clearNotes() {
	for (let i = 0; i < notes.length; i++) {
		notes[i] = false;
	}
}

// document.querySelector("#save").addEventListener("click", () => {
function exportFile() {
	Tone.Transport.stop();

	let stepLength = Math.floor(Tone.Transport.toSeconds("16n") * keys.context.sampleRate);
	let fileLength = stepLength * 16;
	let outBuffer = new Float32Array(fileLength);

	for (let note = 0; note < 4; note++) {
		let inStart = Math.floor(sttime[note] * Tone.context.sampleRate);
		for (let step = 0; step < 16; step++) {
			// if (document.querySelector("tone-step-sequencer")._matrix[step][3 - note]) {
			if (notes[step * numNotes + note]) {
				let outStart = stepLength * step;
				for (let i = 0; i < stepLength; i++) {
					let inFrame = (inStart + i) % keys.player(selectedIds[note]).buffer.getChannelData(0).length;
					outBuffer[outStart + i] += keys.player(selectedIds[note]).buffer.getChannelData(0)[inFrame];
				}
			}
		}
	}

	fetch('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/addons/p5.sound.js').then(r=>r.text()).then(t=>eval(t)).then(()=>{
		let dateObj = new Date();
		let outFile = new p5.SoundFile();
		outFile.setBuffer([outBuffer]);
		outFile.save(dateObj.getFullYear() + ('00' + dateObj.getMonth()).slice(-2) + ('00' + dateObj.getDate()).slice(-2) + ('00' + dateObj.getHours()).slice(-2) + ('00' + dateObj.getMinutes()).slice(-2) + ('00' + dateObj.getSeconds()).slice(-2));
		// window.location.reload();
		reloadFlag = true;
	});
}

function fileChange() {
	selectedIds[this.elt.id] = this.elt.selectedIndex;
	// soundIds[this.elt.id] = this.elt.selectedIndex;
	// if (sounds[soundIds[this.elt.id]].isPlaying()) {
	// 	sounds[soundIds[this.elt.id]].stop();
	// }
	startTimes[this.elt.id] = 0;
	startSliders[this.elt.id].elt.value = 0;
	// startSliders[this.elt.id].elt.max = sounds[soundIds[this.elt.id]].duration();
	startSliders[this.elt.id].elt.max = keys.player(selectedIds[this.elt.id]).buffer.duration;
}
