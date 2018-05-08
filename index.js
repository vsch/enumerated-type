'use strict';

const isFunction = require("lodash.isfunction");
const forEachBreak = require("for-each-break");
const BREAK = forEachBreak.BREAK;
const RETURN = forEachBreak.RETURN;
const forEach = forEachBreak.forEach;
const map = forEachBreak.map;
const filter = forEachBreak.filter;

const UNDEFINED = void 0;

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

    props = Object.create(props ? props : null);
    props.constructor = Symbol;
    props.enum = this;

    const names = Object.keys(values);
    const keyNameValues = {};
    const iMax = names.length;
    for (let i = 0; i < iMax; i++) {
        const name = names[i];
        const value = values[name];

        const symbol = Symbol(name);
        const enumValue = Object(symbol);
        enumValue.__proto__ = props;

        Object.defineProperty(enumValue, 'name', {
            value: name,
            writable: false,
            enumerable: true,
        });

        if (keyName !== UNDEFINED) {
            if (value[keyName] === UNDEFINED) {
                throw `IllegalArgument, key ${keyName} of each enum value cannot be undefined`;
            }

            if (keyNameValues[value[keyName]] !== UNDEFINED) {
                throw `IllegalArgument, enum with ${keyName} of '${value[keyName]}' is already defined by ${keyNameValues[value[keyName]]._name}`;
            }
            keyNameValues[value[keyName]] = enumValue;
        }

        // copy value props to enumValue
        const valueKeys = Object.keys(value);
        let j = valueKeys.length;
        while (j--) {
            let key = valueKeys[j];
            const valueElement = value[key];
            enumValue[key] = isFunction(valueElement) ? valueElement.bind(enumValue) : valueElement;
        }

        Object.freeze(enumValue);

        Object.defineProperty(this, name, {
            value: enumValue,
            writable: false,
            enumerable: true,
        });

        enumValues.push(enumValue);
    }

    enumValues.sort((a, b) => a[keyName] > b[keyName] ? 1 : -1);
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

Enum.prototype[Symbol.toStringTag] = function toString() {
    return this.name;
};

module.exports = Enum;
