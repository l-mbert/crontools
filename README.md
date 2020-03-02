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

## Pattern and Naming

I'm using [this Wikipedia Article](https://en.wikipedia.org/wiki/Cron) for reference.

**Pattern**

```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │                                   7 is also Sunday on some systems)
# │ │ │ │ │
# │ │ │ │ │
# * * * * * command to execute
```

**Naming of the measurements of time**

It's just using CamelCase for the name, but for clarification:

| Wikipedia        | Package       |
| ---------------- | ------------- |
| minute           | minute        |
| hour             | hour          |
| day of the month | dayOfTheMonth |
| month            | month         |
| day of the week  | dayOfTheWeek  |

---

## Using the Cronjob Timing Builder

```js
// If you are using ES6
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

### Building the current state

```js
cronTiming.build();
// returns: "45 6 12 JAN-DEC *"
```

---

## Using the Cronjob Timing Validator

**If the validation fails, the Validator will throw an Error.**

```js
// If you are using ES6
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
