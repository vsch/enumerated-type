// 'use strict';

const isFunction = require("lodash.isfunction");
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
            Object.defineProperty(this, '_value', {
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
                if (isFunction(valueElement) && valueElement.length === 0) {
                    Object.defineProperty(this, key, {
                        get: valueElement,
                    });
                } else {
                    this[key] = isFunction(valueElement) ? valueElement.bind(this) : valueElement;
                }
            }
        } else {
            Object.defineProperty(this, '_value', {
                value: value,
                writable: false,
                enumerable: false,
            });
        }

        Object.freeze(this);
    };

    const propsProto = Object.create(props ? props : null);

    // convert functions without arguments to getters
    const propKeys = Object.keys(props);
    let i = propKeys.length;
    while (i--) {
        const propKey = propKeys[i];
        const propValue = propsProto[propKey];
        if (isFunction(propValue) && propValue.length === 0) {
            Object.defineProperty(propsProto.__proto__, propKey, {
                get: propValue,
            });
        }
    }

    propsProto.enum = enumInst;
    propsProto.name = enumName;

    propsProto[Symbol.toPrimitive] = function (hint) {
        if (hint === 'number') return this.enum.values.indexOf(this);
        return this._value;
    };

    Object.defineProperty(propsProto, 'index', {
        get: function () {
            return this.enum.values.indexOf(this);
        },
        enumerable: true,
    });

    Object.defineProperty(propsProto, 'next', {
        get: function () {
            const values = this.enum.values;
            const index = values.indexOf(this);
            return index >= 0 && index + 1 < values.length ? values[index + 1] : UNDEFINED;
        },
        enumerable: true,
    });

    Object.defineProperty(propsProto, 'previous', {
        get: function () {
            const values = this.enum.values;
            const index = values.indexOf(this);
            return index >= 1 && index < values.length ? values[index - 1] : UNDEFINED;
        },
        enumerable: true,
    });

    Object.freeze(propsProto);

    enumValue.prototype = propsProto;
    return enumValue;
}

function Enum(enumName, keyName, values, props) {
    if (keyName !== UNDEFINED && (typeof keyName !== "string" || keyName === '')) {
        throw `IllegalArgument, keyName must be undefined or a non-empty string, got '${keyName}'`;
    }

    const enumValues = [];
    Object.defineProperty(this, 'name', {
        value: enumName,
        writable: false,
        enumerable: false,
    });

    const enumValueConstructor = enumValueFunc(this, enumName, props);
    const names = Object.keys(values);
    const keyNameValues = {};
    const iMax = names.length;
    let objectValues = 0;
    let nonObjectValues = 0;
    let functionValues = 0;
    for (let i = 0; i < iMax; i++) {
        const name = names[i];
        const value = values[name];

        const enumValue = new enumValueConstructor(name, value);

        if (keyName !== UNDEFINED) {
            if (value[keyName] === UNDEFINED) {
                throw `IllegalArgument, key ${keyName} of each enum value cannot be undefined`;
            }

            if (keyNameValues[value[keyName]] !== UNDEFINED) {
                throw `IllegalArgument, enum with ${keyName} of '${value[keyName]}' is already defined by ${keyNameValues[value[keyName]]._name}`;
            }
            keyNameValues[value[keyName]] = enumValue;
        } else {
            if (value === UNDEFINED) {
                throw `IllegalArgument, value of each enum value cannot be undefined`;
            }

            if (keyNameValues[value] !== UNDEFINED) {
                throw `IllegalArgument, enum with value of '${value}' is already defined by ${keyNameValues[value]._name}`;
            }
            keyNameValues[value] = enumValue;
        }

        Object.defineProperty(this, name, {
            value: enumValue,
            writable: false,
            enumerable: true,
        });

        if (typeof value === 'object') {
            if (isFunction(value)) {
                functionValues++;
            } else {
                objectValues++;
            }
        } else {
            nonObjectValues++;
        }

        enumValues.push(enumValue);
    }

    if (objectValues !== 0 && nonObjectValues !== 0) {
        // inconsistent value types
        throw `IllegalArgument, enum values must all be objects or all non-objects, got ${objectValues} object values, ${nonObjectValues} non-object values`;
    }

    if (keyName !== UNDEFINED) {
        enumValues.sort((a, b) => a[keyName] > b[keyName] ? 1 : -1);
    } else {
        enumValues.sort((a, b) => a._value > b._value ? 1 : -1);
    }

    Object.freeze(enumValues);

    Object.defineProperty(this, 'values', {
        value: enumValues,
        writable: false,
        enumerable: false,
    });

    if (keyName !== UNDEFINED) {
        const enumKeys = enumValues.map(value => value[keyName]);
        Object.freeze(enumKeys);

        Object.defineProperty(this, 'keys', {
            value: enumKeys,
            writable: false,
            enumerable: false,
        });

        // define property with keyName to return matching enumValue to the key
        Object.defineProperty(this, keyName, {
            value: function (key) {
                return forEach.call(enumValues, (enumValue) => {
                    if (enumValue[keyName] === key) return BREAK(enumValue);
                });
            },
        });
    } else {
        const enumKeys = enumValues.map(value => value._value);
        Object.defineProperty(this, 'keys', {
            value: enumKeys,
            writable: false,
            enumerable: false,
        });

        // define property with value to return matching enumValue to the key
        Object.defineProperty(this, 'value', {
            value: function (key) {
                return forEach.call(enumValues, (enumValue) => {
                    if (enumValue._value === key) return BREAK(enumValue);
                });
            },
        });
    }

    Object.freeze(this);
}

Enum.prototype.forEach = function forEach(callback, defaultValue) {
    return forEachBreak.forEach.call(this.values, callback, defaultValue)
};

Enum.prototype.map = function map(callback) {
    return forEachBreak.map.call(this.values, callback)
};

Enum.prototype.filter = function filter(callback) {
    return forEachBreak.filter.call(this.values, callback)
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
