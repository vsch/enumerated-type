# enumerated-type

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Small utility library implementing enum types that can be used in switch statements, can have an
optional property used as the key for the enum values, have shared properties for all values and
each enum value can have own properties.

## Install

Use [npm](https://npmjs.com/) to install.

```sh
npm install enumerated-type --save
```

## Usage

[![NPM](https://nodei.co/npm/enumerated-type.png)](https://www.npmjs.com/package/enumerated-type)

Use `new Enum(enumName, keyPropName, values, commonProperties)` to define an enum for given
values. The property values of the `values` object can be objects/arrays/functions or
non-objects. If

```javascript
const Enum = require("enumerated-type");

const StepType = new Enum("StepType", "stepTypeId", {
    duty: { stepTypeId: 1, isDuty: true, },
    variable: { stepTypeId: 2, isVariable: true, },
    optional: { stepTypeId: 3, isOptional: true, },
    xor: { stepTypeId: 4, isGateway: true, isXor: true, },
    and: { stepTypeId: 5, isGateway: true, isAnd: true, },
    combineXor: { stepTypeId: 6, isGateway: true, isXor: true, isCombined: true, },
    combineAnd: { stepTypeId: 7, isGateway: true, isAnd: true, isCombined: true, },
}, {
    isDuty: false,
    isVariable: false,
    isOptional: false,
    isGateway: false,
    isXor: false,
    isAnd: false,
    isCombined: false,
});
```

`commonProperties` are used for each enum value for its prototype, therefore they provide a
default value when the enum value does not define the property directly:

```javascript
const values = [];
for (let value of StepType) {
    values.push({
        isAnd: value.isAnd,
        isCombined: value.isCombined,
        isDuty: value.isDuty,
        isGateway: value.isGateway,
        isOptional: value.isOptional,
        isVariable: value.isVariable,
        isXor: value.isXor,
        name: value.name,
        stepTypeId: value.stepTypeId,
    });
}

expect(values).toEqual([
    { "isAnd": false, "isCombined": false, "isDuty": true, "isGateway": false, "isOptional": false, "isVariable": false, "isXor": false, "name": "duty", "stepTypeId": 1, },
    { "isAnd": false, "isCombined": false, "isDuty": false, "isGateway": false, "isOptional": false, "isVariable": true, "isXor": false, "name": "variable", "stepTypeId": 2, },
    { "isAnd": false, "isCombined": false, "isDuty": false, "isGateway": false, "isOptional": true, "isVariable": false, "isXor": false, "name": "optional", "stepTypeId": 3, },
    { "isAnd": false, "isCombined": false, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": true, "name": "xor", "stepTypeId": 4, },
    { "isAnd": true, "isCombined": false, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": false, "name": "and", "stepTypeId": 5, },
    { "isAnd": false, "isCombined": true, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": true, "name": "combineXor", "stepTypeId": 6, },
    { "isAnd": true, "isCombined": true, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": false, "name": "combineAnd", "stepTypeId": 7, },
]);
```

Use enum values as property names:

```javascript
let obj = {};
obj['duty'] = "++duty";
obj[StepType.duty] = "--duty";
obj[StepType.variable] = "--variable";
obj[StepType.optional] = "--optional";
obj[StepType.xor] = "--xor";
obj[StepType.and] = "--and";
obj[StepType.combineXor] = "--combineXor";
obj[StepType.combineAnd] = "--combineAnd";

expect(obj.duty).toEqual('++duty');

let values = [];
StepType.forEach(value => {
    values.push(obj[value]);
});

expect(values).toEqual([
    "--duty",
    "--variable",
    "--optional",
    "--xor",
    "--and",
    "--combineXor",
    "--combineAnd",
]);
```

### Enum Instance Properties

* `.name` : name of the enum passed to constructor
* `.values` : array of enum values sorted by `keyPropName` if provided or by value if non-object
  values.
* `.keys` : array of enum key properties if keyPropName was passed to constructor, otherwise
  array of enum values which were not objects
* `[keyPropName](key)`: function taking key and returning enum value whose `keyPropName` equals
  the value of the key. Only defined if `keyPropName` is defined and is a string. Convenience
  method for converting key property value to an enum value.
* `.value(key)`: function taking the a value and returning enum value whose value equals the
  key. Only defined if `keyPropName` is not defined.
* `.forEach`: function (callback, defaultResult) taking a callback function(value, index,
  values) and optional default result if callback does not return `BREAK(result)` or
  `RETURN(result)`. see [for-each-break]
* `.map`: function (callback) taking a callback function(value, index, values) and returning
  array of values returned my callback, unless callback returns `BREAK(result)` or
  `RETURN(result)`. see [for-each-break]
* `.filter`: function (callback) taking a callback function(value, index, values) and returning
  array of values for which callback result tested true, unless callback returns `BREAK(result)`
  or `RETURN(result)`. see [for-each-break]
* `[Symbol.iterator]`: iterator over enum values
* `[Symbol.hasInstance]`: handles `instanceof` and returns true when left hand side is an enum
  value of this enum instance.
* `.toString`: returns `[object Enum(enumName)]`

### Enum Value Instance Properties

In addition to enum value properties passed for the value each enum value has the following
additional properties:

* `.enum`: parent enum instance.
* `.name`: name of the enum value (property name in values object passed to `Enum()`
  constructor.
* `.value`: Symbol(name) symbol instance for the property name of the enum value.
* `.index`: the enum value's index within enum instances values array.
* `.next`: enum value after this enum or `undefined` if last enum value.
* `.previous`: enum value before this enum or `undefined` if first enum value.
* `[Symbol.toPrimitive]`: returns `value` property for `string` or `default` hint, for `number`
  returns the enum value's index within enum instances values array.

Functions passed in as property values for enum value properties or `commonProperties` will have
`this` set to the enum value instance. Any functions which take no arguments (ie.
function.length === 0) will be converted to getters of the enum value instance and should not
use the function call syntax.

## License

MIT, see [LICENSE.md](http://github.com/vsch/enumerated-type/blob/master/LICENSE.md) for
details.

[for-each-break]: http://github.com/vsch/for-each-break/blob/master/README.md
