var perfumTableData = {};
perfumTableData.variables = {};
perfumTableData.results = {};

const rowsCountMin = 1;
const rowsCountMax = 100;
let lastRowsNumber = 5;

const orderVolume = 50;

const perfumeCountInput = document.querySelector('#perfume-count-input');
perfumeCountInput.value = lastRowsNumber;

function cleanChildren(element) {
    const children = Array.from(element.childNodes);
    children.forEach((c) => {
        element.removeChild(c);
    });
}

function updateInputTable(rowsCount) {
    if (isNaN(parseInt(rowsCount))) {
        perfumeCountInput.value = lastRowsNumber;
        return;
    }
    else {
        rowsCount = parseInt(rowsCount);
        if (rowsCount < rowsCountMin) rowsCount = rowsCountMin;
        else if (rowsCount > rowsCountMax) rowsCount = rowsCountMax;
        lastRowsNumber = rowsCount;
    }

    perfumTableData.inputTable = {};
    perfumTableData.rowsCount = rowsCount;
    const perfumeTableWrapper = document.querySelector('.perfume-input-table-wrapper');
    cleanChildren(perfumeTableWrapper);

    for(let i=1; i<rowsCount+1; i++) {
        perfumTableData.inputTable[i] = {};

        const idSpan = document.createElement('span');
        idSpan.classList.add('input-group-text');
        idSpan.textContent = i;

        const inputCode = document.createElement('input');
        inputCode.classList.add('form-control');
        inputCode.placeholder='Код';
        inputCode.addEventListener('change', function(e) { 
            const value = e.target.value;
        
            perfumTableData.inputTable[i].code = value;
        });

        const inputName = document.createElement('input');
        inputName.classList.add('form-control');
        inputName.placeholder='Наименование';
        inputName.addEventListener('change', function(e) { 
            const value = e.target.value;
        
            perfumTableData.inputTable[i].name = value;
        });

        const inputCost = document.createElement('input');
        inputCost.type = 'number';
        inputCost.classList.add('form-control');
        inputCost.placeholder='Стоимость';
        inputCost.addEventListener('change', function(e) { 
            const value = +e.target.value;
            e.target.value = value;
        
            perfumTableData.inputTable[i].cost = value;

            const displayField = document.querySelector(`#display-fullcost-${i}`);
            displayField.value = value * orderVolume;
        });

        const displayFullCost = document.createElement('input');
        displayFullCost.type = 'number';
        displayFullCost.readOnly = true;
        displayFullCost.classList.add('form-control');
        displayFullCost.id = `display-fullcost-${i}`;
        displayFullCost.placeholder='Итог';

        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group');
        inputGroup.classList.add('mb-2');
        inputGroup.appendChild(idSpan);
        inputGroup.appendChild(inputCode);
        inputGroup.appendChild(inputName);
        inputGroup.appendChild(inputCost);
        inputGroup.appendChild(displayFullCost);

        perfumeTableWrapper.appendChild(inputGroup);
    }
}

function displayToElement(id, text) {
    if (typeof text !== "string" && isNaN(text)) document.querySelector('#'+id).textContent = '-';
    else document.querySelector('#'+id).textContent = text;
}

updateInputTable(lastRowsNumber);

perfumeCountInput.addEventListener('change', (e) => {
    let rowsCount = e.target.value;
    updateInputTable(rowsCount);
});

function calculate() {
    /*
    console.log('Calculate...');
    console.log(perfumTableData);
    */

    var r = perfumTableData.results;
    var vars = perfumTableData.variables;
    var rowsCount = perfumTableData.rowsCount;

    //#region Первая таблица
    // Стоимость закупа парфюмов
    r.resultCost = 0    
    for (const [i, row] of Object.entries(perfumTableData.inputTable)) {
        if (!row.cost) continue;
        r.resultCost += row.cost;
    }
    // умножаем сумму стоимости 1 мл всех парфюмов на объем закупа (50мл по стандарту)
    r.resultCost *= orderVolume;
    displayToElement('result-cost', r.resultCost);

    // Ко-во флаконов
    r.countBottle = Math.floor(orderVolume / vars.partVolume) * rowsCount;
    displayToElement('result-countbottle', r.countBottle);
    
    // Стоимость флаконов
    r.costBottle = r.countBottle * vars.bottleCost;
    displayToElement('result-costbottle', r.costBottle);
    
    // Ко-во пробников
    // r.countTester = Math.round(1.5 * perfumTableData.rowsCount);
    r.countTester = rowsCount;
    displayToElement('result-couttester', r.countTester);

    // Стоимость пробников
    r.costTester = r.countTester * vars.testerCost;
    displayToElement('result-costtester', r.costTester);

    // Объем разбавителя (спирта)
    r.volumeDiluent = (vars.bottleVolume - vars.partVolume) * rowsCount;
    displayToElement('result-volumediluent', r.volumeDiluent);

    // Стоимость разбавителя
    r.diluentCost = r.volumeDiluent * vars.diluentCost;
    displayToElement('result-diluentCost', r.diluentCost);
    
    // Соотношение масло/разбавитель
    r.ratio = `${vars.partVolume}/${vars.bottleVolume - vars.partVolume}`;
    displayToElement('result-ratio', r.ratio);

    // Стоимость брендирования
    r.branding = vars.brandCost * r.countBottle;
    displayToElement('result-branding', r.branding);

    //#endregion

    //#region Вторая таблица
    // Себестоимость 1 флакона
    r.selfCost = (vars.deliveryCost + r.resultCost + r.costBottle + r.costTester + r.diluentCost + vars.brandCost) / r.countBottle;
    displayToElement('result-selfcost', r.selfCost);

    // Сумарно затрат
    r.sumExpenses = vars.deliveryCost + r.resultCost + r.costBottle + r.costTester + r.diluentCost + r.branding;
    displayToElement('result-sumexpenses', r.sumExpenses);

    // Стоимость полной продажи
    r.SellCost = r.countBottle * vars.sell;
    displayToElement('result-fullsellcost', r.SellCost);

    // Прибыль
    r.income = r.SellCost - r.sumExpenses;
    displayToElement('result-income', r.income);

    //#endregion
}

//#region  Слушатели событий ввода переменных
// Доставка
var inputDeliveryCost = document.querySelector('#inputDeliveryCost');
inputDeliveryCost.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.deliveryCost = value;
    calculate();
});
// Объем флакона
var inputBottleVolume = document.querySelector('#inputBottleVolume');
inputBottleVolume.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.bottleVolume = value;
});
// Стоимость флакона
var inputBottleCost = document.querySelector('#inputBottleCost');
inputBottleCost.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.bottleCost = value;
});
// Стоимость флакона пробника
var inputTesterCost = document.querySelector('#inputTesterCost');
inputTesterCost.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.testerCost = value;
});
// Стоимость разбавителя (спирта)
var inputDiluentCost = document.querySelector('#inputDiluentCost');
inputDiluentCost.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.diluentCost = value;
});
// Доля масла
var inputPartVolume = document.querySelector('#inputPartVolume');
inputPartVolume.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.partVolume = value;
});
// Стоимость брендовых допов
var inputBrandCost = document.querySelector('#inputBrandCost');
inputBrandCost.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.brandCost = value;
});
// Стоимость продажи
var inputSell = document.querySelector('#inputSell');
inputSell.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.sell = value;
});

// Add event recalculate to ever change of any input
let inputs = Array.from(document.querySelectorAll('input'));

const calculateInputs = inputs.filter((i) => !Array.from(i.classList).includes('no-calculate'));
calculateInputs.forEach((inputElement) => {
    inputElement.addEventListener('change', (e) => calculate());
});

//#endregion

//#region Загрузка данных с json-файлами
    function download(data) {
        let a = document.querySelector("#json-download-a");
        a.href = "data:application/json," + encodeURIComponent(data);
        a.click();
    }

    const downloadButton = document.querySelector('#download-json-btn');
    downloadButton.addEventListener('click', (e) => {
        const json = JSON.stringify(perfumTableData, null, '\t');
        download(json);
    });

    const uploadButton = document.querySelector('#upload-json-btn');
    uploadButton.addEventListener('click', (e) => {
        
    });
//#endregion