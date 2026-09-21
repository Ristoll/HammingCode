import { log } from "./logger.js";
import { getControlBitsAmount } from "./hammingHelper.js";

function convertTextToASCII(text) {
    let asciiValues = Array.from(text, char => char.codePointAt(0));
    let asciiValuesText = asciiValues.join(" ");

    log("ASCII значення: " + asciiValuesText);

    return asciiValues;
}

function ASCIIToBinary(asciiValues) {
    let binaryValues = asciiValues.map(element => {
        return element.toString(2).padStart(8, "0");
    });

    let binarySequence = binaryValues.join("");

    log("Бінарний ряд: " + binarySequence);

    return binarySequence;
}

function* getBitBlocks(binarySequence, bitBlockLength) {
    bitBlockLength = Number(bitBlockLength);

    if (!Number.isInteger(bitBlockLength) || bitBlockLength <= 0) {
        throw new Error("Некоректна довжина блоку");
    }

    for (let i = 0; i < binarySequence.length; i += bitBlockLength) {
        let bitBlock = binarySequence.slice(i, i + bitBlockLength);

        bitBlock = bitBlock.padEnd(bitBlockLength, "0");

        yield bitBlock;
    }
}

function* getBlocksWithControlledPositions(binarySequence, bitBlockLength) {
    let blocks = getBitBlocks(binarySequence, bitBlockLength);

    for (let block of blocks) {

        let controlBitsAmount = getControlBitsAmount(bitBlockLength);
        let hammingBlockLength = bitBlockLength + controlBitsAmount;
        let hammingBlock = new Array(hammingBlockLength);

        let dataIndex = 0;

        for (let index = 0; index < hammingBlockLength; index++) {
            let position = hammingBlockLength - index;
            let isControlPosition = (position & (position - 1)) === 0;

            if (isControlPosition) {
                hammingBlock[index] = "0";
            } else {
                hammingBlock[index] = block[dataIndex];
                dataIndex++;
            }
        }

        yield hammingBlock.join("");
    }
}

function calculateControlBits(block) {

    let result = block.split("");
    for (let controlPosition = 1; controlPosition <= result.length; controlPosition *= 2) {
        let sum = 0;

        for (let position = 1; position <= result.length; position++) {
            if (position === controlPosition) {
                continue;
            }

            if ((position & controlPosition) !== 0) {
                let index = result.length - position;

                sum += Number(result[index]);
            }
        }
        let controlBit = sum % 2;

        let index = result.length - controlPosition;

        result[index] = controlBit.toString();
    }

    return result.join("");
}

export function getHemmingCode(binarySequence, bitBlockLength) {

    let blocks = getBlocksWithControlledPositions(binarySequence, bitBlockLength);
    let hammingBlocks = [];

    for (let block of blocks) {

        let hammingBlock = calculateControlBits(block);

        hammingBlocks.push(hammingBlock);
    }

    log("Код Хеммінга: " + hammingBlocks.join(""));

    return hammingBlocks;
}

export function encodeText(text, bitBlockLength) {

    // Текст - ASCII
    let asciiValues = convertTextToASCII(text);

    // ASCII - двійковий код
    let binarySequence = ASCIIToBinary(asciiValues);

    // Двійковий код - код Хеммінга
    let hammingBlocks = getHemmingCode(binarySequence, bitBlockLength);

    return hammingBlocks;
}