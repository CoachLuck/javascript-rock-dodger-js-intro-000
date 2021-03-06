/**
 * Don't change these constants!
 */
const DODGER = document.getElementById('dodger')
const GAME = document.getElementById('game')
const GAME_HEIGHT = 400
const GAME_WIDTH = 400
const LEFT_ARROW = 37 // use e.which!
const RIGHT_ARROW = 39 // use e.which!
const ROCKS = []
const START = document.getElementById('start')
const DODGER_VELOCITY = 1
const ROCK_VELOCITY = 2
var ROCK_COUNT = 0

var gameInterval = null

/**
 * Be aware of what's above this line,
 * but all of your work should happen below.
 */

function checkCollision(rock) {

  const top = positionToInteger(rock.style.top)

  // rocks are 20px high
  // DODGER is 20px high
  // GAME_HEIGHT - 20 - 20 = 360px;
  if (top > 360) {
    const dodgerLeftEdge = positionToInteger(DODGER.style.left)

    const dodgerRightEdge = dodgerLeftEdge + 40;

    const rockLeftEdge = positionToInteger(rock.style.left)

    const rockRightEdge = rockLeftEdge + 20;

    return ((rockLeftEdge < dodgerLeftEdge && rockRightEdge > dodgerLeftEdge)
     || (rockLeftEdge >= dodgerLeftEdge && rockRightEdge <= dodgerRightEdge)
     || (rockLeftEdge < dodgerRightEdge && rockRightEdge > dodgerRightEdge))
  }
}

function createRock(x) {
  const rock = document.createElement('div')

  rock.className = 'rock'
  rock.style.left = `${x}px`

  // Hmmm, why would we have used `var` here?
  var top = 0

  rock.style.top = `${top}px`

  /**
   * Now that we have a rock, we'll need to append
   * it to GAME and move it downwards.
   */
   GAME.appendChild(rock)

  /**
   * This function moves the rock. (2 pixels at a time
   * seems like a good pace.)
   */
  function moveRock() {
    rock.style.top = `${top += ROCK_VELOCITY}px`;

     if (checkCollision(rock)) {
       endGame();
     }
     else if (top < GAME_HEIGHT) {
       window.requestAnimationFrame(moveRock)
     }
     else {
       ROCK_COUNT++;
       rock.remove();
     }
  }

  // We should kick off the animation of the rock around here.
  window.requestAnimationFrame(moveRock)

  // Add the rock to ROCKS so that we can remove all rocks
  // when there's a collision.
  ROCKS.push(rock)

  // Finally, return the rock element you've created.
  return rock
}

/**
 * End the game by clearing `gameInterval`,
 * removing all ROCKS from the DOM,
 * and removing the `moveDodger` event listener.
 * Finally, alert "YOU LOSE!" to the player.
 */
function endGame() {
  clearInterval(gameInterval);

  ROCKS.forEach(rock => rock.remove())
  ROCKS.splice(0, ROCKS.length);

  window.removeEventListener('keydown', moveDodger)
  alert('YOU LOSE!')

  START.innerHTML = `${ROCK_COUNT} rocks avoided.<br> Play again?`
  START.style.display = 'inline'
}

function moveDodger(e) {
   var elm = e.which
   switch (elm) {
     case LEFT_ARROW:
      moveDodgerLeft();
      break;
     case RIGHT_ARROW:
      moveDodgerRight();
     break;
     default:
      return;
   }

   e.stopPropagation();
   e.preventDefault();
}

function moveDodgerLeft() {
  var left = positionToInteger(dodger.style.left)

  if (left > 0) {
    dodger.style.left = `${left - DODGER_VELOCITY}px`
  }
}

function moveDodgerRight() {
  var left = positionToInteger(dodger.style.left)

  if (left < 360) {
    dodger.style.left = `${left + DODGER_VELOCITY}px`
  }
}

/**
 * @param {string} p The position property
 * @returns {number} The position as an integer (without 'px')
 */
function positionToInteger(p) {
  return parseInt(p.split('px')[0]) || 0
}

function start() {
  window.addEventListener('keydown', moveDodger)

  START.style.display = 'none'

  gameInterval = setInterval(function() {
    createRock(Math.floor(Math.random() *  (GAME_WIDTH - 20)))
  }, 1000)
}
