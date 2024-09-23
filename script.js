'use strict';

// Countdown Timer
const countdownDate = new Date("2024-09-24T00:16:00").getTime();
const countdownElement = document.getElementById("countdown-timer");

// Initialize fireworks flag and repetition count
let fireworksInitialized = false;
const maxFireworksRepetitions = 5000; // Number of times fireworks should repeat
let fireworksRepetitions = 0;

// Function to trigger celebrations
function triggerCelebrations() {
    // Trigger Confetti
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: Math.random(), y: Math.random() }
            });
        }, i * 800); // Burst every 500ms
    }

    // Trigger Fireworks
    if (!fireworksInitialized) {
        initializeFireworks();
        fireworksInitialized = true;
    }

    // Trigger Blue Confetti
    triggerBlueConfetti();
}

// Countdown Function
const countdownFunction = setInterval(function() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display countdown
    countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // When the countdown is finished
    if (distance < 0) {
        clearInterval(countdownFunction);
        countdownElement.innerHTML = "EXPIRED";

        // Trigger celebrations and initialize fireworks
        if (!fireworksInitialized) { // Check if fireworks are already initialized
            triggerCelebrations();
            initializeFireworks(); // Ensure fireworks start fresh
            current = 0; // Reset to start from "HAPPY"
            fireworksInitialized = true; // Mark as initialized
        }
    }
}, 1000);


// Function to trigger Blue Confetti
function triggerBlueConfetti() {
    const random = Math.random;
    const cos = Math.cos;
    const sin = Math.sin;
    const PI = Math.PI;
    const PI2 = PI * 2;
    let timer;
    let frame;
    const confetti = [];

    const particles = 10;
    const spread = 40;
    const sizeMin = 3;
    const sizeMax = 12 - sizeMin;
    const eccentricity = 10;
    const deviation = 100;
    const dxThetaMin = -.1;
    const dxThetaMax = -dxThetaMin - dxThetaMin;
    const dyMin = .13;
    const dyMax = .18;
    const dThetaMin = .4;
    const dThetaMax = .7 - dThetaMin;

    // Define 20 shades of blue
    function generateBlueShade() {
        const shades = [];
        for (let i = 0; i < 20; i++) {
            const value = Math.floor(100 + 155 * random()); // Blue shades from light to dark
            shades.push(color(0, 0, value));
        }
        return shades;
    }

    // Generate blue shades
    const blueShades = generateBlueShade();
    
    function color(r, g, b) {
        return `rgb(${r},${g},${b})`;
    }

    // Cosine interpolation
    function interpolation(a, b, t) {
        return ((1 - cos(PI * t)) / 2 * (b - a)) + a;
    }

    // Create a 1D Maximal Poisson Disc over [0, 1]
    const radius = 1 / eccentricity;
    const radius2 = radius + radius;
    function createPoisson() {
        const domain = [radius, 1 - radius];
        let measure = 1 - radius2;
        const spline = [0, 1];
        while (measure) {
            const dart = measure * random();
            let i;
            let l;
            let interval;
            let a;
            let b;
            let c;
            let d;

            // Find where dart lies
            for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
                a = domain[i];
                b = domain[i + 1];
                interval = b - a;
                if (dart < measure + interval) {
                    spline.push(dart += a - measure);
                    break;
                }
                measure += interval;
            }
            c = dart - radius;
            d = dart + radius;

            // Update the domain
            for (i = domain.length - 1; i > 0; i -= 2) {
                l = i - 1;
                a = domain[l];
                b = domain[i];
                if (a >= c && a < d) {
                    if (b > d) domain[l] = d;
                    else domain.splice(l, 2);
                } else if (a < c && b > c) {
                    if (b <= d) domain[i] = c;
                    else domain.splice(i, 0, c, d);
                }
            }

            // Re-measure the domain
            for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
                measure += domain[i + 1] - domain[i];
            }
        }

        return spline.sort();
    }

    // Create the overarching container
    const container = document.getElementById('confetti-container');

    // Confetto constructor
    function Confetto(theme) {
        this.frame = 0;
        this.outer = document.createElement('div');
        this.inner = document.createElement('div');
        this.outer.appendChild(this.inner);

        const outerStyle = this.outer.style;
        const innerStyle = this.inner.style;
        outerStyle.position = 'absolute';
        outerStyle.width = `${sizeMin + sizeMax * random()}px`;
        outerStyle.height = `${sizeMin + sizeMax * random()}px`;
        innerStyle.width = '100%';
        innerStyle.height = '100%';
        innerStyle.backgroundColor = theme();

        outerStyle.perspective = '50px';
        outerStyle.transform = `rotate(${360 * random()}deg)`;
        this.axis = `rotate3D(${cos(360 * random())},${cos(360 * random())},0,`;
        this.theta = 360 * random();
        this.dTheta = dThetaMin + dThetaMax * random();
        innerStyle.transform = `${this.axis}${this.theta}deg)`;

        this.x = window.innerWidth * random();
        this.y = -deviation;
        this.dx = sin(dxThetaMin + dxThetaMax * random());
        this.dy = dyMin + dyMax * random();
        outerStyle.left = `${this.x}px`;
        outerStyle.top = `${this.y}px`;

        // Create the periodic spline
        this.splineX = createPoisson();
        this.splineY = [];
        for (let i = 1, l = this.splineX.length - 1; i < l; ++i) {
            this.splineY[i] = deviation * random();
        }
        this.splineY[0] = this.splineY[l] = deviation * random();

        this.update = function(height, delta) {
            this.frame += delta;
            this.x += this.dx * delta;
            this.y += this.dy * delta;
            this.theta += this.dTheta * delta;

            // Compute spline and convert to polar
            const phi = this.frame % 7777 / 7777;
            let i = 0;
            let j = 1;
            while (phi >= this.splineX[j]) i = j++;
            const rho = interpolation(
                this.splineY[i],
                this.splineY[j],
                (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
            );
            phi *= PI2;

            outerStyle.left = `${this.x + rho * cos(phi)}px`;
            outerStyle.top = `${this.y + rho * sin(phi)}px`;
            innerStyle.transform = `${this.axis}${this.theta}deg)`;
            return this.y > height + deviation;
        };
    }

    function poof() {
        if (!frame) {
            // Add confetti
            const themeIndex = Math.floor(blueShades.length * random());
            const theme = function() {
                return blueShades[themeIndex];
            };
            (function addConfetto() {
                const confetto = new Confetto(theme);
                confetti.push(confetto);
                container.appendChild(confetto.outer);
                timer = setTimeout(addConfetto, spread * random());
            })();

            // Start the loop
            let prev;
            requestAnimationFrame(function loop(timestamp) {
                const delta = prev ? timestamp - prev : 0;
                prev = timestamp;
                const height = window.innerHeight;

                for (let i = confetti.length - 1; i >= 0; --i) {
                    if (confetti[i].update(height, delta)) {
                        container.removeChild(confetti[i].outer);
                        confetti.splice(i, 1);
                    }
                }
                if (confetti.length) frame = requestAnimationFrame(loop);
            });
        }
    }

    poof();
}

// Fireworks Functionality
let chars, particles, canvas, ctx, w, h, current;
const duration = 5000; // Duration of one fireworks cycle
const str = ['HAPPY', 'BDAY', 'VARSHU'];
const colors = {
    'HAPPY': 'hsl(0, 100%, 80%)', // Pink
    'BDAY': 'hsl(30, 100%, 70%)', // Orange
    'VARSHU': 'hsl(210, 100%, 70%)' // Blue
};


function init() {
    canvas = document.querySelector('#confetti-container > canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        document.getElementById('confetti-container').appendChild(canvas);
    }
    ctx = canvas.getContext('2d');
    resize();
    requestAnimationFrame(render);
    window.addEventListener('resize', resize);
}

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = window.innerWidth < 400 ? 55 : 99;
}

function makeChar(c, color) {
    const tmp = document.createElement('canvas');
    const size = tmp.width = tmp.height = w < 400 ? 200 : 300;
    const tmpCtx = tmp.getContext('2d');
    tmpCtx.font = `bold ${size}px Arial`;
    tmpCtx.fillStyle = color;
    tmpCtx.textBaseline = "middle";
    tmpCtx.textAlign = "center";
    tmpCtx.fillText(c, size / 2, size / 2);
    const char2 = tmpCtx.getImageData(0, 0, size, size);
    const char2particles = [];
    for (let i = 0; char2particles.length < particles; i++) {
        const x = size * Math.random();
        const y = size * Math.random();
        const offset = parseInt(y) * size * 4 + parseInt(x) * 4;
        if (char2.data[offset]) char2particles.push([x - size / 2, y - size / 2]);
    }
    return char2particles;
}

function makeChars(t) {
    const actual = parseInt(t / duration) % str.length;
    if (current === actual) return;
    current = actual;
    const currentStr = str[actual];
    const color = colors[currentStr];
    chars = [...currentStr].map(c => makeChar(c, color));
}

function render(t) {
    if (fireworksRepetitions < maxFireworksRepetitions) {
        makeChars(t);
        requestAnimationFrame(render);
        ctx.fillStyle = '#00000010';
        ctx.fillRect(0, 0, w, h);
        chars.forEach((pts, i) => firework(t, i, pts));
    }
}

function firework(t, i, pts) {
    t -= i * 150;
    const id = i + chars.length * parseInt(t - t % duration);
    t = t % duration / duration;
    let dx = (i + 1) * w / (1 + chars.length);
    dx += Math.min(0.33, t) * 100 * Math.sin(id);
    let dy = h * 0.5;
    dy += Math.sin(id * 4547.411) * h * 0.1;
    if (t < 0.33) {
        rocket(dx, dy, id, t * 3);
    } else {
        explosion(pts, dx, dy, id, Math.min(1, Math.max(0, t - 0.33) * 2));
    }
}

function rocket(x, y, id, t) {
    ctx.fillStyle = 'white';
    const r = 2 - 2 * t + Math.pow(t, 15 * t) * 16;
    y = h - y * t;
    circle(x, y, r);
}

function explosion(pts, x, y, id, t) {
    const dy = (t * t * t) * 20;
    let r = Math.sin(id) * 1 + 3;
    r = t < 0.5 ? (t + 0.5) * t * r : r - t * r;
    const color = colors[str[current]] || 'white'; // Default to white if not found
    ctx.fillStyle = color;
    pts.forEach((xy, i) => {
        if (i % 20 === 0) {
            const adjustedColor = colors[str[current]] || 'white';
            ctx.fillStyle = adjustedColor;
        }
        circle(t * xy[0] + x, h - y + t * xy[1] + dy, r);
    });
}

function circle(x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
    ctx.fill();
}

function initializeFireworks() {
    init();
    fireworksRepetitions = 0;
    function animateFireworks() {
        if (fireworksRepetitions < maxFireworksRepetitions) {
            fireworksRepetitions++;
            requestAnimationFrame(() => render(performance.now()));
        }
    }
    animateFireworks();
}


function playAudio() {
    const audio = document.getElementById('voice-note');
    audio.play().catch(error => {
        console.error("Error playing audio:", error);
    });
}
