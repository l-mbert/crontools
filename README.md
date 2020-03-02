# Crontime

An Package to manipulate, build and validate Cronjob Timings.

---

## Adding this Package

**Using npm**

```sh
# npm install crontime
```

**Using yarn**

```sh
# yarn add crontime
```

---

## Using the Cronjob Timing Builder

```js
// If you are using ES&
import CronBuilder from 'crontime';
// If you are using ES5
var CronBuilder = require('crontime');
// ...

var cronTiming = new CronBuilder();
```

### Adding an Value

```js
cronTiming.addValue('minute', 5);
cronTiming.addValue('hour', 3);
cronTiming.addValue('dayOfTheMonth', 15);
cronTiming.addValue('month', 1);
cronTiming.addValue('month', 'JAN-APR');
cronTiming.addValue('month', 'SEP,NOV');
cronTiming.addValue('dayOfTheWeek', '4');
```

### Removing an Value

```js
cronTiming.removeValue('month', 'SEP,NOV');
```

### Getting an Value

```js
cronTiming.get('month');
// returns: "1,JAN-APR"
```

### Getting all Values as an object

```js
cronTiming.getAll();
/* returns:
{
  minute: ['5'],
  hour: ['3'],
  dayOfTheMonth: ['15'],
  month: ['1', 'JAN-APR'],
  dayOfTheWeek: ['4'],
}
*/
```

### Setting an Value

```js
cronTiming.set('minute', ['6', '30']);
// returns: "6,30"
```

### Setting all Values

```js
cronTiming.setAll({
  minute: ['45'],
  hour: ['6'],
  dayOfTheMonth: ['12'],
  month: ['JAN-DEC'],
  dayOfTheWeek: ['*'],
});
```

---

## Using the Cronjob Timing Validator

**If the validation fails, the Validator will throw an Error.**

```js
// If you are using ES&
import { CronValidator } from 'crontime';
// If you are using ES5
var { CronValidator } = require('crontime');
// ...
```

### Validating an Timing Expression

```js
CronValidator.validateExpression('* * 1 * *');
// or the object from earlier...
CronValidator.validateExpression({
  minute: ['45'],
  hour: ['6'],
  dayOfTheMonth: ['12'],
  month: ['JAN-DEC'],
  dayOfTheWeek: ['*'],
});
```

### Validating an Timing String explicitly

```js
CronValidator.validateString('* * 1 * *');
```

### Validating a single Timing Value

```js
CronValidator.validateValue('minute', 1);
```
