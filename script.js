createControl();



function createControl() {
    const divTag = document.createElement("div");
    divTag.appendChild(createSlider(divTag));
    divTag.appendChild(refreshButton(divTag));
    console.log(divTag);
    document.body.appendChild(divTag);
}

function refreshButton() {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerHTML = "Refresh";
    return button;
}

function createSlider(divTag) {
    const inputTag = document.createElement("input");
    inputTag.setAttribute("type", "range");
    inputTag.setAttribute("min", "0")
    inputTag.setAttribute("max", "500")
    inputTag.setAttribute("value", "0")
    inputTag.setAttribute("class", "slider")
    return inputTag;
}