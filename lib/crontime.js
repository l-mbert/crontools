'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/**
 * The default interval for an field in an expression
 * @constant
 * @type {Array.<string>}
 */
var DEFAULT_INTERVAL = ['*'];
/**
 * All measurements of time with the Minimum and Maximum value for that measurement
 * @constant
 * @type {{
        minute: Array.<string>,
        hour: Array.<string>,
        dayOfTheMonth: Array.<string>,
        month: Array.<string>,
        dayOfTheWeek: Array.<string>,
     * }}
 */

var MeasurementsOfTime = Object.freeze({
  minute: {
    min: 0,
    max: 59
  },
  hour: {
    min: 0,
    max: 23
  },
  dayOfTheMonth: {
    min: 1,
    max: 31
  },
  month: {
    min: 1,
    max: 12
  },
  dayOfTheWeek: {
    min: 0,
    max: 7
  }
});
/**
 * All names of measurements of time
 * @constant
 * @type {Array.<string>}
 */

var MeasurementsOfTimeNames = Object.keys(MeasurementsOfTime).map(function (measurementOfTime) {
  return measurementOfTime;
});
/**
 * The Regular Expression to check for the valid characters in a field in an expression which is not an range or an list
 * @constant
 * @type {RegExp}
 */

var SimpleCharacterRegex = new RegExp(/^[0-9]{1,2}|[-*]/);
/**
 * All allowed abbreviations for weekdays
 * @constant
 * @type {Array.<string>}
 */

var AllowedWeekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
/**
 * All allowed abbreviations for months
 * @constant
 * @type {Array.<string>}
 */

var AllowedMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

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

var splitExpression = function splitExpression(expression) {
  var splittedExpression = expression.split(' ');

  if (splittedExpression.length > 5) {
    throw new Error("Expression given is not a valid Cronjob Timing Expression. Expected 5 or less values, got: ".concat(splittedExpression.length, " instead."));
  }

  expression = {};
  Object.keys(splittedExpression).forEach(function (key, index) {
    expression[MeasurementsOfTimeNames[index]] = _toConsumableArray(splittedExpression[key] !== '*' ? splittedExpression[key].split(',') : '*');
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


var validateExpression = function validateExpression(expression) {
  if (!expression) {
    throw new Error('Missing argument: "expression".');
  }

  if (typeof expression === 'string') {
    expression = splitExpression(expression);
  }

  var expressionKeys = Object.keys(expression);

  if (expressionKeys.length > 5) {
    throw new Error("Expression given is not a valid Cronjob Timing Expression. Expected 5 or less values, got: ".concat(expressionKeys.length, " instead."));
  }
};
/**
 * Validates the given Cronjob expression
 * @param {string} expression - The Cronjob timing expression to validate
 * @throws {Error} if the string contains more than five fields.
 */


var validateString = function validateString(expression) {
  if (!expression) {
    throw new Error('Missing argument: "expression".');
  }

  expression = splitExpression(expression);
  Object.keys(expression).forEach(function (measurementOfTime) {
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


var validateValue = function validateValue(measurementOfTime, value) {
  if (!measurementOfTime) {
    throw new Error('Missing argument: "measurementOfTime".');
  }

  if (!value) {
    throw new Error('Missing argument: "value".');
  }

  if (!MeasurementsOfTimeNames.includes(measurementOfTime)) {
    throw new Error("".concat(measurementOfTime, " is not a valid Measurement of Time. Please try use one of these: ").concat(MeasurementsOfTimeNames.join(', ')));
  } // If the "measurementOfTime" is "month" we check if it's one of the Allowed Months or a valid character exists in it.


  if (measurementOfTime === 'month') {
    if (!AllowedMonths.includes(value) && !SimpleCharacterRegex.test(value)) {
      throw new Error("".concat(value, " is not valid. Please use 0-9, \"-\", \"*\", ").concat(AllowedMonths.join(', ')));
    }
  } // If the "measurementOfTime" is "dayOfTheWeek" we check if it's one of the Allowed Weekday or a valid character exists in it.


  if (measurementOfTime === 'dayOfTheWeek') {
    if (!AllowedWeekdays.includes(value) && !SimpleCharacterRegex.test(value)) {
      throw new Error("".concat(value, " is not valid. Please use 0-9, \"-\", \"*\", ").concat(AllowedWeekdays.join(', ')));
    }
  } // If the "measurementOfTime" is not "month" or "dayOfTheWeek" just check for a valid character


  if (measurementOfTime !== 'month' && measurementOfTime !== 'dayOfTheWeek') {
    if (!SimpleCharacterRegex.test(value)) {
      throw new Error("".concat(value, " is not a valid. Please use 0-9, \"-\" or \"*\".'"));
    }
  }

  if (!isNaN(value)) {
    value = value + '';
  }

  if (value !== '*' || value !== '?') {
    if (value.indexOf('-') >= 0) {
      var range = value.split('-');

      if (typeof range[0] === 'undefined') {
        throw new Error('Invalid range. Please specify a minimum.');
      }

      if (typeof range[1] === 'undefined') {
        throw new Error('Invalid range. Please specify a minimum.');
      } // Check if they are numeric or are identifierer strings.


      if (typeof range[0] !== 'string' && typeof range[1] !== 'string') {
        // Check the Minimum and Maximum
        if (range[0] < MeasurementsOfTime[measurementOfTime].min) {
          throw new Error("".concat(range[0], " is too small for \"").concat(measurementOfTime, "\" range. Minimum value is: ").concat(MeasurementsOfTime[measurementOfTime].min));
        }

        if (range[1] > MeasurementsOfTime[measurementOfTime].max) {
          throw new Error("".concat(range[1], " is too big for \"").concat(measurementOfTime, "\" range. Maximum value is: ").concat(MeasurementsOfTime[measurementOfTime].max));
        }
      } else {
        // Check if the upper and lower part of the range are either a valid month or a valid weekday
        if (!AllowedWeekdays.includes(range[0])) {
          if (!AllowedMonths.includes(range[0])) {
            throw new Error("".concat(range[0], " is an not allowed month. Please try use one of these: ").concat(AllowedMonths.join(', ')));
          } else {
            throw new Error("".concat(range[0], " is an not allowed weekday. Please try use one of these: ").concat(AllowedWeekdays.join(', ')));
          }
        }

        if (!AllowedWeekdays.includes(range[1])) {
          if (!AllowedMonths.includes(range[1])) {
            throw new Error("".concat(range[1], " is an not allowed month. Please try use one of these: ").concat(AllowedMonths.join(', ')));
          } else {
            throw new Error("".concat(range[1], " is an not allowed weekday. Please try use one of these: ").concat(AllowedWeekdays.join(', ')));
          }
        } // The upper and lower part of the range are both either an valid weekday or month.
        // Check which case applies and check the corresponding part to be an month or an weekday too.


        if (AllowedWeekdays.includes(range[0])) {
          if (!AllowedWeekdays.includes(range[1])) {
            throw new Error('The upper part of the range is not an valid weekday but the lower part is. Both need to be an valid weekday.');
          } // Could be an valid month


          if (AllowedMonths.includes(range[1])) {
            if (!AllowedMonths.includes(range[0])) {
              throw new Error('The lower part of the range is not an valid month but the upper part is. Both need to be an valid month.');
            }
          }
        }

        if (AllowedMonths.includes(range[0])) {
          if (!AllowedMonths.includes(range[1])) {
            throw new Error('The upper part of the range is not an valid month but the lower part is. Both need to be an valid month.');
          } // Could be an valid weekday


          if (AllowedWeekdays.includes(range[1])) {
            if (!AllowedWeekdays.includes(range[0])) {
              throw new Error('The lower part of the range is not an valid weekday but the upper part is. Both need to be an valid weekday.');
            }
          }
        }
      }
    } // Check if value is not a list, if not it's a single value


    if (!value.includes(',')) {
      if (parseInt(value) < MeasurementsOfTime[measurementOfTime].min) {
        throw new Error("".concat(value, " is too small for \"").concat(measurementOfTime, "\" range. Minimum value is: ").concat(MeasurementsOfTime[measurementOfTime].min));
      }

      if (parseInt(value) > MeasurementsOfTime[measurementOfTime].max) {
        throw new Error("".concat(value, " is too big for \"").concat(measurementOfTime, "\" range. Maximum value is: ").concat(MeasurementsOfTime[measurementOfTime].max));
      }
    }

    if (value.includes(',')) {
      // Value is a list
      var multiples = value.split(',');

      if (multiples.length) {
        multiples.forEach(function (multiple) {
          if (!SimpleCharacterRegex.test(value)) {
            if (multiple === '*') {
              throw new Error('"*" is not allowed in a list.');
            }

            if (measurementOfTime === 'month') {
              if (!AllowedMonths.includes(multiple)) {
                throw new Error("".concat(multiple, " is not a valid value in a list of months."));
              }
            }

            if (measurementOfTime === 'dayOfTheWeek') {
              if (!AllowedWeekdays.includes(value)) {
                throw new Error("".concat(multiple, " is not a valid value in a list of weekdays."));
              }
            }

            throw new Error("".concat(multiple, " is not a valid value in a list."));
          }
        });
      }
    }
  }
};

var CronValidator = {
  splitExpression: splitExpression,
  validateExpression: validateExpression,
  validateString: validateString,
  validateValue: validateValue
};

var CronBuilder = function CronBuilder(initalExpression) {
  var _this = this;

  _classCallCheck(this, CronBuilder);

  _defineProperty(this, "build", function () {
    return [_this.expression.minute.join(','), _this.expression.hour.join(','), _this.expression.dayOfTheMonth.join(','), _this.expression.month.join(','), _this.expression.dayOfTheWeek.join(',')].join(' ');
  });

  _defineProperty(this, "addValue", function (measurementOfTime, value) {
    CronValidator.validateValue(measurementOfTime, value); // If value is an Asterisk, replace all other values and only set the Asterisk

    if (_this.expression[measurementOfTime].length === 1 && _this.expression[measurementOfTime][0] === '*') {
      _this.expression[measurementOfTime] = [value];
    } else {
      // If value does not already exists in the "measurementOfTime"
      if (!_this.expression[measurementOfTime].includes(value)) {
        _this.expression[measurementOfTime].push(value);
      }
    }
  });

  _defineProperty(this, "removeValue", function (measurementOfTime, value) {
    CronValidator.validateValue(measurementOfTime, value);

    if (_this.expression[measurementOfTime].length === 1 && _this.expression[measurementOfTime][0] === '*') {
      throw new Error("The default interval for \"".concat(measurementOfTime, "\" is \"*\", won't change."));
    } // Filter out the to remove value


    _this.expression[measurementOfTime] = _this.expression[measurementOfTime].filter(function (field) {
      return value !== field;
    }); // If there is now nothing left, set to Asterisk

    if (!_this.expression[measurementOfTime].length) {
      _this.expression[measurementOfTime] = DEFAULT_INTERVAL;
    }
  });

  _defineProperty(this, "get", function (measurementOfTime) {
    if (!_this.expression[measurementOfTime]) {
      throw new Error("".concat(measurementOfTime, " is not a valid Measurement of Time. Please try one of these: ").concat(MeasurementsOfTimeNames.join(', ')));
    }

    return _this.expression[measurementOfTime].join(',');
  });

  _defineProperty(this, "getAll", function () {
    return _this.expression;
  });

  _defineProperty(this, "set", function (measurementOfTime, value) {
    if (!Array.isArray(value)) {
      throw new TypeError("Value needs to be an Array. Got \"".concat(_typeof(value), "\" instead."));
    }

    value.forEach(function (field) {
      CronValidator.validateValue(measurementOfTime, field);
    });
    _this.expression[measurementOfTime] = value;
    return _this.expression[measurementOfTime].join(',');
  });

  _defineProperty(this, "setAll", function (expression) {
    CronValidator.validateExpression(expression);
    _this.expression = expression;
  });

  if (initalExpression) {
    CronValidator.validateExpression(initalExpression);
    this.expression = CronValidator.splitExpression(initalExpression);
  } else {
    this.expression = {
      minute: DEFAULT_INTERVAL,
      hour: DEFAULT_INTERVAL,
      dayOfTheMonth: DEFAULT_INTERVAL,
      month: DEFAULT_INTERVAL,
      dayOfTheWeek: DEFAULT_INTERVAL
    };
  }
}
/**
 * Builds a valid Cronjob Timing Expression
 * @returns {string} - Cronjob Timing Expression
 */
;

module.exports = CronBuilder;

exports.CronBuilder = CronBuilder;
exports.CronValidator = CronValidator;
exports.default = CronBuilder;
