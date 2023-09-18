import { createTicTacToe, reset, resetWins } from "./gameLogic.js";
import { setWinsText } from "./setTexts.js";

const begin = document.getElementById("begin");
const resetWinsBtn = document.getElementById("resetWins");

// Получение данных, записанных в localStorage.
const historyProgress = JSON.parse(localStorage.getItem("ticTacToeProgress"));
const historyWins = JSON.parse(localStorage.getItem("ticTacToeWins"));

// Восстановление счетчика побед.
if (historyWins) setWinsText(historyWins);
else setWinsText({ xWins: 0, yWins: 0, draws: 0 });

console.log(historyProgress);
// Создание поля.
createTicTacToe(historyProgress, historyWins);

// Сброс текущего прогресса на поле.
begin.onclick = reset;
// Сброс счетчика побед.
resetWinsBtn.onclick = () => {
	resetWins();
	localStorage.setItem("ticTacToeWins", false);
	setWinsText({ xWins: 0, yWins: 0, draws: 0 });
};
