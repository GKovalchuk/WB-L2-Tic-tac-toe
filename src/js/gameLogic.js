// Создаем массив для квадратов поля.
const squares = [];

// Создаем canvas.
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
// Подготавливаем переменные.
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
// Раскрашиваем.
context.fillStyle = "white";

// Функция для создания квадрата.
function createSquare({ x, y, sign }) {
	side = canvas.offsetWidth / 3;
	context.lineWidth = 3;
	// Рисуем квадрат.
	context.beginPath();
	context.strokeStyle = "black";
	context.strokeRect(x, y, side, side);
	context.stroke();

	// Отрисовываем знак.
	if (sign) {
		// Задаем длину линии.
		const lineSize = Math.floor(side / 4);
		if (sign === "X") {
			// Рисуем крестик.
			context.beginPath();
			context.strokeStyle = "#f87c56";
			context.moveTo(x + lineSize, y + lineSize);
			context.lineTo(x + side - lineSize, y + side - lineSize);
			context.moveTo(x + side - lineSize, y + lineSize);
			context.lineTo(x + lineSize, y + side - lineSize);
			context.stroke();
		} else {
			// Рисуем нолик.
			context.beginPath();
			context.strokeStyle = "#3CAE74";
			context.arc(x + side / 2, y + side / 2, lineSize * 1.05, 0, 2 * Math.PI);
			context.stroke();
		}
	}
}

export const reset = () => {
	// Очищаем канвас.
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Обнуляем данные о нарисованных знаках и перерисовываем поле.
	squares.forEach((square) => (square.sign = null));
	squares.forEach((square) => createSquare(square));
	// Обнуляем счетчик очередности и флаг конца игры.
	turn = 0;
	gameOver = false;
};

// Проверяем наличие победителя.
function checkForWinner() {
	// Функция, рисующая текст конца игры.
	const drawWinner = (sign = "Nobody") => {
		// Накладываем белый фильтр.
		context.fillStyle = "rgba(255, 255, 255, 0.85)";
		context.fillRect(0, 0, side * 3, side * 3);

		// Задаем параметры текста.
		context.font = `${side / 2.5}px Arial`;
		context.textAlign = "center";

		// Рисуем текст - объявляем победителя.
		if (sign === "X") context.fillStyle = "#f87c56";
		if (sign === "O") context.fillStyle = "#3CAE74";
		else context.fillStyle = "#000000";
		context.fillText(sign + "  wins!", (side * 3) / 2, (side * 3) / 2);
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

				// Рисуем линию, перечеркивающую комбинацию.
				let xFrom, yFrom, xTo, yTo;
				xFrom = yFrom = xTo = yTo = side / 2;
				if (i >= 0 && i <= 2) {
					yFrom = side / 3;
					yTo = side / 1.5;
				} else if (i >= 3 && i <= 5) {
					xFrom = side / 3;
					xTo = side / 1.5;
				} else {
					yFrom = side / 2.2;
					yTo = side / 1.8;
				}
				context.fillStyle = "black";
				context.beginPath();
				context.strokeStyle = "black";
				context.moveTo(s1.x + xFrom, s1.y + yFrom);
				context.lineTo(s3.x + xTo, s3.y + yTo);
				context.stroke();

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
		if (x >= square.x && x <= square.x + side && y >= square.y && y <= square.y + side) {
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

export function createTicTacToe() {
	// Задаем переменные.
	turn = 0;
	gameOver = false;

	// Задаем размеры canvas.
	canvas.width = canvas.height = canvas.clientWidth;
	side = canvas.width / 3;

	// Очищаем canvas.
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Задаем параметры квадратам. Помещаем полученные квадраты в массив.
	for (let x = 0; x < 3; x += 1) {
		for (let y = 0; y < 3; y += 1) {
			squares.push({ x: x * side, y: y * side, sign: null });
		}
	}

	// Рисуем квадраты на холсте.
	squares.forEach((square) => createSquare(square));

	// Добавляем обработчик событий для кликов на холсте.
	canvas.addEventListener("click", (e) => {
		click(e);
	});
}
