import { setHistoryText, setWinsText } from "./setTexts.js";

// Создаем массив для квадратов поля.
let squares = [];

// Создаем canvas.
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
// Подготавливаем переменные.
// Длина стороны поля.
let sideOfField;
// Длина стороны клетки.
let side;
// Текущий ход.
let turn = 0;
// Флаг конца игры.
let gameOver = false;
// Массив, определяющий, какой знак будет следующим.
const signs = ["X", "O"];
// Массив комбинаций знаков для победы.
const winnerCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];
let mouseX;
let mouseY;
// Счетчики побед.
let wins = {
	xWins: 0,
	yWins: 0,
	draws: 0,
};

// Раскрашиваем.
context.fillStyle = "white";

const setSideOfField = () => {
	sideOfField = canvas.clientWidth;
	side = sideOfField / 3;
};

// Функция для создания квадрата.
function createSquare({ x, y, sign, isCursorHere = false }) {
	// Определяем x и y верхенго левого угла квадрата.
	const xSide = x * side;
	const ySide = y * side;

	// Задаем длину линии знака.
	const lineSize = Math.floor(side / 4);
	context.lineWidth = 3;
	// Рисуем квадрат.
	context.beginPath();
	context.strokeStyle = "black";
	context.strokeRect(xSide, ySide, side, side);
	context.stroke();

	// Рисуем крестик.
	const drawX = (color) => {
		context.beginPath();
		context.strokeStyle = color;
		context.moveTo(xSide + lineSize, ySide + lineSize);
		context.lineTo(xSide + side - lineSize, ySide + side - lineSize);
		context.moveTo(xSide + side - lineSize, ySide + lineSize);
		context.lineTo(xSide + lineSize, ySide + side - lineSize);
		context.stroke();
	};

	// Рисуем нолик.
	const drawO = (color) => {
		context.beginPath();
		context.strokeStyle = color;
		context.arc(xSide + side / 2, ySide + side / 2, lineSize * 1.05, 0, 2 * Math.PI);
		context.stroke();
	};

	// Отрисовываем указание хода.
	if (isCursorHere && !sign) {
		if (signs[turn] === "X") {
			// Рисуем крестик.
			drawX("#f87c5633");
		} else {
			// Рисуем нолик.
			drawO("#3CAE7433");
		}
	}

	// Отрисовываем знак.
	if (sign) {
		if (sign === "X") {
			// Рисуем крестик.
			drawX("#f87c56");
		} else {
			// Рисуем нолик.
			drawO("#3CAE74");
		}
		const strSquares = JSON.stringify(squares);
		localStorage.setItem("ticTacToeProgress", strSquares);
	}
}

export const reset = () => {
	// Очищаем канвас.
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Обнуляем данные о нарисованных знаках и перерисовываем поле.
	squares.forEach((square) => {
		square.sign = null;
		square.isCursorHere = false;
	});
	squares.forEach((square) => createSquare(square));
	// Обнуляем счетчик очередности и флаг конца игры.
	turn = 0;
	gameOver = false;
	localStorage.setItem("ticTacToeProgress", false);
};

// Проверяем наличие победителя.
function checkForWinner() {
	// Функция, рисующая текст конца игры.
	const drawWinner = (sign = "Nobody") => {
		// Накладываем белый фильтр.
		context.fillStyle = "rgba(255, 255, 255, 0.85)";
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Задаем параметры текста.
		context.font = `${side / 2.5}px Arial`;
		context.textAlign = "center";

		// Рисуем текст - объявляем победителя.
		if (sign === "X") {
			context.fillStyle = "#f87c56";
			wins.xWins += 1;
		} else if (sign === "O") {
			context.fillStyle = "#3CAE74";
			wins.yWins += 1;
		} else if (sign === "Nobody") {
			context.fillStyle = "#000000";
			wins.draws += 1;
		}
		context.fillText(sign + "  wins!", (side * 3) / 2, (side * 3) / 2);

		// Записываем данные в localStorage и обновляем тексты.
		localStorage.setItem("ticTacToeProgress", false);
		localStorage.setItem("ticTacToeWins", `{"xWins":${wins.xWins},"yWins":${wins.yWins},"draws":${wins.draws}}`);
		setWinsText(wins);
		setHistoryText(false);
	};

	// Проходим по массиву победных комбинаций.
	for (let i = 0; i < winnerCombinations.length; i += 1) {
		let comb = winnerCombinations[i];
		let s1 = squares[comb[0]];
		let s2 = squares[comb[1]];
		let s3 = squares[comb[2]];
		// Исключаем те комбинации, где есть пустые клетки.
		if (s1.sign != null) {
			// Проверяем на три одинаковых знака.
			if (s1.sign == s2.sign && s1.sign == s3.sign) {
				// Ставис флаг конца игры в true.
				gameOver = true;
				// Рисуем текст.
				drawWinner(s1.sign);
			}
		}
	}

	// Проверяем на ничью.
	let freeSquares = squares.filter(({ sign }) => sign === null).length;
	if (freeSquares === 0 && !gameOver) {
		drawWinner();
		gameOver = true;
	}
}

// Функция обработчика событий для кликов на холсте.
function click(e) {
	// Перезагрузка холста по нажатию при конце игры.
	if (gameOver) {
		reset();
		return;
	}

	// Получаем координаты клика.
	const x = e.offsetX;
	const y = e.offsetY;
	// Находим квадрат, к которому принадлежат координаты клика.
	for (let square of squares) {
		if (square.sign != null) continue;
		let xSide = square.x * side;
		let ySide = square.y * side;
		if (x >= xSide && x <= xSide + side && y >= ySide && y <= ySide + side) {
			// Определяем и задаем знак. Сменяем ход.
			square.sign = signs[turn];
			turn = (turn + 1) % 2;
			// Отрисовываем новый знак на канвасе.
			createSquare(square);
		}
	}

	// Проверяем, определен ли победитель.
	checkForWinner();
}

// Сброс счетчика побед.
export const resetWins = () => {
	wins = {
		xWins: 0,
		yWins: 0,
		draws: 0,
	};
};

export function createTicTacToe(historyProgress = false, historyWins) {
	// Задаем переменные.
	turn = 0;
	gameOver = false;
	// Задаем размеры canvas.
	setSideOfField();

	// Очищаем canvas.
	context.clearRect(0, 0, canvas.width, canvas.height);

	if (historyWins) {
		wins = historyWins;
	}

	if (!historyProgress) {
		// Задаем параметры квадратам. Помещаем полученные квадраты в массив.
		for (let x = 0; x < 3; x += 1) {
			for (let y = 0; y < 3; y += 1) {
				squares.push({ x, y, sign: null });
			}
		}
	} else {
		squares = historyProgress;
		setHistoryText(true);
		squares.forEach((square) => {
			if (square.sign != null) {
				turn += 1;
			}
		});

		turn = turn % 2;
	}

	// Рисуем квадраты на холсте.
	squares.forEach((square) => createSquare(square));

	// Добавляем обработчик событий для кликов на холсте.
	canvas.addEventListener("click", (e) => {
		click(e);
	});
}

/*
	Функция, отслеживающая положение мыши на canvas.
	Она же устанавливает подсказку - чья очередь ходить.
	*/
canvas.addEventListener("mousemove", (event) => {
	// Не отслеживаем, пока на экране заставка победы.
	if (gameOver) return;
	// Получаем размеры canvas.
	const sizes = canvas.getBoundingClientRect();
	const x = event.clientX - sizes.left;
	const y = event.clientY - sizes.top;

	// Очищаем canvas.
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Получаем в каком квадрате находится курсор.
	const row = Math.floor(y / side);
	const col = Math.floor(x / side) * 3;
	const curSqr = row + col;

	// Отрисовываем canvas с полупрозрачным указателем хода.
	squares.forEach((square) => {
		if (square === squares[curSqr]) {
			square.isCursorHere = true;
		} else {
			square.isCursorHere = false;
		}
		createSquare(square);
	});
});

// Создаем прослушиватель изменений для canvas.
const resizeCanvasObserver = new ResizeObserver((entries) => {
	const { width } = entries[0].contentRect;
	canvas.width = canvas.height = width;
	setSideOfField();
	squares.forEach((square) => createSquare(square));
});

// Запускаем прослушиватель изменений для canvas.
resizeCanvasObserver.observe(canvas);
