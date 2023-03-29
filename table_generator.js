class InputTable {
  constructor(data, onCreateRow) {
    this.data = data;
    this.onCreateRow = onCreateRow;
    this.rowsCount = 0;

    this.rows = []; // {group, id, code, name, cost, fullCost}
    this.parentElement = document.querySelector(".perfume-input-table-wrapper");
  }

  // Создаёт div.input-group, который содержит строку с инпутами
  // И возвращает объект со ссылками на все элементы строки,
  // никуда не навешивает и ничего больше не делает.
  createRow(number, id) {
    const self = this;

    self.onCreateRow();

    const idSpan = document.createElement("span");
    idSpan.classList.add("input-group-text");
    idSpan.textContent = id != undefined ? id : number;

    const inputCode = document.createElement("input");
    inputCode.classList.add("form-control");
    inputCode.id = "input_code_" + number;
    inputCode.placeholder = "Код";
    inputCode.addEventListener("change", function (e) {
      const value = e.target.value;
      self.data.rows[number].code = value;
    });

    const inputName = document.createElement("input");
    inputName.classList.add("form-control");
    inputName.id = "input_name_" + number;
    inputName.placeholder = "Наименование";
    inputName.addEventListener("change", function (e) {
      const value = e.target.value;
      self.data.rows[number].name = value;
    });

    const displayFullCost = document.createElement("input");
    displayFullCost.type = "number";
    displayFullCost.readOnly = true;
    displayFullCost.classList.add("form-control");
    displayFullCost.id = `display-fullcost-${number}`;
    displayFullCost.placeholder = "Итог";

    const inputCost = document.createElement("input");
    inputCost.type = "number";
    inputCost.id = "input_cost_" + number;
    inputCost.classList.add("form-control");
    inputCost.placeholder = "Стоимость";
    inputCost.addEventListener("change", function (e) {
      const value = +e.target.value;
      self.data.rows[number].cost = value;
      displayFullCost.value = value * ORDER_VOLUME;
    });

    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");
    inputGroup.classList.add("mb-2");
    inputGroup.appendChild(idSpan);
    inputGroup.appendChild(inputCode);
    inputGroup.appendChild(inputName);
    inputGroup.appendChild(inputCost);
    inputGroup.appendChild(displayFullCost);

    return {
      group: inputGroup,
      id: idSpan,
      code: inputCode,
      name: inputName,
      cost: inputCost,
      fullCost: displayFullCost,
    };
  }

  // Генерирует таблицу из input-group div'ов, заполняя по-новой this.rows
  generate(rowsCount) {
    this.rows = [];
    cleanChildren(this.parentElement);
    for (let i = 0; i < rowsCount; i++) {
        this.addEmptyRow();
    }
  }

  // Заполняет таблицу присланными данными
  // data представляет собой список  [{code, name, cost}...]
  fill(data) {
    for (let i = 0; i < data.length; i++) {
      const dataRow = data[i];
      const inputs = this.rows[i];
      setInputValue(inputs.code, dataRow.code);
      setInputValue(inputs.name, dataRow.name);
      setInputValue(inputs.cost, dataRow.cost);
    }
  }

  // Добавляет в таблицу пустую строку
  addEmptyRow() {
    const idx = this.rowsCount;
    const row = this.createRow(idx, idx + 1);
    this.rows.push(row);
    this.parentElement.appendChild(row.group);
    this.rowsCount++;
  }
}
