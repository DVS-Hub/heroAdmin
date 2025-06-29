import { useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { heroCreated } from "../heroesList/heroesSlice";
import { createSelector } from "@reduxjs/toolkit";

const HeroesAddForm = () => {
  const [nameHero, setNameHero] = useState("");
  const [descrHero, setDescrHero] = useState("");
  const [elementHero, setElementHero] = useState("");
  const { request } = useHttp();
  const dispatch = useDispatch();

  const filtersSelector = createSelector(
    (state) => state.filters.filters,
    (state) => state.filters.filtersLoadingStatus,
    (filters, filtersLoadingStatus) => {
      return { filters, filtersLoadingStatus };
    }
  );

  const { filters, filtersLoadingStatus } = useSelector(filtersSelector);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const hero = {
      id: uuidv4(),
      name: nameHero,
      description: descrHero,
      element: elementHero,
    };

    request("http://localhost:3001/heroes", "POST", JSON.stringify(hero))
      .then((res) => console.log(res, "отправка успешна"))
      .then(dispatch(heroCreated(hero)))
      .catch((err) => console.log(err));

    setNameHero("");
    setDescrHero("");
    setElementHero("");
  };

  const renderFilters = (filters, status) => {
    if (status === "loading") {
      return <option>Загрузка элементов</option>;
    }
    if (status === "error") {
      return <option>Ошибка загрузки</option>;
    }
    if (filters && filters.length > 0) {
      return filters.map(({ name, label }) => {
        // eslint-disable-next-line
        if (name === "all") return;
        return (
          <option key={name} value={name}>
            {label}
          </option>
        );
      });
    }
  };

  return (
    <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          onChange={(e) => setNameHero(e.target.value)}
          value={nameHero}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          onChange={(e) => setDescrHero(e.target.value)}
          value={descrHero}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          required
          className="form-select"
          id="element"
          name="element"
          onChange={(e) => setElementHero(e.target.value)}
          value={elementHero}
        >
          <option>Я владею элементом...</option>
          {renderFilters(filters, filtersLoadingStatus)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
