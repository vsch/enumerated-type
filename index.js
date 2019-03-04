'use strict';

const utilTypeFuncs = require('util-type-funcs');
const isFunction = utilTypeFuncs.isFunction;
const isString = utilTypeFuncs.isString;
const isValid = utilTypeFuncs.isValid;

const forEachBreak = require("for-each-break");
const BREAK = forEachBreak.BREAK;
const RETURN = forEachBreak.RETURN;
const forEach = forEachBreak.forEach;
const map = forEachBreak.map;
const filter = forEachBreak.filter;

const UNDEFINED = void 0;

/**
 * @return {string}
 */
function enumValueToString() {
    return `[Symbol: Symbol(${this.name}) ${JSON.stringify(this)}]`;
}

function deleteItem(arr, item) {
    const index = arr.indexOf(item);
    if (index >= 0) {
        arr.splice(index, 1);
    }
}

function enumValueFunc(enumInst, enumName, props) {
    const enumValue = function (name, value) {

        // Object.setPrototypeOf(this, props);
        Object.defineProperty(this, 'name', {
            value: name,
            writable: false,
            enumerable: true,
        });

        if (typeof value === "object") {
            const symbol = Symbol(name);
            Object.defineProperty(this, 'value', {
                value: symbol,
                writable: false,
                enumerable: false,
            });

            // // copy value props to enumValue
            const valueKeys = Object.keys(value);
            let j = valueKeys.length;
            while (j--) {
                const key = valueKeys[j];
                const valueElement = value[key];
                const propDescriptor = Object.getOwnPropertyDescriptor(value, key);
                if (isFunction(valueElement)) {
                    Object.defineProperty(this, key, Object.assign({}, propDescriptor, {
                        value: valueElement.bind(this),
                        configurable: false,
                    }));
                } else {
                    Object.defineProperty(this, key, Object.assign({}, propDescriptor, {
                        configurable: false,
                    }));
                }
            }
        } else {
            Object.defineProperty(this, 'value', {
                value: value,
                writable: false,
                enumerable: false,
            });
        }

        Object.freeze(this);
    };

    const propsProto = Object.create(props ? props : null);

    propsProto.enum = enumInst;
    propsProto.name = enumName;

    propsProto[Symbol.toPrimitive] = function (hint) {
        if (hint === 'number') return this.enum.values.indexOf(this);
        return this.value;
    };

    Object.defineProperties(propsProto, {
        index: {
            get: function () {
                return this.enum.values.indexOf(this);
            },
            enumerable: true,
        },
        next: {
            get: function () {
                const values = this.enum.values;
                const index = values.indexOf(this);
                return index >= 0 && index + 1 < values.length ? values[index + 1] : UNDEFINED;
            },
            enumerable: true,
        },
        previous: {
            get: function () {
                const values = this.enum.values;
                const index = values.indexOf(this);
                return index >= 1 && index < values.length ? values[index - 1] : UNDEFINED;
            },
            enumerable: true,
        },
    });

    Object.freeze(propsProto);

    enumValue.prototype = propsProto;
    return enumValue;
}

function Enum(enumName, values, valueProps, keyName = UNDEFINED, displayKeyName = UNDEFINED) {
    if (keyName !== UNDEFINED && keyName !== null && !isString(keyName)) {
        throw `IllegalArgument, keyName must be undefined, null or a string, got '${keyName}'`;
    }

    if (!isValid(keyName)) keyName = UNDEFINED;
    if (!isValid(displayKeyName)) displayKeyName = UNDEFINED;

    const enumValues = [];
    Object.defineProperty(this, 'name', {
        value: enumName,
        writable: false,
        enumerable: false,
    });

    const enumValueConstructor = enumValueFunc(this, enumName, valueProps);
    const names = Object.keys(values);

    // need to remove sample function converting key value to enum value
    if (keyName !== UNDEFINED) {
        deleteItem(names, "value");
        deleteItem(names, keyName);
    } else {
        deleteItem(names, "value");
        deleteItem(names, "key");
    }

    const keyNameValues = {};
    const dropdownValues = [];
    const iMax = names.length;
    let objectValues = 0;
    let nonObjectValues = 0;
    let functionValues = 0;
    for (let i = 0; i < iMax; i++) {
        const name = names[i];
        const value = values[name];

        if (!isFunction(value)) {
            const enumValue = new enumValueConstructor(name, value);

            if (keyName !== UNDEFINED) {
                if (value[keyName] === UNDEFINED) {
                    throw `IllegalArgument, key ${keyName} of each enum value cannot be undefined`;
                }

                if (keyNameValues[value[keyName]] !== UNDEFINED) {
                    throw `IllegalArgument, enum with ${keyName} of '${value[keyName]}' is already defined by ${keyNameValues[value[keyName]]._name}`;
                }
                keyNameValues[value[keyName]] = enumValue;
                if (displayKeyName !== UNDEFINED) {
                    dropdownValues.push({value: value[keyName], label: value[displayKeyName]});
                } else {
                    dropdownValues.push({value: value[keyName], label: name});
                }
            } else {
                if (value === UNDEFINED) {
                    throw `IllegalArgument, value of each enum value cannot be undefined`;
                }

                if (keyNameValues[value] !== UNDEFINED) {
                    throw `IllegalArgument, enum with value of '${value}' is already defined by ${keyNameValues[value]._name}`;
                }
                keyNameValues[value] = enumValue;
                if (displayKeyName !== UNDEFINED) {
                    dropdownValues.push({value: value, label: value[displayKeyName]});
                } else {
                    dropdownValues.push({value: value, label: name});
                }
            }

            Object.defineProperty(this, name, {
                value: enumValue,
                writable: false,
                enumerable: true,
            });

            if (typeof value === 'object') {
                objectValues++;
            } else {
                nonObjectValues++;
            }
            enumValues.push(enumValue);
        } else {
            Object.defineProperty(this, name, {
                value: value,
                writable: false,
                enumerable: false,
            });
            functionValues++;
        }
    }

    if (objectValues !== 0 && nonObjectValues !== 0) {
        // inconsistent value types
        throw `IllegalArgument, enum values must all be objects or all non-objects, got ${objectValues} object values, ${nonObjectValues} non-object values`;
    }

    if (keyName !== UNDEFINED) {
        enumValues.sort((a, b) => a[keyName] > b[keyName] ? 1 : -1);
    } else {
        enumValues.sort((a, b) => a.value > b.value ? 1 : -1);
    }

    Object.freeze(enumValues);

    Object.defineProperty(this, 'values', {
        value: enumValues,
        writable: false,
        enumerable: false,
    });

    Object.freeze(dropdownValues);

    Object.defineProperty(this, 'dropdownChoices', {
        value: dropdownValues,
        writable: false,
        enumerable: true,
    });

    if (keyName !== UNDEFINED) {
        Object.defineProperty(this, 'dropdownChoicesExcluding', {
            value: function () {
                if (arguments.length === 0) return dropdownValues;

                let result = [];
                const exclude = {};

                forEach.call(arguments, (arg) => {
                    const item = this.value(arg);
                    if (item) exclude[item[keyName]] = true;
                });

                forEach.call(dropdownValues, (item) => {
                    if (!exclude.hasOwnProperty(item.value)) {
                        result.push(item);
                    }
                });

                return result;
            },
            writable: false,
            enumerable: true,
        });

        const enumKeys = enumValues.map(value => value[keyName]);
        Object.freeze(enumKeys);

        Object.defineProperty(this, 'keys', {
            value: enumKeys,
            writable: false,
            enumerable: false,
        });

        // define property with keyName to return matching enumValue to the key
        Object.defineProperty(this, 'value', {
            value: function (key, defaultValue = UNDEFINED) {
                // allow values to be passed
                if (this.values.indexOf(key) !== -1) return key;

                return forEach.call(enumValues, (enumValue) => {
                    if (enumValue[keyName] === key) return BREAK(enumValue);
                }) || defaultValue;
            },
        });

        // define property with keyName to return matching enumValue to the key
        Object.defineProperty(this, keyName, {
            value: function (key) {
                // allow values to be passed
                if (this.values.indexOf(key) !== -1) return key[keyName];

                return forEach.call(enumValues, (enumValue) => {
                    if (enumValue[keyName] === key) return BREAK(enumValue[keyName]);
                }) || this.values[0][keyName];
            },
        });
    } else {
        Object.defineProperty(this, 'dropdownChoicesExcluding', {
            value: function () {
                if (arguments.length === 0) return dropdownValues;

                let result = [];
                const exclude = {};

                forEach.call(arguments, (arg) => {
                    const item = this.value(arg);
                    if (item) exclude[item.value] = true;
                });

                forEach.call(dropdownValues, (item) => {
                    if (!exclude.hasOwnProperty(item.value)) {
                        result.push(item);
                    }
                });

                return result;
            },
            writable: false,
            enumerable: true,
        });

        const enumKeys = enumValues.map(value => value.value);
        Object.defineProperty(this, 'keys', {
            value: enumKeys,
            writable: false,
            enumerable: false,
        });

        // define function value to return matching enumValue to the key
        Object.defineProperty(this, 'value', {
            value: function (key, defaultValue = UNDEFINED) {
                // allow values to be passed
                if (this.values.indexOf(key) !== -1) return key;

                return forEach.call(enumValues, (enumValue) => {
                    if (enumValue.value === key) return BREAK(enumValue);
                }) || defaultValue;
            },
        });

        // define function value to return matching enumValue to the key
        Object.defineProperty(this, 'key', {
            value: function (key) {
                // allow values to be passed
                if (this.values.indexOf(key) !== -1) return key;

                return forEach.call(enumValues, (enumValue) => {
                    if (enumValue.value === key) return BREAK(enumValue);
                }) || this.values[0];
            },
        });
    }

    Object.freeze(this);
}

Enum.prototype.forEach = function forEach(callback, thisArg, defaultValue) {
    return forEachBreak.forEach.call(this.values, callback, thisArg, defaultValue);
};

Enum.prototype.map = function map(callback, thisArg) {
    return forEachBreak.map.call(this.values, callback, thisArg);
};

Enum.prototype.filter = function filter(callback, thisArg) {
    return forEachBreak.filter.call(this.values, callback, thisArg);
};

Enum.prototype.forEachRight = function forEachRight(callback, thisArg, defaultValue) {
    return forEachBreak.forEachRight.call(this.values, callback, thisArg, defaultValue);
};

Enum.prototype.mapRight = function mapRight(callback, thisArg) {
    return forEachBreak.mapRight.call(this.values, callback, thisArg);
};

Enum.prototype.filterRight = function filterRight(callback, thisArg) {
    return forEachBreak.filterRight.call(this.values, callback, thisArg);
};

Enum.prototype[Symbol.iterator] = function iterator() {
    const enumValues = this.values;
    return (function* () {
        for (let i = 0; i < enumValues.length; i++) {
            yield enumValues[i];
        }
    })();
};

Enum.prototype[Symbol.hasInstance] = function hasInstance(instance) {
    return this.values.indexOf(instance) !== -1;
};

Enum.prototype.toString = function toString() {
    return '[object Enum(' + this.name + ')]';
};

module.exports = Enum;
