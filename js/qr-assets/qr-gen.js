var input_text = document.querySelector("#input_text");
var generate_qr = document.querySelector("#generate_qr");
var result = document.querySelector("#result");
var downloadBtn = document.querySelector("#downloadBtn");
var error = document.querySelector("#error");

generate_qr.addEventListener("click", newQRFun);
input_text.addEventListener("keyup", newQRFun);

function newQRFun() {
    error.innerHTML = "";
    console.log(isValidHttpUrl(input_text.value));
    if (!isValidHttpUrl(input_text.value)) {
        result.innerHTML = "";
        downloadBtn.innerHTML = "";
        error.innerHTML =
            "<i class='bi bi-exclamation-circle-fill'></i> Invalid Input";
        return;
    }
    if (input_text.value != "") {
        if (result.childElementCount == 0) {
            generate(input_text);
            shortenURl(input_text.value);
        } else {
            result.innerHTML = "";
            generate(input_text);
            shortenURl(input_text.value);
        }
    } else {
        error.innerHTML =
            "<i class='bi bi-exclamation-circle-fill'></i> Invalid Input";
        result.style = "display: none";
    }
}

function generate(user_input) {
    if (downloadBtn.childNodes.length == 1) {
        downloadBtn.removeChild(downloadBtn.firstElementChild);
    }
    result.style = "";

    var qrcode = new QRCode(result, {
        text: `${user_input.value}`,
        width: 180, //128
        height: 180,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });

    let download_link = document.createElement("a");
    download_link.setAttribute("download", "qr_code.png");
    download_link.setAttribute("class", "btn btn-danger text-center");
    download_link.innerText = "Download";

    downloadBtn.appendChild(download_link);

    let qr_code_canvas = document.querySelector("canvas");

    if (result.getAttribute("src") == null) {
        setTimeout(() => {
            download_link.setAttribute("href", `${qr_code_canvas.toDataURL()}`);
        }, 300);
    } else {
        setTimeout(() => {
            download_link.setAttribute("href", `${result.getAttribute("src")}`);
        }, 300);
    }
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function shortenURl(longUrl) {
    var group_guid = "Ba1bc23dE4F";
    var access_token = "511e3738b4444363b04b6130eedaa96306c9cc00";
    //511e3738b4444363b04b6130eedaa96306c9cc00
    var fetchUrl = "https://api-ssl.bitly.com/v4/shorten";
    var headers = {
        Authorization: "Bearer " + access_token,
        "Content-Type": "application/json",
    };
    var payload = {
        group_guid: group_guid,
        long_url: longUrl,
    };
    var params = {
        method: "post",
        headers: headers,
        payload: payload,
        muteHttpExceptions: true,
    };
    fetch(fetchUrl, params)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        });
}
// function shortenURl(domain) {
//     var data = {
//         group_guid: "Ba1bc23dE4F",
//         domain: "bit.ly",
//         long_url: domain,
//     };
//     var access_token = "511e3738b4444363b04b6130eedaa96306c9cc00";
//     fetch("https://api-ssl.bitly.com/v4/shorten", {
//             method: "post",
//             headers: {
//                 Authorization: `Bearer ${access_token}`,
//             },
//             "Content-Type": "application/json",
//             body: JSON.stringify(data),
//         })
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(data) {
//             alert(data.shortURL);
//         });
// }