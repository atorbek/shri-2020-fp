/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
  __,
  allPass,
  andThen,
  identity,
  ifElse,
  invoker,
  length,
  modulo,
  multiply,
  otherwise,
  pipe,
  tap,
  tryCatch
} from 'ramda';

const { get } = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const tapWriteLog = tap(writeLog);

  const isPositiveNumber = (value) => value > 0;
  const isLengthGreaterThanTwo = (value) => value.length >= 2;
  const isLengthLessThanTwo = (value) => value.length <= 10;
  const isDotLessThanOrEqualOne = (value) =>
    String(value).split('.').length - 1 <= 1;
  const isValidate = allPass([
    isPositiveNumber,
    isLengthGreaterThanTwo,
    isLengthLessThanTwo,
    isDotLessThanOrEqualOne
  ]);
  const validation = ifElse(isValidate, identity, () => {
    throw 'ValidationError';
  });

  const toFixed = invoker(1, 'toFixed');
  const roundNumber = pipe(Number, toFixed(1), Number, tapWriteLog);

  const convert = get('https://api.tech/numbers/base');
  const convertToBinary = (number) =>
    convert({
      from: 10,
      to: 2,
      number
    });
  const result = ({ result }) => result;
  const binaryNumber = pipe(
    convertToBinary,
    andThen(result),
    andThen(tapWriteLog)
  );

  const animalById = (id) => get(`https://animals.tech/${id}`, {});
  const animal = pipe(animalById, andThen(result), andThen(tapWriteLog));
  const len = pipe(length, tapWriteLog);
  const pow = pipe(multiply(__, 2), tapWriteLog);
  const remainder = pipe(modulo(__, 3), tapWriteLog);

  const allActions = pipe(
    tapWriteLog,
    validation,
    roundNumber,
    binaryNumber,
    andThen(len),
    andThen(pow),
    andThen(remainder),
    andThen(animal),
    andThen(handleSuccess),
    otherwise(handleError)
  );

  tryCatch(allActions, handleError)(value);
};

export default processSequence;
