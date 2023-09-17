import { createTicTacToe, reset } from "./gameLogic.js";
const begin = document.getElementById("begin");

// Create a new game.
createTicTacToe();

begin.onclick = reset;
