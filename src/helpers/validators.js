/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import { SHAPES, COLORS } from '../constants';
import {
  __,
  allPass,
  compose,
  countBy,
  equals,
  gte,
  identity,
  includes,
  invert,
  not,
  prop,
  propEq,
  length,
  values,
  has,
  anyPass,
  and,
  converge
} from 'ramda';

const { TRIANGLE, CIRCLE, SQUARE, STAR } = SHAPES;
const { BLUE, GREEN, ORANGE, RED, WHITE } = COLORS;
const getColors = compose(countBy(identity), values);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => {
  const isRedStar = propEq(STAR, RED);
  const isGreenSquare = propEq(SQUARE, GREEN);
  const isWhite = propEq(__, WHITE);
  const isWhiteCircle = isWhite(CIRCLE);
  const isWhiteTriangle = isWhite(TRIANGLE);
  const isColorPosition = allPass([
    isRedStar,
    isGreenSquare,
    isWhiteTriangle,
    isWhiteCircle
  ]);

  return isColorPosition(shapes);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
  const greenFigureGte2 = ({ green }) => gte(green, 2);
  return compose(greenFigureGte2, getColors)(shapes);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
  const isRedEqualsBlue = ({ blue, red }) => blue === red;
  return compose(isRedEqualsBlue, getColors)(shapes);
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (shapes) => {
  const isBlueCircle = propEq(CIRCLE, BLUE);
  const isRedStar = propEq(STAR, RED);
  const isOrangeSquare = propEq(SQUARE, ORANGE);
  const isColorPosition = allPass([isBlueCircle, isRedStar, isOrangeSquare]);

  return isColorPosition(shapes);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
  const invertObjectColors = compose(invert, getColors)(shapes);
  const is3FiguresNotWhite = compose(not, equals([WHITE]), prop(3));
  const has3FiguresAndNotWhite = converge(and, [has(3), is3FiguresNotWhite]);

  return anyPass([has(4), has3FiguresAndNotWhite])(invertObjectColors);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (shapes) => {
  const invertFigures = invert(shapes);
  const greensFigures = prop(GREEN);
  const includeTriangle = compose(includes(TRIANGLE), greensFigures);
  const greensEqualsTwo = compose(equals(2), length, greensFigures);

  return allPass([has(RED), has(GREEN), includeTriangle, greensEqualsTwo])(
    invertFigures
  );
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shapes) => {
  const allFiguresIsOrange = propEq(ORANGE, 4);
  return compose(allFiguresIsOrange, getColors)(shapes);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = (shapes) => {
  const isStarNotEqualsRed = compose(not, propEq(STAR, RED));
  const isStarNotEqualsWhite = compose(not, propEq(STAR, WHITE));

  return converge(and, [isStarNotEqualsRed, isStarNotEqualsWhite])(shapes);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shapes) => {
  const allFiguresIsGreen = propEq(GREEN, 4);
  return compose(allFiguresIsGreen, getColors)(shapes);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = ({ triangle, square }) =>
  equals(triangle, square);
