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

function generateNumber(digits: number, allowZero: boolean = false): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    if (digits === 1 && !allowZero) {
        return getRandomInt(1, 9); // Avoid 0 for single digit
    }
    return getRandomInt(min, max);
}

export function generateOptions(correctAnswer: number, randomness: number = 50): QuestionOption[] {
    // Generate 3 distractors
    const options: number[] = [correctAnswer];
    // Simple heuristic: range is roughly +/- randomness% of the answer, or at least 10 for small numbers
    const range = Math.max(10, Math.abs(correctAnswer * (randomness / 100)));

    while (options.length < 4) {
        // Generate a random offset
        const offset = getRandomInt(1, Math.round(range));
        const sign = Math.random() > 0.5 ? 1 : -1;
        const distractor = correctAnswer + (offset * sign);

        // Ensure distractors are positive and unique
        if (!options.includes(distractor) && distractor > 0) {
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
    let zeroCount = 0;
    const maxZeros = Math.max(1, Math.floor(config.count * 0.05)); // Allow at most 5% zeros

    for (let i = 0; i < config.count; i++) {
        // Pick an operator type for this specific question
        const operatorType = config.operators[Math.floor(Math.random() * config.operators.length)];

        let operationNumbers: number[] = [];
        let correctAnswer = 0;
        let attempts = 0;
        const maxAttempts = 10;

        const maxNum = Math.pow(10, config.digits) - 1;
        const minNum = config.digits === 1 ? 1 : Math.pow(10, config.digits - 1);

        if (operatorType === 'multiplication') {
            const num1 = generateNumber(config.digits);
            // Typically multiplier is smaller or same digits
            const num2 = generateNumber(Math.max(1, config.digits > 2 ? 1 : config.digits));
            operationNumbers = [num1, num2];
            correctAnswer = num1 * num2;
        } else if (operatorType === 'division') {
            // Reverse multiplication to ensure integer result
            const divisor = generateNumber(1) || 1; // Single digit divisor, ensure not 0
            const quotient = generateNumber(config.digits);
            const dividend = divisor * quotient;
            operationNumbers = [dividend, divisor];
            correctAnswer = quotient;
        } else {
            // Addition / Subtraction / Mixed
            const rows = Math.max(2, config.rows);

            do {
                operationNumbers = [];
                correctAnswer = 0;
                attempts++;

                if (operatorType === 'subtraction' || operatorType === 'mixed') {
                    // IMPROVED SUBTRACTION LOGIC to avoid zero answers
                    // Similar to website worksheet generator

                    // Start with a LARGE first number (80% of max range)
                    let firstNum = generateNumber(config.digits);
                    firstNum = Math.max(firstNum, Math.floor(maxNum * 0.8));
                    operationNumbers.push(firstNum);
                    let runningSum = firstNum;

                    // Calculate minimum final answer we want to target
                    const minimumFinalAnswer = Math.max(minNum, Math.floor(firstNum * 0.1));

                    for (let r = 1; r < rows; r++) {
                        const remainingRows = rows - r;

                        // Decide operation based on current running sum
                        const safetyMargin = minNum * remainingRows + minimumFinalAnswer;
                        const canSubtract = runningSum > safetyMargin;

                        // Probability: for subtraction use 70%, for mixed use 50%
                        const subtractProbability = operatorType === 'subtraction' ? 0.7 : 0.5;
                        let shouldSubtract = canSubtract && Math.random() < subtractProbability;

                        if (shouldSubtract) {
                            // Calculate max we can subtract while maintaining minimum answer
                            const maxSubtractable = runningSum - safetyMargin;

                            if (maxSubtractable >= minNum) {
                                // Generate a random subtraction that doesn't go too low
                                const subtractRange = Math.min(maxSubtractable, maxNum * 0.5);
                                const subNum = Math.floor(Math.random() * (subtractRange - minNum + 1)) + minNum;
                                operationNumbers.push(-subNum);
                                runningSum -= subNum;
                                continue;
                            }
                        }

                        // Addition case - add to maintain positive answers
                        const addNum = generateNumber(config.digits);
                        operationNumbers.push(addNum);
                        runningSum += addNum;
                    }

                    correctAnswer = runningSum;
                } else {
                    // Pure addition - simple case
                    let sum = 0;
                    for (let r = 0; r < rows; r++) {
                        const num = generateNumber(config.digits);
                        operationNumbers.push(num);
                        sum += num;
                    }
                    correctAnswer = sum;
                }

                // Safety check - if answer is negative or zero, convert all to positive
                if (correctAnswer <= 0) {
                    for (let idx = 0; idx < operationNumbers.length; idx++) {
                        if (operationNumbers[idx] < 0) {
                            operationNumbers[idx] = Math.abs(operationNumbers[idx]);
                        }
                    }
                    correctAnswer = operationNumbers.reduce((a, b) => a + b, 0);
                }

            } while (
                correctAnswer === 0 &&
                zeroCount >= maxZeros &&
                attempts < maxAttempts
            );

            if (correctAnswer === 0) zeroCount++;
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
