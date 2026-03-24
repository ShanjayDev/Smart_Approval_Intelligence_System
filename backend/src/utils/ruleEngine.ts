import ApprovalRequest from '../models/ApprovalRequest';
import ApprovalRule from '../models/ApprovalRule';

export async function evaluateRules(requestId: string): Promise<string> {
    const request = await ApprovalRequest.findById(requestId);
    if (!request) throw new Error('Request not found');

    const rules = await ApprovalRule.find({ isActive: true }).sort({
        priority: -1,
    });

    for (const rule of rules) {
        if (evaluateConditions(rule.conditions, request)) {
            return rule.action;
        }
    }

    return 'no-action';
}

function evaluateConditions(
    conditions: any[],
    request: any
): boolean {
    return conditions.every((condition) => {
        const value = (request as any)[condition.field];
        return evaluateCondition(value, condition.operator, condition.value);
    });
}

function evaluateCondition(
    value: any,
    operator: string,
    conditionValue: any
): boolean {
    switch (operator) {
        case 'equals':
            return value === conditionValue;
        case 'greater-than':
            return value > conditionValue;
        case 'less-than':
            return value < conditionValue;
        case 'in':
            return Array.isArray(conditionValue) && conditionValue.includes(value);
        case 'contains':
            return String(value).includes(String(conditionValue));
        default:
            return false;
    }
}
