import Rover from "./Rover";

describe("Rover", () => {
  let myRover;
  beforeEach(() => {
    myRover = new Rover();
    myRover.setMapSize([5, 5]);
  });
  it("Should initialize", () => {
    expect(myRover).toBeTruthy();
  });
  it(".setMapSize should set a new map for the Rover", () => {
    myRover.setMapSize([3, 3]);
    expect(myRover.mapSize).toEqual([3, 3]);
  });
  it(".resetPosition should set Rover to new position", () => {
    myRover.resetPosition([2, 3, "N"]);
    expect(myRover.x).toBe(2);
    expect(myRover.y).toBe(3);
    expect(myRover.directionIdx).toBe(0);
  });
  it(".canMoveTo should be true if new position is within map", () => {
    expect(myRover.canMoveTo([5, 5])).toBeTruthy();
  });
  it(".canMoveTo should be false if new position is outside map", () => {
    expect(myRover.canMoveTo([8, 3])).toBeFalsy();
  });
  describe(".move", () => {
    it("Rover should move north if its facing North", () => {
      myRover.resetPosition([2, 3, "N"]);
      myRover.move();
      expect(myRover.x).toBe(2);
      expect(myRover.y).toBe(4);
    });
    it("Rover should move south if its facing South", () => {
      myRover.resetPosition([2, 3, "S"]);
      myRover.move();
      expect(myRover.x).toBe(2);
      expect(myRover.y).toBe(2);
    });
    it("Rover should move east if its facing East", () => {
      myRover.resetPosition([2, 3, "E"]);
      myRover.move();
      expect(myRover.x).toBe(3);
      expect(myRover.y).toBe(3);
    });
    it("Rover should move west if its facing West", () => {
      myRover.resetPosition([2, 3, "W"]);
      myRover.move();
      expect(myRover.x).toBe(1);
      expect(myRover.y).toBe(3);
    });
    it("return false if new position is out of bound, and rover is not moved", () => {
      myRover.resetPosition([5, 5, "N"]);
      expect(myRover.move()).toBeFalsy();
      expect(myRover.x).toBe(5);
      expect(myRover.y).toBe(5);
    });
  });
  it(".turnLeft should turn rover counter clockwise", () => {
    myRover.resetPosition([5, 5, "E"]);
    myRover.turnLeft();
    expect(myRover.directionOrder[myRover.directionIdx]).toEqual("N");
  });
  it(".turnLeft should turn rover counter clockwise (wrap)", () => {
    myRover.turnLeft();
    expect(myRover.directionOrder[myRover.directionIdx]).toEqual("W");
  });
  it(".turnRight should turn rover clockwise", () => {
    myRover.turnRight();
    expect(myRover.directionOrder[myRover.directionIdx]).toEqual("E");
  });
  it(".turnRight should turn rover clockwise (wrap)", () => {
    myRover.resetPosition([5, 5, "W"]);
    myRover.turnRight();
    expect(myRover.directionOrder[myRover.directionIdx]).toEqual("N");
  });
  describe(".command", () => {
    it("L should call turnLeft()", () => {
      const left = jest.spyOn(myRover, "turnLeft");
      expect(myRover.command("L")).toBeTruthy();
      expect(left).toBeCalledTimes(1);
    });
    it("R should call turnRight()", () => {
      const spy = jest.spyOn(myRover, "turnRight");
      expect(myRover.command("R")).toBeTruthy();
      expect(spy).toBeCalledTimes(1);
    });
    it("M should call move()", () => {
      const spy = jest.spyOn(myRover, "move");
      expect(myRover.command("M")).toBeTruthy();
      expect(spy).toBeCalledTimes(1);
    });
    it("other than LMR should do nothing", () => {
      const move = jest.spyOn(myRover, "move");
      const left = jest.spyOn(myRover, "turnLeft");
      const right = jest.spyOn(myRover, "turnRight");
      expect(myRover.command("A")).toBeFalsy();
      expect(move).toBeCalledTimes(0);
      expect(left).toBeCalledTimes(0);
      expect(right).toBeCalledTimes(0);
    });
  });
  it(".getLocation should return location with direction", () => {
    myRover.resetPosition([1, 2, "N"]);
    expect(myRover.getLocation()).toEqual([1, 2, "N"]);
  });
});
