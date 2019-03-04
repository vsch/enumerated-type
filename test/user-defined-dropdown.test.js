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
    duty: { stepTypeId: 1, isDuty: true, label: "Duty"},
    variable: { stepTypeId: 2, isVariable: true, label: "Variable"},
    optional: { stepTypeId: 3, isOptional: true, label: "Optional"},
    xor: { stepTypeId: 4, isGateway: true, isXor: true, label: "Xor"},
    and: { stepTypeId: 5, isGateway: true, isAnd: true, label: "And"},
    combineXor: { stepTypeId: 6, isGateway: true, isXor: true, isCombined: true, label: "Combine Xor"},
    combineAnd: { stepTypeId: 7, isGateway: true, isAnd: true, isCombined: true, label: "Combine And"},

    value(value) {
        return StepTypeValue;
    },

    stepTypeId(value) {
        return StepTypeValue.stepTypeId;
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
StepType = new Enum("StepType", StepType, StepTypeValue, "stepTypeId", "label");

test('enum has dropdownChoices', () => {
    expect(StepType.dropdownChoices).toEqual([
        {value: 1, label: "Duty"},
        {value: 2, label: "Variable"},
        {value: 3, label: "Optional"},
        {value: 4, label: "Xor"},
        {value: 5, label: "And"},
        {value: 6, label: "Combine Xor"},
        {value: 7, label: "Combine And"},
    ]);
});

test('enum has dropdownChoicesExcluding()', () => {
    expect(StepType.dropdownChoicesExcluding()).toEqual([
        {value: 1, label: 'Duty'},
        {value: 2, label: 'Variable'},
        {value: 3, label: 'Optional'},
        {value: 4, label: 'Xor'},
        {value: 5, label: 'And'},
        {value: 6, label: 'Combine Xor'},
        {value: 7, label: 'Combine And'},
    ]);
});

test('enum has dropdownChoicesExcluding()', () => {
    expect(StepType.dropdownChoicesExcluding(StepType.duty, StepType.variable)).toEqual([
        // {value: 1, label: 'Duty'},
        // {value: 2, label: 'Variable'},
        {value: 3, label: 'Optional'},
        {value: 4, label: 'Xor'},
        {value: 5, label: 'And'},
        {value: 6, label: 'Combine Xor'},
        {value: 7, label: 'Combine And'},
    ]);
});

test('enum has dropdownChoicesExcluding()', () => {
    expect(StepType.dropdownChoicesExcluding(StepType.duty, StepType.combineAnd)).toEqual([
        // {value: 1, label: 'Duty'},
        {value: 2, label: 'Variable'},
        {value: 3, label: 'Optional'},
        {value: 4, label: 'Xor'},
        {value: 5, label: 'And'},
        {value: 6, label: 'Combine Xor'},
        // {value: 7, label: 'Combine And'},
    ]);
});

test('enum has dropdownChoicesExcluding()', () => {
    expect(StepType.dropdownChoicesExcluding(StepType.optional, StepType.xor)).toEqual([
        {value: 1, label: 'Duty'},
        {value: 2, label: 'Variable'},
        // {value: 3, label: 'Optional'},
        // {value: 4, label: 'Xor'},
        {value: 5, label: 'And'},
        {value: 6, label: 'Combine Xor'},
        {value: 7, label: 'Combine And'},
    ]);
});

test('enum has dropdownChoicesExcluding()', () => {
    expect(StepType.dropdownChoicesExcluding(8, 9, 10)).toEqual([
        {value: 1, label: 'Duty'},
        {value: 2, label: 'Variable'},
        {value: 3, label: 'Optional'},
        {value: 4, label: 'Xor'},
        {value: 5, label: 'And'},
        {value: 6, label: 'Combine Xor'},
        {value: 7, label: 'Combine And'},
    ]);
});

