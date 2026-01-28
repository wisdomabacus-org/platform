import { OperatorType, Question, QuestionOption } from '../types/question-bank.types';

export interface GenerationConfig {
    count: number;
    digits: number;
    rows: number; // operands count
    operators: OperatorType[];
    allowNegative: boolean; // Intermediate results can be negative? Usually NO for beginners.
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNumber(digits: number): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    if (digits === 1) return getRandomInt(1, 9); // Avoid 0 for single digit usually
    return getRandomInt(min, max);
}

function generateOptions(correctAnswer: number): QuestionOption[] {
    // Generate 3 distractors
    const options: number[] = [correctAnswer];
    const range = Math.max(10, Math.abs(correctAnswer * 0.5));

    while (options.length < 4) {
        // Generate a random offset
        const offset = getRandomInt(1, range);
        const sign = Math.random() > 0.5 ? 1 : -1;
        const distractor = correctAnswer + (offset * sign);

        if (!options.includes(distractor)) {
            options.push(distractor);
        }
    }

    // Shuffle options
    const shuffled = options
        .map(val => ({ val, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((item, index) => ({
            text: item.val.toString(),
            index
        }));

    return shuffled;
}

export function generateBatchQuestions(config: GenerationConfig): Partial<Question>[] {
    const questions: Partial<Question>[] = [];

    for (let i = 0; i < config.count; i++) {
        // Pick an operator type for this specific question
        const operatorType = config.operators[Math.floor(Math.random() * config.operators.length)];

        let operationNumbers: number[] = [];
        let correctAnswer = 0;

        if (operatorType === 'multiplication') {
            const num1 = generateNumber(config.digits);
            // Typically multiplier is smaller or same digits. Let's keep it simple.
            const num2 = generateNumber(Math.max(1, config.digits > 2 ? 1 : config.digits));
            operationNumbers = [num1, num2];
            correctAnswer = num1 * num2;
        } else if (operatorType === 'division') {
            // Reverse multiplication to ensure integer result
            const divisor = generateNumber(1); // Single digit divisor usually used for practice
            const quotient = generateNumber(config.digits);
            const dividend = divisor * quotient;
            operationNumbers = [dividend, divisor];
            correctAnswer = quotient;
        } else {
            // Addition / Subtraction / Mixed
            // Default to 'mixed' logic if we have rows > 2

            let currentTotal = 0;
            const rows = Math.max(2, config.rows);

            for (let r = 0; r < rows; r++) {
                let num = generateNumber(config.digits);

                // First number always positive
                if (r === 0) {
                    currentTotal = num;
                    operationNumbers.push(num);
                    continue;
                }

                // Determine sign
                let isSubtract = false;

                if (operatorType === 'addition') {
                    isSubtract = false;
                } else if (operatorType === 'subtraction') {
                    // Abacus Subtraction usually implies mixed operations focused on subtraction skills,
                    // OR essentially "Mixed". Pure "A - B - C" is rare/boring. 
                    // The user requested "combinations of addition and subtraction".
                    isSubtract = Math.random() > 0.3; // 70% chance subtract, 30% add
                } else if (operatorType === 'mixed') {
                    isSubtract = Math.random() > 0.5; // 50/50
                }

                // Constraint: No Negative Intermediate Results (for beginners)
                if (!config.allowNegative && isSubtract) {
                    // If subtracting this number makes the running total negative, flip to addition
                    if (currentTotal - num < 0) {
                        isSubtract = false;
                    }
                }

                if (isSubtract) {
                    num = -num;
                }

                currentTotal += num;
                operationNumbers.push(num);
            }
            correctAnswer = currentTotal;
        }

        const options = generateOptions(correctAnswer);
        const correctIndex = options.findIndex(o => parseInt(o.text) === correctAnswer);

        questions.push({
            operations: operationNumbers,
            operatorType,
            correctAnswer,
            digits: config.digits,
            rowsCount: config.rows,
            options,
            correctOptionIndex: correctIndex,
            marks: 1,
            isAutoGenerated: true,
            sortOrder: i,
        });
    }

    return questions;
}
