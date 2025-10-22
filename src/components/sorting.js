import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // @todo: #3.2 — сбросить сортировки остальных колонок
      columns.forEach((column) => {
        // Перебираем элементы (в columns у нас массив кнопок)
        if (column.dataset.field !== action.dataset.field) {
          // Если это не та кнопка, что нажал пользователь
          // тогда сбрасываем её в начальное состояние
          column.dataset.value = "none";
        }
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки
      columns.forEach((column) => {
        // Перебираем все наши кнопки сортировки
        if (column.dataset.value !== "none") {
          // Ищем ту, что находится не в начальном
          // состоянии (предполагаем, что одна)

          // Сохраняем в переменных поле
          field = column.dataset.field;

          // и направление сортировки
          order = column.dataset.value;
        }
      });
    }

    return sortCollection(data, field, order);
  };
}
