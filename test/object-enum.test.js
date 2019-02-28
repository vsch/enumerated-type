"use strict";

const Enum = require("enumerated-type");

// NOTE: defining the enum using intermediate objects allows JetBrains IDEs completion to work better with enums and enum values
// common enum value properties, instance enum values can override these with their own definitions
const StepTypeValue = {
    stepTypeId: 0,
    isDuty: false,
    isVariable: false,
    isOptional: false,
    isGateway: false,
    isXor: false,
    isAnd: false,
    isCombined: false,
};

// NOTE: defining the enum using intermediate objects allows JetBrains IDEs completion to work better with enums and enum values
// enum value properties
let StepType = {
    duty: { stepTypeId: 1, isDuty: true, },
    variable: { stepTypeId: 2, isVariable: true, },
    optional: { stepTypeId: 3, isOptional: true, },
    xor: { stepTypeId: 4, isGateway: true, isXor: true, },
    and: { stepTypeId: 5, isGateway: true, isAnd: true, },
    combineXor: { stepTypeId: 6, isGateway: true, isXor: true, isCombined: true, },
    combineAnd: { stepTypeId: 7, isGateway: true, isAnd: true, isCombined: true, },

    stepTypeId(value) {
        return StepTypeValue;
    },

    customFunction(works) {
        return `Yes, it ${works}!`;
    },

    // see if this is passed
    listAllValues() {
        return this.values;
    },
};

// will use the name of the enum for display
StepType = new Enum("StepType", StepType, StepTypeValue, "stepTypeId");

console.log(StepType);
console.log('' + StepType);
console.log(StepType.duty);
console.log(+StepType.duty);
console.log((+StepType.duty) + 1);
console.log(typeof StepType.duty);

test('has all values in order of keys', () => {
    expect(StepType.values.map(enumValue => {
        return {
            name: enumValue.name,
            key: enumValue.stepTypeId,
            index: enumValue.index,
        }
    })).toEqual([
        { name: "duty", key: 1, index: 0 },
        { name: "variable", key: 2, index: 1 },
        { name: "optional", key: 3, index: 2 },
        { name: "xor", key: 4, index: 3 },
        { name: "and", key: 5, index: 4 },
        { name: "combineXor", key: 6, index: 5 },
        { name: "combineAnd", key: 7, index: 6 },
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
        // @formatter:off
        { "isAnd": false, "isCombined": false, "isDuty": true, "isGateway": false, "isOptional": false, "isVariable": false, "isXor": false, "name": "duty", "stepTypeId": 1, },
        { "isAnd": false, "isCombined": false, "isDuty": false, "isGateway": false, "isOptional": false, "isVariable": true, "isXor": false, "name": "variable", "stepTypeId": 2, },
        { "isAnd": false, "isCombined": false, "isDuty": false, "isGateway": false, "isOptional": true, "isVariable": false, "isXor": false, "name": "optional", "stepTypeId": 3, },
        { "isAnd": false, "isCombined": false, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": true, "name": "xor", "stepTypeId": 4, },
        { "isAnd": true, "isCombined": false, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": false, "name": "and", "stepTypeId": 5, },
        { "isAnd": false, "isCombined": true, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": true, "name": "combineXor", "stepTypeId": 6, },
        { "isAnd": true, "isCombined": true, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": false, "name": "combineAnd", "stepTypeId": 7, },
        // @formatter:on
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

test('can use map on enum', () => {
    let values;
    values = StepType.map(value => {
        switch (value) {
            case StepType.duty :
                return 'duty';
            case StepType.variable :
                return 'variable';
            case StepType.optional :
                return 'optional';
            case StepType.xor :
                return 'xor';
            case StepType.and :
                return 'and';
            case StepType.combineXor :
                return 'combineXor';
            case StepType.combineAnd :
                return 'combineAnd';
            default:
                return 'unknown';
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

test('enum values as indices equal their values', () => {
    let obj = {};
    obj[StepType.duty.value] = "++StepType.duty.value";
    obj[StepType.variable.value] = "++StepType.variable.value";
    obj[StepType.optional.value] = "++StepType.optional.value";
    obj[StepType.xor.value] = "++StepType.xor.value";
    obj[StepType.and.value] = "++StepType.and.value";
    obj[StepType.combineXor.value] = "++StepType.combineXor.value";
    obj[StepType.combineAnd.value] = "++StepType.combineAnd.value";
    obj[StepType.duty] = "--duty";
    obj[StepType.variable] = "--variable";
    obj[StepType.optional] = "--optional";
    obj[StepType.xor] = "--xor";
    obj[StepType.and] = "--and";
    obj[StepType.combineXor] = "--combineXor";
    obj[StepType.combineAnd] = "--combineAnd";

    expect(obj).toEqual({
        [StepType.duty]: "--duty",
        [StepType.variable]: "--variable",
        [StepType.optional]: "--optional",
        [StepType.xor]: "--xor",
        [StepType.and]: "--and",
        [StepType.combineXor]: "--combineXor",
        [StepType.combineAnd]: "--combineAnd"
    });

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

test('enum can have custom functions', () => {
    expect(StepType.customFunction('works')).toEqual("Yes, it works!");
});

test('enum can have custom functions with this resolved to enum', () => {
    expect(StepType.listAllValues()).toBe(StepType.values);
});

test('enum has dropdownChoices', () => {
    expect(StepType.dropdownChoices).toEqual([
        {value: 1, label: 'duty'},
        {value: 2, label: 'variable'},
        {value: 3, label: 'optional'},
        {value: 4, label: 'xor'},
        {value: 5, label: 'and'},
        {value: 6, label: 'combineXor'},
        {value: 7, label: 'combineAnd'},
    ]);
});


test('enum value() returns default', () => {
    expect(StepType.stepTypeId(10, StepType.and)).toBe(StepType.and);
});

test('enum value() returns key', () => {
    expect(StepType.stepTypeId(StepType.duty, StepType.and)).toBe(StepType.duty);
});
