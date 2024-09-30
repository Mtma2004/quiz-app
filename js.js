let countspan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submit = document.querySelector(".submit-button");
let bulletscontener = document.querySelector(".bullets");
let result = document.querySelector(".result");
let countdownele = document.querySelector(".countdown");

let currentindex = 0;
let ranswer = 0;
let countdownintervel;
fetch("./html-question.json").then((d) => {
  console.log(d);
});

function getQuestion() {
  let myrequiest = new XMLHttpRequest();
  myrequiest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionobj = JSON.parse(this.responseText);
      let questioncount = questionobj.length;
      createbullets(questioncount);

      addquestiondata(questionobj[currentindex], questioncount);
      countdown(5, questioncount);
      submit.onclick = function () {
        if (currentindex < questioncount) {
          let rightanswer = questionobj[currentindex]["answer_right"];
          currentindex++;
          checkanswer(rightanswer, questioncount);
          quizArea.innerHTML = "";
          answerArea.innerHTML = "";
          addquestiondata(questionobj[currentindex], questioncount);
          handleblutes();
          clearInterval(countdownintervel);
          countdown(5, questioncount);
          showresult(questioncount);
        }
      };
    }
  };
  myrequiest.open("GET", "./html-question.json", true);
  myrequiest.send();
}

function createbullets(num) {
  countspan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    if (i === 0) {
      span.className = "on";
    }
    bullets.appendChild(span);
  }
}
function addquestiondata(obj, count) {
  if (currentindex < count) {
    let questiontitle = document.createElement("h2");
    let questiomtext = document.createTextNode(obj.title);
    questiontitle.append(questiomtext);
    quizArea.appendChild(questiontitle);
    for (let i = 1; i <= 4; i++) {
      let maindiv = document.createElement("div");
      maindiv.className = "answer";
      let input = document.createElement("input");
      input.name = "question";
      input.type = "radio";
      input.id = `answer_${i}`;
      input.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        input.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      let labeltext = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labeltext);
      maindiv.appendChild(input);
      maindiv.appendChild(label);
      answerArea.appendChild(maindiv);
    }
  }
}
function checkanswer(answer, count) {
  let answers = document.getElementsByName("question");
  let thechosenanswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked === true) {
      thechosenanswer = answers[i].dataset.answer;
    }
  }
  if (answer === thechosenanswer) {
    ranswer++;
  }
}
function handleblutes() {
  let bulletsspans = document.querySelectorAll(".bullets .spans span");
  let arrofspan = Array.from(bulletsspans);
  arrofspan.forEach((span, index) => {
    if (currentindex === index) {
      span.className = "on";
    }
  });
}
function showresult(count) {
  // show the result in the end
  let theResult;
  if (currentindex === count) {
    quizArea.remove();
    answerArea.remove();
    submit.remove();
    bulletscontener.remove();
    if (ranswer > count / 2 && ranswer < count) {
      theResult = `<span class = "good">Good</span> ${ranswer} From ${count} `;
    } else if (ranswer === count) {
      theResult = `<span class = "perfict">perfict</span> All answer is good`;
    } else {
      theResult = `<span class = "bad">Bad</span> ${ranswer} From ${count} `;
    }
    result.innerHTML = theResult;
  }
}
function countdown(duration, count) {
  // timer
  if (currentindex < count) {
    let minutes, seconds;
    countdownintervel = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownele.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownintervel);
        submit.click();
      }
    }, 1000);
  }
}

getQuestion();
