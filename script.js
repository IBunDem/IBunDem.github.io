class App {
    constructor() {
        this.data = {};
        this.data.rows = []; // {code, name, cost}
        this.data.vars = {};
        this.data.results = {};

        this.table = new InputTable(this.data, this.onAddRow);
        
        this.initEvents();
    }

    // Callback, вызываемый при добавлении строчки в таблицу
    onAddRow() {
        // this.data.rows.push({code: '', name: '', cost: ''});
    }

    // Инициирует создание пустой строки в таблице ввода
    addEmptyInputRow() {
        this.data.rows.push({code: '', name: '', cost: ''});
        this.table.addEmptyRow();
    }

    // Устанавливает значение для поля ввода количества строк
    // И генерирует соответствующую таблицу, не перетирая данные
    setRowsCountInputValue(value) {
        // Определяем количество недостающих полей
        if (value > this.data.rows.length) {
            const newRowsCount = value - this.data.rows.length;
            for (let i=0; i<newRowsCount; i++) {
                this.data.rows.push({code: '', name: '', cost: ''});
            }
        }
        else if (value < this.data.rows.length) {
            const excessCount = this.data.rows.length - value;
            this.data.rows = this.data.rows.slice(0, excessCount);
        }
        const countInput = document.querySelector('#perfume-count-input');
        setInputValue(countInput, value, dispatchEvent=false);
        this.table.generate(value);
        this.table.fill(this.data.rows);
    }

    // Заполняет все поля (таблица, переменные) из хранящегося data
    // также триггерит calculate с каждым полем
    fillFields() {
        // Количество строк таблицы
        this.setRowsCountInputValue(this.data.rows.length);

        const vars = this.data.vars;

        //Переменные
        // Доставка
        setInputValue('inputDeliveryCost', vars.deliveryCost);
        // Объем флакона
        setInputValue('inputBottleVolume', vars.bottleVolume);
        // Стоимость флакона
        setInputValue('inputBottleCost', vars.bottleCost);
        // Стоимость флакона пробника
        setInputValue('inputTesterCost', vars.testerCost);
        // Стоимость разбавителя (спирта)
        setInputValue('inputDiluentCost', vars.diluentCost);
        // Доля масла
        setInputValue('inputPartVolume', vars.partVolume);
        // Стоимость брендовых допов
        setInputValue('inputBrandCost', vars.brandCost);
        // Стоимость продажи
        setInputValue('inputSell', vars.sell, true);
    }

    // Обновление данных
    updateData(self, data) {
        this.data.rows = data.rows;
        this.data.vars = data.vars;
        this.data.results = data.results;
        self.fillFields();
    }

    // Производит вычисления и заполняет таблицы с результатами
    calculate() {
        var r = this.data.results;
        var vars = this.data.vars;
        var rowsCount = this.table.rowsCount;
        
        //#region Первая таблица
        // Стоимость закупа парфюмов
        r.resultCost = 0   
        //TODO 
        // for (const [i, row] of Object.entries(perfumTableData.inputTable)) {
        //     if (!row.cost) continue;
        //     r.resultCost += row.cost;
        // }
        // умножаем сумму стоимости 1 мл всех парфюмов на объем закупа (50мл по стандарту)
        r.resultCost *= ORDER_VOLUME;
        displayToElement('result-cost', r.resultCost);

        // Ко-во флаконов
        r.countBottle = Math.floor(ORDER_VOLUME/ vars.partVolume) * rowsCount;
        displayToElement('result-countbottle', r.countBottle);
        
        // Стоимость флаконов
        r.costBottle = r.countBottle * vars.bottleCost;
        displayToElement('result-costbottle', r.costBottle);
        
        // Ко-во пробников
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

    // Инициализирует события DOM-элементов
    initEvents() {
        const self = this;
        //#region countInput
        const countInput = document.querySelector('#perfume-count-input');
        countInput.value = 0;
        countInput.addEventListener('change', (e) => {
            const rowsCount = e.target.value;
            this.setRowsCountInputValue(rowsCount);
        })
        //#endregion

        //#region Download data as JSON buttons
        const downloadButton = document.querySelector('#download-json-btn');
        downloadButton.addEventListener('click', (e) => {
            const json = JSON.stringify(this.data, null, '\t');
            download(json);
        });
    
        const uploadButton = document.querySelector('#upload-json-btn');
        uploadButton.addEventListener('click', function (e)  {
            const inputFileField = document.querySelector('#upload-data-file-input');
            const file = inputFileField.files[0];
            readJsonFile(file, (data) => self.updateData(self, data));
        });
        //#endregion

        //#region  Слушатели событий ввода input'ов с переменными
        // Доставка
        var inputDeliveryCost = document.querySelector('#inputDeliveryCost');
        inputDeliveryCost.addEventListener('change', function (e) {
            const value = +e.target.value;
            self.data.vars.deliveryCost = value;
        });
        // Объем флакона
        var inputBottleVolume = document.querySelector('#inputBottleVolume');
        inputBottleVolume.addEventListener('change', function (e) {
            const value = +e.target.value;
            self.data.vars.bottleVolume = value;
        });
        // Стоимость флакона
        var inputBottleCost = document.querySelector('#inputBottleCost');
        inputBottleCost.addEventListener('change', function (e) {
            const value = +e.target.value;
            self.data.vars.bottleCost = value;
        });
        // Стоимость флакона пробника
        var inputTesterCost = document.querySelector('#inputTesterCost');
        inputTesterCost.addEventListener('change', function (e) {
            const value = +e.target.value;
            self.data.vars.testerCost = value;
        });
        // Стоимость разбавителя (спирта)
        var inputDiluentCost = document.querySelector('#inputDiluentCost');
        inputDiluentCost.addEventListener('change', function (e) {
            const value = +e.target.value;
            self.data.vars.diluentCost = value;
        });
        // Доля масла
        var inputPartVolume = document.querySelector('#inputPartVolume');
        inputPartVolume.addEventListener('change', function (e) {
            const value = +e.target.value;
            self.data.vars.partVolume = value;
        });
        // Стоимость брендовых допов
        var inputBrandCost = document.querySelector('#inputBrandCost');
        inputBrandCost.addEventListener('change', function (e) {
            const value = +e.target.value;
            self.data.vars.brandCost = value;
        });
        // Стоимость продажи
        var inputSell = document.querySelector('#inputSell');
        inputSell.addEventListener('change', function (e) {
            const value = +e.target.value;
            self.data.vars.sell = value;
        });

        // Add event recalculate to ever change of any input
        let inputs = Array.from(document.querySelectorAll('input'));
        const calculateInputs = inputs.filter((i) => !Array.from(i.classList).includes('no-calculate'));

        calculateInputs.forEach((inputElement) => {
            inputElement.addEventListener('change', (e) => self.calculate());
        });
        //#endregion

        //#region Кнопка Добавить строку
        const addRowButton = document.querySelector('#add-input-row-btn');
        addRowButton.addEventListener('click', (e) => {
            self.addEmptyInputRow();
        });
        //#endregion
    }

}

const app = new App();
