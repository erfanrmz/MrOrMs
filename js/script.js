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

//if we choose any radioButton of male or female it saves it otherwise it saves the api response in localStorage
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
// after checking that the name is valid, make a Http request to api and get data in response to show it on page
submitButton.onclick = function (e) {
  e.preventDefault();
  if (validating(inputName.value)) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(
      "GET",
      "https://api.genderize.io/?name=" + inputName.value,
      false
    );
    //showing Error alert if any error occurred
    try {
      xmlHttp.send(null);
    } catch (err) {
      notifError(err);
    }

    let response = JSON.parse(xmlHttp.response);
    console.log(response);
    predictionGender.innerHTML = response.gender;
    prediction.innerHTML = response.probability;
    // if gender is null and api dont know the name show an error with not found message
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
//if the name is valid and we had any save in localStorage it deletes the localStorage of that name otherwise alert some Error
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
//give showNotif class to the p tag children of .notif.error div for 4seconds then removing it
function notifError(message) {
  document.querySelector(".notif.error > p").innerHTML = message;
  notif.classList.add("showNotif");
  setTimeout(function () {
    notif.classList.remove("showNotif");
  }, 4000);
}
//check the input name value is including just A-Z characters and its length is between 1 to 255
function validating(name) {
  var regex = /^[a-zA-Z ]{1,255}$/;
  return regex.test(name);
}
