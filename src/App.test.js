import React from "react";
import { render } from "@testing-library/react";
import App, { fileParser } from "./App";

it("runs", () => {
  expect(render(<App />)).toBeTruthy();
});

describe(".filePrase", () => {
  it("should return a set of commands", () => {
    const input = ["1 1 N", "LMLMLM"];
    expect(fileParser(input)).toEqual([
      {
        position: ["1", "1", "N"],
        orders: "LMLMLM",
      },
    ]);
  });
  it("should return empty array if input is empty", () => {
    const input = [];
    expect(fileParser(input)).toEqual([]);
  });
  it("should skip empty array", () => {
    const input = ["", "", "   ", "1 1 N", "LMLMLM"];
    expect(fileParser(input)).toEqual([
      {
        position: ["1", "1", "N"],
        orders: "LMLMLM",
      },
    ]);
  });
  it("should allow empty order", () => {
    const input = ["", "", "   ", "1 1 N", "", "ABCDEFG"];
    expect(fileParser(input)).toEqual([
      {
        position: ["1", "1", "N"],
        orders: "",
      },
    ]);
  });
  it("should not return fragmented order", () => {
    const input = ["1 1 N"];
    expect(fileParser(input)).toEqual([]);
  });
});
