# Version History

[TOC]: # " "

- [0.5.12](#0512)
- [0.5.8](#058)
- [0.5.6](#056)
- [0.5.4](#054)
- [0.5.2](#052)
- [0.5.0](#050)
- [0.4.0](#040)
- [0.3.2](#032)
- [0.3.0](#030)
- [0.2.0](#020)
- [0.1.0](#010)


## 0.5.12

* Add: optional `defaultValue` parameter to `value(id, defaultValue = undefined)` or
  `[keyPropertyName](id, defaultValue = undefined)` to return if the passed in id does not match
  any enum value.

## 0.5.8

* Add: Enum.dropdownChoices to return array of `{label: xxx, value:yyy}` built from `keyName`
  values and `displayKeyName` values of the enum during construction. Useful for React Dropdown
  component `source` attribute.

## 0.5.6

* Add: Enum.value(arg) to return arg if it is already a value of the enum.

## 0.5.4

* Add: function properties in values object do not get added to the enum values but are added to
  the properties of the enum. Gives ability ot define custom static functions.

## 0.5.2

* Fix: update dependency versions

## 0.5.0

* Add: add `util-type-funcs` dependency
* Change: declaration format to use intermediate object to make enums and enum values more
  compatible with JetBrains code completion.

## 0.4.0

* Add: add reverse version of functions
* Change: add `thisArg` argument to match js forEach, map, filter.

## 0.3.2

* Change: allow null and empty string for keyName arg to mean undefined.

## 0.3.0

* Change: `_value` to `value` property for enum value `Symbol` or non-object value.

## 0.2.0

* Add: non-object enum value handling and tests

## 0.1.0

Initial release
