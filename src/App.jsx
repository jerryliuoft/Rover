import React, { useState, useEffect, useRef } from "react";
import Rover from "./Rover";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [result, setResult] = useState([]); // contains rover initial command and final position
  const [myRover] = useState(new Rover());
  const [input, setInput] = useState([]); // Raw file input
  const [commands, setCommands] = useState([]); // parsed input for the rover
  const fileSelectRef = useRef(null); // This is used to reset the file after uploading

  const selectFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      setInput(text.split("\n").map((str) => str.replace(/\s\s+/g, " ")));
    };
    reader.readAsText(e.target.files[0]);
  };

  // handle user file upload
  useEffect(() => {
    if (input.length === 0 || !fileSelectRef) {
      return;
    }
    const inputHelper = [...input]; // reassign to not mutate state

    while (inputHelper.length > 0) {
      let mapSize = inputHelper.shift().trim().split(" ");
      if (mapSize.length === 2) {
        if (myRover.setMapSize(mapSize)) {
          break;
        }
      }
    }
    setCommands(fileParser(inputHelper));
    setInput([]);
    fileSelectRef.current.value = null; // clear the file so every upload is new
  }, [input, myRover, fileSelectRef]);

  // handle new commands, runs commands on rover
  useEffect(() => {
    if (commands.length === 0 || !myRover) {
      return;
    }
    setResult(runCommands(commands, myRover));
    setCommands([]);
  }, [commands, myRover]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <small style={{ fontSize: "14px" }}>
          Input should be text file, first line should be space separated 2
          number indicating the map width and height ie 5 5
        </small>
        <small style={{ fontSize: "14px" }}>
          Rest of the input file should be in sets of 2 lines where first line
          is initial position + direction , and the next line is commands made
          up of L/R/M
        </small>
        <small style={{ fontSize: "14px" }}>Assumptions:</small>
        <small style={{ fontSize: "14px" }}>input should be valid format</small>
        <small style={{ fontSize: "14px", marginBottom: "2em" }}>
          rover will do nothing if command is invalid
        </small>
        <input
          type="file"
          onChange={selectFile}
          accept=".txt"
          ref={fileSelectRef}
        />
        <p>The result is</p>
        <table>
          <tbody>
            <tr>
              <th>Initial Position</th>
              <th>Commands</th>
              <th>Final Position</th>
            </tr>
            {result.map((ans, idx) => (
              <tr key={idx}>
                <th>{ans[0].join(" ")}</th>
                <th>{ans[1]}</th>
                <th>{ans[2].join(" ")}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

/**
 * fileParser will parse the file and return the commands in sets
 * It will skip empty line
 * For every non-empty line and their next line, it'll take the first line as position and second line as order
 * Order can be empty
 *
 * Return: [{position: [], orders: ""}, {position: [], orders: ""}]
 */
export const fileParser = (file) => {
  const commandSets = [];
  while (file.length > 0) {
    let position = file.shift().trim();
    while (!position && file.length > 0) {
      position = file.shift().trim();
    }
    const orders = file.shift();
    if (position.length && orders !== undefined)
      commandSets.push({
        position: position.split(" "),
        orders,
      });
  }
  return commandSets;
};

/**
 * Helper function to run all the commands
 *
 * Return: [Rover location1, Rover location 2]
 */
export const runCommands = (commands, rover) => {
  if (!rover) {
    return [];
  }
  return commands.map((command) => {
    const { position, orders } = command;
    // Only move the rover if the new position is valid
    if (rover.resetPosition(position)) {
      for (let i = 0; i < orders.length; i += 1) {
        rover.command(orders[i]);
      }
    } else {
      return [position, orders, ["Invalid input"]];
    }
    return [position, orders, rover.getLocation()];
  });
};

export default App;
