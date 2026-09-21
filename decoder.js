import { log } from "./logger.js";
import { getControlBitsAmount, isBinarySequence } from "./hammingHelper.js";

function* getHammingBlocks(hammingSequence, blockLength) {
   if (!isBinarySequence(hammingSequence)) {
        throw new Error("Ваш файл містить небінарні символи");
    }

    const r = getControlBitsAmount(blockLength);
    const hammingBlockLength = blockLength + r;

    for (let i = 0; i < hammingSequence.length; i += hammingBlockLength) {
        yield hammingSequence.slice(i, i + hammingBlockLength);
    }
}

function findErrorPosition(block) {
    let errorPosition = 0;

    for (let controlPosition = 1; controlPosition <= block.length; controlPosition *= 2) {
        let sum = 0;

        for (let position = 1; position <= block.length; position++) {
            if ((position & controlPosition) !== 0) {
                const index = block.length - position;
                sum += Number(block[index]);
            }
        }

        if (sum % 2 !== 0) {
            errorPosition += controlPosition;
        }
    }

    return errorPosition;
}

function decodeHammingBlock(block) {
    let result = block.split("");

    const errorPosition = findErrorPosition(result);

    if (errorPosition > 0 && errorPosition <= result.length) {
        const index = result.length - errorPosition;

        result[index] = result[index] === "0" ? "1" : "0";

        log("Виправлено помилку на позиції: " + errorPosition);
    }

    let dataBits = [];

    for (let position = result.length; position >= 1; position--) {
        let isControlPosition = (position & (position - 1)) === 0;

        if (!isControlPosition) {
            let index = result.length - position;
            dataBits.push(result[index]);
        }
    }

    return dataBits.join("");
}

function binaryToText(binarySequence) {
    let text = "";

    for (let i = 0; i + 7 < binarySequence.length; i += 8) {
        const byte = binarySequence.slice(i, i + 8);

        text += String.fromCodePoint(Number.parseInt(byte, 2));
    }

    return text;
}

export function decodeText(hammingSequence, blockLength) {
    blockLength = Number(blockLength);
    if (!Number.isInteger(blockLength) || blockLength <= 0) {
        throw new Error("Некоректна довжина блоку");
    }
    const blocks = getHammingBlocks(hammingSequence, blockLength);
    let binarySequence = "";

    for (const block of blocks) {
        if (block.length === 0) continue;

        binarySequence += decodeHammingBlock(block);
    }

    binarySequence = binarySequence.slice(0, Math.floor(binarySequence.length / 8) * 8);
    log("Відновлений бінарний ряд: " + binarySequence);
    const text = binaryToText(binarySequence);
    log("Відновлений текст: " + text);

    return text;
}