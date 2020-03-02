/**
 * CronBuilder
 * Build and manipulate Cronjob Timings
 */

import * as Constants from './Constants';
import CronValidator from './CronValidator';

class CronBuilder {
  constructor(initalExpression) {
    if (initalExpression) {
      CronValidator.validateExpression(initalExpression);
      this.expression = CronValidator.splitExpression(initalExpression);
    } else {
      this.expression = {
        minute: Constants.DEFAULT_INTERVAL,
        hour: Constants.DEFAULT_INTERVAL,
        dayOfTheMonth: Constants.DEFAULT_INTERVAL,
        month: Constants.DEFAULT_INTERVAL,
        dayOfTheWeek: Constants.DEFAULT_INTERVAL,
      };
    }
  }

  /**
   * Builds a valid Cronjob Timing Expression
   * @returns {string} - Cronjob Timing Expression
   */
  build = () => {
    return [
      this.expression.minute.join(','),
      this.expression.hour.join(','),
      this.expression.dayOfTheMonth.join(','),
      this.expression.month.join(','),
      this.expression.dayOfTheWeek.join(','),
    ].join(' ');
  };

  /**
   * Adds a value in the "measurementOfTime", if it's an Asterisk it replaces it.
   * @param {string} measurementOfTime - An valid measurement of time for a CronJob to add to
   * @param {string|number} value - The value to add to the "measurementOfTime".
   * @throws {Error} If the "measurementOfTime" or "value" for the corresponding "measurementOfTime" fails validation.
   */
  addValue = (measurementOfTime, value) => {
    CronValidator.validateValue(measurementOfTime, value);

    // If value is an Asterisk, replace all other values and only set the Asterisk
    if (this.expression[measurementOfTime].length === 1 && this.expression[measurementOfTime][0] === '*') {
      this.expression[measurementOfTime] = [value];
    } else {
      // If value does not already exists in the "measurementOfTime"
      if (!this.expression[measurementOfTime].includes(value)) {
        this.expression[measurementOfTime].push(value);
      }
    }
  };

  /**
   * Removes a single value from the expression, if none a left, value will be replaced by an Asterisk
   * @param {string} measurementOfTime - An valid measurement of time for a CronJob to remove from
   * @param {string|number} value - The value to remove from the "measurementOfTime".
   * @throws {Error} If the "measurementOfTime" or "value" for the corresponding "measurementOfTime" fails validation.
   */
  removeValue = (measurementOfTime, value) => {
    CronValidator.validateValue(measurementOfTime, value);

    if (this.expression[measurementOfTime].length === 1 && this.expression[measurementOfTime][0] === '*') {
      throw new Error(`The default interval for "${measurementOfTime}" is "*", won't change.`);
    }

    // Filter out the to remove value
    this.expression[measurementOfTime] = this.expression[measurementOfTime].filter(field => {
      return value !== field;
    });

    // If there is now nothing left, set to Asterisk
    if (!this.expression[measurementOfTime].length) {
      this.expression[measurementOfTime] = Constants.DEFAULT_INTERVAL;
    }
  };

  /**
   * Returns the current state of the "measurementOfTime"
   * @param {string} measurementOfTime - An valid measurement of time for a CronJob
   * @returns {string} Comma seperated string of interval for the corresponding "measurementOfTime"
   * @throws {Error} If the "measurementOfTime" is not a valid measurement of time for a Cronjob
   */
  get = measurementOfTime => {
    if (!this.expression[measurementOfTime]) {
      throw new Error(
        `${measurementOfTime} is not a valid Measurement of Time. Please try one of these: ${Constants.MeasurementsOfTimeNames.join(
          ', ',
        )}`,
      );
    }

    return this.expression[measurementOfTime].join(',');
  };

  /**
   * Returns the Expression as an Object
   * @returns {{
    minute: Array.string,
    hour: Array.string,
    dayOfTheMonth: Array.string,
    month: Array.string,
    dayOfTheWeek: Array.string,
   * }}
   */
  getAll = () => {
    return this.expression;
  };

  /**
   * Sets the "measurementOfTime" to the corresponding "value"
   * @param {string} measurementOfTime - - An valid measurement of time for a CronJob to set to
   * @param {Array.<string>} value - The value to set the "measurementOfTime" to.
   * @returns {string} Comma seperated string of interval for the corresponding "measurementOfTime"
   * @throws {TypeError} If "value" is not an Array&lt;String&gt;
   * @throws {Error} If any item in "value" is not a valid Cronjob field
   */
  set = (measurementOfTime, value) => {
    if (!Array.isArray(value)) {
      throw new TypeError(`Value needs to be an Array. Got "${typeof value}" instead.`);
    }

    value.forEach(function(field) {
      CronValidator.validateValue(measurementOfTime, field);
    });

    this.expression[measurementOfTime] = value;

    return this.expression[measurementOfTime].join(',');
  };

  /**
   * Overwrite the complete Cronjob expression.
   * @param {!{
    minute: Array.<string>,
    hour: Array.<string>,
    dayOfTheMonth: Array.<string>,
    month: Array.<string>,
    dayOfTheWeek: Array.<string>,
   * }} expression - An object to validate
   * @throws {Error} If the validation for the Expression goes wrong
   */
  setAll = expression => {
    CronValidator.validateExpression(expression);

    this.expression = expression;
  };
}

export default CronBuilder;
