//================================
// IKON ONLINE TEST SYSTEM
// SCRIPT.JS - PART 1A-1
//================================

//--------------------------------
// GOOGLE APP SCRIPT URL
//--------------------------------

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxvJs4QgvlSBAbcg5zuRyS8TeAzAt-en0h5Kb0V_FUtR6r3HVk-XOxchf0EnKiqEhbr6w/exec";


//================================
// GLOBAL VARIABLES
//================================

// Student Details
let studentName = "";
let regNo = "";
let paperName = "";

// Questions
let questions = [];
let currentQuestion = 0;
let answers = [];
//================================
// LOAD SETTINGS FROM GOOGLE SHEET
//================================

function loadExamSettings(){

fetch(SCRIPT_URL+"?action=status")
.then(res=>res.text())
.then(status=>{

    console.log("Status:",status);

});


fetch(SCRIPT_URL+"?action=duration")
.then(res=>res.text())
.then(duration=>{

    totalTime = Number(duration) * 60;

    console.log("Duration:",duration);

});


fetch(SCRIPT_URL+"?action=totalQuestions")
.then(res=>res.text())
.then(total=>{

    console.log("Total Questions:",total);

});

}


// PAGE LOAD
loadExamSettings();



// PAGE LOAD

window.addEventListener("DOMContentLoaded",function(){

    loadHeaderDateTime();

});

// Timer
let totalTime = 30 * 60;
let timer = null;


// Waiting Page Checker
let statusChecker = null;


//================================
// EXAM SECURITY
//================================

let examSubmitted = false;
let submitReason = "Manual Submit";

// Focus Warning
let focusWarnings = 0;
const MAX_FOCUS_WARNING = 3;
let focusLock = false;
//================================
// WINDOW SWITCH SECURITY
//================================

document.addEventListener("visibilitychange", function(){

    let examArea = document.getElementById("examArea");


    // केवल exam शुरू होने के बाद चलेगा

    if(
        document.hidden &&
        examArea &&
        !examArea.classList.contains("hidden") &&
        !examSubmitted &&
        !focusLock
    ){


        focusWarnings++;


        if(focusWarnings < MAX_FOCUS_WARNING){

            alert(
            "⚠️ Warning "+focusWarnings+"/"+MAX_FOCUS_WARNING+
            "\n\nWindow switch ya tab change allowed nahi hai."
            );

        }



        if(focusWarnings >= MAX_FOCUS_WARNING){


            focusLock = true;

            submitReason =
            "Auto Submit - Window Switch";


            alert(
            "❌ 3 warnings complete.\nTest automatically submit hoga."
            );


            submitTest(true);


        }


    }


});




//================================
// FULLSCREEN SECURITY
//================================

document.addEventListener("fullscreenchange", function(){


    let examArea = document.getElementById("examArea");


    if(
        examArea &&
        !examArea.classList.contains("hidden") &&
        !document.fullscreenElement &&
        !examSubmitted &&
        !focusLock
    ){


        focusWarnings++;


        if(focusWarnings < MAX_FOCUS_WARNING){

            alert(
            "⚠️ Warning "+focusWarnings+"/"+MAX_FOCUS_WARNING+
            "\n\nPlease remain in fullscreen mode."
            );

        }



        if(focusWarnings >= MAX_FOCUS_WARNING){


            focusLock = true;

            submitReason =
            "Auto Submit - Fullscreen Exit";


            alert(
            "❌ 3 warnings complete.\nTest submitted."
            );


            submitTest(true);

        }


    }


});

//================================
// PAGE LOAD
//================================

window.onload = function () {
    loadDuration();

};


//================================
// SHOW TIMER
//================================

function showTimer() {

    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    const timerBox = document.getElementById("timer");

    if (timerBox) {

        timerBox.innerHTML = minutes + ":" + seconds;

    }
}
//================================
// LOAD TEST DATE
//================================

//================================

// PAGE LOAD
loadHeaderDateTime();


//================================
// LOAD TEST TIME
//================================

function loadTestTime() {

    fetch(SCRIPT_URL + "?action=testTime")
        .then(res => res.text())
        .then(data => {

            const el = document.getElementById("testTime");

            if (el) {
                el.innerHTML = "🕒 Test Time : " + data;
            }

        })
        .catch(err => {

            console.log("Test Time Error :", err);

            const el = document.getElementById("testTime");

            if (el) {
                el.innerHTML = "🕒 Test Time : Not Available";
            }

        });

}



//================================
// LOAD TEST DURATION
//================================

function loadDuration() {

    fetch(SCRIPT_URL + "?action=duration")
        .then(res => res.text())
        .then(data => {

            let minutes = parseInt(data);

            if (isNaN(minutes) || minutes <= 0) {
                minutes = 30;
            }

            totalTime = minutes * 60;

            showTimer();

        })
        .catch(err => {

            console.log("Duration Error :", err);

            totalTime = 30 * 60;

            showTimer();

        });

}
//================================
// LOGIN SYSTEM
//================================

function startTest() {

    // Student Details
    studentName = document
        .getElementById("studentName")
        .value
        .trim();

    regNo = document
        .getElementById("regNo")
        .value
        .trim();

    // Validation
    if (studentName === "" || regNo === "") {

        alert("Please enter Name and Registration Number.");
        return;

    }

    // Disable Button
    const btn = document.getElementById("loginBtn");

    if (btn) {

        btn.disabled = true;
        btn.innerHTML = "Please Wait...";

    }

    // Login Request
    fetch(
        SCRIPT_URL +
        "?action=login" +
        "&regNo=" + encodeURIComponent(regNo) +
        "&name=" + encodeURIComponent(studentName)
    )

    .then(res => res.json())

    .then(data => {

        // Enable Button
        if (btn) {

            btn.disabled = false;
            btn.innerHTML = "Start Test";

        }

        if (data.status === "VALID") {

            studentName = data.name;
            regNo = data.regNo;
            paperName = data.paperName;

            checkTestStatus();

        }

        else if (data.status === "ALREADY_SUBMITTED") {

            alert("You have already submitted this test.");

        }

        else {

            alert("Invalid Registration Number or Name.");

        }

    })

    .catch(err => {

        console.log(err);

        if (btn) {

            btn.disabled = false;
            btn.innerHTML = "Start Test";

        }

        alert("Unable to connect with server.");

    });

}
//================================
// CHECK TEST STATUS
//================================

function checkTestStatus() {

    fetch(SCRIPT_URL + "?action=status")

    .then(res => res.text())

    .then(status => {

        status = status.trim().toUpperCase();

        if (status === "ON") {

            openTest();

        } else {

            const login = document.getElementById("loginPage");
            const waiting = document.getElementById("waitingPage");

            if (login) login.classList.add("hidden");
            if (waiting) waiting.classList.remove("hidden");

            showRandomLine();

            autoCheckStatus();

        }

    })

    .catch(err => {

        console.log(err);
        alert("Unable to check test status.");

    });

}



//================================
// AUTO CHECK TEST STATUS
//================================

function autoCheckStatus() {

    if (statusChecker !== null) return;

    statusChecker = setInterval(function () {

        fetch(SCRIPT_URL + "?action=status")

        .then(res => res.text())

        .then(status => {

            status = status.trim().toUpperCase();

            if (status === "ON") {

                clearInterval(statusChecker);
                statusChecker = null;

                openTest();

            }

        })

        .catch(err => {

            console.log(err);

        });

    }, 5000);

}



//================================
// MOTIVATION MESSAGE
//================================

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

    const box = document.getElementById("motivationText");

    if (box) {

        box.innerHTML =
            lines[Math.floor(Math.random() * lines.length)];

    }

}
//================================
// OPEN TEST
//================================

function openTest() {

    examSubmitted = false;
    submitReason = "Manual Submit";
    focusWarnings = 0;
    focusLock = false;

    // Pages
    const login = document.getElementById("loginPage");
    const waiting = document.getElementById("waitingPage");
    const test = document.getElementById("testPage");

    if (login) login.classList.add("hidden");
    if (waiting) waiting.classList.add("hidden");
    if (test) test.classList.remove("hidden");

    // Student Details
    const nameBox = document.getElementById("showName");
    const regBox = document.getElementById("showReg");
    const paperBox = document.getElementById("showPaper");

    if (nameBox) nameBox.innerHTML = studentName;
    if (regBox) regBox.innerHTML = regNo;
    if (paperBox) paperBox.innerHTML = paperName;

    // Show Instruction Page
    document.getElementById("instructionPage").classList.remove("hidden");
    document.getElementById("examArea").classList.add("hidden");

    // Reset Checkbox
    document.getElementById("acceptRules").checked = false;
    document.getElementById("startExamBtn").disabled = true;

}



//================================
// ENABLE START BUTTON
//================================

function enableStartExam() {

    const check = document.getElementById("acceptRules");
    const btn = document.getElementById("startExamBtn");

    btn.disabled = !check.checked;

}



//================================
// START EXAM
//================================

function startExam() {

    // Hide Instructions
    document.getElementById("instructionPage")
        .classList.add("hidden");

    // Show Exam Area
    document.getElementById("examArea")
        .classList.remove("hidden");

    // Load Questions
    loadPaperQuestions();

    // Start Timer
    startTimer();

    // Full Screen
    if (document.documentElement.requestFullscreen) {

        document.documentElement
            .requestFullscreen()
            .catch(() => {});

    }

}
//================================
// LOAD PAPER QUESTIONS
//================================

function loadPaperQuestions() {

    fetch(
        SCRIPT_URL +
        "?action=questions" +
        "&paper=" + encodeURIComponent(paperName)
    )

    .then(res => {

        if (!res.ok) {
            throw new Error("Server Error");
        }

        return res.json();

    })

    .then(data => {

        // Check Questions
        if (!Array.isArray(data) || data.length === 0) {

            alert("No questions found for " + paperName);
            return;

        }

        // Store Questions
        questions = data;

        // Reset Answers
        answers = new Array(questions.length).fill("");

        // Start From Question 1
        currentQuestion = 0;

        // Load First Question
        loadQuestion();

    })

    .catch(err => {

        console.error("Question Loading Error :", err);

        alert(
            "Unable to load questions.\nPlease contact administrator."
        );

    });

}
//================================
// LOAD QUESTION
//================================

function loadQuestion() {

    // Safety Check
    if (!questions || questions.length === 0) {
        return;
    }

    // Current Question
    const q = questions[currentQuestion];

    if (!q) {
        return;
    }

    //--------------------------------
    // Question Number
    //--------------------------------

    const qNo = document.getElementById("questionNumber");

    if (qNo) {

        qNo.innerHTML =
            "Question " +
            (currentQuestion + 1) +
            " of " +
            questions.length;

    }

    //--------------------------------
    // Question Text
    //--------------------------------

    const qText = document.getElementById("questionText");

    if (qText) {

        qText.innerHTML = q.question;

    }

    //--------------------------------
    // Options
    //--------------------------------

    const optionBox = document.getElementById("options");

    let html = "";

    q.options.forEach(function (option, index) {

        const checked =
            answers[currentQuestion] === option
                ? "checked"
                : "";

        html += `
            <label class="option">
                <input
                    type="radio"
                    name="answer"
                    ${checked}
                    onclick="saveAnswer(${index})">

                <span>${option}</span>
            </label>
        `;

    });

    optionBox.innerHTML = html;

    //--------------------------------
    // Update UI
    //--------------------------------

    updateProgress();

    createQuestionPalette();

}
//================================
// SAVE ANSWER
//================================

function saveAnswer(index) {

    // Save Selected Option
    answers[currentQuestion] =
        questions[currentQuestion].options[index];

    // Refresh Palette
    createQuestionPalette();

}



//================================
// QUESTION PALETTE
//================================

function createQuestionPalette() {

    const box =
        document.getElementById("questionNumbers");

    if (!box) return;

    // Clear Old Buttons
    box.innerHTML = "";

    // Create Buttons
    questions.forEach(function (q, index) {

        const btn = document.createElement("button");

        btn.innerHTML = index + 1;

        btn.className = "q-btn";

        //--------------------------------
        // Current Question
        //--------------------------------

        if (index === currentQuestion) {

            btn.classList.add("active");

        }

        //--------------------------------
        // Answered Question
        //--------------------------------

        if (
            answers[index] !== "" &&
            answers[index] !== undefined
        ) {

            btn.classList.add("done");

        }

        //--------------------------------
        // Jump to Question
        //--------------------------------

        btn.onclick = function () {

            currentQuestion = index;

            loadQuestion();

        };

        box.appendChild(btn);

    });

}
    //================================
// NEXT QUESTION
//================================

function nextQuestion() {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    }

}



//================================
// PREVIOUS QUESTION
//================================

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();

    }

}



//================================
// GO TO QUESTION
//================================

function gotoQuestion(index) {

    if (index < 0 || index >= questions.length) {
        return;
    }

    currentQuestion = index;

    loadQuestion();

}



//================================
// UPDATE PROGRESS BAR
//================================

function updateProgress() {

    const bar = document.getElementById("progressBar");

    const text = document.getElementById("progressText");

    if (!bar) return;

    // Progress %
    const percent =
        ((currentQuestion + 1) / questions.length) * 100;

    bar.style.width = percent + "%";

    // Optional Text
    if (text) {

        text.innerHTML =
            (currentQuestion + 1) +
            " / " +
            questions.length;

    }

}
    //================================
// START TIMER
//================================

function startTimer() {

    // Stop old timer if running
    if (timer !== null) {

        clearInterval(timer);

    }

    // Show current timer
    showTimer();

    timer = setInterval(function () {

        totalTime--;

        // Update Timer UI
        showTimer();

        // Time Over
        if (totalTime <= 0) {

            clearInterval(timer);
            timer = null;

            submitReason = "Time Over";

            alert("Time is over.\nYour test will be submitted automatically.");

            submitTest(true);

        }

    }, 1000);

}



//================================
// STOP TIMER
//================================

function stopTimer() {

    if (timer !== null) {

        clearInterval(timer);

        timer = null;

    }

}
    //================================
// SUBMIT TEST
//================================

function submitTest(autoSubmit = false) {

    // Prevent Duplicate Submit
    if (examSubmitted) {
        return;
    }

    examSubmitted = true;

    // Manual Confirmation
    if (!autoSubmit) {

        const ok = confirm(
            "Are you sure you want to submit the test?"
        );

        if (!ok) {

            examSubmitted = false;
            return;

        }

    }

    // Stop Timer
    stopTimer();

    // Disable Submit Button
    const submitBtn = document.getElementById("submitBtn");

    if (submitBtn) {

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";

    }

    //--------------------------------
    // Prepare Data
    //--------------------------------

    const data = {

        name: studentName,
        regNo: regNo,
        paperName: paperName,

        submittedAt: new Date().toLocaleString(),

        submitReason: submitReason,

        answers: answers

    };

    //--------------------------------
    // Send to Apps Script
    //--------------------------------

    fetch(SCRIPT_URL, {

    method:"POST",

    body:JSON.stringify(data)

})
.then(res=>res.text())

.then(result=>{

    console.log(result);

    if(result.trim()=="SUCCESS"){

        showSuccess();

    }
    else{

        alert(result);

    }

})
.catch(err=>{

    console.log(err);

    alert("Unable to submit responses");

});

}
    //================================
// SUCCESS PAGE
//================================

function showSuccess() {

    // Stop Timer
    stopTimer();

    // Hide Pages
    document.getElementById("testPage")?.classList.add("hidden");
    document.getElementById("waitingPage")?.classList.add("hidden");

    // Show Success Page
    document.getElementById("successPage")?.classList.remove("hidden");

}



//================================
// GO TO LOGIN PAGE
//================================


    //================================
// EXAM SECURITY - BASIC
//================================

// Disable Right Click
document.addEventListener("contextmenu", function (e) {

    e.preventDefault();

});

// Disable Copy
document.addEventListener("copy", function (e) {

    e.preventDefault();

});

// Disable Cut
document.addEventListener("cut", function (e) {

    e.preventDefault();

});

// Disable Paste
document.addEventListener("paste", function (e) {

    e.preventDefault();

});

// Disable Drag
document.addEventListener("dragstart", function (e) {

    e.preventDefault();

});

// Disable Select
document.addEventListener("selectstart", function (e) {

    e.preventDefault();

});


//================================
// KEYBOARD SECURITY
//================================

document.addEventListener("keydown", function (e) {

    // F12
    if (e.key === "F12") {

        e.preventDefault();
        return;

    }

    // Ctrl + U
    if (e.ctrlKey && e.key.toLowerCase() === "u") {

        e.preventDefault();
        return;

    }

    // Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {

        e.preventDefault();
        return;

    }

    // Ctrl + Shift + J
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {

        e.preventDefault();
        return;

    }

    // Ctrl + Shift + C
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {

        e.preventDefault();
        return;

    }

    // Ctrl + S
    if (e.ctrlKey && e.key.toLowerCase() === "s") {

        e.preventDefault();
        return;

    }

    // Ctrl + P
    if (e.ctrlKey && e.key.toLowerCase() === "p") {

        e.preventDefault();
        return;

    }

});
    //================================
// EXAM SECURITY SYSTEM
//================================

// Check if Exam is Running
function isExamRunning() {

    const examArea = document.getElementById("examArea");

    return (
        examArea &&
        !examArea.classList.contains("hidden") &&
        !examSubmitted
    );

}



//================================
// AUTO SUBMIT
//================================

function securitySubmit(reason) {

    if (examSubmitted) return;

    submitReason = reason;

    examSubmitted = true;

    alert(
        "⚠ Test Submitted Automatically.\n\nReason:\n" +
        reason
    );

    submitTest(true);

}



//================================
// WARNING SYSTEM
//================================

function giveFocusWarning(reason) {

    if (!isExamRunning()) return;

    if (focusLock) return;

    focusLock = true;

    focusWarnings++;

    if (focusWarnings >= MAX_FOCUS_WARNING) {

        securitySubmit(reason);
        return;

    }

    alert(
        "⚠ Warning " +
        focusWarnings +
        " of " +
        MAX_FOCUS_WARNING +
        "\n\n" +
        reason +
        "\n\nNext violation may submit your test automatically."
    );

    setTimeout(function () {

        focusLock = false;

    }, 1000);

}



//================================
// TAB CHANGE / MINIMIZE
//================================

document.addEventListener("visibilitychange", function () {

    if (document.hidden) {

        giveFocusWarning(
            "Tab changed or browser minimized."
        );

    }

});



//================================
// FULLSCREEN EXIT
//================================

document.addEventListener("fullscreenchange", function () {

    if (
        isExamRunning() &&
        !document.fullscreenElement
    ) {

        giveFocusWarning(
            "Fullscreen mode exited."
        );

    }

});



//================================
// REFRESH / CLOSE WARNING
//================================

window.addEventListener("beforeunload", function (e) {

    if (!isExamRunning()) return;

    e.preventDefault();
    e.returnValue = "";

});



//================================
// BACK BUTTON BLOCK
//================================

history.pushState(null, "", location.href);

window.addEventListener("popstate", function () {

    history.pushState(null, "", location.href);

    if (isExamRunning()) {

        giveFocusWarning(
            "Back button is not allowed."
        );

    }

});
    //================================
// RESET EXAM
//================================

function resetExam() {

    studentName = "";
    regNo = "";
    paperName = "";

    questions = [];
    answers = [];

    currentQuestion = 0;

    examSubmitted = false;

    submitReason = "Manual Submit";

    focusWarnings = 0;

    focusLock = false;

    stopTimer();

    totalTime = 30 * 60;

    showTimer();

}



//================================
// RESTART LOGIN PAGE
//================================

function goLogin() {

    resetExam();

    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("waitingPage").classList.add("hidden");

    document.getElementById("testPage").classList.add("hidden");

    document.getElementById("successPage").classList.add("hidden");

    document.getElementById("studentName").value = "";

    document.getElementById("regNo").value = "";

}



//================================
// SHOW SUCCESS
//================================

function logoutExam() {

    if(confirm("Do you want to exit the test?")){

        goLogin();

    }

}



//================================
// CLEAR WAITING TIMER
//================================

function stopStatusChecker(){

    if(statusChecker!=null){

        clearInterval(statusChecker);

        statusChecker=null;

    }

}



//================================
// WINDOW LOAD SAFETY
//================================

window.addEventListener("load",function(){

    showTimer();

});



//================================
// END OF SCRIPT
//================================

console.log(
"IKON ONLINE TEST SYSTEM LOADED SUCCESSFULLY"
);
