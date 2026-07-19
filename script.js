//=============================
// IKON ONLINE TEST
//=============================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxvJs4QgvlSBAbcg5zuRyS8TeAzAt-en0h5Kb0V_FUtR6r3HVk-XOxchf0EnKiqEhbr6w/exec";

//=============================
// TEST TITLE
//=============================

window.onload = function(){

    loadPaperName();
    loadTestDate();
    loadTestTime();
    loadDuration();

};
//=============================
// LOAD PAPER DETAILS
//=============================

function loadPaperName(){

    fetch(SCRIPT_URL + "?action=paperName")
    .then(res => res.text())
    .then(data => {

        document.getElementById("testTitle").innerHTML = data;

    })
    .catch(err => console.log(err));

}

function loadTestDate(){

    fetch(SCRIPT_URL + "?action=testDate")
    .then(res => res.text())
    .then(data => {

        document.getElementById("testDate").innerHTML =
        "📅 Test Date : " + data;

    })
    .catch(err => console.log(err));

}

function loadTestTime(){

    fetch(SCRIPT_URL + "?action=testTime")
    .then(res => res.text())
    .then(data => {

        const el = document.getElementById("testTime");

        if(el){

            el.innerHTML = "🕒 Test Time : " + data;

        }

    })
    .catch(err => console.log(err));

}
function loadDuration(){

    fetch(SCRIPT_URL + "?action=duration")
    .then(res => res.text())
    .then(data => {

        totalTime = parseInt(data) * 60;

        if(isNaN(totalTime)){
            totalTime = 30 * 60;
        }

        let minutes = Math.floor(totalTime/60);
        let seconds = totalTime % 60;

        document.getElementById("timer").innerHTML =
        (minutes<10?"0":"")+minutes + ":" +
        (seconds<10?"0":"")+seconds;

    });

}
//=============================
// VARIABLES
//=============================

let studentName = "";
let regNo = "";

let currentQuestion = 0;

let answers = new Array(questions.length).fill("");

let totalTime = 30 * 60;
let timer = null;

let statusChecker = null;

//=============================
// LOGIN
//=============================

function startTest() {

    studentName =
        document.getElementById("studentName").value.trim();

    regNo =
        document.getElementById("regNo").value.trim();

    if (studentName == "" || regNo == "") {

        alert("Please enter Name and Registration Number.");

        return;

    }

    fetch(
        SCRIPT_URL +
        "?action=login&regNo=" +
        encodeURIComponent(regNo) +
        "&name=" +
        encodeURIComponent(studentName)
    )

        .then(res => res.text())

        .then(result => {

    result = result.trim();

    if (result == "VALID") {

        checkTestStatus();

    }
    else if (result == "ALREADY_SUBMITTED") {

        alert("You have already submitted this test.");

    }
    else {

        alert("Invalid Registration Number or Name.");

    }

})

        .catch(err => {

            console.log(err);

            alert("Unable to connect.");

        });

}

//=============================
// CHECK STATUS
//=============================

function checkTestStatus() {

    fetch(
        SCRIPT_URL + "?action=status"
    )

        .then(res => res.text())

        .then(status => {

            status = status.trim().toUpperCase();

            if (status == "ON") {

                openTest();

            }

            else {

                document.getElementById("loginPage")
                    .classList.add("hidden");

                document.getElementById("waitingPage")
                    .classList.remove("hidden");

                showRandomLine();

                autoCheckStatus();

            }

        });

}

//=============================
// AUTO CHECK
//=============================

function autoCheckStatus() {

    if (statusChecker != null)
        return;

    statusChecker = setInterval(function () {

        fetch(
            SCRIPT_URL + "?action=status"
        )

            .then(res => res.text())

            .then(status => {

                status = status.trim().toUpperCase();

                if (status == "ON") {

                    clearInterval(statusChecker);

                    statusChecker = null;

                    openTest();

                }

            });

    }, 5000);

}

//=============================
// OPEN TEST
//=============================

function openTest() {

    document.getElementById("waitingPage")
        .classList.add("hidden");

    document.getElementById("loginPage")
        .classList.add("hidden");

    document.getElementById("testPage")
        .classList.remove("hidden");

    document.getElementById("showName").innerHTML = studentName;
    document.getElementById("showReg").innerHTML = regNo;

    loadQuestion();

    startTimer();

}
//=============================
// MOTIVATION
//=============================

function showRandomLine() {

    const lines = [

        "Believe in yourself.",
        "Stay calm and focused.",
        "Success begins with confidence.",
        "Give your best today.",
        "Every question is an opportunity.",
        "Hard work always pays.",
        "Think before you answer.",
        "You are ready to succeed."

    ];

    document.getElementById("motivationText").innerHTML =
        lines[Math.floor(Math.random() * lines.length)];

}

//=============================
// LOAD QUESTION
//=============================

function loadQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("questionNumber").innerHTML =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        questions.length;

    document.getElementById("questionText").innerHTML =
        q.question;

    let html = "";

    q.options.forEach(function (option, index) {

        let checked = "";

        if (answers[currentQuestion] == option) {

            checked = "checked";

        }

        html += `
<label class="option">
<input
type="radio"
name="answer"
${checked}
onclick="saveAnswer(${index})">
${option}
</label>
`;

    });

    document.getElementById("options").innerHTML = html;

    updateProgress();

}

//=============================
// SAVE ANSWER
//=============================

function saveAnswer(index) {

    answers[currentQuestion] =
        questions[currentQuestion].options[index];

}

//=============================
// NEXT
//=============================

function nextQuestion() {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    }

}

//=============================
// PREVIOUS
//=============================

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();

    }

}

//=============================
// PROGRESS
//=============================

function updateProgress() {

    let percent =
        ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById("progressBar").style.width =
        percent + "%";

}
//=============================
// START TIMER
//=============================

function startTimer(){

    if(timer!=null){
        clearInterval(timer);
    }

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

            submitTest(true);

        }

    },1000);

}



//=============================
// SUBMIT TEST
//=============================

function submitTest(autoSubmit=false){

    if(!autoSubmit){

        if(!confirm("Are you sure you want to submit the test?")){
            return;
        }

    }

    if(timer!=null){
        clearInterval(timer);
    }

    const data={

        name:studentName,

        regNo:regNo,

        submittedAt:new Date().toLocaleString(),

        answers:answers

    };


fetch(SCRIPT_URL,{

    method:"POST",

    body:JSON.stringify(data)

})

    .then(res=>res.text())

    .then(result=>{

        console.log(result);

        if(result.trim()=="SUCCESS"){

            showSuccess();

        }else{

            alert(result);

        }

    })

    .catch(err=>{

        console.log(err);

        alert("Unable to submit responses.");

    });

}



//=============================
// SUCCESS PAGE
//=============================

function showSuccess(){

    document.getElementById("testPage")
    .classList.add("hidden");

    document.getElementById("waitingPage")
    .classList.add("hidden");

    document.getElementById("successPage")
    .classList.remove("hidden");

}



//=============================
// DISABLE RIGHT CLICK
//=============================

document.addEventListener("contextmenu",function(e){

    e.preventDefault();

});



//=============================
// DISABLE COPY
//=============================

document.addEventListener("copy",function(e){

    e.preventDefault();

});



//=============================
// DISABLE CUT
//=============================

document.addEventListener("cut",function(e){

    e.preventDefault();

});



//=============================
// DISABLE F12
//=============================

document.addEventListener("keydown",function(e){

    if(
        e.key==="F12" ||

        (e.ctrlKey && e.shiftKey && e.key==="I") ||

        (e.ctrlKey && e.shiftKey && e.key==="J") ||

        (e.ctrlKey && e.shiftKey && e.key==="C") ||

        (e.ctrlKey && e.key==="U")
    ){

        e.preventDefault();

    }

});



//=============================
// PREVENT BACK
//=============================

history.pushState(null,null,location.href);

window.onpopstate=function(){

    history.go(1);

};
