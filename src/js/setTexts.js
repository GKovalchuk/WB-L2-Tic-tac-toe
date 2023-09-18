const historyConainer = document.getElementById("history");
const winsX = document.getElementById("winsX");
const winsY = document.getElementById("winsY");
const winsDraw = document.getElementById("winsDraw");

/*
	При запуске игры с записью в истории сохранений, выводим сообщение, пока
	текущая партия не завершится
	*/
export const setHistoryText = (flag = false) => {
	if (flag) {
		historyConainer.textContent = `История восстановлена`;
	} else {
		historyConainer.textContent = ``;
	}
};

// Обновляем поля счетчиков побед.
export const setWinsText = ({ xWins, yWins, draws }) => {
	winsX.textContent = `Побед Крестика: ${xWins}`;
	winsY.textContent = `Побед Нолика: ${yWins}`;
	winsDraw.textContent = `Ничьих: ${draws}`;
};
