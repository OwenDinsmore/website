/**
 * Newton's Cradle Physics Simulation
 * Optimized for performance with Canvas rendering
 */

export class NewtonsCradle {
  constructor(canvas, links) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.links = links; // Array of {name, url, icon}

    // Physics constants
    this.gravity = 0.98;
    this.damping = 0.998; // Energy loss per frame (higher = longer bounces)
    this.minVelocity = 0.0005; // Stop threshold (lower = more bounces)

    // Dimensions
    this.ropeLength = 130;
    this.ballRadius = 18;
    this.spacing = 42;

    // State
    this.balls = [];
    this.isAnimating = false;
    this.draggedBall = null;
    this.animationId = null;

    this.init();
  }

  init() {
    this.setupCanvas();
    this.createBalls();
    this.setupEventListeners();
    this.draw();
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);

    this.canvasWidth = rect.width;
    this.canvasHeight = rect.height;
    this.pivotY = 5; // Attach close to top of canvas (bottom of button)
  }

  createBalls() {
    const centerX = this.canvasWidth / 2;
    const numBalls = this.links.length;
    const baseSpacing = this.spacing;

    // Pivot points - clustered together at top for diagonal rope effect
    const pivotPositions = [];
    const pivotClusterFactor = 0.55; // Cluster pivot points to 55% of normal spacing

    for (let i = 0; i < numBalls; i++) {
      const offset = i - (numBalls - 1) / 2;
      pivotPositions.push(centerX + (offset * baseSpacing * pivotClusterFactor));
    }

    // Rest positions - normal spacing with slight median centering
    const restPositions = [];
    for (let i = 0; i < numBalls; i++) {
      const offset = i - (numBalls - 1) / 2;
      restPositions.push(centerX + (offset * baseSpacing * 0.85));
    }

    this.balls = this.links.map((link, i) => ({
      name: link.name,
      url: link.url,
      icon: link.icon,
      angle: 0,
      velocity: 0,
      isDraggable: link.isDraggable,
      pivotX: pivotPositions[i],  // Clustered at top
      pivotY: this.pivotY,
      x: restPositions[i],         // Normal spacing at rest
      y: this.pivotY + this.ropeLength
    }));
  }

  setupEventListeners() {
    const getMousePos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleStart = (e) => {
      const pos = getMousePos(e);

      // Check if clicking on a ball
      for (let ball of this.balls) {
        const dist = Math.hypot(pos.x - ball.x, pos.y - ball.y);
        if (dist < this.ballRadius) {
          if (ball.isDraggable) {
            e.preventDefault();
            this.draggedBall = ball;
          } else {
            // Middle ball - navigate to link
            window.open(ball.url, '_blank');
          }
          return;
        }
      }
    };

    const handleMove = (e) => {
      if (!this.draggedBall) return;
      e.preventDefault();

      const pos = getMousePos(e);

      // Calculate angle based on mouse position
      const dx = pos.x - this.draggedBall.pivotX;
      const dy = pos.y - this.draggedBall.pivotY;
      const angle = Math.atan2(dx, dy);

      // Allow wider swing range (-80° to 80°) for free dragging
      this.draggedBall.angle = Math.max(-Math.PI * 0.44, Math.min(Math.PI * 0.44, angle));

      // Reset velocity while dragging to prevent auto-drop
      this.draggedBall.velocity = 0;

      this.updateBallPosition(this.draggedBall);
      this.draw();
    };

    const handleEnd = () => {
      if (this.draggedBall) {
        // Calculate initial velocity based on release angle
        this.draggedBall.velocity = this.draggedBall.angle * 0.1;
        this.draggedBall = null;
        this.startAnimation();
      }
    };

    this.canvas.addEventListener('mousedown', handleStart);
    this.canvas.addEventListener('mousemove', handleMove);
    this.canvas.addEventListener('mouseup', handleEnd);
    this.canvas.addEventListener('mouseleave', handleEnd);

    // Touch events
    this.canvas.addEventListener('touchstart', handleStart, { passive: false });
    this.canvas.addEventListener('touchmove', handleMove, { passive: false });
    this.canvas.addEventListener('touchend', handleEnd);
  }

  updateBallPosition(ball) {
    ball.x = ball.pivotX + Math.sin(ball.angle) * this.ropeLength;
    ball.y = ball.pivotY + Math.cos(ball.angle) * this.ropeLength;
  }

  checkCollisions() {
    // Collision detection and separation for all balls
    for (let i = 0; i < this.balls.length - 1; i++) {
      const ball1 = this.balls[i];
      const ball2 = this.balls[i + 1];

      const dist = Math.abs(ball1.x - ball2.x);
      const minDist = this.ballRadius * 2;

      // Prevent overlap - push balls apart if too close
      if (dist < minDist && dist > 0) {
        const overlap = minDist - dist;
        const direction = ball1.x < ball2.x ? -1 : 1;

        // Separate balls by half the overlap each
        const separation = overlap / 2;
        ball1.x += direction * separation;
        ball2.x -= direction * separation;

        // Recalculate angles based on new positions
        ball1.angle = Math.asin((ball1.x - ball1.pivotX) / this.ropeLength);
        ball2.angle = Math.asin((ball2.x - ball2.pivotX) / this.ropeLength);
      }

      // Transfer momentum when balls touch
      if (dist <= minDist * 1.1) {
        if (Math.abs(ball1.velocity) > Math.abs(ball2.velocity)) {
          const temp = ball1.velocity * 0.9;
          ball1.velocity = 0;
          ball2.velocity = temp;
        } else if (Math.abs(ball2.velocity) > Math.abs(ball1.velocity)) {
          const temp = ball2.velocity * 0.9;
          ball2.velocity = 0;
          ball1.velocity = temp;
        }
      }
    }
  }

  animate() {
    let hasMovement = false;

    this.balls.forEach(ball => {
      if (ball === this.draggedBall) return;

      // Pendulum physics
      const force = -this.gravity * Math.sin(ball.angle);
      ball.velocity += force * 0.01;
      ball.velocity *= this.damping;
      ball.angle += ball.velocity;

      // Check if ball has significant movement
      if (Math.abs(ball.velocity) > this.minVelocity || Math.abs(ball.angle) > 0.01) {
        hasMovement = true;
      } else {
        // Stop small oscillations
        ball.velocity = 0;
        ball.angle = 0;
      }

      this.updateBallPosition(ball);
    });

    this.checkCollisions();
    this.draw();

    if (hasMovement) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.isAnimating = false;
      this.animationId = null;
    }
  }

  startAnimation() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animate();
    }
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.balls.forEach(ball => {
      // Draw rope with curved spline
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(ball.pivotX, ball.pivotY);

      // Create curved rope using quadratic curve
      // Control point is offset to create natural rope curve
      const dx = ball.x - ball.pivotX;
      const dy = ball.y - ball.pivotY;
      const controlX = ball.pivotX + dx * 0.3;
      const controlY = ball.pivotY + dy * 0.5 + Math.abs(dx) * 0.2;

      this.ctx.quadraticCurveTo(controlX, controlY, ball.x, ball.y);
      this.ctx.stroke();

      // Draw ball
      if (ball.isDraggable) {
        // Draggable balls - solid white
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      } else {
        // Link balls - white with dark green border
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw ball outline
        this.ctx.strokeStyle = '#114a1fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw icon/label
        this.ctx.fillStyle = '#114a1fff';
        this.ctx.font = 'bold 14px "Fira Code", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(ball.icon, ball.x, ball.y);
      }
    });
  }

  cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isAnimating = false;
  }

  resize() {
    this.setupCanvas();
    this.createBalls();
    this.draw();
  }
}
