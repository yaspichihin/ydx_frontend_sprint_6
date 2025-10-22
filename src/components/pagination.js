import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  // В качестве шаблона берём первый элемент из контейнера со страницами
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  // и удаляем его (предполагаем, что там больше ничего,
  //  как вариант, можно и всё удалить из pages)
  pages.firstElementChild.remove();

  return (data, state, action) => {
    // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
    // Будем часто обращаться, чтобы короче записывать
    const rowsPerPage = state.rowsPerPage;
    // Число страниц округляем в большую сторону
    const pageCount = Math.ceil(data.length / rowsPerPage);
    // Страница переменной, потому что она может
    // меняться при обработке действий позже
    let page = state.page;

    // @todo: #2.6 — обработать действия
    if (action)
      switch (action.name) {
        // Переход на предыдущую страницу
        case "prev":
          page = Math.max(1, page - 1);
          break;
        // Переход на следующую страницу
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        // Переход на первую страницу
        case "first":
          page = 1;
          break;
        // Переход на последнюю страницу
        case "last":
          page = pageCount;
          break;
      }

    // @todo: #2.4 — получить список видимых страниц и вывести их
    // Получим массив страниц, которые нужно показать, выводим только 5 страниц
    const visiblePages = getPages(page, pageCount, 5);
    // Перебираем их и создаём для них кнопку
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        // Клонируем шаблон, который запомнили ранее
        const el = pageTemplate.cloneNode(true);
        // Вызываем колбэк из настроек, чтобы заполнить кнопку данными
        return createPage(el, pageNumber, pageNumber === page);
      })
    );
    // @todo: #2.5 — обновить статус пагинации
    // С какой строки выводим
    fromRow.textContent = (page - 1) * rowsPerPage + 1;
    // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
    toRow.textContent = Math.min(page * rowsPerPage, data.length);
    // Сколько всего строк выводим на всех страницах вместе (после фильтрации будет меньше)
    totalRows.textContent = data.length;

    // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
    // Сколько строк нужно пропустить
    const skip = (page - 1) * rowsPerPage;
    // Получаем нужную часть строк
    return data.slice(skip, skip + rowsPerPage);
  };
};
