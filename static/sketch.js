// === USER DATA ===
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
  /*A_minor: [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99],
  C_minor: [261.63, 311.13, 349.23, 392, 466.16, 523.25, 622.25, 698.46, 783.99, 932.33],
  D_minor: [293.66, 349.23, 392, 440, 523.25, 587.33, 698.46, 783.99, 880, 1046.5],*/
  minimal: [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00],
  minimal_alt1: [220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88, 523.25],
  minimal_alt2: [174.61, 207.65, 233.08, 261.63, 293.66, 349.23, 392.00, 440.00]
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
  { color: '#A3A1FB', index: 0 },
  { color: '#FBB13C', index: 1 },
  { color: '#A89F91', index: 2 },
  { color: '#8C9C8C', index: 3 },
  { color: '#B0A18F', index: 4 },
  { color: '#FFB7C5', index: 5 },
  { color: '#AEC6CF', index: 6 }
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
    const size = 20 + sin(frameCount * pulseSpeed * 0.01) * 5;

    fill(user.color + (isMouseOver ? "FF" : "AA"));
    ellipse(pos.x, pos.y, size);

    fill(255);
    textAlign(CENTER, TOP);
    textSize(20);
    text(user.name, pos.x, pos.y + 40);

    if (isMouseOver) {
      const freq = notes[noteIndex];
      if (!hoverOscillators[i] && isFinite(freq)) {
        hoverOscillators[i] = createHoverOscillator(freq);
      }

    } else if (hoverOscillators[i]) {
      stopHoverOscillator(i);
    }
  }

  fill(255);
  textAlign(CENTER, TOP);
  textSize(20);
  text(`Usuarios activos: ${activeUsers}`, width / 2, 20);
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
  startBtn = createButton("Escuchando a IDIS");
  startBtn.position(windowWidth / 2 - 110, windowHeight / 2 - 30);
  startBtn.size(250, 50);
  startBtn.style('font-size', '25px');
  startBtn.style('font-family', 'Helvetica');
  startBtn.style('border-radius', '10px');
  startBtn.style('cursor', 'pointer');
  startBtn.mousePressed(startApp);
}

function startApp() {
  removeElements();
  userStartAudio(); getAudioContext().resume();
  soundStarted = true; circlesVisible = true;

  if (isDemoMode) {
    fetchInterval = setInterval(updateDemoUsers, 15000);
    updateDemoUsers();
  } else {
    fetchInterval = setInterval(updateRealNotes, 15000);
    updateRealUsers(); // fetches once at start
  }

  createFullscreenButton(); createRestartButton();
  setInterval(() => {
    if (isDemoMode) updateDemoUsers();
    else updateRealNotes();
  }, 15000);
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

    if (data.active_user_names && data.active_user_names.length > 0) {
      const fetchedNames = data.active_user_names.filter(name => name !== "Unknown");
      activeUserNames = fetchedNames;
      activeUsers = fetchedNames.length;
      notes = chooseNewScaleKey();
      userNoteIndices = {};

      fetchedNames.forEach(name => {
        if (!dynamicUserData[name]) {
          const assignedColor = colorFromString(name);
          const noteIndex = noteIndexFromColor(assignedColor);
          dynamicUserData[name] = {
            name,
            xPercent: random(0.2, 0.8),
            yPercent: random(0.2, 0.8),
            color: assignedColor,
            noteIndex
          };
        }

        // Use the already assigned noteIndex
        userNoteIndices[name] = dynamicUserData[name].noteIndex;
      });

      updateOscillators();
    } else {
      activeUserNames = [];
      activeUsers = 0;
    }
  } catch (error) {
    console.error("Error fetching real user data:", error);
  }
}

function updateRealNotes() {
  const previousScaleKey = currentScaleKey;
  notes = chooseNewScaleKey(currentScaleKey);  // Avoid repeat

  activeUserNames.forEach(name => {
    const user = dynamicUserData[name];
    if (user) {
      const index = user.noteIndex; // Fixed noteIndex per user
      user.color = colorNotePalette.find(entry => entry.index === index)?.color || '#FFFFFF';
      userNoteIndices[name] = index;
    }
  });

  updateOscillators();
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

function colorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorNotePalette[Math.abs(hash) % colorNotePalette.length].color;
}

// === AUDIO ===
function updateOscillators() {
  oscillators.forEach(o => {
    if (o) {
      o.sine.amp(0, 0.3);
      o.noise.amp(0, 0.3);
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
    sine.amp(0.015, 0.6);

    const noise = new p5.Noise('white');
    noise.amp(0); noise.disconnect();
    noise.connect(filter); noise.start();
    noise.amp(0.007, 0.6);

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
  o.sineOsc.amp(0, 0.3);
  o.noise.amp(0, 0.3);
  setTimeout(() => stopHoverOscillatorImmediate(o), 500);
  hoverOscillators[i] = null;
}

function stopHoverOscillatorImmediate(o) {
  if (o.sineOsc) o.sineOsc.stop();
  if (o.noise) o.noise.stop();
  if (o.sineOsc) o.sineOsc.dispose();
  if (o.noise) o.noise.dispose();
  if (o.filter) o.filter.dispose();
}

function noteIndexFromColor(color) {
  const match = colorNotePalette.find(entry => entry.color === color);
  return match ? match.index : floor(random(notes.length));
}