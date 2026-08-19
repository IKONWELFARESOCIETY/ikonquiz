//====================================================
// IKON ONLINE TEST SYSTEM
// script.js
// PART 1A : CONFIGURATION + GLOBAL VARIABLES
//====================================================


//====================================================
// GOOGLE APPS SCRIPT URL
//====================================================

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxvJs4QgvlSBAbcg5zuRyS8TeAzAt-en0h5Kb0V_FUtR6r3HVk-XOxchf0EnKiqEhbr6w/exec";


//====================================================
// STUDENT DETAILS
//====================================================

let studentName = "";
let regNo = "";
let paperName = "";
let theoryPapers = [];
let practicalPapers = [];
let examMode = "";
let studentId = "";
let courseName = "";
let totalMarks = "";
let passingMarks = "";


//====================================================
// QUESTION DATA
//====================================================

let questions = [];
let answers = [];
let currentQuestion = 0;
//====================================================
// PRACTICAL TIMER
//====================================================

let practicalDuration = 15;

let practicalTotalTime = 15 * 60;

let practicalTimer = null;


//====================================================
// EXAM STATE
//====================================================

let examStarted = false;
let examSubmitted = false;

let submitReason = "Manual Submit";



//====================================================
// SECURITY
//====================================================

let focusWarnings = 0;

const MAX_FOCUS_WARNING = 3;

let focusLock = false;

//====================================================
// RESULT ACCESS MODE
//====================================================

let isAdminMode = false;

//====================================================
// TIMER
//====================================================

let totalTime = 30 * 60;

let timer = null;
let examDuration = 30;


//====================================================
// WAITING PAGE STATUS CHECKER
//====================================================

let statusChecker = null;



//====================================================
// PAGE INITIALIZATION
//====================================================

window.addEventListener("DOMContentLoaded", initializeSystem);

function initializeSystem() {

    console.log("IKON ONLINE TEST SYSTEM");

    loadExamSettings();
    loadDuration();
    loadTestDate();
    loadTestTime();
    showTimer();
    checkQRVerification();
    loadPracticalTime();

}

//====================================================
// LOAD PRACTICAL TIME
//====================================================

function loadPracticalTime(){

    fetch(
        SCRIPT_URL + "?action=practicalTime"
    )

    .then(res => res.text())

    .then(function(data){

        practicalDuration = parseInt(data);

        if(
            isNaN(practicalDuration) ||
            practicalDuration <= 0
        ){

            practicalDuration = 15;

        }

        practicalTotalTime =
            practicalDuration * 60;

        console.log(
            "Practical Duration :",
            practicalDuration
        );

    })

    .catch(function(){

        practicalDuration = 15;

        practicalTotalTime =
            practicalDuration * 60;

    });

}

//====================================================
// LOAD EXAM SETTINGS
//====================================================

function loadExamSettings() {

    //--------------------------
    // STATUS
    //--------------------------

    fetch(SCRIPT_URL + "?action=status")

        .then(res => res.text())

        .then(status => {

            console.log("Exam Status :", status);

        })

        .catch(err => console.log(err));



    //--------------------------
    // DURATION
    //--------------------------

    //--------------------------
// DURATION
//--------------------------

fetch(SCRIPT_URL + "?action=duration")

.then(res => res.text())

.then(duration => {

    examDuration = parseInt(duration);

    if (!isNaN(examDuration) && examDuration > 0) {

        totalTime = examDuration * 60;

        showTimer();

        console.log("Exam Duration :", examDuration);

    } else {

        console.log("Invalid Duration :", duration);

    }

})

.catch(err => console.log(err));



    //--------------------------
    // TOTAL QUESTIONS
    //--------------------------

    fetch(SCRIPT_URL + "?action=totalQuestions")

        .then(res => res.text())

        .then(total => {

            console.log("Questions :", total);

        })

        .catch(err => console.log(err));

}



//====================================================
// LOAD TEST DURATION
//====================================================

function loadDuration() {

    fetch(SCRIPT_URL + "?action=duration")

    .then(res => res.text())

    .then(data => {

        examDuration = parseInt(data);

        if (isNaN(examDuration) || examDuration <= 0) {
            examDuration = 30;
        }

        totalTime = examDuration * 60;

        showTimer();

    })

    .catch(() => {

        examDuration = 30;
        totalTime = examDuration * 60;

        showTimer();

    });

}


//====================================================
// LOAD TEST TIME
//====================================================

//====================================================
// LOAD TEST TIME
//====================================================

function loadTestTime() {

    fetch(SCRIPT_URL + "?action=testTime")

        .then(function(res) {

            return res.text();

        })

        .then(function(data) {

            data = data.trim();

            const box =
                document.getElementById("testTime");

            if (!box) return;

            if (data !== "") {

                box.innerHTML =
                    "🕒 Test Time : " + data;

            }
            else {

                box.innerHTML =
                    "🕒 Test Time : --";

            }

        })

        .catch(function(err) {

            console.log("Test Time Error :", err);

            const box =
                document.getElementById("testTime");

            if (box) {

                box.innerHTML =
                    "🕒 Test Time : --";

            }

        });

}



//====================================================
// LOAD TEST DATE
//====================================================

function loadTestDate() {

    fetch(SCRIPT_URL + "?action=testDate")

        .then(function(res) {

            return res.text();

        })

        .then(function(data) {

            data = data.trim();

            const box =
                document.getElementById("testDate");

            if (!box) return;

            if (data !== "") {

                box.innerHTML =
                    "📅 Exam Date : " + data;

            }
            else {

                box.innerHTML =
                    "📅 Exam Date : --";

            }

        })

        .catch(function(err) {

            console.log("Test Date Error :", err);

            const box =
                document.getElementById("testDate");

            if (box) {

                box.innerHTML =
                    "📅 Exam Date : --";

            }

        });

}

//====================================================
// TIMER DISPLAY
//====================================================

function showTimer() {

    const minute = Math.floor(totalTime / 60);

    const second = totalTime % 60;

    const text =
        String(minute).padStart(2, "0") +
        ":" +
        String(second).padStart(2, "0");

    const timerBox = document.getElementById("timer");

    if (timerBox) {

        timerBox.innerHTML = text;

    }

}



//====================================================
// LOAD STUDENT PHOTO
//====================================================

function loadStudentPhoto(regNo) {

    const img = document.getElementById("studentPhoto");

    if (!img) {
        console.log("studentPhoto element not found");
        return;
    }

    console.log("Reg No =", regNo);
    console.log("Image Path =", regNo + ".jpeg");

    img.src = regNo + ".jpeg";

    img.onload = function () {
        console.log("Image Loaded");
    };

    img.onerror = function () {
        console.log("Image Not Found");
        this.src = "no-photo.jpeg";
    };

}
//====================================================
// RANDOMIZE QUESTIONS
//====================================================
function shuffleQuestions(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

}


//====================================================
// END OF PART 1A
//====================================================
//====================================================
// PART 1B-1
// LOGIN SYSTEM
//====================================================

function startTest() {

    //----------------------------------
    // Read Input
    //----------------------------------

    studentName = document
        .getElementById("studentName")
        .value
        .trim();

    regNo = document
        .getElementById("regNo")
        .value
        .trim();

    //----------------------------------
    // Validation
    //----------------------------------

    if (studentName === "" || regNo === "") {

        alert("Please enter Name and Registration Number.");

        return;

    }

    //----------------------------------
    // Login Button
    //----------------------------------

    const loginBtn = document.getElementById("loginBtn");

    loginBtn.disabled = true;

    loginBtn.innerHTML = "Please Wait...";

    //----------------------------------
    // Login API
    //----------------------------------

    fetch(

        SCRIPT_URL +

        "?action=login" +

        "&regNo=" + encodeURIComponent(regNo) +

        "&name=" + encodeURIComponent(studentName)

    )

    .then(function (res) {

        if (!res.ok) {

            throw new Error("Server Error");

        }

        return res.json();

    })

    .then(function (data) {

        console.log("Login Response :", data);

        loginBtn.disabled = false;

        loginBtn.innerHTML = "Start Test";

        //----------------------------------
        // Valid Student
        //----------------------------------

        if (data.status === "VALID") {

            studentName = data.name;

            regNo = data.regNo;
            studentId = data.idNo;
         courseName = data.course;
        totalMarks = data.totalMarks;
        passingMarks = data.passingMarks;
            theoryPapers = data.theoryPapers || [];
practicalPapers = data.practicalPapers || [];

            if(
    theoryPapers.length===0 &&
    practicalPapers.length===0
){

    alert(
        "All assigned examinations have already been completed."
    );

    return;

}
           openExamTypePage();

return;
        }

        //----------------------------------
        // Already Submitted
        //----------------------------------

        if(data.status==="ALL_SUBMITTED"){

    alert("All examinations have already been completed.");

    return;

}
        //----------------------------------
        // Invalid Login
        //----------------------------------

        alert("Invalid Registration Number or Student Name.");

    })

    .catch(function (err) {

        console.log(err);

        loginBtn.disabled = false;

        loginBtn.innerHTML = "Start Test";

        alert("Unable to connect with server.");

    });

}

//====================================================
// OPEN EXAM TYPE PAGE
//====================================================

function openExamTypePage(){

    document
    .getElementById("loginPage")
    ?.classList.add("hidden");

    document
    .getElementById("examTypePage")
    ?.classList.remove("hidden");

    document.getElementById("examTypeStudentName").textContent =
    studentName;

    document.getElementById("examTypeRegNo").textContent =
    regNo;

    document.getElementById("examTypeCourse").textContent =
    courseName;

}
//====================================================
// THEORY EXAM
//====================================================

function continueTheoryExam(){

    const select =
    document.getElementById("theoryPaperSelect");

    if(select.value==""){

        alert("Please Select Theory Paper");

        return;

    }

    paperName = select.value;

    examMode = "THEORY";

    fetch(
        SCRIPT_URL + "?action=theoryStatus"
    )

    .then(res=>res.json())

    .then(function(data){

        if(
            data.status &&
            data.status.toUpperCase()=="ON"
        ){

            document
            .getElementById("theoryPaperPage")
            ?.classList.add("hidden");

            checkTestStatus();

        }else{

            alert(
                data.message ||
                "Theory Examination is not available."
            );

        }

    })

    .catch(function(){

        alert("Unable to check Theory Status.");

    });

}
//====================================================
// PRACTICAL EXAM
//====================================================

//====================================================
// PRACTICAL EXAM
//====================================================


//====================================================
// OPEN PRACTICAL PAGE
//====================================================

function continuePracticalExam(){

    const select =
    document.getElementById("practicalPaperSelect");

    if(select.value==""){

        alert("Please Select Practical Paper");

        return;

    }

    paperName = select.value;

    examMode = "PRACTICAL";

    document
        .getElementById("practicalPaperPage")
        ?.classList.add("hidden");

    document
        .getElementById("practicalPage")
        ?.classList.remove("hidden");

    // Student Details

    document.getElementById("prStudentName").textContent =
        studentName;

    document.getElementById("prRegNo").textContent =
        regNo;

    document.getElementById("prCourse").textContent =
        courseName;

    document.getElementById("prPaper").textContent =
        paperName;

    // Exam Date

    const examDate =
        document.getElementById("testDate");

    if(examDate){

        document.getElementById("prExamDate").textContent =
            examDate.textContent.replace("📅 Exam Date : ","");

    }

    // Load Questions

    loadPracticalQuestions();

}
    //====================================================
// SHOW PRACTICAL TIMER
//====================================================

function showPracticalTimer(){

    const minute =
        Math.floor(practicalTotalTime / 60);

    const second =
        practicalTotalTime % 60;

    const timerBox =
        document.getElementById("practicalTimer");

    if(!timerBox){
        return;
    }

    timerBox.innerHTML =

        String(minute).padStart(2,"0")

        + ":"

        + String(second).padStart(2,"0");

}
    //====================================================
// START PRACTICAL TIMER
//====================================================

function startPracticalTimer(){

    // Stop old timer if running
    if(practicalTimer){

        clearInterval(practicalTimer);

    }

    practicalTimer = setInterval(function(){

        practicalTotalTime--;

        showPracticalTimer();

        // Last 5 Minutes

        const timerBox =
            document.getElementById("practicalTimer");

        if(timerBox){

            if(practicalTotalTime <= 300){

                timerBox.style.color = "#d32f2f";

            }

        }

        // Time Over

        if(practicalTotalTime <= 0){

            clearInterval(practicalTimer);

            practicalTimer = null;

            alert(
                "Practical Exam Time Over.\nYour practical will be submitted automatically."
            );

            submitPractical();

        }

    },1000);

}
function stopPracticalTimer(){

    if(practicalTimer){

        clearInterval(practicalTimer);

        practicalTimer = null;

    }

}
//====================================================
// LOAD PRACTICAL QUESTIONS
//====================================================

function loadPracticalQuestions(){

    const area =
        document.getElementById(
            "practicalQuestionArea"
        );

    area.innerHTML =
        "<h3>Loading Questions...</h3>";

    fetch(

        SCRIPT_URL +

        "?action=practicalQuestions" +

       "&paper=" +
encodeURIComponent(paperName)

    )

    .then(res=>res.json())

    .then(function(data){

        if(data.status!="SUCCESS"){

            area.innerHTML =
                "<h3>"+data.message+"</h3>";

            return;

        }

        let html="";

        data.questions.forEach(function(q,index){

           html +=

'<div class="prQuestionCard">' +

    '<div class="prQuestionNo">' +

        'Question ' + (index+1) +

    '</div>' +

    '<div class="prTopic">' +

        '<b>Topic :</b> ' +

        q.topic +

    '</div>' +

    '<div class="prQuestionText">' +

        q.question +

    '</div>' +
               '<div class="prQuestionMarks">' +
    'Marks: ' + q.marks +
'</div>' +

    '<div class="prUploadBox">' +

        '<label>' +

            'Upload Screenshot' +

        '</label>' +

        '<input ' +

            'type="file" ' +

            'class="prScreenshot" ' +

            'data-topic="' + q.topic + '" ' +
               'data-question="' + encodeURIComponent(q.question) + '" ' +
            'accept=".png,.jpg,.jpeg">' +

    '</div>' +

'</div>';
        });

        area.innerHTML = html;

        //------------------------------------
        // Timer Start
        //------------------------------------

        practicalTotalTime =
            practicalDuration * 60;

        showPracticalTimer();

        startPracticalTimer();

    })

    .catch(function(){

        area.innerHTML =
        "<h3>Unable to Load Questions</h3>";

    });

}

//====================================================
// PART 1B-2
// TEST STATUS + WAITING PAGE
//====================================================


//====================================================
// CHECK TEST STATUS
//====================================================



//====================================================
// AUTO STATUS CHECK
//====================================================

function autoCheckStatus() {

    if (statusChecker !== null)
        return;

    statusChecker = setInterval(function () {

        fetch(SCRIPT_URL + "?action=status")

        .then(function (res) {

            return res.text();

        })

        .then(function (status) {

            status = status.trim().toUpperCase();

            if (status === "ON") {

                clearInterval(statusChecker);

                statusChecker = null;

                openTest();

            }

        })

        .catch(function (err) {

            console.log(err);

        });

    }, 5000);

}



//====================================================
// STOP AUTO CHECK
//====================================================

function stopStatusChecker() {

    if (statusChecker !== null) {

        clearInterval(statusChecker);

        statusChecker = null;

    }

}





//====================================================
// SHOW RANDOM LINE
//====================================================

function showRandomLine() {

    const box =
        document.getElementById("motivationText");

    if (!box)
        return;

    const random =
        Math.floor(
            Math.random() *
            motivationLines.length
        );

    box.innerHTML =
        motivationLines[random];

}



//====================================================
// OPEN TEST
//====================================================

function openTest() {

    // Stop waiting checker
    stopStatusChecker();

    // Reset flags
    examSubmitted = false;
    submitReason = "Manual Submit";
    focusWarnings = 0;
    focusLock = false;


    // Hide Login
    const loginPage = document.getElementById("loginPage");
    if(loginPage)
        loginPage.classList.add("hidden");


    // Hide Waiting
    const waitingPage = document.getElementById("waitingPage");
    if(waitingPage)
        waitingPage.classList.add("hidden");


    // Show Test Page
    const testPage = document.getElementById("testPage");
    if(testPage)
        testPage.classList.remove("hidden");


    // Student Details

    const showName = document.getElementById("showName");
    const showReg = document.getElementById("showReg");
    const showPaper = document.getElementById("showPaper");
    const showCourse = document.getElementById("showCourse");
    const showMarks = document.getElementById("showMarks");
    const showPassing = document.getElementById("showPassingMarks");


    if(showName)
        showName.innerHTML = studentName;


    if(showReg)
        showReg.innerHTML = regNo;


    if(showPaper)
        showPaper.innerHTML = paperName;


    if(showCourse)
        showCourse.innerHTML = courseName;


    if(showMarks)
        showMarks.innerHTML = totalMarks;


    if(showPassing)
        showPassing.innerHTML = passingMarks;



    // Load Photo safely

    if(typeof loadStudentPhoto === "function"){
        loadStudentPhoto(regNo);
    }



    // Hide Exam Area

    const examArea = document.getElementById("examArea");

    if(examArea)
        examArea.classList.add("hidden");



    // Show Instruction Page

    //=====================================
// Show Verification Page First
//=====================================

document
.getElementById("verificationPage")
?.classList.remove("hidden");

document
.getElementById("instructionPage")
?.classList.add("hidden");



    // Reset checkbox

    const rules =
        document.getElementById("acceptRules");

    if(rules)
        rules.checked = false;



    // Disable Start Button

    const startBtn =
        document.getElementById("startExamBtn");


    if(startBtn)
        startBtn.disabled = true;

}
//====================================================
// VERIFY STUDENT ID
//====================================================

function verifyStudentID() {

    const input = document.getElementById("studentIdInput");

    if (!input) {
        alert("Student ID input not found.");
        return;
    }

    const enteredId = String(input.value).trim();
    const savedId = String(studentId || "").trim();

    if (enteredId === "") {
        alert("Please enter Student ID.");
        input.focus();
        return;
    }

    if (enteredId.toUpperCase() !== savedId.toUpperCase()) {
        alert("Invalid Student ID.");
        input.focus();
        return;
    }

    document.getElementById("verificationPage")?.classList.add("hidden");
    document.getElementById("instructionPage")?.classList.remove("hidden");
}
//====================================================
// ENABLE START BUTTON
//====================================================

function enableStartExam() {

    const check =
        document.getElementById("acceptRules");

    const btn =
        document.getElementById("startExamBtn");

    if (!check || !btn)
        return;

    btn.disabled = !check.checked;

}
//====================================================
// PART 1B-2
// TEST STATUS + WAITING PAGE
//====================================================


//====================================================
// CHECK TEST STATUS
//====================================================

function checkTestStatus() {

    fetch(SCRIPT_URL + "?action=status")

    .then(function(res){
        return res.text();
    })

    .then(function(status){

        status = status.trim().toUpperCase();

        console.log("STATUS =", status);


        if(status === "ON"){

            openTest();

        }
        else{

            document
            .getElementById("loginPage")
            ?.classList.add("hidden");


            document
            .getElementById("waitingPage")
            ?.classList.remove("hidden");


            autoCheckStatus();

        }

    })

    .catch(function(error){

        console.log(error);

    });

}


//====================================================
// STOP AUTO CHECK
//====================================================

function stopStatusChecker() {

    if (statusChecker !== null) {

        clearInterval(statusChecker);

        statusChecker = null;

    }

}



//====================================================
// MOTIVATION LINES
//====================================================

const motivationLines = [

    "Believe in yourself.",

    "Stay calm and focused.",

    "Every question is an opportunity.",

    "Hard work always pays.",

    "Success begins with confidence.",

    "Stay positive and give your best.",

    "Read every question carefully.",

    "Confidence is your biggest strength.",

    "You can do it!",

    "Never lose your focus.",
 "Success is the sum of small efforts repeated day after day.",

"Believe in yourself. You are capable of amazing things.",

"Every exam is a step toward your dreams.",

"Hard work always beats talent when talent doesn't work hard.",

"Keep learning. Keep growing. Keep winning.",

"Your future is created by what you do today.",

"Small progress every day leads to big success.",

"Never stop learning because life never stops teaching."

];



//====================================================
// SHOW RANDOM LINE
//====================================================

function showRandomLine() {

    const box =
        document.getElementById("motivationText");

    if (!box)
        return;

    const random =
        Math.floor(
            Math.random() *
            motivationLines.length
        );

    box.innerHTML =
        motivationLines[random];

}



//====================================================
// OPEN TEST
//====================================================

//====================================================
// PART 2A
// START EXAM + LOAD QUESTIONS
//====================================================


//====================================================
// START EXAM
//====================================================

function startExam() {

    //------------------------------------------
    // Prevent Double Click
    //------------------------------------------

    if (examStarted) {
        return;
    }

    //------------------------------------------
    // Exam State
    //------------------------------------------

    examStarted = true;

    examSubmitted = false;

    focusWarnings = 0;

    focusLock = false;

    //------------------------------------------
    // Hide Instructions
    //------------------------------------------

    document
        .getElementById("instructionPage")
        ?.classList.add("hidden");

    //------------------------------------------
    // Show Exam Area
    //------------------------------------------

    document
        .getElementById("examArea")
        ?.classList.remove("hidden");

    //------------------------------------------
    // Start Timer
    //------------------------------------------
    totalTime = examDuration * 60;

    showTimer();
    startTimer();

    //------------------------------------------
    // Load Questions
    //------------------------------------------

    loadPaperQuestions();

    //------------------------------------------
    // Fullscreen
    //------------------------------------------

    if (
        document.documentElement.requestFullscreen &&
        !document.fullscreenElement
    ) {

        document.documentElement
            .requestFullscreen()
            .catch(function () {});

    }

}


//====================================================
// LOAD PAPER QUESTIONS
//====================================================

function loadPaperQuestions() {

    const url =
        SCRIPT_URL +
        "?action=questions&paper=" +
        encodeURIComponent(paperName);

    fetch(url)

    .then(function (res) {

        if (!res.ok) {

            throw new Error("Server Error");

        }

        return res.json();

    })

    .then(function (data) {

        //--------------------------------------
        // Validate
        //--------------------------------------

        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            alert(
                "No questions found for this paper."
            );

            return;

        }

        //--------------------------------------
        // Store Questions
        //--------------------------------------

        questions = data;
      
        shuffleQuestions(questions);

        //--------------------------------------
        // Reset Answers
        //--------------------------------------

        answers =
            new Array(questions.length).fill("");

        //--------------------------------------
        // First Question
        //--------------------------------------

        currentQuestion = 0;

        //--------------------------------------
        // Progress
        //--------------------------------------

        updateProgress();

        //--------------------------------------
        // Load
        //--------------------------------------

        loadQuestion();

    })

    .catch(function (err) {

        console.log(err);

        alert(
            "Unable to load questions.\nPlease contact Administrator."
        );

    });

}



//====================================================
// LOAD QUESTION
//====================================================

function loadQuestion() {

    //------------------------------------------
    // Safety
    //------------------------------------------

    if (
        !questions ||
        questions.length === 0
    ) {
        return;
    }

    //------------------------------------------
    // Current Question
    //------------------------------------------

    const q =
        questions[currentQuestion];

    if (!q) return;

    //------------------------------------------
    // Question Number
    //------------------------------------------

    const number =
        document.getElementById(
            "questionNumber"
        );

    if (number) {

        number.innerHTML =
            "Question " +
            (currentQuestion + 1) +
            " of " +
            questions.length;

    }

    //------------------------------------------
    // Question Text
    //------------------------------------------

    const text =
        document.getElementById(
            "questionText"
        );

    if (text) {

        text.innerHTML = q.question;

    }
const hindiText =
    document.getElementById(
        "questionHindi"
    );

if (hindiText) {

    hindiText.innerHTML = q.hindiQuestion || "";

}
    //------------------------------------------
    // Options
    //------------------------------------------

    const optionBox =
        document.getElementById(
            "options"
        );

    if (!optionBox)
        return;

    optionBox.innerHTML = "";

    //------------------------------------------
    // Create Options
    //------------------------------------------

    q.options.forEach(function (
        option,
        index
    ) {

        const label =
            document.createElement("label");

        label.className = "option";

        const input =
            document.createElement("input");

        input.type = "radio";

        input.name = "answer";

        input.checked =
            answers[currentQuestion] === option;

        input.onclick = function () {

            saveAnswer(index);

        };
        const letters = ["A","B","C","D"];
        
        const letter = document.createElement("span");
        letter.className = "option-letter";
        letter.innerHTML = letters[index] + ".";
        
        const text = document.createElement("span");
        text.className = "option-text";
        text.innerHTML = option;
        
        label.appendChild(input);
        label.appendChild(letter);
        label.appendChild(text);
        optionBox.appendChild(label);
    });

    //------------------------------------------
    // Navigation Button
    //------------------------------------------

    const prev =
        document.getElementById(
            "prevBtn"
        );

    const next =
        document.getElementById(
            "nextBtn"
        );

    if (prev) {

        prev.disabled =
            currentQuestion === 0;

    }

    if (next) {

        next.disabled =
            currentQuestion ===
            questions.length - 1;

    }

    //------------------------------------------
    // Refresh UI
    //------------------------------------------

    updateProgress();

    createQuestionPalette();

}
//====================================================
// PART 2B
// ANSWER SYSTEM + QUESTION NAVIGATION
//====================================================


//====================================================
// SAVE ANSWER
//====================================================

function saveAnswer(optionIndex) {

    if (
        !questions.length ||
        !questions[currentQuestion]
    ) {
        return;
    }

    answers[currentQuestion] =
        questions[currentQuestion].options[optionIndex];

    createQuestionPalette();

}



//====================================================
// CREATE QUESTION PALETTE
//====================================================

function createQuestionPalette() {

    const container =
        document.getElementById("questionNumbers");

    if (!container) return;

    container.innerHTML = "";

    questions.forEach(function (question, index) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.innerHTML = index + 1;

        button.className = "q-btn";

        //------------------------------------
        // Current Question
        //------------------------------------

        if (index === currentQuestion) {

            button.classList.add("active");

        }

        //------------------------------------
        // Answered Question
        //------------------------------------

        if (
            answers[index] !== "" &&
            answers[index] !== undefined
        ) {

            button.classList.add("done");

        }

        //------------------------------------
        // Jump Question
        //------------------------------------

        button.addEventListener("click", function () {

            gotoQuestion(index);

        });

        container.appendChild(button);

    });

}



//====================================================
// NEXT QUESTION
//====================================================

function nextQuestion() {

    if (
        currentQuestion >=
        questions.length - 1
    ) {

        return;

    }

    currentQuestion++;

    loadQuestion();

}



//====================================================
// PREVIOUS QUESTION
//====================================================

function previousQuestion() {

    if (currentQuestion <= 0) {

        return;

    }

    currentQuestion--;

    loadQuestion();

}



//====================================================
// GOTO QUESTION
//====================================================

function gotoQuestion(index) {

    if (

        index < 0 ||

        index >= questions.length

    ) {

        return;

    }

    currentQuestion = index;

    loadQuestion();

}



//====================================================
// UPDATE PROGRESS
//====================================================

function updateProgress() {

    if (!questions.length)
        return;

    const progressBar =
        document.getElementById("progressBar");

    const progressText =
        document.getElementById("progressText");

    const percent =

        ((currentQuestion + 1) /

        questions.length) * 100;

    if (progressBar) {

        progressBar.style.width =
            percent + "%";

    }

    if (progressText) {

        progressText.innerHTML =

            "Question " +

            (currentQuestion + 1) +

            " / " +

            questions.length;

    }

}



//====================================================
// ANSWER SUMMARY
//====================================================

function getAnsweredCount() {

    return answers.filter(function (answer) {

        return answer !== "";

    }).length;

}



//====================================================
// UNANSWERED COUNT
//====================================================

function getUnansweredCount() {

    return questions.length -

           getAnsweredCount();

}
//====================================================
// PART 3A-1
// TIMER SYSTEM
//====================================================


//====================================================
// START TIMER
//====================================================

function startTimer() {

    //------------------------------------------
    // Prevent Duplicate Timer
    //------------------------------------------

    stopTimer();

    showTimer();

    timer = setInterval(function () {

        totalTime--;

        showTimer();

        //----------------------------------
        // Last 5 Minutes
        //----------------------------------

        const timerBox =
            document.getElementById("timer");

        if (timerBox) {

            if (totalTime <= 300) {

                timerBox.classList.add("timer-danger");

            } else {

                timerBox.classList.remove("timer-danger");

            }

        }

        //----------------------------------
        // Time Over
        //----------------------------------

        if (totalTime <= 0) {

            stopTimer();

            submitReason = "Time Over";

            alert(
                "Time is over.\nYour test will be submitted automatically."
            );

            submitTest(true);

        }

    }, 1000);

}



//====================================================
// STOP TIMER
//====================================================

function stopTimer() {

    if (timer) {

        clearInterval(timer);

        timer = null;

    }

}
//====================================================
// SUBMIT TEST
//====================================================

function submitTest(autoSubmit = false) {

    //------------------------------------------
    // Prevent Duplicate Submit
    //------------------------------------------

    if (examSubmitted) {

        return;

    }

    //------------------------------------------
    // Manual Confirmation
    //------------------------------------------

    if (!autoSubmit) {

        const ok = confirm(
            "Are you sure you want to submit the test?"
        );

        if (!ok) {

            return;

        }

    }

    //------------------------------------------
    // Lock Exam
    //------------------------------------------

    examSubmitted = true;

    focusLock = true;

    examStarted = false;

    //------------------------------------------
    // Stop Timer
    //------------------------------------------

    stopTimer();

    //------------------------------------------
    // Disable Submit Button
    //------------------------------------------

    const submitBtn =
        document.getElementById("submitBtn");

    if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.innerHTML = "Submitting...";

    }

    //------------------------------------------
    // Data
    //------------------------------------------
const unattemptedCount = answers.filter(answer => answer === "").length;
    const payload = {

        name: studentName,

        regNo: regNo,

        paperName: paperName,

        submitReason: submitReason,

        answers: answers,
        questions: questions,
     unattempted: unattemptedCount,
          passingMarks: passingMarks

    };

    console.log(payload);

    //------------------------------------------
    // Send
    //------------------------------------------

    fetch(SCRIPT_URL, {

        method: "POST",

        body: JSON.stringify(payload)

    })

    .then(function (res) {

        return res.text();

    })

    .then(function (result) {

        result = result.trim();

        console.log(result);

        //--------------------------------------
        // Success
        //--------------------------------------

        if (result === "SUCCESS") {

            showSuccess();

            return;

        }

        //--------------------------------------
        // Already Submitted
        //--------------------------------------

        if (result === "ALREADY_SUBMITTED") {

            alert(
                "This paper has already been submitted."
            );

            showSuccess();

            return;

        }

        //--------------------------------------
        // Other Error
        //--------------------------------------

        examSubmitted = false;

        focusLock = false;

        alert(result);

        if (submitBtn) {

            submitBtn.disabled = false;

            submitBtn.innerHTML = "Submit Test";

        }

    })

    .catch(function (err) {

        console.log(err);

        examSubmitted = false;

        focusLock = false;

        alert(
            "Unable to submit your responses."
        );

        if (submitBtn) {

            submitBtn.disabled = false;

            submitBtn.innerHTML = "Submit Test";

        }

    });

}
//====================================================
// PART 3B
// SUCCESS PAGE + RESET + LOGOUT
//====================================================


//====================================================
// SHOW SUCCESS PAGE
//====================================================

function showSuccess() {

    //------------------------------------------
    // Stop Everything
    //------------------------------------------

    stopTimer();
    stopStatusChecker();

    //------------------------------------------
    // Reset Exam Flags
    //------------------------------------------

    examStarted = false;
    examSubmitted = true;
    focusLock = true;

    //------------------------------------------
    // Hide All Pages
    //------------------------------------------
    document
    .getElementById("practicalPage")
    ?.classList.add("hidden");
    document.getElementById("loginPage")
        ?.classList.add("hidden");

    document.getElementById("waitingPage")
        ?.classList.add("hidden");

    document.getElementById("testPage")
        ?.classList.add("hidden");

    //------------------------------------------
    // Hide Exam Sections
    //------------------------------------------

    document.getElementById("instructionPage")
        ?.classList.add("hidden");

    document.getElementById("examArea")
        ?.classList.add("hidden");

    //------------------------------------------
    // Show Success Page
    //------------------------------------------

    document.getElementById("successPage")
        ?.classList.remove("hidden");

    //------------------------------------------
    // Show Student Name
    //------------------------------------------

    document.getElementById("thankStudent").innerHTML =
        "Thank You, <b>" + studentName + "</b>";

    //------------------------------------------
    // Random Motivational Line
    //------------------------------------------

    let random = Math.floor(Math.random() * motivationLines.length);

    document.getElementById("motivationLine").innerText =
        motivationLines[random];

}

//====================================================
// RESET COMPLETE EXAM
//====================================================

function resetExam() {

    //------------------------------------------
    // Stop Timers
    //------------------------------------------

    stopTimer();
    stopStatusChecker();

    //------------------------------------------
    // Student
    //------------------------------------------

    studentName = "";
    regNo = "";
    paperName = "";
  theoryPapers = [];
practicalPapers = [];

    //------------------------------------------
    // Questions
    //------------------------------------------

    questions = [];
    answers = [];
    currentQuestion = 0;

    //------------------------------------------
    // Exam State
    //------------------------------------------

    examStarted = false;
    examSubmitted = false;

    submitReason = "Manual Submit";

    //------------------------------------------
    // Security
    //------------------------------------------

    focusWarnings = 0;
    focusLock = false;

    //------------------------------------------
    // Timer
    //------------------------------------------

    totalTime = 30 * 60;

    showTimer();

    //------------------------------------------
    // Clear Photo
    //------------------------------------------

    const img =
        document.getElementById("studentPhoto");

    if (img) {

        img.src = "no-photo.png";

    }

}



//====================================================
// BACK TO LOGIN PAGE
//====================================================

function goLogin() {
    document
.getElementById("theoryPaperPage")
?.classList.add("hidden");

document
.getElementById("practicalPaperPage")
?.classList.add("hidden");
     document.getElementById("successPage")
    ?.classList.add("hidden");
   document.getElementById("examTypePage")
    ?.classList.add("hidden");

document.getElementById("practicalPage")
    ?.classList.add("hidden");
    resetExam();

    //------------------------------------------
    // Show Login
    //------------------------------------------

    document.getElementById("loginPage")
        ?.classList.remove("hidden");

    //------------------------------------------
    // Hide Other Pages
    //------------------------------------------

    document.getElementById("waitingPage")
        ?.classList.add("hidden");

    document.getElementById("testPage")
        ?.classList.add("hidden");

    document.getElementById("successPage")
        ?.classList.add("hidden");

    //------------------------------------------
    // Clear Inputs
    //------------------------------------------

    const studentInput =
        document.getElementById("studentName");

    const regInput =
        document.getElementById("regNo");

    if (studentInput)
        studentInput.value = "";

    if (regInput)
        regInput.value = "";

    //------------------------------------------
    // Hide Paper Selection
    //------------------------------------------

    const label =
        document.getElementById("paperLabel");

    const select =
        document.getElementById("paperSelect");

    if (label)
        label.style.display = "none";

    if (select) {

        select.style.display = "none";
        select.innerHTML = "";

    }
}
//------------------------------------------
// Reset Exam Type Page
//------------------------------------------


//====================================================
// EXIT EXAM
//====================================================

function logoutExam() {

    if (!confirm(
        "Do you want to exit the test?"
    )) {

        return;

    }

    goLogin();

}



//====================================================
// WINDOW LOAD SAFETY
//====================================================

window.addEventListener("load", function () {

    showTimer();

});



//====================================================
// END OF PART 3B
//====================================================
//====================================================
// PART 4A
// EXAM SECURITY
//====================================================


//====================================================
// CHECK EXAM RUNNING
//====================================================

function isExamRunning() {

    const examArea =
        document.getElementById("examArea");

    return (

        examStarted &&

        !examSubmitted &&

        examArea &&

        !examArea.classList.contains("hidden")

    );

}



//====================================================
// SECURITY SUBMIT
//====================================================

function securitySubmit(reason) {

    if (!isExamRunning()) return;

    if (examSubmitted) return;

    submitReason = reason;

    submitTest(true);

}



//====================================================
// GIVE WARNING
//====================================================

function giveFocusWarning(reason) {

    //----------------------------------
    // Security only during exam
    //----------------------------------

    if (!isExamRunning()) return;

    //----------------------------------
    // Already submitted
    //----------------------------------

    if (examSubmitted) return;

    //----------------------------------
    // Prevent duplicate alerts
    //----------------------------------

    if (focusLock) return;

    focusLock = true;

    focusWarnings++;

    //----------------------------------
    // Auto Submit
    //----------------------------------

    if (focusWarnings >= MAX_FOCUS_WARNING) {

        submitReason = reason;

        alert(

            "❌ Maximum warnings reached.\n\n" +

            "Your test has been submitted automatically."

        );

        securitySubmit(reason);

        return;

    }

    //----------------------------------
    // Warning Message
    //----------------------------------

    alert(

        "⚠ Warning " +

        focusWarnings +

        "/" +

        MAX_FOCUS_WARNING +

        "\n\n" +

        reason +

        "\n\nPlease continue the exam carefully."

    );

    //----------------------------------
    // Re-enter Fullscreen
    //----------------------------------

    if (

        !document.fullscreenElement &&

        document.documentElement.requestFullscreen

    ) {

        document.documentElement

            .requestFullscreen()

            .catch(function () {});

    }

    //----------------------------------
    // Unlock
    //----------------------------------

    setTimeout(function () {

        if (!examSubmitted) {

            focusLock = false;

        }

    }, 1000);

}



//====================================================
// RIGHT CLICK
//====================================================

document.addEventListener(

    "contextmenu",

    function (e) {

        if (isExamRunning()) {

            e.preventDefault();

        }

    }

);



//====================================================
// COPY
//====================================================

document.addEventListener(

    "copy",

    function (e) {

        if (isExamRunning()) {

            e.preventDefault();

        }

    }

);



//====================================================
// CUT
//====================================================

document.addEventListener(

    "cut",

    function (e) {

        if (isExamRunning()) {

            e.preventDefault();

        }

    }

);



//====================================================
// PASTE
//====================================================

document.addEventListener(

    "paste",

    function (e) {

        if (isExamRunning()) {

            e.preventDefault();

        }

    }

);



//====================================================
// DRAG
//====================================================

document.addEventListener(

    "dragstart",

    function (e) {

        if (isExamRunning()) {

            e.preventDefault();

        }

    }

);



//====================================================
// TEXT SELECT
//====================================================

document.addEventListener(

    "selectstart",

    function (e) {

        if (isExamRunning()) {

            e.preventDefault();

        }

    }

);



//====================================================
// KEYBOARD SECURITY
//====================================================

document.addEventListener(

    "keydown",

    function (e) {

        if (!isExamRunning()) return;

        const key =
            e.key.toLowerCase();

        //----------------------------------

        if (e.key === "F12") {

            e.preventDefault();

        }

        //----------------------------------

        if (e.ctrlKey && key === "u") {

            e.preventDefault();

        }

        //----------------------------------

        if (

            e.ctrlKey &&

            e.shiftKey &&

            (

                key === "i" ||

                key === "j" ||

                key === "c"

            )

        ) {

            e.preventDefault();

        }

        //----------------------------------

        if (

            e.ctrlKey &&

            (

                key === "s" ||

                key === "p"

            )

        ) {

            e.preventDefault();

        }

    }

);
//====================================================
// PART 4B
// SECURITY EVENTS
//====================================================


//====================================================
// TAB CHANGE / MINIMIZE
//====================================================

document.addEventListener(
    "visibilitychange",
    function () {

        if (!isExamRunning()) {
            return;
        }

        if (document.hidden) {

            giveFocusWarning(
                "Tab changed or browser minimized."
            );

        }

    }
);



//====================================================
// FULLSCREEN EXIT
//====================================================

document.addEventListener(
    "fullscreenchange",
    function () {

        if (!isExamRunning()) {
            return;
        }

        if (!document.fullscreenElement) {

            giveFocusWarning(
                "Fullscreen mode exited."
            );

        }

    }
);



//====================================================
// WINDOW LOST FOCUS
//====================================================

window.addEventListener(
    "blur",
    function () {

        if (!isExamRunning()) {
            return;
        }

        // Ignore if browser is still visible
        if (!document.hidden) {

            giveFocusWarning(
                "Window lost focus."
            );

        }

    }
);



//====================================================
// BEFORE REFRESH / CLOSE
//====================================================

window.addEventListener(
    "beforeunload",
    function (e) {

        if (!isExamRunning()) {
            return;
        }

        e.preventDefault();

        e.returnValue = "";

    }
);



//====================================================
// BLOCK BACK BUTTON
//====================================================

history.pushState(
    null,
    "",
    location.href
);

window.addEventListener(
    "popstate",
    function () {

        history.pushState(
            null,
            "",
            location.href
        );

        if (!isExamRunning()) {
            return;
        }

        giveFocusWarning(
            "Back button is not allowed."
        );

    }
);



//====================================================
// PAGE HIDE (Mobile Support)
//====================================================

window.addEventListener(
    "pagehide",
    function () {

        if (!isExamRunning()) {
            return;
        }

        giveFocusWarning(
            "Page was hidden."
        );

    }
);



//====================================================
// WINDOW RESIZE
//====================================================

window.addEventListener(
    "resize",
    function () {

        if (!isExamRunning()) {
            return;
        }

        if (!document.fullscreenElement) {

            giveFocusWarning(
                "Fullscreen mode exited."
            );

        }

    }
);



//====================================================
// END OF SECURITY
//====================================================
//====================================================
// RESULT MODULE
//====================================================

function openResultVerifyPage(){

    document.getElementById("loginPage").classList.add("hidden");

    document.getElementById("resultVerifyPage").classList.remove("hidden");

}


console.log(
    "Security System Loaded Successfully"
);

function verifyResultStudent(){

    const code = document.getElementById("resultStudentID").value.trim();

    if(code==""){
        alert("Please Enter Verification Code");
        return;
    }

    if(code !== "16112001"){
        alert("Invalid Verification Code");
        return;
    }

    fetch(
        SCRIPT_URL +
        "?action=studentResultList"
    )

    .then(res => res.json())

    .then(data => {

        if(data.status!="SUCCESS"){
            alert("Unable to load Result List");
            return;
        }

        document.getElementById("loginPage")
        ?.classList.add("hidden");

        document.getElementById("resultVerifyPage")
        ?.classList.add("hidden");

        document.getElementById("studentResultPage")
        ?.classList.remove("hidden");

        const body = document.getElementById("resultTableBody");

        body.innerHTML = "";

        let visibleCount = 0;

        data.results.forEach(function(r){

            // Sirf Published Results Show Honge
            if(r.publishStatus !== "YES"){
                return;
            }

            visibleCount++;

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${visibleCount}</td>
                <td>${r.marksheetNo}</td>
                <td>${r.regNo}</td>
                <td>${r.studentName}</td>
                <td>${r.course}</td>
                <td>${r.paperName}</td>
                <td>${r.theory}</td>
                <td>${r.practical}</td>
                <td>${r.viva}</td>
                <td>${r.notes}</td>
                <td>${r.behaviour}</td>
                <td>${r.project}</td>
                <td>${r.totalMarks}</td>
                <td>${r.percentage}</td>
                <td>${r.grade}</td>
                <td>${r.result}</td>
                <td>${r.resultDate}</td>
                <td>
                    <button class="viewMarksheetBtn"
                        onclick="verifyMarksheet('${r.paperName}')">
                        View Marksheet
                    </button>
                </td>
            `;

            body.appendChild(tr);

        });

        // Agar koi bhi Result Publish nahi hua
        if(visibleCount === 0){

            body.innerHTML = `
                <tr>
                    <td colspan="18"
                        style="
                            text-align:center;
                            padding:45px;
                            color:#d32f2f;
                            font-size:22px;
                            font-weight:bold;
                            background:#fff8f8;">
                        Results will be published soon.
                    </td>
                </tr>
            `;

        }

    })

    .catch(function(err){

        console.log(err);

        alert("Unable to load Result List.");

    });

}
//====================================
// BACK LOGIN
//====================================

function backToLogin(){

    // Hide all Result Pages
    document.getElementById("resultVerifyPage")
        ?.classList.add("hidden");

    document.getElementById("studentResultPage")
        ?.classList.add("hidden");

    document.getElementById("marksheetPage")
        ?.classList.add("hidden");

    document.getElementById("studentResultPage")
        ?.classList.add("hidden");

    // Show Login Page
    document.getElementById("loginPage")
        ?.classList.remove("hidden");

    // Clear Search Box
    const search = document.getElementById("searchResult");
    if(search){
        search.value = "";
    }

    // Clear Student ID
    const id = document.getElementById("resultStudentID");
    if(id){
        id.value = "";
    }

    // Clear Table
    const body = document.getElementById("resultTableBody");
    if(body){
        body.innerHTML = "";
    }

}





        // Create Question Details

     
//====================================================
// BACK TO RESULT LIST FROM ANSWER DETAILS
//====================================================

function backToResultListFromAnswers(){

    // Hide Answer Details Page

    document
        .getElementById("adminAnswerDetailsPage")
        ?.classList.add("hidden");


    // Show Result List

    document
        .getElementById("studentResultPage")
        ?.classList.remove("hidden");

}

function backToResultList(){

document
.getElementById("marksheetPage")
.classList.add("hidden");

document
.getElementById("studentResultPage")
.classList.remove("hidden");

}
//====================================================
// ADMIN PAGE - 3 TAP ON IKON LOGO
//====================================================

let ikonTapCount = 0;
let ikonTapTimer = null;

document.addEventListener("DOMContentLoaded", function(){

    const logo =
        document.getElementById("ikonLogo");

    if(!logo) return;

    logo.addEventListener("click", function(){

        ikonTapCount++;

        clearTimeout(ikonTapTimer);

        ikonTapTimer = setTimeout(function(){

            ikonTapCount = 0;

        }, 1000);


        if(ikonTapCount === 3){

            ikonTapCount = 0;

            openAdminVerify();

        }

    });

});


//====================================================
// OPEN ADMIN VERIFICATION
//====================================================

function openAdminVerify(){

    document
        .getElementById("adminVerifyPage")
        ?.classList.remove("hidden");


    const codeBox =
        document.getElementById("adminVerifyCode");

    if(codeBox){

        codeBox.value = "";

        setTimeout(function(){

            codeBox.focus();

        },100);

    }

}


//====================================================
// VERIFY ADMIN
//====================================================

function verifyAdmin(){

    const codeBox =
        document.getElementById("adminVerifyCode");

    if(!codeBox){

        alert("Verification box not found.");

        return;

    }


    const code =
        codeBox.value.trim();


    if(code === ""){

        alert("Please Enter Verification Code");

        return;

    }


    fetch(
        SCRIPT_URL +
        "?action=verifyAdmin" +
        "&code=" +
        encodeURIComponent(code)
    )

    .then(function(res){

        return res.json();

    })

    .then(function(data){

        if(data.status === "SUCCESS"){

            document
                .getElementById("adminVerifyPage")
                ?.classList.add("hidden");
            // Admin Mode ON
    isAdminMode = true;
            // Admin ke liye result list open
            loadAllResults();

            return;

        }


        alert("Invalid Admin Verification Code");

        codeBox.value = "";

        codeBox.focus();

    })

    .catch(function(err){

        console.log(err);

        alert("Unable to verify Admin.");

    });

}


//====================================================
// CLOSE ADMIN VERIFICATION
//====================================================

function closeAdminVerify(){

    document
        .getElementById("adminVerifyPage")
        ?.classList.add("hidden");

    const codeBox =
        document.getElementById("adminVerifyCode");

    if(codeBox){

        codeBox.value = "";

    }

}


//====================================================
// RESULT MODULE
//====================================================

//=========================================
// OPEN MARKSHEET
//=========================================

function openMarksheet(studentID,paper){

    fetch(

        SCRIPT_URL +

        "?action=marksheet" +

        "&id=" +

        encodeURIComponent(studentID) +

        "&paper=" +

        encodeURIComponent(paper)

    )

    .then(res=>res.json())

    .then(function(data){

        console.log(data);

        if(data.status!="SUCCESS"){

            alert("Invalid Student ID");

            return;

        }

        fillMarksheet(data);

    })

    .catch(function(err){

        console.log(err);

        alert("Unable to load Marksheet.");

    });

}
//=========================================
// VERIFY MARKSHEET
//=========================================

//=========================================
// VERIFY MARKSHEET
//=========================================

function verifyMarksheet(paper){

    const id = prompt("Enter Student ID");

    if(id == null){
        return;
    }

    if(id.trim() == ""){
        alert("Please Enter Student ID");
        return;
    }

    openMarksheet(
        id.trim(),
        paper
    );

}
//====================================================
// FILL MARKSHEET
//====================================================

function fillMarksheet(m){

    //---------------------------------------
    // Hide Result List
    //---------------------------------------

    document
    .getElementById("studentResultPage")
    ?.classList.add("hidden");

    //---------------------------------------
    // Show Marksheet
    //---------------------------------------

    document
    .getElementById("marksheetPage")
    ?.classList.remove("hidden");

    //---------------------------------------
    // Student Details
    //---------------------------------------

    document.getElementById("mkMarksheetNo").textContent =
    m.marksheetNo || "";

    document.getElementById("mkRegNo").textContent =
    m.regNo || "";

    document.getElementById("mkStudentName").textContent =
    m.studentName || "";

    document.getElementById("mkCourse").textContent =
    m.course || "";

    document.getElementById("mkPaperName").textContent =
    m.paperName || "";

       document.getElementById("mkResultDate").textContent = m.resultDate;
        document.getElementById("mkIssueDate").textContent = m.issueDate || "";
        document.getElementById("mkExamDate").textContent = m.examDate;
        document.getElementById("mkExamCode").textContent = m.examCode;

    //---------------------------------------
    // Marks
    //---------------------------------------

    document.getElementById("mkTheory").textContent =
    m.theory || "";

    document.getElementById("mkPractical").textContent =
    m.practical || "";

    document.getElementById("mkViva").textContent =
    m.viva || "";

    document.getElementById("mkNotes").textContent =
    m.notes || "";

    document.getElementById("mkBehaviour").textContent =
    m.behaviour || "";

    document.getElementById("mkProject").textContent =
    m.project || "";

    document.getElementById("mkTotal").textContent =
    m.totalMarks || "";

    document.getElementById("mkPercentage").textContent =
    m.percentage || "";

    document.getElementById("mkGrade").textContent =
    m.grade || "";

    document.getElementById("mkResult").textContent =
    m.result || "";

    //---------------------------------------
    // Student Image (Repo)
    //---------------------------------------

    const photo =
    document.getElementById("mkStudentPhoto");

    if(photo){

        photo.src = m.regNo + ".jpeg";

        photo.onerror = function(){

            this.src = "no-photo.jpeg";

        };

    }

   //---------------------------------------
// QR Code
//---------------------------------------

const qr =
document.getElementById("mkQRCode");

if(qr){

    const verifyURL =
        window.location.origin +
        window.location.pathname +
        "?verifyQR=" +
        encodeURIComponent(m.regNo) +
        "&paper=" +
        encodeURIComponent(m.paperName);

    generateMarksheetQR(verifyURL);

}

    //---------------------------------------
    // Scroll Top
    //---------------------------------------

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}
function openResultVerifyPage(){

    document.getElementById("loginPage").classList.add("hidden");

    document.getElementById("resultVerifyPage").classList.remove("hidden");

}

//====================================================
// LOAD MARKSHEET
//====================================================


//====================================================
// RESULT MODULE PART 2B
// FILL MARKSHEET
//====================================================




//====================================================
// BACK TO RESULT VERIFY
//====================================================

function backToResultVerify(){

    document
    .getElementById("studentResultPage")
    ?.classList.add("hidden");

    document
    .getElementById("marksheetPage")
    ?.classList.add("hidden");

    document
    .getElementById("resultVerifyPage")
    ?.classList.remove("hidden");

}

//====================================================
// SEARCH RESULT
//====================================================

function searchResult(){
    

    const txt = document
    .getElementById("searchResult")
    .value
    .toUpperCase();

    const rows =
    document.querySelectorAll(
        "#resultTableBody tr"
    );

    rows.forEach(function(row){

        row.style.display =
        row.innerText
        .toUpperCase()
        .includes(txt)
        ? ""
        : "none";

    });

}
//====================================================
// PRINT MARKSHEET
//====================================================

function printMarksheet(){

    const marksheet =
    document.getElementById("marksheetPage");

    if(!marksheet){

        alert("Marksheet not found.");

        return;

    }

    window.print();

}
function generateMarksheetQR(data){

    const temp = document.createElement("div");

    new QRCode(temp,{
        text:data,
        width:150,
        height:150,
        correctLevel:QRCode.CorrectLevel.H
    });

    setTimeout(function(){

        const img = temp.querySelector("img");
        const canvas = temp.querySelector("canvas");

        const qr = document.getElementById("mkQRCode");

        if(img){

            qr.src = img.src;

        }
        else if(canvas){

            qr.src = canvas.toDataURL("image/png");

        }

    },100);

}
async function downloadPDF() {

    const { jsPDF } = window.jspdf;

    const original = document.querySelector(".marksheet");

    if (!original) {
        alert("Marksheet not found.");
        return;
    }

    const buttons = document.querySelector(".mkActionButtons");
    if (buttons) buttons.style.display = "none";

    try {

        // ===== Temporary Wrapper =====

        const wrapper = document.createElement("div");

        wrapper.style.position = "fixed";
        wrapper.style.left = "-10000px";
        wrapper.style.top = "0";
        wrapper.style.background = "#ffffff";
        wrapper.style.padding = "25px";
        wrapper.style.display = "inline-block";

        const clone = original.cloneNode(true);

        // ===== PDF Signature Images Fix =====

        const signImg = clone.querySelector(".mkSignImage");

        if (signImg) {

            signImg.removeAttribute("width");
            signImg.removeAttribute("height");

            signImg.style.width = "170px";
            signImg.style.height = "auto";
            signImg.style.maxHeight = "90px";
            signImg.style.objectFit = "contain";
            signImg.style.display = "block";
            signImg.style.margin = "0 auto 8px auto";

        }

        const issuedImg = clone.querySelector(".mkIssuedImage");

        if (issuedImg) {

            issuedImg.removeAttribute("width");
            issuedImg.removeAttribute("height");

            issuedImg.style.width = "165px";
            issuedImg.style.height = "auto";
            issuedImg.style.maxHeight = "120px";
            issuedImg.style.objectFit = "contain";
            issuedImg.style.display = "block";
            issuedImg.style.margin = "0 auto 8px auto";

        }

        // Hide HTML watermark
        const cloneWatermark = clone.querySelector(".mkWatermark");

        if (cloneWatermark) {
            cloneWatermark.style.display = "none";
        }

        clone.style.margin = "0";
        clone.style.boxShadow = "none";

        wrapper.appendChild(clone);

        document.body.appendChild(wrapper);

        const canvas = await html2canvas(wrapper, {

            scale: 3,

            useCORS: true,

            allowTaint: true,

            backgroundColor: "#ffffff",

            scrollX: 0,

            scrollY: 0,

            imageTimeout: 0,

            logging: false

        });

        document.body.removeChild(wrapper);

        // ===== Canvas =====

        const ctx = canvas.getContext("2d");

        const logo = new Image();

        logo.crossOrigin = "anonymous";

        logo.src = "ikon.jpg";

        await new Promise(resolve => {

            logo.onload = resolve;
            logo.onerror = resolve;

        });

        if (logo.complete && logo.naturalWidth > 0) {

            ctx.save();

            ctx.globalAlpha = 0.12;
                        // ===== Watermark Position =====

            const padding = 25;

            const sheetWidth = canvas.width - (padding * 2);
            const sheetHeight = canvas.height - (padding * 2);

            const wmWidth = sheetWidth * 0.46;
            const wmHeight = wmWidth * logo.height / logo.width;

            const x = padding + ((sheetWidth - wmWidth) / 2);
            const y = padding + ((sheetHeight - wmHeight) / 2);

            ctx.translate(
                x + (wmWidth / 2),
                y + (wmHeight / 2)
            );

            ctx.rotate(-12 * Math.PI / 180);

            ctx.drawImage(
                logo,
                -wmWidth / 2,
                -wmHeight / 2,
                wmWidth,
                wmHeight
            );

            ctx.restore();

        }

        // ===== PDF =====

        const pdf = new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4",

            compress: true

        });

        const margin = 8;

        const pageWidth = 210;

        const printableWidth = pageWidth - (margin * 2);

        const imgWidth = printableWidth;

        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const imgData = canvas.toDataURL(
            "image/jpeg",
            1.0
        );

        pdf.addImage(

            imgData,

            "JPEG",

            margin,

            margin,

            imgWidth,

            imgHeight,

            "",

            "FAST"

        );

        saveAs(

            pdf.output("blob"),

            "IKON_Marksheet.pdf"

        );

    }

    catch (e) {

        console.error(e);

        alert("PDF generation failed.");

    }

    finally {

        if (buttons) {

            buttons.style.display = "flex";

        }

    }

}


//====================================================
// PRINT SHORTCUT
//====================================================

document.addEventListener("keydown",function(e){

    if(

        e.ctrlKey &&

        e.key.toLowerCase()=="p"

    ){

        const page =
        document.getElementById("marksheetPage");

        if(

            page &&

            !page.classList.contains("hidden")

        ){

            e.preventDefault();

            printMarksheet();

        }

    }

});

function backToResultVerify(){

    // Student Result List Hide
    const resultPage =
        document.getElementById("studentResultPage");

    if(resultPage){

        resultPage.classList.add("hidden");

    }

    // Result Verify Page Show
    const verifyPage =
        document.getElementById("resultVerifyPage");

    if(verifyPage){

        verifyPage.classList.remove("hidden");

    }

    // Search Box Clear
    const search =
        document.getElementById("searchResult");

    if(search){

        search.value="";

    }

    // Table Clear
    const table =
        document.getElementById("resultTableBody");

    if(table){

        table.innerHTML="";

    }

}
function backToLogin(){

    document
        .getElementById("resultVerifyPage")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

    document
        .getElementById("resultStudentID")
        .value="";

}
function checkQRVerification(){

    const params = new URLSearchParams(window.location.search);

    const regNo = params.get("verifyQR");
    const paper = params.get("paper");

    if(!regNo || !paper){
        return;
    }

    fetch(
        SCRIPT_URL +
        "?action=verifyQR" +
        "&regNo=" + encodeURIComponent(regNo) +
        "&paper=" + encodeURIComponent(paper)
    )

    .then(res=>res.json())

    .then(function(data){

        if(data.status!="SUCCESS"){

            alert("Invalid QR Code");

            return;

        }

        // Hide All Pages

        document.getElementById("loginPage")?.classList.add("hidden");
        document.getElementById("resultVerifyPage")?.classList.add("hidden");
        document.getElementById("studentResultPage")?.classList.add("hidden");
        document.getElementById("marksheetPage")?.classList.add("hidden");

        // Show QR Page

        document.getElementById("qrVerifyPage")
        ?.classList.remove("hidden");

        // Fill Details

        document.getElementById("qrRegNo").textContent=data.regNo;
        document.getElementById("qrStudentName").textContent=data.studentName;
        document.getElementById("qrCourse").textContent=data.course;
        document.getElementById("qrPaper").textContent=data.paperName;
        document.getElementById("qrTotal").textContent=data.totalMarks;
        document.getElementById("qrPercentage").textContent=data.percentage;
        document.getElementById("qrGrade").textContent=data.grade;
        document.getElementById("qrResult").textContent=data.result;
        document.getElementById("qrIssueDate").textContent=data.issueDate;

    })

    .catch(function(err){

        console.log(err);

        alert("Verification Failed.");

    });

}
//====================================================
// END RESULT MODULE
//====================================================
//====================================================
// BACK TO EXAM TYPE PAGE
//====================================================

function backToExamType(){

    // Stop Timers
    stopPracticalTimer();
    stopStatusChecker();

    // Hide All Exam Pages
    document
        .getElementById("practicalPage")
        ?.classList.add("hidden");

    document
        .getElementById("theoryPaperPage")
        ?.classList.add("hidden");

    document
        .getElementById("practicalPaperPage")
        ?.classList.add("hidden");

    document
        .getElementById("verificationPage")
        ?.classList.add("hidden");

    document
        .getElementById("instructionPage")
        ?.classList.add("hidden");

    document
        .getElementById("waitingPage")
        ?.classList.add("hidden");

    document
        .getElementById("testPage")
        ?.classList.add("hidden");

    document
        .getElementById("successPage")
        ?.classList.add("hidden");

    // Show Exam Type Page
    document
        .getElementById("examTypePage")
        ?.classList.remove("hidden");

    // Clear Student ID
    const idBox =
        document.getElementById("studentIdInput");

    if(idBox){
        idBox.value = "";
    }

    // Clear Practical Questions
    const area =
        document.getElementById("practicalQuestionArea");

    if(area){
        area.innerHTML = "";
    }

    // Reset Practical Timer
    practicalTotalTime = practicalDuration * 60;
    showPracticalTimer();

    // Reset Theory Paper Dropdown
    const theorySelect =
        document.getElementById("theoryPaperSelect");

    if(theorySelect){
        theorySelect.selectedIndex = 0;
    }

    // Reset Practical Paper Dropdown
    const practicalSelect =
        document.getElementById("practicalPaperSelect");

    if(practicalSelect){
        practicalSelect.selectedIndex = 0;
    }

    // Enable Practical Submit Button
    const btn =
        document.querySelector(".submitPracticalBtn");

    if(btn){
        btn.disabled = false;
        btn.innerHTML = "Submit Practical";
    }

}
//====================================================
// SUBMIT PRACTICAL
//====================================================

async function submitPractical(autoSubmit = false){

    if(!autoSubmit){

        const ok = confirm(
            "Are you sure you want to submit Practical Examination?"
        );

        if(!ok) return;

    }

    stopPracticalTimer();

    const btn =
        document.querySelector(".submitPracticalBtn");

    if(btn){

        btn.disabled = true;
        btn.innerHTML = "Uploading...";

    }

    //---------------------------------------
    // Read All Screenshot Inputs
    //---------------------------------------

    const inputs =
        document.querySelectorAll(".prScreenshot");

    let files = [];

    for(const input of inputs){

        if(input.files.length==0){

            alert("Please upload screenshot for every question.");

            if(btn){

                btn.disabled=false;
                btn.innerHTML="Submit Practical";

            }

            return;

        }

        const file =
            input.files[0];

        const base64 =
            await fileToBase64(file);


        //---------------------------------------
        // Get Question Short Name
        //---------------------------------------

        const fullQuestion =
            decodeURIComponent(
                input.dataset.question || ""
            );

        const shortQuestion =
            fullQuestion
                .replace(/[^a-zA-Z0-9\s]/g,"")
                .trim()
                .split(/\s+/)
                .slice(0,7)
                .join("_");


        //---------------------------------------
        // Prepare File
        //---------------------------------------

        files.push({

            topic:
                input.dataset.topic,

            fileName:

                regNo+"_"+

                studentName.replace(/\s+/g,"")+"_"+

                paperName.replace(
                    /[^a-zA-Z0-9\s]/g,"_"
                )+"_"+

                shortQuestion+

                "."+

                file.name.split(".").pop(),

            mimeType:
                file.type,

            base64:
                base64.split(",")[1]

        });

    }


    //---------------------------------------
    // Send to Apps Script
    //---------------------------------------

    const payload={

        action:"submitPractical",

        regNo:regNo,

        studentName:studentName,

        studentId:studentId,

        course:courseName,

        paper:paperName,

        files:files

    };


    fetch(SCRIPT_URL,{

        method:"POST",

        body:JSON.stringify(payload)

    })

    .then(res=>res.text())

    .then(function(result){

        console.log(result);

        if(result=="SUCCESS"){

            stopPracticalTimer();

            document
                .getElementById("practicalPage")
                ?.classList.add("hidden");

            showSuccess();

            return;

        }

        else{

            alert(result);

            if(btn){

                btn.disabled=false;
                btn.innerHTML="Submit Practical";

            }

        }

    })

    .catch(function(err){

        console.log(err);

        alert("Upload Failed");

        if(btn){

            btn.disabled=false;
            btn.innerHTML="Submit Practical";

        }

    });

}
//====================================================
// FILE TO BASE64
//====================================================

function fileToBase64(file){

    return new Promise(function(resolve,reject){

        const reader =
            new FileReader();

        reader.onload=function(){

            resolve(reader.result);

        };

        reader.onerror=reject;

        reader.readAsDataURL(file);

    });

}
function openTheoryPaperPage(){

    document
    .getElementById("examTypePage")
    ?.classList.add("hidden");

    document
    .getElementById("theoryPaperPage")
    ?.classList.remove("hidden");

    const select =
    document.getElementById("theoryPaperSelect");

    select.innerHTML =
    "<option value=''>-- Select Theory Paper --</option>";

    theoryPapers.forEach(function(p){

        const option =
        document.createElement("option");

        option.value = p;

        option.textContent = p;

        select.appendChild(option);

    });

}
function openPracticalPaperPage(){

    fetch(
        SCRIPT_URL +
        "?action=practicalStatus"
    )

    .then(res=>res.json())

    .then(function(data){

        if(
            data.status &&
            data.status.toUpperCase()=="OFF"
        ){

            alert(data.message);

            return;

        }

        document
        .getElementById("examTypePage")
        ?.classList.add("hidden");

        document
        .getElementById("practicalPaperPage")
        ?.classList.remove("hidden");

        const select =
        document.getElementById("practicalPaperSelect");

        select.innerHTML =
        "<option value=''>-- Select Practical Paper --</option>";

        practicalPapers.forEach(function(p){

            const option =
            document.createElement("option");

            option.value = p;

            option.textContent = p;

            select.appendChild(option);

        });

    })

    .catch(function(){

        alert("Unable to check Practical Status.");

    });

}
