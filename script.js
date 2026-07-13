//=============================
// IKON ONLINE TEST
//=============================

// Replace with Apps Script URL later
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxvJs4QgvlSBAbcg5zuRyS8TeAzAt-en0h5Kb0V_FUtR6r3HVk-XOxchf0EnKiqEhbr6w/exec";

// Student Details
let studentName = "";
let regNo = "";

// Question Control
let currentQuestion = 0;

// Store Answers
let answers = new Array(questions.length).fill(null);

// Timer (30 Minutes)
let totalTime = 30 * 60;
let timer;

//=============================
// START TEST
//=============================

function startTest(){

    studentName = document.getElementById("studentName").value.trim();

    regNo = document.getElementById("regNo").value.trim();

    if(studentName=="" || regNo==""){

        alert("Enter Name and Registration Number");

        return;

    }

    fetch(
        SCRIPT_URL +
        "?action=login&regNo=" +
        encodeURIComponent(regNo) +
        "&name=" +
        encodeURIComponent(studentName)
    )

    .then(res=>res.text())

    .then(result=>{

        if(result=="VALID"){

            document.getElementById("loginPage").classList.add("hidden");

            document.getElementById("testPage").classList.remove("hidden");

            document.getElementById("showName").innerHTML=studentName;

            document.getElementById("showReg").innerHTML=regNo;

            loadQuestion();

            startTimer();

        }

        else{

            alert("Invalid Name or Registration Number");

        }

    });

}

//=============================
// LOAD QUESTION
//=============================

function loadQuestion(){

    const q = questions[currentQuestion];

    document.getElementById("questionNumber").innerHTML =
    "Question " +
    (currentQuestion+1) +
    " of " +
    questions.length;

    document.getElementById("questionText").innerHTML =
    q.question;

    let html="";

    q.options.forEach(function(option,index){

        let checked="";

        if(answers[currentQuestion]===index){

            checked="checked";

        }

        html+=`

<label class="option">

<input
type="radio"
name="answer"
value="${index}"
${checked}
onclick="saveAnswer(${index})">

${option}

</label>

`;

    });

    document.getElementById("options").innerHTML=html;

    updateProgress();

}

//=============================
// SAVE ANSWER
//=============================

function saveAnswer(index){

    answers[currentQuestion]=index;

}

//=============================
// NEXT
//=============================

function nextQuestion(){

    if(currentQuestion<questions.length-1){

        currentQuestion++;

        loadQuestion();

    }

}

//=============================
// PREVIOUS
//=============================

function previousQuestion(){

    if(currentQuestion>0){

        currentQuestion--;

        loadQuestion();

    }

}

//=============================
// PROGRESS BAR
//=============================

function updateProgress(){

    let percent=((currentQuestion+1)/questions.length)*100;

    document.getElementById("progressBar").style.width=
    percent+"%";

}

//=============================
// TIMER
//=============================

function startTimer(){

timer=setInterval(function(){

totalTime--;

let minutes=Math.floor(totalTime/60);

let seconds=totalTime%60;

minutes=minutes<10?"0"+minutes:minutes;

seconds=seconds<10?"0"+seconds:seconds;

document.getElementById("timer").innerHTML=
minutes+":"+seconds;

if(totalTime<=0){

clearInterval(timer);

alert("Time Over");

submitTest();

}

},1000);

}
//=============================
// SUBMIT TEST
//=============================

function submitTest() {

    if (!confirm("Are you sure you want to submit the test?")) {
        return;
    }

    clearInterval(timer);

    // Student Data
    const data = {
        name: studentName,
        regNo: regNo,
        submittedAt: new Date().toLocaleString(),
        answers: answers
    };

    // Testing Mode (Apps Script URL nahi diya)
    if (SCRIPT_URL === "") {

        console.log("Submitted Data");
        console.log(data);

        showSuccess();
        return;
    }

    // Send to Google Apps Script
    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {

        console.log(result);

        showSuccess();

    })
    .catch(error => {

        console.error(error);

        alert("Unable to submit your responses. Please try again.");

    });

}

//=============================
// SUCCESS PAGE
//=============================

function showSuccess() {

    document.getElementById("testPage").classList.add("hidden");

    document.getElementById("successPage").classList.remove("hidden");

}

//=============================
// PREVENT BACK BUTTON
//=============================

history.pushState(null, null, location.href);

window.onpopstate = function () {

    history.go(1);

};
