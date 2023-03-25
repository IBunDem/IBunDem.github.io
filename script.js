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
            console.log(i + '. new code: ' + value);
        });

        const inputName = document.createElement('input');
        inputName.classList.add('form-control');
        inputName.placeholder='Наименование';
        inputName.addEventListener('change', function(e) { 
            const value = e.target.value;
        
            perfumTableData.inputTable[i].name = value;
            console.log(i + '. new name: ' + value);
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
            console.log(i + '. new cost: ' + value);
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

updateInputTable(lastRowsNumber);

perfumeCountInput.addEventListener('change', (e) => {
    let rowsCount = e.target.value;
    updateInputTable(rowsCount);
});

function calculate() {
    console.log('Calculate...');
    console.log(perfumTableData);
    var r = perfumTableData.results;
    var vars = perfumTableData.variables;

    // Стоимость закупа парфюмов
    r.resultCost = 0    
    for (const [i, row] of Object.entries(perfumTableData.inputTable)) {
        r.resultCost += row.cost;
    }
    r.resultCost *= orderVolume;

    document.querySelector('#result-cost').textContent = r.resultCost;

    // Ко-во флаконов
    r.countBottle = orderVolume / Math.floor(vars.partVolume) * perfumTableData.rowsCount;
    document.querySelector('#result-countbottle').textContent = r.countBottle;
   
    // Стоимость флаконов
    r.costBottle = r.countBottle * vars.bottleCost;
    document.querySelector('#result-costbottle').textContent = r.costBottle;
    
    // Ко-во пробников
    r.countTester = Math.round(1.5 * perfumTableData.rowsCount);
    document.querySelector('#result-couttester').textContent = r.countTester;

    // Стоимость пробников
    r.costTester = r.countTester * vars.testerCost;
    document.querySelector('#result-costtester').textContent = r.costTester;

    // Объем разбавителя (спирта)
    r.volumeDiluent = (vars.bottleVolume - vars.partVolume) * perfumTableData.rowsCount;
    document.querySelector('#result-volumediluent').textContent = r.volumeDiluent;

    // Стоимость разбавителя
    r.diluentCost = r.volumeDiluent * vars.diluentCost;
    document.querySelector('#result-diluentCost').textContent = r.diluentCost;
    
    // Соотношение масло/разбавитель
    r.ratio = `${vars.partVolume}/${vars.bottleVolume - vars.partVolume}`;
    document.querySelector('#result-ratio').textContent = r.ratio;
    


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
    // calculate();
});
// Стоимость флакона
var inputBottleCost = document.querySelector('#inputBottleCost');
inputBottleCost.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.bottleCost = value;
    // calculate();
});
// Стоимость флакона пробника
var inputTesterCost = document.querySelector('#inputTesterCost');
inputTesterCost.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.testerCost = value;
    // calculate();
});
// Стоимость разбавителя (спирта)
var inputDiluentCost = document.querySelector('#inputDiluentCost');
inputDiluentCost.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.diluentCost = value;
    // calculate();
});
// Доля масла
var inputPartVolume = document.querySelector('#inputPartVolume');
inputPartVolume.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.partVolume = value;
    // calculate();
});
// Стоимость брендовых допов
var inputBrandCost = document.querySelector('#inputBrandCost');
inputBrandCost.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.brandCost = value;
    // calculate();
});
// Стоимость продажи
var inputSell = document.querySelector('#inputSell');
inputSell.addEventListener('change', function (e) {
    const value = +e.target.value;

    perfumTableData.variables.sell = value;
    // calculate();
});
//#endregion

// Add event recalculate to ever change of any input
const inputs = Array.from(document.querySelectorAll('input'));
inputs.forEach((inputElement) => {
    inputElement.addEventListener('change', (e) => calculate());
});