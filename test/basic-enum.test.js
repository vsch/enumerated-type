"use strict";

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

test('has all values in order of keys', () => {
    expect(StepType.values.map(enumValue => {
        return {
            name: enumValue.name,
            key: enumValue.stepTypeId,
        }
    })).toEqual([
        { name: "duty", key: 1, },
        { name: "variable", key: 2, },
        { name: "optional", key: 3, },
        { name: "xor", key: 4, },
        { name: "and", key: 5, },
        { name: "combineXor", key: 6, },
        { name: "combineAnd", key: 7, },
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
    expect([1, 2, 3, 4, 5, 6, 7,].map(key => StepType.stepTypeId(key))).toEqual([
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
    obj[StepType.duty] = "--duty";
    obj[StepType.variable] = "--variable";
    obj[StepType.optional] = "--optional";
    obj[StepType.xor] = "--xor";
    obj[StepType.and] = "--and";
    obj[StepType.combineXor] = "--combineXor";
    obj[StepType.combineAnd] = "--combineAnd";

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

console.log(StepType);
console.log('' + StepType);
console.log(StepType.duty);
console.log(typeof StepType.duty);

