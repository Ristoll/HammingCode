let responseLog = document.getElementById("response");

export function log(text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    responseLog.appendChild(paragraph);
}

export function clearLog() {
    responseLog.innerHTML = "";
}