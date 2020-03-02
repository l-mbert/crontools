/**
 * CronValidator
 * Validate Cronjob Timings
 */

import * as Constants from './Constants';

/**
 * Transforms a Cronjob Timing string to a rich object
 * @param {string} expression - The Cronjob Timing string to split into the rich object
 * @returns {{
  minute: Array.<string>,
  hour: Array.<string>,
  dayOfTheMonth: Array.<string>,
  month: Array.<string>,
  dayOfTheWeek: Array.<string>,
 * }} The rich object the Validator uses
 @throws {Error} if the Object contains more than five fields.
*/
const splitExpression = expression => {
  const splittedExpression = expression.split(' ');

  if (splittedExpression.length > 5) {
    throw new Error(
      `Expression given is not a valid Cronjob Timing Expression. Expected 5 or less values, got: ${splittedExpression.length} instead.`,
    );
  }

  expression = {};
  Object.keys(splittedExpression).forEach((key, index) => {
    expression[Constants.MeasurementsOfTimeNames[index]] = [
      ...(splittedExpression[key] !== '*' ? splittedExpression[key].split(',') : '*'),
    ];
  });

  return expression;
};

/**
   * Validates the given Cronjob Expression
   * @param {{
    minute: Array.<string>,
    hour: Array.<string>,
    dayOfTheMonth: Array.<string>,
    month: Array.<string>,
    dayOfTheWeek: Array.<string>,
 * }|string} expression - An object or string to validate
 @throws {Error} if the Object contains more than five fields.
*/
const validateExpression = expression => {
  if (!expression) {
    throw new Error('Missing argument: "expression".');
  }

  if (typeof expression === 'string') {
    expression = splitExpression(expression);
  }

  const expressionKeys = Object.keys(expression);

  if (expressionKeys.length > 5) {
    throw new Error(
      `Expression given is not a valid Cronjob Timing Expression. Expected 5 or less values, got: ${expressionKeys.length} instead.`,
    );
  }
};

/**
 * Validates the given Cronjob expression
 * @param {string} expression - The Cronjob timing expression to validate
 * @throws {Error} if the string contains more than five fields.
 */
const validateString = expression => {
  if (!expression) {
    throw new Error('Missing argument: "expression".');
  }

  expression = splitExpression(expression);

  Object.keys(expression).forEach(measurementOfTime => {
    validateValue(measurementOfTime, expression[measurementOfTime]);
  });
};

/**
 * Validates the Measurement of Time given
 * @param {string} measurementOfTime - An valid measurement of time for a CronJob
 * @param {string} value - The Interval to validate
 * @throws {Error} If measurementOfTime isn't a valid Character or String
 * @throws {Error} IF measurementOfTime is too small or too big for a numeric Character
 */
const validateValue = (measurementOfTime, value) => {
  if (!measurementOfTime) {
    throw new Error('Missing argument: "measurementOfTime".');
  }

  if (!value) {
    throw new Error('Missing argument: "value".');
  }

  if (!Constants.MeasurementsOfTimeNames.includes(measurementOfTime)) {
    throw new Error(
      `${measurementOfTime} is not a valid Measurement of Time. Please try use one of these: ${Constants.MeasurementsOfTimeNames.join(
        ', ',
      )}`,
    );
  }

  // If the "measurementOfTime" is "month" we check if it's one of the Allowed Months or a valid character exists in it.
  if (measurementOfTime === 'month') {
    if (!Constants.AllowedMonths.includes(value) && !Constants.SimpleCharacterRegex.test(value)) {
      throw new Error(`${value} is not valid. Please use 0-9, "-", "*", ${Constants.AllowedMonths.join(', ')}`);
    }
  }

  // If the "measurementOfTime" is "dayOfTheWeek" we check if it's one of the Allowed Weekday or a valid character exists in it.
  if (measurementOfTime === 'dayOfTheWeek') {
    if (!Constants.AllowedWeekdays.includes(value) && !Constants.SimpleCharacterRegex.test(value)) {
      throw new Error(`${value} is not valid. Please use 0-9, "-", "*", ${Constants.AllowedWeekdays.join(', ')}`);
    }
  }

  // If the "measurementOfTime" is not "month" or "dayOfTheWeek" just check for a valid character
  if (measurementOfTime !== 'month' && measurementOfTime !== 'dayOfTheWeek') {
    if (!Constants.SimpleCharacterRegex.test(value)) {
      throw new Error(`${value} is not a valid. Please use 0-9, "-" or "*".'`);
    }
  }

  if (!isNaN(value)) {
    value = value + '';
  }

  if (value !== '*') {
    if (value.indexOf('-') >= 0) {
      let range = value.split('-');

      if (typeof range[0] === 'undefined') {
        throw new Error('Invalid range. Please specify a minimum.');
      }

      if (typeof range[1] === 'undefined') {
        throw new Error('Invalid range. Please specify a minimum.');
      }

      // Check if they are numeric or are identifierer strings.
      if (typeof range[0] !== 'string' && typeof range[1] !== 'string') {
        // Check the Minimum and Maximum

        if (range[0] < Constants.MeasurementsOfTime[measurementOfTime].min) {
          throw new Error(
            `${range[0]} is too small for "${measurementOfTime}" range. Minimum value is: ${Constants.MeasurementsOfTime[measurementOfTime].min}`,
          );
        }

        if (range[1] > Constants.MeasurementsOfTime[measurementOfTime].max) {
          throw new Error(
            `${range[1]} is too big for "${measurementOfTime}" range. Maximum value is: ${Constants.MeasurementsOfTime[measurementOfTime].max}`,
          );
        }
      } else {
        // Check if the upper and lower part of the range are either a valid month or a valid weekday
        if (!Constants.AllowedWeekdays.includes(range[0])) {
          if (!Constants.AllowedMonths.includes(range[0])) {
            throw new Error(
              `${range[0]} is an not allowed month. Please try use one of these: ${Constants.AllowedMonths.join(', ')}`,
            );
          } else {
            throw new Error(
              `${range[0]} is an not allowed weekday. Please try use one of these: ${Constants.AllowedWeekdays.join(
                ', ',
              )}`,
            );
          }
        }

        if (!Constants.AllowedWeekdays.includes(range[1])) {
          if (!Constants.AllowedMonths.includes(range[1])) {
            throw new Error(
              `${range[1]} is an not allowed month. Please try use one of these: ${Constants.AllowedMonths.join(', ')}`,
            );
          } else {
            throw new Error(
              `${range[1]} is an not allowed weekday. Please try use one of these: ${Constants.AllowedWeekdays.join(
                ', ',
              )}`,
            );
          }
        }

        // The upper and lower part of the range are both either an valid weekday or month.
        // Check which case applies and check the corresponding part to be an month or an weekday too.
        if (Constants.AllowedWeekday.includes(range[0])) {
          if (!Constants.AllowedWeekday.includes(range[1])) {
            throw new Error(
              'The upper part of the range is not an valid weekday but the lower part is. Both need to be an valid weekday.',
            );
          }

          // Could be an valid month
          if (Constants.AllowedMonths.includes(range[1])) {
            if (!Constants.AllowedMonths.includes(range[0])) {
              throw new Error(
                'The lower part of the range is not an valid month but the upper part is. Both need to be an valid month.',
              );
            }
          }
        }

        if (Constants.AllowedMonths.includes(range[0])) {
          if (!Constants.AllowedMonths.includes(range[1])) {
            throw new Error(
              'The upper part of the range is not an valid month but the lower part is. Both need to be an valid month.',
            );
          }

          // Could be an valid weekday
          if (Constants.AllowedWeekday.includes(range[1])) {
            if (!Constants.AllowedWeekday.includes(range[0])) {
              throw new Error(
                'The lower part of the range is not an valid weekday but the upper part is. Both need to be an valid weekday.',
              );
            }
          }
        }
      }
    }

    // Check if value is not a list, if not it's a single value
    if (!value.includes(',')) {
      if (parseInt(value) < Constants.MeasurementsOfTime[measurementOfTime].min) {
        throw new Error(
          `${value} is too small for "${measurementOfTime}" range. Minimum value is: ${Constants.MeasurementsOfTime[measurementOfTime].min}`,
        );
      }

      if (parseInt(value) > Constants.MeasurementsOfTime[measurementOfTime].max) {
        throw new Error(
          `${value} is too big for "${measurementOfTime}" range. Maximum value is: ${Constants.MeasurementsOfTime[measurementOfTime].max}`,
        );
      }
    }

    if (value.includes(',')) {
      // Value is a list
      const multiples = value.split(',');
      if (multiples.length) {
        multiples.forEach(function(multiple) {
          if (!Constants.SimpleCharacterRegex.test(value)) {
            if (multiple === '*') {
              throw new Error('"*" is not allowed in a list.');
            }

            if (measurementOfTime === 'month') {
              if (!Constants.AllowedMonths.includes(multiple)) {
                throw new Error(`${multiple} is not a valid value in a list of months.`);
              }
            }

            if (measurementOfTime === 'dayOfTheWeek') {
              if (!Constants.AllowedWeekdays.includes(value)) {
                throw new Error(`${multiple} is not a valid value in a list of weekdays.`);
              }
            }

            throw new Error(`${multiple} is not a valid value in a list.`);
          }
        });
      }
    }
  }
};

const CronValidator = {
  splitExpression,
  validateExpression,
  validateString,
  validateValue,
};

export { splitExpression, validateExpression, validateString, validateValue };
export default CronValidator;
