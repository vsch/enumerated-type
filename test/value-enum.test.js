"use strict";

const Enum = require("enumerated-type");

const StepTypeEnum = {
    duty: 1,
    variable: 2,
    optional: 3,
    xor: 4,
    and: 5,
    combineXor: 6,
    combineAnd: 7,
};

const StepType = new Enum("StepType", undefined, StepTypeEnum, {
    isDuty: function () { return this._value === 1; },
    isVariable: function () { return this._value === 2; },
    isOptional: function () { return this._value === 3; },
    isGateway: function () { return this._value >= 4; },
    isXor: function () { return this._value === 4 || this._value === 6; },
    isAnd: function () { return this._value === 5 || this._value === 7; },
    isCombined: function () { return this._value === 6 || this._value === 7; },
});

test('has all values in order of keys', () => {
    expect(StepType.values.map(enumValue => {
        return {
            name: enumValue.name,
            key: enumValue._value,
            index: enumValue.index,
        }
    })).toEqual([
        { name: "duty", key: 1, index: 0, },
        { name: "variable", key: 2, index: 1, },
        { name: "optional", key: 3, index: 2, },
        { name: "xor", key: 4, index: 3, },
        { name: "and", key: 5, index: 4, },
        { name: "combineXor", key: 6, index: 5, },
        { name: "combineAnd", key: 7, index: 6, },
    ]);
});

test('all values are enumerable', () => {
    const values = [];
    for (let value of StepType) {
        values.push(value);
    }

    expect(values).toEqual([
        StepType.duty, StepType.variable, StepType.optional, StepType.xor, StepType.and, StepType.combineXor, StepType.combineAnd
    ]);
});

test('all values have correct properties', () => {
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
            stepTypeId: value._value,
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
});

test('all values are instances of enum', () => {
    const values = [];
    for (let value of StepType) {
        expect(value instanceof StepType).toBe(true);
    }
});

test('all keys in keys', () => {
    expect(StepType.keys).toEqual([1, 2, 3, 4, 5, 6, 7,]);
});

test('all values can be found by keys', () => {
    expect([1, 2, 3, 4, 5, 6, 7,].map(key => StepType.value(key))).toEqual([
        StepType.duty,
        StepType.variable,
        StepType.optional,
        StepType.xor,
        StepType.and,
        StepType.combineXor,
        StepType.combineAnd,
    ]);
});

test('can switch on enum values', () => {
    let values = [];
    StepType.forEach(value => {
        switch (value) {
            case StepType.duty :
                values.push('duty');
                break;
            case StepType.variable :
                values.push('variable');
                break;
            case StepType.optional :
                values.push('optional');
                break;
            case StepType.xor :
                values.push('xor');
                break;
            case StepType.and :
                values.push('and');
                break;
            case StepType.combineXor :
                values.push('combineXor');
                break;
            case StepType.combineAnd :
                values.push('combineAnd');
                break;
            default:
                values.push('unknown');
                break;
        }
    });

    expect(values).toEqual([
        "duty",
        "variable",
        "optional",
        "xor",
        "and",
        "combineXor",
        "combineAnd",
    ]);
});

test('can test equals on enum values', () => {
    let values = [];
    StepType.forEach(value => {
        if (value === StepType.duty) values.push('duty');
        else if (value === StepType.variable) values.push('variable');
        else if (value === StepType.optional) values.push('optional');
        else if (value === StepType.xor) values.push('xor');
        else if (value === StepType.and) values.push('and');
        else if (value === StepType.combineXor) values.push('combineXor');
        else if (value === StepType.combineAnd) values.push('combineAnd');
        else values.push('unknown');
    });

    expect(values).toEqual([
        "duty",
        "variable",
        "optional",
        "xor",
        "and",
        "combineXor",
        "combineAnd",
    ]);
});

test('can use enum values as property names', () => {
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

});

test('enum values as property names equal their values', () => {
    let obj = {};
    obj[StepType.duty._value] = "++StepType.duty._value";
    obj[StepType.variable._value] = "++StepType.variable._value";
    obj[StepType.optional._value] = "++StepType.optional._value";
    obj[StepType.xor._value] = "++StepType.xor._value";
    obj[StepType.and._value] = "++StepType.and._value";
    obj[StepType.combineXor._value] = "++StepType.combineXor._value";
    obj[StepType.combineAnd._value] = "++StepType.combineAnd._value";
    obj[StepType.duty] = "--duty";
    obj[StepType.variable] = "--variable";
    obj[StepType.optional] = "--optional";
    obj[StepType.xor] = "--xor";
    obj[StepType.and] = "--and";
    obj[StepType.combineXor] = "--combineXor";
    obj[StepType.combineAnd] = "--combineAnd";

    expect(obj).toEqual({ "1": "--duty", "2": "--variable", "3": "--optional", "4": "--xor", "5": "--and", "6": "--combineXor", "7": "--combineAnd" });

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

});

test('enum values as array indices equal their values', () => {
    let obj = [];
    obj[StepType.duty._value] = "++StepType.duty._value";
    obj[StepType.variable._value] = "++StepType.variable._value";
    obj[StepType.optional._value] = "++StepType.optional._value";
    obj[StepType.xor._value] = "++StepType.xor._value";
    obj[StepType.and._value] = "++StepType.and._value";
    obj[StepType.combineXor._value] = "++StepType.combineXor._value";
    obj[StepType.combineAnd._value] = "++StepType.combineAnd._value";
    obj[StepType.duty] = "--duty";
    obj[StepType.variable] = "--variable";
    obj[StepType.optional] = "--optional";
    obj[StepType.xor] = "--xor";
    obj[StepType.and] = "--and";
    obj[StepType.combineXor] = "--combineXor";
    obj[StepType.combineAnd] = "--combineAnd";

    expect(obj).toEqual([undefined, "--duty", "--variable", "--optional", "--xor", "--and", "--combineXor", "--combineAnd"]);

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

});

test('enum value next is next enum value', () => {
    expect(StepType.duty.next).toEqual(StepType.variable);
    expect(StepType.variable.next).toEqual(StepType.optional);
    expect(StepType.optional.next).toEqual(StepType.xor);
    expect(StepType.xor.next).toEqual(StepType.and);
    expect(StepType.and.next).toEqual(StepType.combineXor);
    expect(StepType.combineXor.next).toEqual(StepType.combineAnd);
    expect(StepType.combineAnd.next).toEqual(undefined);
});

test('enum value previous is previous enum value', () => {
    expect(StepType.duty.previous).toEqual(undefined);
    expect(StepType.variable.previous).toEqual(StepType.duty);
    expect(StepType.optional.previous).toEqual(StepType.variable);
    expect(StepType.xor.previous).toEqual(StepType.optional);
    expect(StepType.and.previous).toEqual(StepType.xor);
    expect(StepType.combineXor.previous).toEqual(StepType.and);
    expect(StepType.combineAnd.previous).toEqual(StepType.combineXor);
});

