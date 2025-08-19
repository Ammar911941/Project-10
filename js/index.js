let first = document.querySelector(".first");
let city = document.querySelector(".city");
let second = document.querySelector(".second");
let icon = document.querySelector(".icon");
let firstP = document.querySelector(".first p");
let allLi = document.querySelectorAll(".cities ul li");
let dateP = document.querySelector(".date p");
let allTime = document.querySelectorAll(".time");
let loading = document.querySelector(".loading");
let prayers = document.querySelector(".prayers");
let boolWait;
let boolOffline;
if (localStorage.getItem("boolOffline")) {
  boolOffline = localStorage.getItem("boolOffline");
}
if (localStorage.getItem("boolWait")) {
  boolWait = localStorage.getItem("boolWait");
}

window.onoffline = function () {
  boolOffline = true;
  localStorage.setItem("boolOffline", true);
};

first.addEventListener("click", function () {
  second.classList.toggle("show");
  icon.classList.toggle("selected");
});
if (!localStorage.getItem("currentCity")) {
  localStorage.setItem("currentCity", "القاهرة");
  firstP.innerHTML = "القاهرة";
} else {
  firstP.innerHTML = localStorage.getItem("currentCity");
}
if (!localStorage.getItem("currentDate")) {
  addTime();
}
allLi.forEach((element) => {
  element.addEventListener("click", function () {
    addTime();
    localStorage.setItem("currentCity", element.innerHTML);
    firstP.innerHTML = element.innerHTML;
    if (second.classList.contains("show")) {
      second.classList.remove("show");
    }
    loading.style.display = "flex";
    prayers.style.display = "none";
    boolWait = true;
    localStorage.setItem("boolWait", true);
    handlApi(localStorage.getItem("currentCity"));
  });
});
function addTime() {
  let date = new Date();
  let currentDay = date.getDate();
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();
  localStorage.setItem(
    "currentDate",
    `${currentMonth + 1}-${currentDay}-${currentYear}`
  );
  dateP.innerHTML = localStorage.getItem("currentDate");
}
addTime();

function handlApi(value) {
  axios
    .get(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=${value}`)
    .then((response) => {
      let times = response.data.data.timings;
      let fajrTime = times.Fajr.slice(1);
      let sunRiseTime = times.Sunrise.slice(1);
      let dhuhrTime;
      let periodOfDhuhr;
      if (+times.Dhuhr.slice(0, times.Dhuhr.indexOf(":")) < 12) {
        periodOfDhuhr = "AM";
        dhuhrTime = times.Dhuhr;
      } else if (+times.Dhuhr.slice(0, times.Dhuhr.indexOf(":")) == 12) {
        periodOfDhuhr = "PM";
        dhuhrTime = times.Dhuhr;
      } else {
        periodOfDhuhr = "PM";
        `${
          times.Dhuhr.slice(0, times.Dhuhr.indexOf(":")) % 12
        }${times.Dhuhr.slice(times.Dhuhr.indexOf(":"))}`;
      }
      let asrTime = `${
        times.Asr.slice(0, times.Asr.indexOf(":")) % 12
      }${times.Asr.slice(times.Asr.indexOf(":"))}`;
      let maghribTime = `${
        times.Maghrib.slice(0, times.Maghrib.indexOf(":")) % 12
      }${times.Maghrib.slice(times.Maghrib.indexOf(":"))}`;
      let ishaTime = `${
        times.Isha.slice(0, times.Isha.indexOf(":")) % 12
      }${times.Isha.slice(times.Isha.indexOf(":"))}`;
      let arrOfTime = [
        fajrTime,
        sunRiseTime,
        dhuhrTime,
        asrTime,
        maghribTime,
        ishaTime,
      ];
      let arrOfPeriod = ["AM", "AM", periodOfDhuhr, "PM", "PM", "PM"];
      allTime.forEach((element, index) => {
        element.innerHTML = `<span>${arrOfPeriod[index]}</span> ${arrOfTime[index]}`;
      });
      loading.style.display = "none";
      prayers.style.display = "block";
      boolWait = false;
      localStorage.setItem("boolWait", false);
    })
    .catch(function () {
      console.log("Error");
    });
}
handlApi(localStorage.getItem("currentCity"));
window.ononline = function () {
  if (boolOffline && boolWait) {
    handlApi(localStorage.getItem("currentCity"));
  }
  boolOffline = false;
  localStorage.setItem("boolOffline", false);
};
