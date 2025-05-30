import { useEffect } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilters,
  filtersFetchingError,
  activeFilterChanged,
} from "../../actions";
import Spinner from "../spinner/Spinner";
import classNames from "classnames";
import { createSelector } from "reselect";

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
  const { request } = useHttp();

  const filtersSelector = createSelector(
    (state) => state.filters.filters,
    (state) => state.filters.filtersLoadingStatus,
    (state) => state.filters.activeFilter,
    (filters, filtersLoadingStatus, activeFilter) => {
      return { filters, filtersLoadingStatus, activeFilter };
    }
  );

  const { filters, filtersLoadingStatus, activeFilter } =
    useSelector(filtersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilters(request));
    // eslint-disable-next-line
  }, []);

  if (filtersLoadingStatus === "loading") {
    return <Spinner />;
  } else if (filtersFetchingError === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderFilters = (arr) => {
    console.log("render Filters");
    if (arr.length === 0) {
      return <h5 className="text-center mt-5">Фильтры не найдены</h5>;
    }

    return arr.map(({ name, className, label }) => {
      const btnClass = classNames("btn", className, {
        active: name === activeFilter,
      });
      return (
        <button
          key={name}
          id={name}
          className={btnClass}
          onClick={() => dispatch(activeFilterChanged(name))}
        >
          {label}
        </button>
      );
    });
  };

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">{renderFilters(filters)}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
