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
let paperList = [];
let studentId = "";
let courseName = "";
let totalMarks = "";
let passingMarks = "";
//================================
// MOTIVATIONAL LINES
//================================


//====================================================
// QUESTION DATA
//====================================================

let questions = [];
let answers = [];
let currentQuestion = 0;



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

    if (!img) return;

    img.src = regNo + ".jpeg";

    img.onerror = function () {

        this.onerror = null;

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

            paperList = data.papers || [];

            if (paperList.length === 0) {

                alert("No Paper Assigned.");

                return;

            }

            //----------------------------------
            // Single Paper
            //----------------------------------

            if (paperList.length === 1) {

                paperName = paperList[0];

                checkTestStatus();

                return;

            }

            //----------------------------------
            // Multiple Papers
            //----------------------------------

            showPaperSelection();

            return;

        }

        //----------------------------------
        // Already Submitted
        //----------------------------------

        if (data.status === "ALREADY_SUBMITTED") {

            alert("All papers already submitted.");

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
// PAPER SELECTION
//====================================================

function showPaperSelection() {

    const label = document.getElementById("paperLabel");

    const select = document.getElementById("paperSelect");

    if (!label || !select) return;

    //----------------------------------
    // Reset List
    //----------------------------------

    select.innerHTML = "";

    //----------------------------------
    // Default Option
    //----------------------------------

    let defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.text = "-- Select Paper --";

    select.appendChild(defaultOption);

    //----------------------------------
    // Paper List
    //----------------------------------

    paperList.forEach(function (paper) {

        let option = document.createElement("option");

        option.value = paper;

        option.text = paper;

        select.appendChild(option);

    });

    label.style.display = "block";

    select.style.display = "block";

}



//====================================================
// SELECT PAPER
//====================================================

function selectPaper() {

    const select = document.getElementById("paperSelect");

    if (!select) return;

    paperName = select.value;

    if (paperName === "") {

        alert("Please select a paper.");

        return;

    }

 

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

function goLogin(){

    window.location.href = "index.html";

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
    paperList = [];

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

console.log(
    "Security System Loaded Successfully"
);
//====================================
// OPEN RESULT VERIFY PAGE
//====================================

function openResultPage(){


    document
    .getElementById("loginPage")
    .classList.add("hidden");


    document
    .getElementById("resultVerifyPage")
    .classList.remove("hidden");


}
//====================================
// VERIFY RESULT
//====================================

//====================================
// VERIFY STUDENT RESULT
//====================================

//====================================
// VERIFY STUDENT RESULT ID
//====================================

function verifyResult(){

    const idBox =
        document.getElementById("resultStudentID");

    if(!idBox){

        alert("Student ID box not found.");

        return;

    }


    const id =
        idBox.value.trim();


    //====================================
    // EMPTY ID
    //====================================

    if(id === ""){

        alert("Enter Student ID");

        idBox.focus();

        return;

    }


    //====================================
    // STUDENT MODE
    //====================================

    isAdminMode = false;


    //====================================
    // VERIFY ID FROM GOOGLE APPS SCRIPT
    //====================================

    fetch(
        SCRIPT_URL +
        "?action=verifyResultStudent" +
        "&id=" +
        encodeURIComponent(id)
    )

    .then(function(res){

        if(!res.ok){

            throw new Error(
                "Server Error"
            );

        }

        return res.json();

    })

    .then(function(data){

        console.log(
            "Student ID Verification :",
            data
        );


        //================================
        // VALID STUDENT ID
        //================================

        if(data.status === "SUCCESS"){

            console.log(
                "Student ID verified successfully:",
                data
            );

            isAdminMode = false;


            //================================
            // SHOW STUDENT RESULT
            //================================

            loadAllResults();

            return;

        }


        //================================
        // INVALID ID
        //================================

        if(data.status === "INVALID_ID"){

            alert(
                "Invalid Student ID."
            );

            idBox.focus();

            return;

        }


        //================================
        // NO ID
        //================================

        if(data.status === "NO_ID"){

            alert(
                "Please enter Student ID."
            );

            idBox.focus();

            return;

        }


        //================================
        // OTHER RESPONSE
        //================================

        alert(
            "Unable to verify Student ID."
        );

    })

    .catch(function(error){

        console.log(
            "Student ID Verification Error :",
            error
        );

        alert(
            "Unable to connect with Google Sheet."
        );

    });

}



//==================================================
// SHOW STUDENT RESULT
//==================================================

function showStudentResult(data){

    //================================
    // CHECK RESULT VERIFY PAGE
    //================================

    const verifyPage =
        document.getElementById("resultVerifyPage");

    if(verifyPage){

        verifyPage.classList.add("hidden");

    }


    //================================
    // SHOW STUDENT RESULT PAGE
    //================================

    const resultPage =
        document.getElementById("studentResultPage");

    if(!resultPage){

        console.error(
            "ERROR: studentResultPage element not found in HTML."
        );

        alert(
            "Result page HTML element not found.\nPlease check studentResultPage ID."
        );

        return;

    }

    resultPage.classList.remove("hidden");


    //================================
    // STUDENT DATA
    //================================

    const student = data.student;

    if(!student){

        console.error(
            "Student data not found:",
            data
        );

        alert("Student information not found.");

        return;

    }


    //================================
    // STUDENT INFORMATION
    //================================

    const studentInfo =
        document.getElementById("studentInfo");

    if(studentInfo){

        studentInfo.innerHTML = `

            <h3>Name : ${student.name || ""}</h3>

            <h3>Reg No : ${student.regNo || ""}</h3>

            <h3>Student ID : ${student.id || ""}</h3>

            <h3>Course : ${student.course || ""}</h3>

        `;

    }


    //================================
    // RESULT DATA
    //================================

    let html = "";


    if(!Array.isArray(data.results)){

        console.error(
            "Result array not found:",
            data
        );

        alert("Result data not found.");

        return;

    }


    data.results.forEach(function(r){

        html += `

            <div class="result-card">

                <h3>
                    ${r.paper || ""}
                </h3>

                <p>
                    Date : ${r.date || ""}
                </p>

                <p>
                    Correct : ${r.correct ?? 0}
                </p>

                <p>
                    Wrong : ${r.wrong ?? 0}
                </p>

                <p>
                    Unattempted : ${r.unattempted ?? 0}
                </p>

                <p>
                    Total : ${r.total ?? 0}
                </p>

                <p>
                    Percentage : ${r.percentage || ""}
                </p>

                <p>
                    Result : ${r.result || ""}
                </p>

            </div>

        `;

    });


    //================================
    // DISPLAY RESULT
    //================================

    const resultData =
        document.getElementById("resultData");

    if(resultData){

        resultData.innerHTML = html;

    }

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
//====================================
// LOAD ALL RESULTS
// STUDENT + ADMIN
//====================================

//====================================
// LOAD ALL RESULTS
// STUDENT + ADMIN
//====================================

function loadAllResults(){

    fetch(
        SCRIPT_URL + "?action=allResults"
    )

    .then(function(res){

        if(!res.ok){

            throw new Error(
                "Server Error"
            );

        }

        return res.json();

    })

    .then(function(data){

        if(!data || !Array.isArray(data.results)){

            alert("Result data not found.");

            return;

        }


        let html = "";


        //====================================
        // STUDENT MODE
        //====================================

        if(!isAdminMode){

            data.results.forEach(function(row){

                html += `

                <tr>

                    <td>
                        ${row.name || ""}
                    </td>

                    <td>
                        ${row.regNo || ""}
                    </td>

                    <td>
                        ${row.paper || ""}
                    </td>

                    <td class="correct">
                        ${row.correct ?? 0}
                    </td>

                    <td class="wrong">
                        ${row.wrong ?? 0}
                    </td>

                    <td class="skip">
                        ${row.unattempted ?? 0}
                    </td>

                    <td>

                        <button
                            class="primary"
                            onclick="openMarksheet(
                                '${String(row.regNo || "").replace(/'/g,"\\'")}',
                                '${String(row.paper || "").replace(/'/g,"\\'")}'
                            )">

                            View Result

                        </button>

                    </td>

                </tr>

                `;

            });

        }


        //====================================
        // ADMIN MODE
        //====================================

        else{

            data.results.forEach(function(row){

                html += `

                <tr>

                    <td>
                        ${row.regNo || ""}
                    </td>

                    <td>
                        ${row.name || ""}
                    </td>

                    <td>
                        ${row.paper || ""}
                    </td>

                    <td class="correct">
                        ${row.correct ?? 0}
                    </td>

                    <td class="wrong">
                        ${row.wrong ?? 0}
                    </td>

                    <td class="skip">
                        ${row.unattempted ?? 0}
                    </td>

                    <td>

                        <button
                            class="primary"
                            onclick="openAnswerDetails(
                                '${String(row.regNo || "").replace(/'/g,"\\'")}',
                                '${String(row.paper || "").replace(/'/g,"\\'")}'
                            )">

                            View Answer

                        </button>

                    </td>

                </tr>

                `;

            });

        }


        //====================================
        // TABLE HEADER
        //====================================

        const tableHead =
            document.querySelector(
                "#studentResultPage table thead tr"
            );


        if(tableHead){

            //================================
            // STUDENT HEADER
            //================================

            if(!isAdminMode){

                tableHead.innerHTML = `

                    <th>Name</th>
                    <th>Reg No</th>
                    <th>Paper</th>
                    <th>Correct</th>
                    <th>Incorrect</th>
                    <th>Unattempted</th>
                    <th>View Result</th>

                `;

            }


            //================================
            // ADMIN HEADER
            //================================

            else{

                tableHead.innerHTML = `

                    <th>Reg No</th>
                    <th>Name</th>
                    <th>Paper</th>
                    <th>Correct</th>
                    <th>Incorrect</th>
                    <th>Unattempted</th>
                    <th>View Answer</th>

                `;

            }

        }


        //====================================
        // TABLE BODY
        //====================================

        const body =
            document.getElementById(
                "resultTableBody"
            );


        if(body){

            if(html === ""){

                body.innerHTML = `

                    <tr>

                        <td colspan="7"
                            style="text-align:center;padding:20px;">

                            No published result available.

                        </td>

                    </tr>

                `;

            }else{

                body.innerHTML = html;

            }

        }


        //====================================
        // HIDE VERIFY PAGE
        //====================================

        document
            .getElementById("resultVerifyPage")
            ?.classList.add("hidden");


        //====================================
        // SHOW RESULT PAGE
        //====================================

        document
            .getElementById("studentResultPage")
            ?.classList.remove("hidden");


        //====================================
        // STUDENT INFO (OPTIONAL)
        //====================================

        if(!isAdminMode){

            const studentInfo =
                document.getElementById(
                    "studentInfo"
                );

            if(studentInfo){

                studentInfo.innerHTML = "";

            }

        }

    })

    .catch(function(err){

        console.log(
            "LOAD ALL RESULTS ERROR:",
            err
        );

        alert(
            "Unable to load result list."
        );

    });

}
function searchResult(){

let input=document.getElementById("searchResult").value.toUpperCase();

let tr=document.querySelectorAll("#resultTableBody tr");

tr.forEach(function(row){

let text=row.innerText.toUpperCase();

row.style.display=text.includes(input)?"":"none";

});

}
//====================================================
// PROFESSIONAL DMC MARKSHEET
// LOAD FROM DMC SHEET
//====================================================

//====================================================
// OPEN DMC MARKSHEET
//====================================================

function openMarksheet(regNo, paper){

    if(!regNo || !paper){

        alert("Student details missing.");
        return;

    }


    document
    .getElementById("studentResultPage")
    ?.classList.add("hidden");


    document
    .getElementById("marksheetPage")
    ?.classList.remove("hidden");


    loadDMCMarksheet(
        regNo,
        paper,
        studentId
    );

}
//====================================================
// LOAD DMC MARKSHEET
//====================================================

function loadMarksheet(){

  const regNo = localStorage.getItem("regNo") || "";
  const paper = localStorage.getItem("paperName") || "";
  const studentId = localStorage.getItem("studentId") || "";


  if(!regNo || !paper || !studentId){
    alert("Invalid Student Details");
    return;
  }


  fetch(
    SCRIPT_URL +
    "?action=dmcMarksheet" +
    "&regNo=" + encodeURIComponent(regNo) +
    "&paper=" + encodeURIComponent(paper) +
    "&studentId=" + encodeURIComponent(studentId)
  )
  .then(res => res.json())
  .then(data => {


    if(data.status !== "SUCCESS"){

      alert("Marksheet Not Found");
      return;

    }


    const s = data.student;
    const m = data.marksheet;



    //==============================
    // STUDENT DETAILS
    //==============================


    document.getElementById("mkRegNo").textContent =
    s.regNo || "";


    document.getElementById("mkStudentName").textContent =
    s.name || "";


    document.getElementById("mkCourse").textContent =
    s.course || "";



    //==============================
    // DMC DETAILS
    //==============================


    document.getElementById("mkPaperName").textContent =
    m["Paper Name"] || "";


    document.getElementById("mkTheory").textContent =
    m["Theory"] || "";


    document.getElementById("mkPractical").textContent =
    m["Practical"] || "";



    // HARD CODED VALUES
    document.getElementById("mkTotalMarks").textContent =
    "100";


    document.getElementById("mkPassMarks").textContent =
    "33";



    // OBTAIN MARKS FROM SHEET

    document.getElementById("mkObtainMarks").textContent =
    m["Obtain Marks"] || "";



    // PERCENTAGE

    document.getElementById("mkPercentage").textContent =
    m["Percentage"] || "";



    // GRADE

    document.getElementById("mkGrade").textContent =
    m["Grade"] || "";



    // RESULT

    document.getElementById("mkResult").textContent =
    m["Result"] || "";



    //==============================
    // LOGO
    //==============================

    document.getElementById("mkLogo").src =
    "ikon.jpg";



    //==============================
    // QR CODE
    //==============================

    document.getElementById("mkQR").src =
    "qr.png";



  })
  .catch(err=>{

    console.log(err);
    alert("Server Error");

  });


}


//====================================================
// ADMIN - VIEW QUESTION WISE ANSWERS
//====================================================

function openAnswerDetails(regNo, paperName){

    if(!regNo || !paperName){

        alert("Student details not found.");

        return;

    }


    fetch(
        SCRIPT_URL +
        "?action=adminAnswerDetails" +
        "&regNo=" + encodeURIComponent(regNo) +
        "&paper=" + encodeURIComponent(paperName)
    )

    .then(function(res){

        return res.json();

    })

    .then(function(data){

        if(data.status !== "SUCCESS"){

            alert("Answer details not found.");

            return;

        }


        // Hide Result List

        document
        .getElementById("studentResultPage")
        ?.classList.add("hidden");


        // Show Answer Details Page

        document
        .getElementById("adminAnswerDetailsPage")
        ?.classList.remove("hidden");


        // Student Name

        const nameBox =
            document.getElementById("answerStudentName");

        if(nameBox){

            nameBox.innerHTML =
                data.name || "";

        }


        // Paper Name

        const paperBox =
            document.getElementById("answerPaperName");

        if(paperBox){

            paperBox.innerHTML =
                data.paper || paperName;

        }


        // Create Question Details

        let html = "";


        data.details.forEach(function(item){

            html += `

                <div class="answer-detail-card">

                    <p>
                        <b>Question:</b>
                        ${item.question || ""}
                    </p>

                    <p>
                        <b>Correct Answer:</b>
                        ${item.correctAnswer || ""}
                    </p>

                    <p>
                        <b>Student Answer:</b>
                        ${
                            item.studentAnswer
                            ? item.studentAnswer
                            : "Not Attempted"
                        }
                    </p>

                </div>

            `;

        });


        const detailsBox =
            document.getElementById("adminAnswerDetailsData");


        if(detailsBox){

            detailsBox.innerHTML = html;

        }

    })

    .catch(function(err){

        console.log(err);

        alert("Unable to load answer details.");

    });

}
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
function showMarksheet(data){

document
.getElementById("studentResultPage")
.classList.add("hidden");

document
.getElementById("marksheetPage")
.classList.remove("hidden");


document.getElementById("msregNo").innerHTML=data.regNo;

document.getElementById("msName").innerHTML=data.name;

document.getElementById("msCourse").innerHTML=data.course;

document.getElementById("msPaper").innerHTML=data.paper;

document.getElementById("msCorrect").innerHTML=data.correct;

document.getElementById("msGrade").innerHTML=data.grade;

document.getElementById("msResult").innerHTML=data.result;


// Student Photo

document.getElementById("msPhoto").src=

data.regNo+".jpeg";

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
