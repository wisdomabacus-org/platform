import { jsPDF } from "jspdf";

export interface WorksheetConfig {
    operators: string[];
    questions: number;
    rows: number;
    digits: number;
    name: string;
    type: string;
}

interface Question {
    id: number;
    numbers: number[];
    operator: string;
    answer: number;
}

const generateRandomNumber = (digits: number, allowZero: boolean = false): number => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    if (digits === 1 && !allowZero) {
        return Math.floor(Math.random() * 9) + 1;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateQuestions = (config: WorksheetConfig): Question[] => {
    const questions: Question[] = [];

    for (let i = 1; i <= config.questions; i++) {
        const operator = config.operators[Math.floor(Math.random() * config.operators.length)];
        const numbers: number[] = [];
        let answer = 0;

        // Logic for Addition/Subtraction (Vertical Stack)
        if (operator === "addition" || operator === "subtraction") {
            let sum = 0;
            for (let r = 0; r < config.rows; r++) {
                let num = generateRandomNumber(config.digits);

                // Handle mixed operators or dedicated subtraction
                if (config.operators.includes("subtraction")) {
                    // Logic: If user selected subtraction, we want meaningful subtraction logic.
                    // If rows > 2, it's a mix.
                    // If start of loop (r=0), keep positive.
                    // If subsequent rows, chance of negative.
                    if (r > 0 && Math.random() > 0.4) {
                        num = -num;
                    }
                }

                // Correction to prevent negative total for "Student" level if needed
                // But for now, we allow it or try to adjust the first number to be larger?
                // Let's stick to pure random generation as requested originally but ensuring clean display.

                numbers.push(num);
                sum += num;
            }
            answer = sum;
        }
        else if (operator === "multiplication") {
            const a = generateRandomNumber(config.digits);
            const b = generateRandomNumber(config.digits); // Could be smaller digits for multiplier
            numbers.push(a);
            numbers.push(b);
            answer = a * b;
        }
        else if (operator === "division") {
            const divisor = generateRandomNumber(1);
            const quotient = generateRandomNumber(config.digits);
            const dividend = divisor * quotient;
            numbers.push(dividend);
            numbers.push(divisor);
            answer = quotient;
        }

        questions.push({ id: i, numbers, operator, answer });
    }
    return questions;
};

export const generatePDF = async (config: WorksheetConfig) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const margins = 15;
    const contentWidth = width - (margins * 2);

    // Load Logo
    let logoData: string | null = null;
    try {
        const response = await fetch("/brand.png");
        if (response.ok) {
            const blob = await response.blob();
            logoData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        }
    } catch (e) {
        console.warn("Failed to load logo", e);
    }

    // --- Helpers ---
    const addHeader = (pageNum: number) => {
        let yPos = 10;

        // Logo - ONLY ON FIRST PAGE
        if (pageNum === 1 && logoData) {
            const logoSize = 25; // Square
            doc.addImage(logoData, "PNG", (width / 2) - (logoSize / 2), yPos, logoSize, logoSize);
            yPos += logoSize + 5;
        } else if (pageNum === 1) {
            yPos += 10;
        } else {
            // Smaller header for subsequent pages
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text("Wisdom Abacus Worksheet", margins, 10);
            doc.text(`Page ${pageNum}`, width - margins, 10, { align: "right" });
            return 20; // Start higher on subsequent pages
        }

        // Title - Bold Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text("WISDOM ABACUS", width / 2, yPos, { align: "center" });
        yPos += 7;

        // Website Link
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("https://www.wisdomabacus.com", width / 2, yPos, { align: "center" });
        doc.setTextColor(0, 0, 0);
        yPos += 10;

        // Worksheet Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Abacus Worksheet", width / 2, yPos, { align: "center" });
        yPos += 15;

        // Info Fields
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);

        // Name Field
        doc.text(`Name: ${config.name || "____________________"}`, margins, yPos);

        // Date Field
        doc.text(`Date: _________________`, width / 2, yPos, { align: "center" });

        // Time Field
        doc.text(`Time: ___________`, width - margins, yPos, { align: "right" });

        // Line divider
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(margins, yPos + 3, width - margins, yPos + 3);

        return yPos + 10; // Return start Y for content
    };

    const drawFooter = (pageNum: number, totalPages: number) => {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${pageNum} of ${totalPages}`, width / 2, height - 10, { align: "center" });
        doc.text("Generated by Wisdom Academy", margins, height - 10);
        doc.setTextColor(0, 0, 0);
    };

    // --- Generation Loop ---
    const questions = generateQuestions(config);

    // Layout Config
    const cols = 6;
    const colGap = 4;
    const boxWidth = (contentWidth - ((cols - 1) * colGap)) / cols;
    const rowLineHeight = 7; // Increased spacing between numbers (was 6)

    // Vertical Box Height calculation
    // Header (8) + Rows (rowLineHeight * rows) + Divider/Answer space (12)
    const boxHeight = 8 + (config.rows * rowLineHeight) + 12;

    let startY = 55; // Placeholder
    let currentY = 0;
    let currentCol = 0;

    // Initialize Page 1
    startY = addHeader(1);
    currentY = startY;

    questions.forEach((q) => {
        // Check new page
        if (currentY + boxHeight > height - 15) {
            doc.addPage();
            startY = addHeader(doc.getNumberOfPages());
            currentY = startY;
            currentCol = 0;
        }

        const x = margins + (currentCol * (boxWidth + colGap));

        // Draw Box container (optional border, maybe remove for cleaner look, but kept for structure)
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.1);
        doc.rect(x, currentY, boxWidth, boxHeight);

        // Header Background
        doc.setFillColor(248, 248, 248);
        doc.rect(x, currentY, boxWidth, 7, "F");

        // Q Number
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.text(`Q: ${q.id}`, x + (boxWidth / 2), currentY + 5, { align: "center" });

        // Numbers
        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        let numY = currentY + 14;

        if (q.operator === 'multiplication' || q.operator === 'division') {
            const symbol = q.operator === 'multiplication' ? 'x' : '÷';
            const text = `${q.numbers[0]} ${symbol} ${q.numbers[1]}`;
            doc.text(text, x + (boxWidth / 2), numY + 5, { align: "center" });

            // Answer Line
            doc.setLineWidth(0.3);
            doc.line(x + 5, currentY + boxHeight - 8, x + boxWidth - 5, currentY + boxHeight - 8);
        } else {
            // Vertical Stack
            q.numbers.forEach((num, idx) => {
                // Handling Symbols
                // For the last number, if we want to show operator? 
                // Usually abacus sheets show sign for negative numbers.
                // Standard format: Just the numbers right aligned. 
                // If negative, assume there's a minus sign.

                const numStr = Math.abs(num).toString();
                // Symbol logic: if negative, show '- '. If positive, usually no sign unless explicitly desired.
                // We'll put the sign to the left of the number if negative.

                const isNegative = num < 0;
                const text = numStr;

                // Align right
                // X position for number end
                const xEnd = x + boxWidth - 8;
                doc.text(text, xEnd, numY, { align: "right" });

                // Draw sign if negative
                if (isNegative) {
                    doc.text("-", xEnd - (text.length * 2.5) - 2, numY); // Rough positioning for monospace
                }

                numY += rowLineHeight;
            });

            // Answer Line
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(x + 5, currentY + boxHeight - 10, x + boxWidth - 5, currentY + boxHeight - 10);
        }

        currentCol++;
        if (currentCol >= cols) {
            currentCol = 0;
            currentY += boxHeight + 5;
        }
    });

    // --- Answer Key Page ---
    doc.addPage();
    const answerPageStart = 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Answer Key", width / 2, answerPageStart, { align: "center" });

    let keyY = answerPageStart + 15;
    let keyCol = 0;
    const keyCols = 8;
    const keyBoxWidth = (contentWidth - ((keyCols - 1) * colGap)) / keyCols;
    const keyBoxHeight = 12; // Compact

    doc.setFontSize(10);
    doc.setLineWidth(0.1);
    doc.setDrawColor(200, 200, 200);

    questions.forEach((q) => {
        if (keyY + keyBoxHeight > height - 15) {
            doc.addPage();
            keyY = 20;
            doc.text("Answer Key (Cont.)", width / 2, 10, { align: "center" });
        }

        const kx = margins + (keyCol * (keyBoxWidth + colGap));

        // Draw Box
        doc.rect(kx, keyY, keyBoxWidth, keyBoxHeight);

        // Q Num
        doc.setFillColor(240, 240, 240);
        doc.rect(kx, keyY, keyBoxWidth, 5, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.text(`${q.id}`, kx + (keyBoxWidth / 2), keyY + 3.5, { align: "center" });

        // Answer
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${q.answer}`, kx + (keyBoxWidth / 2), keyY + 10, { align: "center" });

        keyCol++;
        if (keyCol >= keyCols) {
            keyCol = 0;
            keyY += keyBoxHeight + 3;
        }
    });

    // Add Footers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(i, totalPages);
    }

    doc.save(`Wisdom-Abacus-${config.operators.join("-")}-${config.questions}.pdf`);
};
