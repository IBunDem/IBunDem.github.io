//#region utils

// Очищает DOM-элемент от дочерних элементов
function cleanChildren(element) {
    const children = Array.from(element.childNodes);
    children.forEach((c) => {
        element.removeChild(c);
    });
}

// Выводит текст в DOM-элемент с указанным id
function displayToElement(id, text) {
    if (typeof text !== "string" && isNaN(text)) document.querySelector('#'+id).textContent = '-';
    else document.querySelector('#'+id).textContent = text;
}

// Устанавливает значение в поле ввода
// inputId может быть как строкой с id, начинаясь с #,
// Либо быть DOM-элементом input
// Есть dispatchEvent флаг, указывающий нужно ли
// триггерить событие "change"
function setInputValue(inputId, value, dispatchEvent=true) {
    var input;
    if (typeof inputId === 'string') {
        if (!inputId.startsWith('#')) inputId = '#' + inputId;
        input = document.querySelector(inputId);
    }
    else input = inputId;

    input.value = value;
    if (dispatchEvent) input.dispatchEvent(new Event('change'));
}

// Загружает файл "data.json" с указанным содержимым
// Использует сохранённый в разметке элемент a
function download(data) {
    let a = document.querySelector("#json-download-a");
    a.href = "data:application/json," + encodeURIComponent(data);
    a.click();
}

// Читает текст из указанного текстового файла
// file - Это файл, принятый input'ом
// onRead - callback, вызываемый после ассинхронного чтения файла
// в коллбэк передается параметром текст из файла в виде строки
function readTextFile(file, onRead) {
    const reader = new FileReader();
    reader.onload = function() {
        const result = reader.result;
        // const data = JSON.parse(result);
        onRead(result);
    };

    reader.readAsText(file);
}

// Читает json-файл, парсит его и возвращает готовый объект
function readJsonFile(file, onRead) {
    return readTextFile(file, (text) => onRead(JSON.parse(text)))
}

//#endregion