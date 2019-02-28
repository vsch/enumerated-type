"use strict";

const Enum = require("enumerated-type");

// NOTE: defining the enum using intermediate objects allows JetBrains IDEs completion to work better with enums and enum values
// common enum value properties
const StepTypeValue = {
    stepTypeId: "",
    get isDuty() { return this.value === "a"; },
    get isVariable() { return this.value === "b"; },
    get isOptional() { return this.value === "c"; },
    get isGateway() { return this.value >= "d"; },
    get isXor() { return this.value === "d" || this.value === "f"; },
    get isAnd() { return this.value === "e" || this.value === "g"; },
    get isCombined() { return this.value === "f" || this.value === "g"; },
};

// NOTE: defining the enum using intermediate objects allows JetBrains IDEs completion to work better with enums and enum values
// enum values
let StepType = {
    duty: "a",
    variable: "b",
    optional: "c",
    xor: "d",
    and: "e",
    combineXor: "f",
    combineAnd: "g",

    value(value, defaultValue = undefined) {
        return StepTypeValue;
    }
};

StepType = new Enum("StepType", StepType, StepTypeValue);

test('has all values in order of keys', () => {
    expect(StepType.values.map(enumValue => {
        return {
            name: enumValue.name,
            key: enumValue.value,
            index: enumValue.index,
        }
    })).toEqual([
        { name: "duty", key: "a", index: 0, },
        { name: "variable", key: "b", index: 1, },
        { name: "optional", key: "c", index: 2, },
        { name: "xor", key: "d", index: 3, },
        { name: "and", key: "e", index: 4, },
        { name: "combineXor", key: "f", index: 5, },
        { name: "combineAnd", key: "g", index: 6, },
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
            stepTypeId: value.value,
        });
    }

    expect(values).toEqual([
        // @formatter:off
        { "isAnd": false, "isCombined": false, "isDuty": true, "isGateway": false, "isOptional": false, "isVariable": false, "isXor": false, "name": "duty", "stepTypeId": "a", },
        { "isAnd": false, "isCombined": false, "isDuty": false, "isGateway": false, "isOptional": false, "isVariable": true, "isXor": false, "name": "variable", "stepTypeId": "b", },
        { "isAnd": false, "isCombined": false, "isDuty": false, "isGateway": false, "isOptional": true, "isVariable": false, "isXor": false, "name": "optional", "stepTypeId": "c", },
        { "isAnd": false, "isCombined": false, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": true, "name": "xor", "stepTypeId": "d", },
        { "isAnd": true, "isCombined": false, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": false, "name": "and", "stepTypeId": "e", },
        { "isAnd": false, "isCombined": true, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": true, "name": "combineXor", "stepTypeId": "f", },
        { "isAnd": true, "isCombined": true, "isDuty": false, "isGateway": true, "isOptional": false, "isVariable": false, "isXor": false, "name": "combineAnd", "stepTypeId": "g", },
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
    expect(StepType.keys).toEqual(["a", "b", "c", "d", "e", "f", "g",]);
});

test('all values can be found by keys', () => {
    expect(["a", "b", "c", "d", "e", "f", "g",].map(key => StepType.value(key))).toEqual([
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

test('enum values as property names equal their values', () => {
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
        "a": "--duty",
        "b": "--variable",
        "c": "--optional",
        "d": "--xor",
        "e": "--and",
        "f": "--combineXor",
        "g": "--combineAnd"
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


test('enum has dropdownChoices', () => {
    expect(StepType.dropdownChoices).toEqual([
        {value: "a", label: 'duty'},
        {value: "b", label: 'variable'},
        {value: "c", label: 'optional'},
        {value: "d", label: 'xor'},
        {value: "e", label: 'and'},
        {value: "f", label: 'combineXor'},
        {value: "g", label: 'combineAnd'},
    ]);
});


test('enum value() returns default', () => {
    expect(StepType.value("h", StepType.and)).toBe(StepType.and);
});
