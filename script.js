const canvas = document.getElementById('antCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let gridCols, gridRows;
let grid = [];
let ants = [];

let scale = 4;
const initialScale = 4;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let lastMouseX = 0, lastMouseY = 0;

let isRunning = false;
let currentIntervalId = null;
let currentSpeed = 50;
let simulationSteps = 0;

const COLOR_BLACK = 0;
const colors = [
    '#000000', // 0: Black
    '#FFFFFF', // 1: White 
    '#FF00FF', // 2: Magenta
    '#FFFF00', // 3: Yellow
    '#00FF00', // 4: Lime
    '#00FFFF', // 5: Cyan
    '#FF0000', // 6: Red 
    '#FFA500', // 7: Orange
    '#0000FF', // 8: Blue
    '#FF69B4', // 9: Hot Pink
    '#DA70D6', // 10: Orchid
    '#8A2BE2'  // 11: BlueViolet
];

let globalRules = {
    0: { writeColor: 1, move: 'R' },
    1: { writeColor: 0, move: 'L' }
};

const directions = [
    { dx: 0, dy: -1 }, // North
    { dx: 1, dy: 0 },  // East
    { dx: 0, dy: 1 },  // South
    { dx: -1, dy: 0 }  // West
];

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.imageSmoothingEnabled = false;
    if (!isRunning) requestAnimationFrame(draw);
}
window.addEventListener('resize', resizeCanvas);

function updateAntCountDisplay() {
    const display = document.getElementById('antCountDisplay');
    if (display) display.textContent = ants.length;
}

function updateStepCountDisplay() {
    const display = document.getElementById('stepCountDisplay');
    if (display) display.textContent = simulationSteps.toLocaleString();
}

function initSimulation() {
    stopSimulation();
    simulationSteps = 0;
    
    const presetSelect = document.getElementById('presetSelect');
    const selectedPreset = presetSelect ? presetSelect.value : "";
    
    // We don't reset globalRules based on preset here anymore, because 
    // globalRules is already updated directly in the preset dropdown's 'change' listener.
    
    scale = initialScale;
    // Double the playable grid area relative to screen size (reduced from 4x)
    gridCols = Math.ceil((width * 2) / scale);
    gridRows = Math.ceil((height * 2) / scale);
    
    if (gridCols < 10) gridCols = 10;
    if (gridRows < 10) gridRows = 10;
    
    grid = new Uint8Array(gridCols * gridRows);
    ants = [];
    
    // Default 1 ant in the center, applying the current direction selected in the UI
    const cx = Math.floor(gridCols / 2);
    const cy = Math.floor(gridRows / 2);
    const dirSelect = document.getElementById('placeDirectionSelect');
    const defaultDir = dirSelect ? parseInt(dirSelect.value) : 0;
    ants.push({ x: cx, y: cy, dir: defaultDir, rule: JSON.parse(JSON.stringify(globalRules)) });
    updateAntCountDisplay();
    updateStepCountDisplay();
    
    updatePlayPauseButton();
    if (isRunning) {
        startSimulationLoop();
    } else {
        stopSimulation();
        requestAnimationFrame(draw);
    }
}

function resetCamera() {
    scale = initialScale;
    offsetX = -(gridCols * scale - width) / 2;
    offsetY = -(gridRows * scale - height) / 2;
    constrainCamera();
    if (!isRunning) requestAnimationFrame(draw);
}

function constrainCamera() {
    const minOffsetX = width - (gridCols * scale);
    const maxOffsetX = 0;
    
    if (minOffsetX > maxOffsetX) {
        offsetX = -(gridCols * scale - width) / 2;
    } else {
        offsetX = Math.max(minOffsetX, Math.min(maxOffsetX, offsetX));
    }
    
    const minOffsetY = height - (gridRows * scale);
    const maxOffsetY = 0;
    
    if (minOffsetY > maxOffsetY) {
        offsetY = -(gridRows * scale - height) / 2;
    } else {
        offsetY = Math.max(minOffsetY, Math.min(maxOffsetY, offsetY));
    }
}

function stepAnt(ant) {
    const idx = ant.y * gridCols + ant.x;
    const color = grid[idx];
    
    const rulesToUse = ant.rule || globalRules;
    let rule = null;
    
    if (rulesToUse[color]) {
        rule = rulesToUse[color];
    } else if (rulesToUse[0]) {
        rule = rulesToUse[0];
    } else {
        rule = { writeColor: color, move: 'N' };
    }
    
    grid[idx] = rule.writeColor;
    
    switch (rule.move) {
        case 'R': ant.dir = (ant.dir + 1) % 4; break;
        case 'L': ant.dir = (ant.dir + 3) % 4; break;
    }
    
    ant.x = (ant.x + directions[ant.dir].dx + gridCols) % gridCols;
    ant.y = (ant.y + directions[ant.dir].dy + gridRows) % gridRows;
}

function runSimulationTick() {
    if (!isRunning) return;
    
    let stepsPerTick = 1;
    let delay = 16;
    
    if (currentSpeed < 50) {
        delay = Math.floor(1000 / (currentSpeed * 2));
    } else {
        delay = 16;
        stepsPerTick = Math.ceil(Math.pow((currentSpeed - 40) / 10, 3) + 1);
    }
    
    let stepped = false;
    for (let s = 0; s < Math.min(stepsPerTick, 10000); s++) {
        if (ants.length > 0) {
            for (let i = 0; i < ants.length; i++) {
                stepAnt(ants[i]);
            }
            simulationSteps++;
            stepped = true;
        }
    }
    
    if (stepped) {
        updateStepCountDisplay();
    }
    
    requestAnimationFrame(draw);
    currentIntervalId = setTimeout(runSimulationTick, delay);
}

function stopSimulation() {
    if (currentIntervalId) {
        clearTimeout(currentIntervalId);
        currentIntervalId = null;
    }
}

function startSimulationLoop() {
    if (currentIntervalId) clearTimeout(currentIntervalId);
    runSimulationTick();
}

function toggleSimulation() {
    isRunning = !isRunning;
    updatePlayPauseButton();
    if (isRunning) {
        startSimulationLoop();
    } else {
        stopSimulation();
    }
}

function updatePlayPauseButton() {
    const btn = document.getElementById('startStopBtn');
    btn.innerHTML = isRunning ? '❚❚' : '▶';
}

function draw() {
    ctx.fillStyle = '#111111'; // Outer "void" background (Very Dark Grey)
    ctx.fillRect(0, 0, width, height);
    
    // Draw the simulated grid base (Black)
    ctx.fillStyle = colors[COLOR_BLACK];
    ctx.fillRect(offsetX, offsetY, gridCols * scale, gridRows * scale);
    
    const startCol = Math.max(0, Math.floor(-offsetX / scale));
    const startRow = Math.max(0, Math.floor(-offsetY / scale));
    const endCol = Math.min(gridCols, Math.ceil((width - offsetX) / scale));
    const endRow = Math.min(gridRows, Math.ceil((height - offsetY) / scale));
    
    for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
            const cellColor = grid[r * gridCols + c];
            if (cellColor > 0) {
                ctx.fillStyle = colors[cellColor % colors.length];
                ctx.fillRect(offsetX + c * scale, offsetY + r * scale, scale + 0.5, scale + 0.5);
            }
        }
    }
    
    ctx.fillStyle = 'red';
    for (let i = 0; i < ants.length; i++) {
        const a = ants[i];
        if (a.x >= startCol && a.x < endCol && a.y >= startRow && a.y < endRow) {
            const antCx = offsetX + a.x * scale + scale / 2;
            const antCy = offsetY + a.y * scale + scale / 2;
            const halfSize = scale * 0.4;
            
            ctx.save();
            ctx.translate(antCx, antCy);
            // Direction 0 (N), 1 (E), 2 (S), 3 (W)
            ctx.rotate(a.dir * Math.PI / 2);
            
            ctx.beginPath();
            ctx.moveTo(0, -halfSize);       // Pointing Upward
            ctx.lineTo(-halfSize, halfSize); // Bottom left
            ctx.lineTo(halfSize, halfSize);  // Bottom right
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }
    }
}

document.getElementById('minimizeBtn').addEventListener('click', () => {
    document.getElementById('controlPanel').classList.add('minimized');
});
document.getElementById('maximizeBtn').addEventListener('click', () => {
    document.getElementById('controlPanel').classList.remove('minimized');
});

document.getElementById('minimizeInfoBtn').addEventListener('click', () => {
    document.getElementById('infoPanel').classList.add('minimized');
});
document.getElementById('maximizeInfoBtn').addEventListener('click', () => {
    document.getElementById('infoPanel').classList.remove('minimized');
});

document.getElementById('startStopBtn').addEventListener('click', toggleSimulation);
document.getElementById('resetBtn').addEventListener('click', () => {
    // If not dragging or modifying
    initSimulation();
});
document.getElementById('zeroAntsBtn').addEventListener('click', () => {
    ants = [];
    updateAntCountDisplay();
    if (!isRunning) requestAnimationFrame(draw);
});
document.getElementById('resetViewBtn').addEventListener('click', resetCamera);
document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'langtons-portrait.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

const speedSlider = document.getElementById('simSpeedSlider');
const speedValue = document.getElementById('simSpeedValue');
speedSlider.addEventListener('input', (e) => {
    currentSpeed = parseInt(e.target.value);
    speedValue.textContent = currentSpeed;
});

let dragDist = 0;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    dragDist = 0;
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const placeCheck = document.getElementById('placeAntsCheck');
        if (placeCheck && placeCheck.checked) return; // Prevent panning if placing ants
        
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        dragDist += Math.abs(dx) + Math.abs(dy);
        
        offsetX += dx;
        offsetY += dy;
        constrainCamera();
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        if (!isRunning) requestAnimationFrame(draw);
    }
});

window.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false;
        
        if (dragDist < 5) {
            const clickX = e.clientX;
            const clickY = e.clientY;
            
            const cellX = Math.floor((clickX - offsetX) / scale);
            const cellY = Math.floor((clickY - offsetY) / scale);
            
            if (cellX >= 0 && cellX < gridCols && cellY >= 0 && cellY < gridRows) {
                // 1) First check if we deleted an ant
                let clickedOnAnt = false;
                for (let i = ants.length - 1; i >= 0; i--) {
                    if (ants[i].x === cellX && ants[i].y === cellY) {
                        ants.splice(i, 1);
                        clickedOnAnt = true;
                        break;
                    }
                }
                
                // 2) If we didn't delete, try to place one
                if (!clickedOnAnt) {
                    const placeCheck = document.getElementById('placeAntsCheck');
                    if (placeCheck && !placeCheck.checked) {
                        dragDist = 0;
                        return; // Placing is disabled
                    }
                    
                    const dirSelect = document.getElementById('placeDirectionSelect');
                    const dir = dirSelect ? parseInt(dirSelect.value) : 0;
                    
                    // Parse custom rules text area
                    let newRule = JSON.parse(JSON.stringify(globalRules));
                    const ruleArea = document.getElementById('customRuleArea');
                    if (ruleArea && ruleArea.value.trim() !== '') {
                        try {
                            const parsed = new Function("return " + ruleArea.value)();
                            if (parsed && typeof parsed === 'object') {
                                newRule = parsed;
                            }
                        } catch (err) {
                            console.error("Invalid custom rule format using eval:", err);
                        }
                    }
                    
                    ants.push({ x: cellX, y: cellY, dir: dir, rule: newRule });
                }
                
                if (!isRunning) requestAnimationFrame(draw);
                updateAntCountDisplay();
            }
        }
        dragDist = 0;
    }
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const oldScale = scale;
    
    // Calculate the exact minimum mathematical scale required to keep the grid edges locked to the screen
    const minScale = Math.max(width / gridCols, height / gridRows);
    
    if (e.deltaY < 0) {
        scale = Math.min(50, scale * zoomFactor);
    } else {
        scale = Math.max(minScale, scale / zoomFactor);
    }
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    offsetX = mouseX - (mouseX - offsetX) * (scale / oldScale);
    offsetY = mouseY - (mouseY - offsetY) * (scale / oldScale);
    
    constrainCamera();
    
    if (!isRunning) requestAnimationFrame(draw);
}, { passive: false });

// Load Custom Presets from LocalStorage
const savedCustomPresets = localStorage.getItem('ant_custom_presets');
if (savedCustomPresets && typeof antPresets !== 'undefined') {
    try {
        const customParsed = JSON.parse(savedCustomPresets);
        // Merge into antPresets
        for (const key in customParsed) {
            antPresets[key] = customParsed[key];
        }
    } catch(e) {
        console.error("Could not parse saved custom presets.", e);
    }
}

function refreshPresetDropdown() {
    if (typeof antPresets !== 'undefined') {
        const presetSelect = document.getElementById('presetSelect');
        if (presetSelect) {
            presetSelect.innerHTML = '';
            
            for (const key in antPresets) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = antPresets[key].name;
                presetSelect.appendChild(option);
            }
        }
    }
}

// Initialize Presets Dropdown
refreshPresetDropdown();

const presetSelect = document.getElementById('presetSelect');
if (presetSelect) {
    const lastPreset = localStorage.getItem('ant_last_preset');
    if (lastPreset && antPresets && antPresets[lastPreset]) {
        presetSelect.value = lastPreset;
    } else if (typeof antPresets !== 'undefined') {
        const firstKey = Object.keys(antPresets)[0];
        if (firstKey) {
            presetSelect.value = firstKey;
            localStorage.setItem('ant_last_preset', firstKey);
        }
    }
    
    // Apply the preset rules implicitly on startup if one was saved
    const activePreset = presetSelect.value;
    if (activePreset && typeof antPresets !== 'undefined' && antPresets[activePreset]) {
        const ruleArea = document.getElementById('customRuleArea');
        globalRules = JSON.parse(JSON.stringify(antPresets[activePreset].rules));
        if (ruleArea) ruleArea.value = JSON.stringify(globalRules, null, 2);
    }
    
    presetSelect.addEventListener('change', () => {
        if (presetSelect.value !== "" && antPresets[presetSelect.value]) {
            localStorage.setItem('ant_last_preset', presetSelect.value);
            const selectedRule = antPresets[presetSelect.value].rules;
            globalRules = JSON.parse(JSON.stringify(selectedRule));
            const customRuleArea = document.getElementById('customRuleArea');
            if (customRuleArea) {
                customRuleArea.value = JSON.stringify(globalRules, null, 2);
            }
        }
    });
}

// Handle Save Custom Preset
const savePresetBtn = document.getElementById('savePresetBtn');
if (savePresetBtn) {
    savePresetBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('presetNameInput');
        const ruleArea = document.getElementById('customRuleArea');
        if (!nameInput || !ruleArea || nameInput.value.trim() === '') {
            alert('Please provide a preset name!');
            return;
        }
        
        let newRule;
        try {
            const parsed = new Function("return " + ruleArea.value)();
            if (parsed && typeof parsed === 'object') {
                newRule = parsed;
            } else {
                throw new Error("Invalid Rule");
            }
        } catch (err) {
            alert('Invalid Javascript rule array provided.');
            return;
        }
        
        const presetKey = "custom_" + nameInput.value.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        
        // Save to active mapping
        if (typeof antPresets !== 'undefined') {
            antPresets[presetKey] = {
                name: nameInput.value.trim(),
                rules: newRule
            };
            
            // Save to localStorage
            let existingCustom = {};
            const savedItem = localStorage.getItem('ant_custom_presets');
            if (savedItem) {
                try { existingCustom = JSON.parse(savedItem); } catch(e) {}
            }
            existingCustom[presetKey] = antPresets[presetKey];
            localStorage.setItem('ant_custom_presets', JSON.stringify(existingCustom));
            
            refreshPresetDropdown();
            
            // Auto Select
            const presetSelect = document.getElementById('presetSelect');
            if (presetSelect) {
                presetSelect.value = presetKey;
                localStorage.setItem('ant_last_preset', presetKey);
                globalRules = JSON.parse(JSON.stringify(newRule));
            }
            nameInput.value = '';
            alert('Preset successfully saved!');
        }
    });
}


// Toggle visibility of direction select
const placeAntsCheck = document.getElementById('placeAntsCheck');
if (placeAntsCheck) {
    placeAntsCheck.addEventListener('change', (e) => {
        const dirContainer = document.getElementById('placeDirectionContainer');
        if (dirContainer) {
            dirContainer.style.display = e.target.checked ? 'flex' : 'none';
        }
    });
}

resizeCanvas();
isRunning = false;
initSimulation();
resetCamera();
