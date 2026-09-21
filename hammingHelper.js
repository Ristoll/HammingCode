export function getControlBitsAmount(bitBlockLength) {
    let controlBitsAmount = 0;

    while (Math.pow(2, controlBitsAmount) < bitBlockLength + controlBitsAmount + 1) {
        controlBitsAmount++;
    }

    return controlBitsAmount;
}

export function isBinarySequence(sequence) {
    return /^[01]+$/.test(sequence);
}
