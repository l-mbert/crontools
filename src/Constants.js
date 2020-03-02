/**
 * The default interval for an field in an expression
 * @constant
 * @type {Array.<string>}
 */
export const DEFAULT_INTERVAL = ['*'];

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
export const MeasurementsOfTime = Object.freeze({
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfTheMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfTheWeek: { min: 0, max: 7 },
});

/**
 * All names of measurements of time
 * @constant
 * @type {Array.<string>}
 */
export const MeasurementsOfTimeNames = Object.keys(MeasurementsOfTime).map(measurementOfTime => measurementOfTime);

/**
 * The Regular Expression to check for the valid characters in a field in an expression which is not an range or an list
 * @constant
 * @type {RegExp}
 */
export const SimpleCharacterRegex = new RegExp(/^[0-9]{1,2}|[-*]/);

/**
 * All allowed abbreviations for weekdays
 * @constant
 * @type {Array.<string>}
 */
export const AllowedWeekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * All allowed abbreviations for months
 * @constant
 * @type {Array.<string>}
 */
export const AllowedMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
