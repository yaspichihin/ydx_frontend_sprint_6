import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

// @todo: подключение
import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const formData = new FormData(sampleTable.container);
  const state = processFormData(formData);

  // Приведём количество страниц к числу
  const rowsPerPage = parseInt(state.rowsPerPage);

  // Номер страницы по умолчанию 1 и тоже число
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  // состояние полей из таблицы
  let state = collectState();

  // копируем для последующего изменения
  let result = [...data];

  // @todo: использование
  result = applySorting(result, state, action);
  result = applyPagination(result, state, action);
  sampleTable.render(result);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["header"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация

const applyPagination = initPagination(
  // передаём сюда элементы пагинации, найденные в шаблоне
  sampleTable.pagination.elements,
  // и callback, чтобы заполнять кнопки страниц данными
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов,
  // которые вызывают сортировку, чтобы изменять
  //  их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

render();
