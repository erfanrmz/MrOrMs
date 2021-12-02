var inputName = document.getElementById("inputName");
var saveButton = document.getElementById("save-button");
var submitButton = document.getElementById("submit-button");
var clearButton = document.getElementById("clear-button");
var predictionGender = document.getElementById("prediction-gender");
var prediction = document.getElementById("prediction");
var savedName = document.getElementById("saved-name");
var notif = document.getElementById("alert");
var maleRadio = document.getElementById("male");
var femaleRadio = document.getElementById("female");

saveButton.onclick = function (e) {
  if (validating(inputName.value)) {
    if (maleRadio.checked) {
      localStorage.setItem(inputName.value, `male`);
      savedName.innerHTML = "male";
    } else if (femaleRadio.checked) {
      localStorage.setItem(inputName.value, `female`);
      savedName.innerHTML = "female";
    } else {
      if (predictionGender.innerHTML == "No data") {
        notifError("cant save null gender");
      } else {
        localStorage.setItem(inputName.value, `${predictionGender.innerHTML}`);
        savedName.innerHTML = predictionGender.innerHTML;
      }
    }
  } else {
    notifError("Enter a valid name");
  }
};

submitButton.onclick = function (e) {
  e.preventDefault();
  if (validating(inputName.value)) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(
      "GET",
      "https://api.genderize.io/?name=" + inputName.value,
      false
    );

    try {
      xmlHttp.send(null);
    } catch (err) {
      notifError(err);
    }

    let response = JSON.parse(xmlHttp.response);
    console.log(response);
    predictionGender.innerHTML = response.gender;
    prediction.innerHTML = response.probability;
    if (response.gender == null) {
      notifError("not found");
      predictionGender.innerHTML = "No data";
      prediction.innerHTML = "No data";
    }
    if (localStorage.getItem(inputName.value)) {
      savedName.innerHTML = localStorage.getItem(inputName.value);
    } else {
      savedName.innerHTML = "Not Saved";
    }
  } else {
    notifError("Enter a valid name");
  }
};
clearButton.onclick = function (e) {
  e.preventDefault();
  if (validating(inputName.value)) {
    if (localStorage.getItem(inputName.value)) {
      localStorage.removeItem(inputName.value);
      savedName.innerHTML = "Cleared";
    } else {
      notifError("You didn`t saved anything before");
    }
  } else {
    notifError("Enter a valid name");
  }
};

function notifError(message) {
  document.querySelector(".notif.error > p").innerHTML = message;
  notif.classList.add("showNotif");
  setTimeout(function () {
    notif.classList.remove("showNotif");
  }, 4000);
}

function validating(name) {
  var regex = /^[a-zA-Z ]{1,255}$/;
  return regex.test(name);
}
