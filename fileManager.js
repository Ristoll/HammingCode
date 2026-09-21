import { log } from "./logger.js";

function chooseFile() {
    return new Promise((resolve) => {
        const input = document.createElement("input");

        input.type = "file";
        input.accept = ".txt";

        input.addEventListener("change", () => {
            resolve(input.files[0]);
        });

        input.click();
    });
}

export async function getFileText() {
    const file = await chooseFile();
    const text = await file.text();

    log("Текст обраного файлу: " + text);

    return text;
}

