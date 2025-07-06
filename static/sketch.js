// === DEMO ===
const allUserData = [
  { name: "Astra", xPercent: 0.2, yPercent: 0.3, color: '#FF6B6B', noteIndices: [1, 2, 4] },
  { name: "Cleo", xPercent: 0.4, yPercent: 0.5, color: '#FFD93D', noteIndices: [2, 3, 5] },
  { name: "Orion", xPercent: 0.6, yPercent: 0.4, color: '#6BCB77', noteIndices: [3, 4, 6] },
  { name: "Bennu", xPercent: 0.3, yPercent: 0.7, color: '#4D96FF', noteIndices: [4, 5, 7] },
  { name: "Nova", xPercent: 0.7, yPercent: 0.6, color: '#C780FA', noteIndices: [5, 6, 0] },
  { name: "Beta", xPercent: 0.5, yPercent: 0.2, color: '#FF8C42', noteIndices: [6, 7, 1] },
  { name: "Iris", xPercent: 0.15, yPercent: 0.85, color: '#00C2A8', noteIndices: [7, 0, 2] },
  { name: "Neo", xPercent: 0.85, yPercent: 0.15, color: '#FF5DA2', noteIndices: [0, 1, 3] },
  /*{ name: "Echo", xPercent: 0.1, yPercent: 0.5, color: '#A3A1FB', noteIndices: [2, 3, 5] },
  { name: "Juno", xPercent: 0.9, yPercent: 0.3, color: '#FBB13C', noteIndices: [3, 4, 6] }*/
];

// === GLOBALS ===
const scales = {
  minimal: [
    196, 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88,
    523.25, 587.33, 659.26, 698.46, 783.99,
    // repetir las mismas 15 notas varias veces
    196, 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88,
    523.25, 587.33, 659.26, 698.46, 783.99,
    196, 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88,
    523.25, 587.33, 659.26, 698.46, 783.99
  ],
  minimal_alt1: [
    220, 246.94, 293.66, 329.63, 392, 440, 493.88, 523.25, 587.33,
    659.26, 698.46, 783.99, 880, 987.77, 1046.5,
    220, 246.94, 293.66, 329.63, 392, 440, 493.88, 523.25, 587.33,
    659.26, 698.46, 783.99, 880, 987.77, 1046.5,
    220, 246.94, 293.66, 329.63, 392, 440, 493.88, 523.25, 587.33,
    659.26, 698.46, 783.99, 880, 987.77, 1046.5
  ],
  minimal_alt2: [
    174.61, 196, 220, 246.94, 261.63, 293.66, 329.63, 349.23,
    392, 440, 493.88, 523.25, 587.33, 659.26, 698.46,
    174.61, 196, 220, 246.94, 261.63, 293.66, 329.63, 349.23,
    392, 440, 493.88, 523.25, 587.33, 659.26, 698.46,
    174.61, 196, 220, 246.94, 261.63, 293.66, 329.63, 349.23,
    392, 440, 493.88, 523.25, 587.33, 659.26, 698.46
  ]
};

const colorNotePalette = [
  { color: '#FF6B6B', index: 0 },
  { color: '#FFD93D', index: 1 },
  { color: '#6BCB77', index: 2 },
  { color: '#4D96FF', index: 3 },
  { color: '#C780FA', index: 4 },
  { color: '#FF8C42', index: 5 },
  { color: '#00C2A8', index: 6 },
  { color: '#FF5DA2', index: 7 },
  { color: '#A3A1FB', index: 8 },
  { color: '#FBB13C', index: 9 },
  { color: '#A89F91', index: 10 },
  { color: '#8C9C8C', index: 11 },
  { color: '#B0A18F', index: 12 },
  { color: '#FFB7C5', index: 13 },
  { color: '#AEC6CF', index: 14 },
  { color: '#E07A5F', index: 15 },
  { color: '#3D405B', index: 16 },
  { color: '#81B29A', index: 17 },
  { color: '#F2CC8F', index: 18 },
  { color: '#9A8C98', index: 19 },
  { color: '#B5838D', index: 20 },
  { color: '#6D6875', index: 21 },
  { color: '#FFC857', index: 22 },
  { color: '#119DA4', index: 23 },
  { color: '#19647E', index: 24 },
  { color: '#D7263D', index: 25 },
  { color: '#F46036', index: 26 },
  { color: '#2E294E', index: 27 },
  { color: '#1B998B', index: 28 },
  { color: '#E71D36', index: 29 },
  { color: '#FF9F1C', index: 30 },
  { color: '#2EC4B6', index: 31 },
  { color: '#E71D36', index: 32 },
  { color: '#FFBF69', index: 33 },
  { color: '#CB997E', index: 34 },
  { color: '#6B4226', index: 35 },
  { color: '#8D99AE', index: 36 },
  { color: '#EF233C', index: 37 },
  { color: '#D90429', index: 38 },
  { color: '#F94144', index: 39 },
  { color: '#F3722C', index: 40 },
  { color: '#F9844A', index: 41 },
  { color: '#F9C74F', index: 42 },
  { color: '#90BE6D', index: 43 },
  { color: '#43AA8B', index: 44 },
  { color: '#577590', index: 45 },
  { color: '#277DA1', index: 46 },
  { color: '#4D908E', index: 47 },
  { color: '#A2D5C6', index: 48 },
  { color: '#FF6F59', index: 49 },
  /*{ color: '#254441', index: 50 },
  { color: '#43BCCD', index: 51 },
  { color: '#F7FFF7', index: 52 },
  { color: '#FCE38A', index: 53 },
  { color: '#EAFFD0', index: 54 },*/
];

const isDemoMode = new URLSearchParams(window.location.search).get("demo") === "true";
let currentScaleKey = null;
let notes = [];
let activeUserNames = [];
let activeUsers = 0;
let userNoteIndices = {};
let hoverOscillators = [];
let oscillators = [];
let soundStarted = false;
let circlesVisible = false;
let fetchInterval;
let dynamicUserData = {};
let draggedUserIndex = -1;
let dragOffset = { x: 0, y: 0 };
let fullscreenButton, restartButton, startBtn;

// === SETUP ===
function setup() {
  createCanvas(windowWidth, windowHeight);
  notes = chooseNewScaleKey();
  createMainMenu();
}

function draw() {
  if (!soundStarted || !circlesVisible) return;
  background('#202020');

  const pixelPositions = getPixelPositions();
  if (!pixelPositions.length) return;

  const { connections } = getUserConnections(pixelPositions);
  stroke(255, 60);
  strokeWeight(1);
  connections.forEach(([i, j]) => {
    const a = pixelPositions[i];
    const b = pixelPositions[j];
    line(a.x, a.y, b.x, b.y);
  });

  noStroke();
  for (let i = 0; i < activeUsers; i++) {
    const name = activeUserNames[i];
    if (!name) continue; // Skip if name is undefined or empty
    const user = isDemoMode
      ? allUserData.find(u => u.name === name)
      : dynamicUserData[name];
    const pos = pixelPositions[i];
    const isMouseOver = dist(mouseX, mouseY, pos.x, pos.y) < 30;
    const noteIndex = userNoteIndices[name];
    const pulseSpeed = notes[noteIndex] || 1;
    const size = 20 + sin(frameCount * pulseSpeed * 0.0001) * 5;

    fill(user.color + (isMouseOver ? "FF" : "AA"));
    ellipse(pos.x, pos.y, size);

    if (isMouseOver) {
      const freq = notes[noteIndex];
      if (!hoverOscillators[i] || !isFinite(hoverOscillators[i].sineOsc.freq().value)) {
        stopHoverOscillator(i);  // Detenemos cualquier oscilador anterior duplicado
        hoverOscillators[i] = createHoverOscillator(freq);
      }

      // Mostrar detalles al hacer hover
      let info = "";
      if (user.unifiedScreenName) info += `${user.unifiedScreenName}\n`;
      if (user.city) info += `${user.city}\n`;
      if (user.country) info += `${user.country}\n`;

      fill(255);
      textAlign(CENTER, TOP);
      textSize(16);
      text(info.trim(), pos.x, pos.y + 40);
    } else if (hoverOscillators[i]) {
      stopHoverOscillator(i);
    }
  }

  fill(255);
  textAlign(CENTER, TOP);
  textSize(20);
  /*text(`Ahora en IDIS: ${activeUsers}`, width / 2, 20);*/
  /*text(`Conexiones: ${connections.length}`, width / 2, 50);*/

  console.log(dynamicUserData);
}

// === USER INTERACTION ===
function mousePressed() {
  const positions = getPixelPositions();
  for (let i = 0; i < positions.length; i++) {
    if (dist(mouseX, mouseY, positions[i].x, positions[i].y) < 30) {
      draggedUserIndex = i;
      dragOffset.x = positions[i].x - mouseX;
      dragOffset.y = positions[i].y - mouseY;
      break;
    }
  }
}

function mouseDragged() {
  if (draggedUserIndex < 0) return;
  const name = activeUserNames[draggedUserIndex];
  const user = isDemoMode
    ? allUserData.find(u => u.name === name)
    : dynamicUserData[name];
  user.xPercent = constrain((mouseX + dragOffset.x) / width, 0, 1);
  user.yPercent = constrain((mouseY + dragOffset.y) / height, 0, 1);
}

function mouseReleased() {
  draggedUserIndex = -1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (fullscreenButton) fullscreenButton.position(windowWidth - 60, 10);
  if (restartButton) restartButton.position(windowWidth - 120, 10);
  if (startBtn) startBtn.position(windowWidth / 2 - 80, windowHeight / 2 - 30);
}

// === STARTUP ===
function createMainMenu() {
  removeElements();
  background('#202020');
  startBtn = createButton("Ahora en IDIS");
  startBtn.position(windowWidth / 2 - 110, windowHeight / 2 - 30);
  startBtn.size(250, 50);
  startBtn.style('color', 'black');
  startBtn.style('font-size', '25px');
  startBtn.style('font-family', 'Helvetica');
  startBtn.style('font-weight', 'bold');
  startBtn.style('border-radius', '10px');
  startBtn.style('cursor', 'pointer');
  startBtn.mousePressed(startApp);
}

function startApp() {
  removeElements();
  userStartAudio(); getAudioContext().resume();
  soundStarted = true; circlesVisible = true;
  createFullscreenButton(); createRestartButton();
  if (isDemoMode) {
    updateDemoUsers();
    fetchInterval = setInterval(updateDemoUsers, 15000);
  } else {
    updateRealUsers();
    fetchInterval = setInterval(() => {
      updateRealUsers();      // actualiza usuarios si hay nuevos
      updateRealNotes();      // cambia frecuencias con nueva escala suave
    }, 15000);
  }
}

function createFullscreenButton() {
  fullscreenButton = createButton('⛶');
  fullscreenButton.position(windowWidth - 60, 10);
  fullscreenButton.size(50, 50);
  fullscreenButton.style('font-size', '24px');
  fullscreenButton.style('font-family', 'Helvetica');
  fullscreenButton.style('background', 'rgba(0,0,0,0.5)');
  fullscreenButton.style('color', 'white');
  fullscreenButton.style('border', 'none');
  fullscreenButton.style('border-radius', '10px');
  fullscreenButton.style('cursor', 'pointer');
  fullscreenButton.mousePressed(() => fullscreen(!fullscreen()));
}

function createRestartButton() {
  restartButton = createButton('←');
  restartButton.position(windowWidth - 120, 10);
  restartButton.size(50, 50);
  restartButton.style('font-size', '24px');
  restartButton.style('font-family', 'Helvetica');
  restartButton.style('background', 'rgba(0,0,0,0.5)');
  restartButton.style('color', 'white');
  restartButton.style('border', 'none');
  restartButton.style('border-radius', '10px');
  restartButton.style('cursor', 'pointer');
  restartButton.mousePressed(() => {
    clearInterval(fetchInterval);
    removeElements();
    hoverOscillators.forEach(o => o && stopHoverOscillatorImmediate(o));
    oscillators.forEach(o => o && stopHoverOscillatorImmediate(o));
    hoverOscillators = [];
    oscillators = [];
    soundStarted = false;
    circlesVisible = false;
    activeUsers = 0;
    createMainMenu();
  });
}

function stopAllOscillators() {
  soundStarted = false;
  circlesVisible = false;
  activeUserNames = [];
  activeUsers = 0;

  hoverOscillators.forEach(osc => {
    if (osc) {
      osc.sineOsc.amp(0, 0.4);
      osc.noise.amp(0, 0.4);
      setTimeout(() => {
        osc.sineOsc.stop();
        osc.noise.stop();
        osc.sineOsc.dispose();
        osc.noise.dispose();
        osc.filter.dispose();
      }, 500);
    }
  });

  oscillators.forEach(osc => {
    if (osc) {
      osc.sine.amp(0, 0.4);
      osc.noise.amp(0, 0.4);
      setTimeout(() => {
        osc.sine.stop();
        osc.noise.stop();
        osc.sine.dispose();
        osc.noise.dispose();
        osc.filter.dispose();
      }, 500);
    }
  });

  hoverOscillators = [];
  oscillators = [];
}

// === MODE HANDLERS ===
function updateDemoUsers() {
  activeUsers = floor(random(3, 11));
  const shuffled = shuffle([...allUserData]);
  const selected = shuffled.slice(0, activeUsers);
  activeUserNames = selected.map(u => u.name);
  userNoteIndices = {};
  selected.forEach(u => {
    const randIndex = floor(random(u.noteIndices.length));
    userNoteIndices[u.name] = u.noteIndices[randIndex];
  });

  updateOscillators();
}

async function updateRealUsers() {
  try {
    const response = await fetch('/active_users');
    const data = await response.json();

    if (Array.isArray(data.active_users) && data.active_users.length > 0) {
      const fetchedUsers = data.active_users
        .filter(u => u.unifiedScreenName && u.city && u.country)
        .slice(0, colorNotePalette.length);

      activeUserNames = fetchedUsers.map(u => u.unifiedScreenName);
      activeUsers = fetchedUsers.length;
      console.log(`Usuarios conectados en vivo: ${activeUsers}`);  // <-- Aquí
      userNoteIndices = {};

      let availablePairs = shuffle([...colorNotePalette]); // randomiza para mayor variedad

      fetchedUsers.forEach(u => {
        const name = u.unifiedScreenName;

        // Si el usuario ya tiene datos asignados, conservar color y nota
        if (!dynamicUserData[name]) {
          const pair = availablePairs.shift();
          if (!pair) return;

          dynamicUserData[name] = {
            name,
            unifiedScreenName: u.unifiedScreenName,
            city: u.city,
            country: u.country,
            xPercent: random(0.2, 0.8),
            yPercent: random(0.2, 0.8),
            color: pair.color,
            noteIndex: pair.index  // store original index
          };
        }

        // always assign note index from stored
        userNoteIndices[name] = dynamicUserData[name].noteIndex;
      });

      updateOscillators();
    } else {
      activeUserNames = [];
      activeUsers = 0;
      console.log(`Usuarios conectados en vivo: ${activeUsers}`);  // <-- Y aquí
    }
  } catch (error) {
    console.error("Error fetching real user data:", error);
  }
}

function updateRealNotes() {
  const previousScaleKey = currentScaleKey;
  notes = chooseNewScaleKey(previousScaleKey);
}


// === UTILITIES ===
function chooseNewScaleKey(previousKey = currentScaleKey) {
  let keys = Object.keys(scales).filter(key => key !== previousKey);

  // If all keys were filtered out (e.g. only one exists), allow repeat
  if (keys.length === 0) keys.push(previousKey);

  const newKey = random(keys);
  currentScaleKey = newKey;
  return scales[newKey];
}

function getPixelPositions() {
  return activeUserNames.map(name => {
    const u = isDemoMode
      ? allUserData.find(u => u.name === name)
      : dynamicUserData[name];

    if (!u) return { x: 0, y: 0 };  // fallback if undefined

    return {
      x: (u.xPercent || 0.5) * width,
      y: (u.yPercent || 0.5) * height
    };
  });
}

function getUserConnections(pixelPositions) {
  let userConnections = Array(activeUsers).fill(0);
  let connections = [];

  for (let i = 0; i < activeUsers; i++) {
    const pos = pixelPositions[i];
    let distances = [];

    for (let j = 0; j < activeUsers; j++) {
      if (i !== j) {
        const d = dist(pos.x, pos.y, pixelPositions[j].x, pixelPositions[j].y);
        distances.push({ j, distance: d });
      }
    }

    distances.sort((a, b) => a.distance - b.distance);
    let connectionCount = 0;

    for (let k = 0; k < distances.length && connectionCount < 2; k++) {
      const j = distances[k].j;
      if (userConnections[i] < 2 && userConnections[j] < 2 && !connections.some(c => (c[0] === j && c[1] === i))) {
        connections.push([i, j]);
        userConnections[i]++;
        userConnections[j]++;
        connectionCount++;
      }
    }

    if (userConnections[i] === 0 && distances.length > 0) {
      const j = distances[0].j;
      connections.push([i, j]);
      userConnections[i]++;
      userConnections[j]++;
    }
  }

  return { connections };
}

/*function colorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorNotePalette[Math.abs(hash) % colorNotePalette.length].color;
}*/

// === AUDIO ===
function updateOscillators() {
  oscillators.forEach(o => {
    if (o) {
      o.sine.amp(0, 2);
      o.noise.amp(0, 2);
      setTimeout(() => {
        o.sine.stop(); o.noise.stop();
        o.sine.dispose(); o.noise.dispose();
        o.filter.dispose();
      }, 500);
    }
  });
  oscillators = [];

  for (let i = 0; i < activeUsers; i++) {
    const name = activeUserNames[i];
    const user = isDemoMode
      ? allUserData.find(u => u.name === name)
      : dynamicUserData[name];
    const freq = notes[userNoteIndices[name]];

    const filter = new p5.BandPass();
    filter.freq(freq); filter.res(15);

    const sine = new p5.Oscillator('sine');
    sine.freq(freq); sine.amp(0);
    sine.disconnect(); sine.connect(filter); sine.start();
    sine.amp(0.015, 2);

    const noise = new p5.Noise('white');
    noise.amp(0); noise.disconnect();
    noise.connect(filter); noise.start();
    noise.amp(0.007, 2);

    oscillators.push({ sine, noise, filter });
  }
}

function createHoverOscillator(freq) {
  if (!isFinite(freq)) return null;

  const filter = new p5.BandPass();
  filter.freq(freq * 2);
  filter.res(10);

  const sine = new p5.Oscillator('sine');
  sine.freq(freq * 2);
  sine.amp(0);
  sine.disconnect();
  sine.connect(filter);
  sine.start();
  sine.amp(0.05, 0.5);

  const noise = new p5.Noise('white');
  noise.amp(0);
  noise.disconnect();
  noise.connect(filter);
  noise.start();
  noise.amp(0.01, 0.5);

  return { sineOsc: sine, noise, filter };
}

function stopHoverOscillator(i) {
  const o = hoverOscillators[i];
  if (!o) return;

  // Solo detiene si no está ya en proceso
  o.sineOsc.amp(0, 0.5);
  o.noise.amp(0, 0.5);
  setTimeout(() => stopHoverOscillatorImmediate(o), 1500);
  hoverOscillators[i] = null;
}

function stopHoverOscillatorImmediate(o) {
  if (o.sineOsc) o.sineOsc.stop();
  if (o.noise) o.noise.stop();
  if (o.sineOsc) o.sineOsc.dispose();
  if (o.noise) o.noise.dispose();
  if (o.filter) o.filter.dispose();
}

/*function noteIndexFromColor(color) {
  const match = colorNotePalette.find(entry => entry.color === color);
  return match ? match.index : floor(random(notes.length));
}*/