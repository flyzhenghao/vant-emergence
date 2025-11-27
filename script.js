/**
 * Vant Emergence - Educational Web App
 * Based on Langton's Ant
 */

// --- Configuration ---
const GRID_SIZE = 151; // Increased size to allow more movement before hitting wall
const CELL_SIZE = 4; // Smaller cells to fit larger grid
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

// --- State ---
let grid = [];
let ant = { x: 0, y: 0, dir: 0 }; // dir: 0=N, 1=E, 2=S, 3=W
let stepCount = 0;
let isRunning = false;
let speed = 10; // Steps per frame (approx)
let animationId = null;
let currentStepIndex = 0;
let currentLang = 'zh'; // 'zh' or 'en'
let wrapWorld = false; // Default: No Wrap

// --- Content Data ---
const content = [
    {
        id: 'intro',
        title: {
            zh: '什么是 Vant (Langton\'s Ant)?',
            en: 'What is Vant (Langton\'s Ant)?'
        },
        text: {
            zh: `
                <p>欢迎来到“涌现”的世界。我们将通过一个极其简单的模型——<strong>兰顿蚂蚁 (Langton's Ant)</strong>，来探索复杂性是如何从简单规则中诞生的。</p>
                <p>这个模型由 Christopher Langton 在 1986 年提出。</p>
                <p><strong>注意：</strong> 本模拟默认关闭了“世界循环 (Wrap World)”，这意味着蚂蚁如果走到边界将会停止。这符合教程中的设定。</p>
                <p>想象一只蚂蚁站在格子上。它只有两个极其简单的规则。让我们开始吧。</p>
            `,
            en: `
                <p>Welcome to the world of "Emergence". We will explore how complexity arises from simplicity using a remarkably simple model: <strong>Langton's Ant</strong>.</p>
                <p>Proposed by Christopher Langton in 1986.</p>
                <p><strong>Note:</strong> "Wrap World" is disabled by default, meaning the ant will stop if it hits the boundary. This matches the tutorial settings.</p>
                <p>Imagine an ant standing on a grid cell. It follows just two extremely simple rules. Let's begin.</p>
            `
        }
    },
    {
        id: 'rules',
        title: {
            zh: '极其简单的规则',
            en: 'Extremely Simple Rules'
        },
        text: {
            zh: `
                <p>蚂蚁每一步只做两件事：</p>
                <ul>
                    <li><strong>如果在一个白色格子上：</strong> 将其涂成<span style="color:#2c3e50; background:#fff; padding:0 4px;">黑色</span>，向<strong>右</strong>转 90 度，向前走一步。</li>
                    <li><strong>如果在一个黑色格子上：</strong> 将其涂成<span style="color:#e0e0e0; background:#333; padding:0 4px;">白色</span>，向<strong>左</strong>转 90 度，向前走一步。</li>
                </ul>
                <p>就是这样。没有随机性，没有复杂的公式。一切都是确定的。</p>
                <p><em>试着点击下方的“单步 (Step)”按钮，观察蚂蚁的最初几步。</em></p>
            `,
            en: `
                <p>The ant does only two things at each step:</p>
                <ul>
                    <li><strong>If on a WHITE square:</strong> Turn it <span style="color:#2c3e50; background:#fff; padding:0 4px;">BLACK</span>, turn <strong>RIGHT</strong> 90°, move forward.</li>
                    <li><strong>If on a BLACK square:</strong> Turn it <span style="color:#e0e0e0; background:#333; padding:0 4px;">WHITE</span>, turn <strong>LEFT</strong> 90°, move forward.</li>
                </ul>
                <p>That's it. No randomness, no complex formulas. Everything is deterministic.</p>
                <p><em>Try clicking the "Step" button below to watch the ant's first few moves.</em></p>
            `
        }
    },
    {
        id: 'phase1',
        title: {
            zh: '阶段一：简单 (Simplicity)',
            en: 'Phase 1: Simplicity'
        },
        text: {
            zh: `
                <p>在最初的几百步里，蚂蚁的行为看起来非常有规律。</p>
                <p>它会构建出一些简单的、对称的图形。一切似乎都在掌控之中，完全符合我们对“简单规则产生简单结果”的直觉。</p>
                <p><em>点击“播放 (Play)”按钮，让它运行到约 400 步左右。</em></p>
            `,
            en: `
                <p>In the first few hundred steps, the ant's behavior looks very regular.</p>
                <p>It builds simple, symmetrical patterns. Everything seems under control, perfectly matching our intuition that "simple rules yield simple results".</p>
                <p><em>Click the "Play" button and let it run to about 400 steps.</em></p>
            `
        }
    },
    {
        id: 'phase2',
        title: {
            zh: '阶段二：混沌 (Chaos)',
            en: 'Phase 2: Chaos'
        },
        text: {
            zh: `
                <p>大约 500 步之后，事情开始变得奇怪了。</p>
                <p>原本的对称性被打破，蚂蚁开始在之前的足迹上乱跑。图形变得毫无规律，看起来完全是随机的。</p>
                <p>这就是<strong>混沌</strong>。虽然规则依然是确定的，但我们已经无法预测蚂蚁下一刻会出现在哪里。</p>
                <p><em>继续运行，观察这团混乱的黑白像素。</em></p>
            `,
            en: `
                <p>After about 500 steps, things start to get weird.</p>
                <p>The symmetry breaks down. The ant starts scurrying chaotically over its previous tracks. The pattern becomes irregular and looks completely random.</p>
                <p>This is <strong>Chaos</strong>. Although the rules are still deterministic, we can no longer predict where the ant will be next.</p>
                <p><em>Keep it running and watch this mess of black and white pixels.</em></p>
            `
        }
    },
    {
        id: 'phase3',
        title: {
            zh: '阶段三：秩序涌现 (Emergence)',
            en: 'Phase 3: Emergence of Order'
        },
        text: {
            zh: `
                <p>耐心等待。大约在 <strong>10,000 步</strong>左右，奇迹会发生。</p>
                <p>突然间，混沌中诞生了秩序。蚂蚁会陷入一个由 104 步组成的循环，形成一条不断延伸的粗线，被称为<strong>“高速公路 (Highway)”</strong>。</p>
                <p>它将永远沿着这个方向走下去（直到碰到世界边缘）。</p>
                <p><em>将速度调到最大，见证这一刻的到来。</em></p>
            `,
            en: `
                <p>Be patient. Around step <strong>10,000</strong>, a miracle happens.</p>
                <p>Suddenly, order emerges from chaos. The ant falls into a 104-step cycle, creating a continuously extending thick line known as the <strong>"Highway"</strong>.</p>
                <p>It will march in this direction forever (until it hits the world's edge).</p>
                <p><em>Crank up the speed and witness this moment.</em></p>
            `
        }
    },
    {
        id: 'conclusion',
        title: {
            zh: '结论与启发',
            en: 'Conclusion & Inspiration'
        },
        text: {
            zh: `
                <p>回顾这三个阶段：<strong>简单 -> 混沌 -> 秩序</strong>。</p>
                <p>谁能想到，那两个简单的左转右转规则，竟然蕴含着建造“高速公路”的潜能？</p>
                <p>这就好比地球生命的演化。从单细胞生物开始，仅靠分裂、变异、选择这几个简单规则，在漫长的时间长河中，涌现出了像你我这样复杂的智慧生命。</p>
                <p><strong>涌现 (Emergence)</strong> 告诉我们：整体大于部分之和。复杂的宏观现象，往往源自微观层面的简单互动。</p>
            `,
            en: `
                <p>Look back at the three phases: <strong>Simplicity -> Chaos -> Order</strong>.</p>
                <p>Who could have guessed that those two simple rules of turning left and right contained the potential to build a "Highway"?</p>
                <p>This is much like the evolution of life on Earth. Starting from single-celled organisms, using just simple rules of division, mutation, and selection, complex intelligent life like us emerged over the vast river of time.</p>
                <p><strong>Emergence</strong> teaches us: The whole is greater than the sum of its parts. Complex macroscopic phenomena often originate from simple interactions at the microscopic level.</p>
            `
        }
    }
];

// --- DOM Elements ---
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const tutorialContent = document.getElementById('tutorial-content');
const prevBtn = document.getElementById('prev-step');
const nextBtn = document.getElementById('next-step');
const stepIndicator = document.getElementById('step-indicator');
const langToggle = document.getElementById('lang-toggle');
const playPauseBtn = document.getElementById('play-pause-btn');
const stepBtn = document.getElementById('step-btn');
const resetBtn = document.getElementById('reset-btn');
const speedSlider = document.getElementById('speed-slider');
const wrapToggle = document.getElementById('wrap-toggle');
const stepCountDisplay = document.getElementById('step-count');
const phaseDisplay = document.getElementById('phase-display');

// --- Initialization ---
function init() {
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    resetSimulation();
    renderContent();
    draw();

    // Event Listeners
    prevBtn.addEventListener('click', () => changeStep(-1));
    nextBtn.addEventListener('click', () => changeStep(1));
    langToggle.addEventListener('click', toggleLanguage);
    playPauseBtn.addEventListener('click', togglePlayPause);
    stepBtn.addEventListener('click', singleStep);
    resetBtn.addEventListener('click', resetSimulation);
    speedSlider.addEventListener('input', (e) => speed = parseInt(e.target.value));
    wrapToggle.addEventListener('change', (e) => wrapWorld = e.target.checked);
}

function resetSimulation() {
    // Initialize Grid (0: White, 1: Black)
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));

    // Center Ant
    ant = {
        x: Math.floor(GRID_SIZE / 2),
        y: Math.floor(GRID_SIZE / 2),
        dir: 0 // 0: Up, 1: Right, 2: Down, 3: Left
    };

    stepCount = 0;
    updateStats();
    draw();

    if (isRunning) {
        togglePlayPause();
    }
}

// --- Simulation Logic ---
function update() {
    // Current cell color
    const currentVal = grid[ant.x][ant.y];

    // Flip color
    grid[ant.x][ant.y] = currentVal === 0 ? 1 : 0;

    // Turn
    if (currentVal === 0) { // White -> Turn Right
        ant.dir = (ant.dir + 1) % 4;
    } else { // Black -> Turn Left
        ant.dir = (ant.dir + 3) % 4; // +3 is same as -1 mod 4
    }

    // Move Forward
    let nextX = ant.x;
    let nextY = ant.y;

    switch (ant.dir) {
        case 0: nextY--; break; // Up
        case 1: nextX++; break; // Right
        case 2: nextY++; break; // Down
        case 3: nextX--; break; // Left
    }

    // Boundary Handling
    if (wrapWorld) {
        // Wrap around (Torus topology)
        if (nextX < 0) nextX = GRID_SIZE - 1;
        if (nextX >= GRID_SIZE) nextX = 0;
        if (nextY < 0) nextY = GRID_SIZE - 1;
        if (nextY >= GRID_SIZE) nextY = 0;

        ant.x = nextX;
        ant.y = nextY;
        stepCount++;
    } else {
        // No Wrap: Stop if out of bounds
        if (nextX >= 0 && nextX < GRID_SIZE && nextY >= 0 && nextY < GRID_SIZE) {
            ant.x = nextX;
            ant.y = nextY;
            stepCount++;
        } else {
            // Hit wall - Stop simulation
            if (isRunning) togglePlayPause();
            alert(currentLang === 'zh' ? '蚂蚁撞到了世界边缘！' : 'The ant hit the edge of the world!');
        }
    }
}

function determinePhase() {
    if (stepCount < 500) return currentLang === 'zh' ? '简单' : 'Simplicity';
    if (stepCount < 10000) return currentLang === 'zh' ? '混沌' : 'Chaos';
    return currentLang === 'zh' ? '秩序 (高速公路)' : 'Order (Highway)';
}

function updateStats() {
    stepCountDisplay.textContent = stepCount;
    phaseDisplay.textContent = determinePhase();
}

// --- Rendering ---
function draw() {
    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Black Cells
    ctx.fillStyle = '#2c3e50';
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            if (grid[x][y] === 1) {
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    // Draw Ant
    ctx.fillStyle = '#ff5f5f';
    ctx.fillRect(ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Optional: Draw Ant Head/Direction (simple distinct pixel)
    ctx.fillStyle = '#fff';
    let headX = ant.x * CELL_SIZE;
    let headY = ant.y * CELL_SIZE;
    const size = CELL_SIZE;

    // Small dot to indicate direction
    switch (ant.dir) {
        case 0: ctx.fillRect(headX + size / 3, headY, size / 3, size / 3); break; // Top
        case 1: ctx.fillRect(headX + size * 2 / 3, headY + size / 3, size / 3, size / 3); break; // Right
        case 2: ctx.fillRect(headX + size / 3, headY + size * 2 / 3, size / 3, size / 3); break; // Bottom
        case 3: ctx.fillRect(headX, headY + size / 3, size / 3, size / 3); break; // Left
    }
}

function loop() {
    if (!isRunning) return;

    // Execute multiple steps per frame based on speed
    // Speed 1-100 maps to roughly 1 to 1000 steps per frame
    const stepsPerFrame = Math.floor(Math.pow(speed, 1.5));

    for (let i = 0; i < stepsPerFrame; i++) {
        update();
        if (!isRunning) break; // Stop immediately if hit wall
    }

    draw();
    updateStats();

    if (isRunning) {
        animationId = requestAnimationFrame(loop);
    }
}

// --- Controls ---
function togglePlayPause() {
    isRunning = !isRunning;
    playPauseBtn.textContent = isRunning ? '⏸' : '▶';
    playPauseBtn.classList.toggle('primary', !isRunning); // Visual toggle

    if (isRunning) {
        loop();
    } else {
        cancelAnimationFrame(animationId);
    }
}

function singleStep() {
    if (isRunning) togglePlayPause();
    update();
    draw();
    updateStats();
}

// --- Tutorial Logic ---
function renderContent() {
    const data = content[currentStepIndex];
    tutorialContent.innerHTML = `
        <h2>${data.title[currentLang]}</h2>
        <div class="text-body">${data.text[currentLang]}</div>
    `;

    stepIndicator.textContent = `${currentStepIndex + 1} / ${content.length}`;

    prevBtn.disabled = currentStepIndex === 0;
    nextBtn.disabled = currentStepIndex === content.length - 1;
}

function changeStep(delta) {
    currentStepIndex += delta;
    if (currentStepIndex < 0) currentStepIndex = 0;
    if (currentStepIndex >= content.length) currentStepIndex = content.length - 1;
    renderContent();
}

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    renderContent();
    updateStats(); // Update phase text
}

// Start
init();
