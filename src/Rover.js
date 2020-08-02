/**
 * Rover class, use command() to move it, and getLocation() to get its current coordinate
 * Available commands:
 *  L: turn left 90%
 *  R: turn right 90%
 *  M: move forward the direction it is facing
 *
 */

class Rover {
  constructor(mapSize = [1, 1], position = [0, 0, "N"]) {
    this.x = position[0];
    this.y = position[1];
    this.mapSize = mapSize; // MapSize is used to track if rover is moving out of bound
    this.directionOrder = ["N", "E", "S", "W"]; // using clockwise order
    this.directionIdx = this.directionOrder.findIndex(
      (pos) => pos === position[2]
    );

    if (this.directionIdx === -1) {
      console.log("invalid direction supplied:", position[2]);
    }
    if (!this.canMoveTo([this.x, this.y])) {
      console.log(
        `invalid initial position supplied: ${position[0]},${position[1]}`
      );
    }
  }

  // Teleport rover to x,y if able;
  resetPosition = (newPos) => {
    if (newPos.length !== 3) {
      return false;
    }
    const [x, y, direction] = newPos;
    const valid = this.canMoveTo([x, y]);
    this.directionIdx = this.directionOrder.indexOf(direction);
    if (this.directionIdx === -1) {
      this.directionIdx = 0;
      return false;
    }
    if (valid) {
      this.x = Number(x);
      this.y = Number(y);
    }
    return valid;
  };
  // Set mapSize for rover;
  setMapSize = (mapSize) => {
    const [width, height] = mapSize;
    if (isNaN(width) || isNaN(height)) {
      console.log("Invalid map size:", mapSize);
      return false;
    }
    if (width <= 0 || height <= 0) {
      console.log("Invalid map size:", mapSize);
      return false;
    }
    this.mapSize = [Number(width), Number(height)];
    return true;
  };

  // Return true if x,y is within the map bound
  canMoveTo = ([x, y]) => {
    if (x > this.mapSize[0] || x < 0) {
      return false;
    }
    if (y > this.mapSize[0] || y < 0) {
      return false;
    }
    return true;
  };

  // Move rover 1 position forward, return false if unable
  move = () => {
    const moveVectors = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    const newPosition = [
      moveVectors[this.directionIdx][0] + this.x,
      moveVectors[this.directionIdx][1] + this.y,
    ];
    if (this.canMoveTo(newPosition)) {
      this.x = newPosition[0];
      this.y = newPosition[1];
      return true;
    } else {
      return false;
    }
  };

  // Turn rover counterclockwise 90%
  turnLeft = () => {
    this.directionIdx -= 1;
    if (this.directionIdx < 0) {
      this.directionIdx = this.directionOrder.length - 1;
    }
    return true;
  };

  // Turn rover clockwise 90%
  turnRight = () => {
    this.directionIdx += 1;
    if (this.directionIdx >= this.directionOrder.length) {
      this.directionIdx = 0;
    }
    return true;
  };

  // Execute the command if able, return false if invalid command
  command = (order) => {
    if (order === "L") {
      return this.turnLeft();
    } else if (order === "R") {
      return this.turnRight();
    } else if (order === "M") {
      return this.move();
    } else {
      console.log("Skipping invalid command: ", order);
      return false;
    }
  };

  // Returns the Rover's current location in the format [x, y, facing direction]
  getLocation = () => {
    return [this.x, this.y, this.directionOrder[this.directionIdx]];
  };
}

export default Rover;
