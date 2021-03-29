let reloadFlag = false;
let sttime = [0, 0, 0, 0];

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

Tone.Transport.bpm.value = document.querySelector("#bpm").getAttribute("value");

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

	let sel01 = document.getElementById("sel01");
	let sel02 = document.getElementById("sel02");
	let sel03 = document.getElementById("sel03");
	let sel04 = document.getElementById("sel04");
	let op01 = document.createElement("option");
	let op02 = document.createElement("option");
	let op03 = document.createElement("option");
	let op04 = document.createElement("option");
	op01.text = files[i];
	op02.text = files[i];
	op03.text = files[i];
	op04.text = files[i];
	op01.value = i;
	op02.value = i;
	op03.value = i;
	op04.value = i;
	sel01.appendChild(op01);
	sel02.appendChild(op02);
	sel03.appendChild(op03);
	sel04.appendChild(op04);
}

document.getElementById("sel01").options[selectedIds[3]].selected = true;
document.getElementById("sel02").options[selectedIds[2]].selected = true;
document.getElementById("sel03").options[selectedIds[1]].selected = true;
document.getElementById("sel04").options[selectedIds[0]].selected = true;

document.querySelector("#st01").addEventListener("click", function() {
	document.getElementById("st01").setAttribute("max", keys.player(selectedIds[3]).buffer.duration);
});
document.querySelector("#st02").addEventListener("click", function() {
	document.getElementById("st02").setAttribute("max", keys.player(selectedIds[2]).buffer.duration);
});
document.querySelector("#st03").addEventListener("click", function() {
	document.getElementById("st03").setAttribute("max", keys.player(selectedIds[1]).buffer.duration);
});
document.querySelector("#st04").addEventListener("click", function() {
	document.getElementById("st04").setAttribute("max", keys.player(selectedIds[0]).buffer.duration);
});

document.querySelector("#save").addEventListener("click", () => {
	Tone.Transport.stop();

	let stepLength = Math.floor(Tone.Transport.toSeconds("8n") * keys.context.sampleRate);
	let fileLength = stepLength * 16;
	let outBuffer = new Float32Array(fileLength);

	for (let note = 0; note < 4; note++) {
		let inStart = Math.floor(sttime[note] * Tone.context.sampleRate);
		for (let step = 0; step < 16; step++) {
			if (document.querySelector("tone-step-sequencer")._matrix[step][3 - note]) {
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
});

document.querySelector("tone-play-toggle").addEventListener("start", () => {
	if (reloadFlag) {
		window.location.reload();
	}
	Tone.Transport.start();
});
document.querySelector("tone-play-toggle").addEventListener("stop", () => Tone.Transport.stop());
document.querySelector("#bpm").addEventListener("input", (e) => Tone.Transport.bpm.value = parseFloat(e.target.value));
document.querySelector("#sel01").addEventListener("change", function() {
	selectedIds[3] = this.selectedIndex;
	document.querySelector("#st01").setAttribute("value", 0);
	document.querySelector("#st01").setAttribute("max", keys.player(this.selectedIndex).buffer.duration);
});
document.querySelector("#sel02").addEventListener("change", function() {
	selectedIds[2] = this.selectedIndex;
	document.querySelector("#st02").setAttribute("value", 0);
	document.querySelector("#st02").setAttribute("max", keys.player(this.selectedIndex).buffer.duration);
});
document.querySelector("#sel03").addEventListener("change", function() {
	selectedIds[1] = this.selectedIndex;
	document.querySelector("#st03").setAttribute("value", 0);
	document.querySelector("#st03").setAttribute("max", keys.player(this.selectedIndex).buffer.duration);
});
document.querySelector("#sel04").addEventListener("change", function() {
	selectedIds[0] = this.selectedIndex;
	document.querySelector("#st04").setAttribute("value", 0);
	document.querySelector("#st04").setAttribute("max", keys.player(this.selectedIndex).buffer.duration);
});
document.querySelector("#st01").addEventListener("input", (e) => sttime[3] = parseFloat(e.target.value));
document.querySelector("#st02").addEventListener("input", (e) => sttime[2] = parseFloat(e.target.value));
document.querySelector("#st03").addEventListener("input", (e) => sttime[1] = parseFloat(e.target.value));
document.querySelector("#st04").addEventListener("input", (e) => sttime[0] = parseFloat(e.target.value));
document.querySelector("tone-step-sequencer").addEventListener("trigger", ({ detail }) => {
	keys.player(selectedIds[detail.row]).start(detail.time, sttime[detail.row], "8n");
});
