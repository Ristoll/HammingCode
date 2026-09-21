import { decodeText } from "./decoder.js"
import { encodeText } from "./encoder.js";
import { getFileText } from "./fileManager.js";
import { log, clearLog } from "./logger.js"

const chooseFileButton = document.getElementById("choose-file-button");
const decodeButton = document.getElementById("decode-button");
const encodeButton = document.getElementById("encode-button");
const resetButton =  document.getElementById("reset-button");
const mainPart = document.getElementById("main-part");
const blockLengthInput = document.getElementById("block-length");
let fileText = "";

chooseFileButton.addEventListener("click", async () => {
    fileText = await getFileText();
    chooseFileButton.style.display = "none";
    mainPart.style.display="flex";
});

encodeButton.addEventListener("click", () => {
    try {
        const blockLength = Number(blockLengthInput.value);
        encodeText(fileText, blockLength);
    } catch (error) {
        log(error);
    }
});

decodeButton.addEventListener("click", () => {
    try {
    const blockLength = Number(blockLengthInput.value);
        decodeText(fileText, blockLength);
    } catch (error) {
        log(error);
    }
});

resetButton.addEventListener("click", ()=>
{
    fileText = null;
    clearLog();
    chooseFileButton.style.display = "flex";
    mainPart.style.display="none";
});