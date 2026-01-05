// Countdown timer to January 12, 2026 at 12:00 AM
const countdownDate = new Date('January 12, 2026 00:00:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  // If countdown is finished
  if (distance < 0) {
    // Mark countdown as finished
    countdownFinished = true;
    // Redirect to home.html
    window.location.href = '../home.html';
    return;
  }

  // Calculate time units
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the countdown
  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

  // Check if 24 hours or less remaining (86400000 milliseconds = 24 hours)
  const numberElements = ['days', 'hours', 'minutes', 'seconds'];
  
  if (distance <= 86400000) {
    // Less than 24 hours - apply gradient
    numberElements.forEach(id => {
      const element = document.getElementById(id);
      element.classList.remove('text-white');
      element.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-purple-600', 'bg-clip-text', 'text-transparent');
    });
  } else {
    // More than 24 hours - keep white text
    numberElements.forEach(id => {
      const element = document.getElementById(id);
      element.classList.remove('bg-gradient-to-r', 'from-pink-500', 'to-purple-600', 'bg-clip-text', 'text-transparent');
      element.classList.add('text-white');
    });
  }
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// Random flip animation for cards
function randomFlip() {
  const cards = document.querySelectorAll('.flip-card');
  if (cards.length > 0) {
    // Pick a random card
    const randomIndex = Math.floor(Math.random() * cards.length);
    const randomCard = cards[randomIndex];
    
    // Add a temporary class to flip it
    randomCard.classList.add('auto-flip');
    
    // Remove the class after 3 seconds (flip back)
    setTimeout(() => {
      randomCard.classList.remove('auto-flip');
    }, 3000);
  }
}

// Randomly flip a card every 20 seconds
// Add some randomness: between 15 to 25 seconds
function scheduleNextFlip() {
  const minTime = 15000;  // 15 seconds
  const maxTime = 25000;  // 25 seconds
  const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  
  setTimeout(() => {
    randomFlip();
    scheduleNextFlip(); // Schedule the next flip
  }, randomTime);
}

// Start the random flip cycle
scheduleNextFlip();

// Button functionality - teasing modal or redirect
let countdownFinished = false;

document.getElementById('exploreBtn').addEventListener('click', function() {
  if (countdownFinished) {
    // Countdown is done, redirect to home.html
    window.location.href = '../home.html';
  } else {
    // Show teasing modal
    document.getElementById('teasingModal').classList.remove('hidden');
  }
});

// Close modal
document.getElementById('closeModal').addEventListener('click', function() {
  document.getElementById('teasingModal').classList.add('hidden');
});

// Close modal when clicking outside
document.getElementById('teasingModal').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.add('hidden');
  }
});

// Interactive stick figures - run away from cursor/touch
const stickFigures = document.querySelectorAll('.interactive-stick');
const detectionRadius = 150; // Distance at which stick figures detect the cursor

stickFigures.forEach((stick, index) => {
  // Initial random position
  let stickX = Math.random() * (window.innerWidth - 100);
  let stickY = Math.random() * (window.innerHeight - 100);
  stick.style.left = stickX + 'px';
  stick.style.top = stickY + 'px';
  stick.style.animation = 'none'; // Disable original animations
  stick.style.position = 'fixed';
});

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function runAway(stick, cursorX, cursorY) {
  const rect = stick.getBoundingClientRect();
  const stickCenterX = rect.left + rect.width / 2;
  const stickCenterY = rect.top + rect.height / 2;
  
  const distance = getDistance(cursorX, cursorY, stickCenterX, stickCenterY);
  
  if (distance < detectionRadius) {
    // Calculate direction away from cursor
    const angle = Math.atan2(stickCenterY - cursorY, stickCenterX - cursorX);
    const escapeDistance = 200;
    
    let newX = stickCenterX + Math.cos(angle) * escapeDistance;
    let newY = stickCenterY + Math.sin(angle) * escapeDistance;
    
    // Keep within screen bounds
    newX = Math.max(50, Math.min(window.innerWidth - 100, newX));
    newY = Math.max(50, Math.min(window.innerHeight - 100, newY));
    
    // Add scared animation
    stick.style.transition = 'all 0.3s ease-out';
    stick.style.left = newX + 'px';
    stick.style.top = newY + 'px';
    stick.style.transform = 'scale(1.2) rotate(' + (Math.random() * 20 - 10) + 'deg)';
    
    setTimeout(() => {
      stick.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
  }
}

// Mouse move event
document.addEventListener('mousemove', (e) => {
  stickFigures.forEach(stick => {
    runAway(stick, e.clientX, e.clientY);
  });
});

// Touch events for mobile
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  stickFigures.forEach(stick => {
    runAway(stick, touch.clientX, touch.clientY);
  });
});

// Make stick figures wander randomly when idle
setInterval(() => {
  stickFigures.forEach(stick => {
    const currentX = parseFloat(stick.style.left);
    const currentY = parseFloat(stick.style.top);
    
    // Small random movement
    const wanderX = currentX + (Math.random() * 100 - 50);
    const wanderY = currentY + (Math.random() * 100 - 50);
    
    // Keep within bounds
    const newX = Math.max(50, Math.min(window.innerWidth - 100, wanderX));
    const newY = Math.max(50, Math.min(window.innerHeight - 100, wanderY));
    
    stick.style.transition = 'all 2s ease-in-out';
    stick.style.left = newX + 'px';
    stick.style.top = newY + 'px';
  });
}, 3000);

// Walking man animation with turn-around behavior
const walker = document.getElementById('walker');
let walkerPosition = 0;
let walkerDirection = 1; // 1 = right, -1 = left
let isWalking = false;

function walkingManCycle() {
  // Show walker and start walking
  walker.classList.add('walking');
  isWalking = true;
  walkerPosition = 0;
  walkerDirection = 1;
  walker.classList.remove('turn-around');
  walker.style.left = '-150px';
  
  const walkInterval = setInterval(() => {
    if (!isWalking) {
      clearInterval(walkInterval);
      return;
    }
    
    walkerPosition += 3 * walkerDirection;
    walker.style.left = walkerPosition + 'px';
    
    // Check if reached right edge
    if (walkerDirection === 1 && walkerPosition >= window.innerWidth) {
      walkerDirection = -1;
      walker.classList.add('turn-around'); // Flip horizontally
    }
    
    // Check if returned to start (left edge)
    if (walkerDirection === -1 && walkerPosition <= -150) {
      clearInterval(walkInterval);
      walker.classList.remove('walking');
      walker.classList.remove('turn-around');
      isWalking = false;
      
      // Wait 20 seconds before next cycle
      setTimeout(() => {
        walkingManCycle();
      }, 20000);
    }
  }, 30); // Update every 30ms for smooth movement
}

// Start the first cycle
walkingManCycle();
