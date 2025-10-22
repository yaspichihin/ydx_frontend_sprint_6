import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules); 


export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  // Получаем ключи из объекта
  Object.keys(indexes).forEach((elementName) => {
    // Перебираем по именам
    elements[elementName].append(
      // в каждый элемент добавляем опции
      ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
        .map((name) => {
          // используйте name как значение и текстовое содержимое
          // @todo: создать и вернуть тег опции
          const option = document.createElement("option");
          option.textContent = name;
          option.value = name;
          return option;
        })
    );
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const key = action.dataset.field;
      const filterWrapper = action.closest(".filter-wrapper");
      const inputField = filterWrapper.querySelector(`[name=${key}]`);
      inputField.value = "";
      state[key] = "";
    }


    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter((row) => compare(row, state)); 
  };
}
