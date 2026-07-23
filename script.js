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
// TIMER
//====================================================

let totalTime = 30 * 60;

let timer = null;



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

    fetch(SCRIPT_URL + "?action=duration")

        .then(res => res.text())

        .then(duration => {

            let min = parseInt(duration);

            if (!isNaN(min) && min > 0) {

                totalTime = min * 60;

                showTimer();

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

            let minutes = parseInt(data);

            if (isNaN(minutes) || minutes <= 0) {

                minutes = 30;

            }

            totalTime = minutes * 60;

            showTimer();

        })

        .catch(() => {

            totalTime = 30 * 60;

            showTimer();

        });

}



//====================================================
// LOAD TEST TIME
//====================================================

function loadTestTime() {

    fetch(SCRIPT_URL + "?action=testTime")

        .then(res => res.text())

        .then(data => {

            const box = document.getElementById("testTime");

            if (box) {

                box.innerHTML = "🕒 Test Time : " + data;

            }

        })

        .catch(() => {

            const box = document.getElementById("testTime");

            if (box) {

                box.innerHTML = "🕒 Test Time : Not Available";

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

    checkTestStatus();

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

    .then(function (res) {

        if (!res.ok) {

            throw new Error("Unable to connect");

        }

        return res.text();

    })

    .then(function (status) {

        status = status.trim().toUpperCase();

        console.log("Current Status :", status);

        //------------------------------------------
        // TEST STARTED
        //------------------------------------------

        if (status === "ON") {

            openTest();

            return;

        }

        //------------------------------------------
        // WAITING PAGE
        //------------------------------------------

        const loginPage =
            document.getElementById("loginPage");

        const waitingPage =
            document.getElementById("waitingPage");

        if (loginPage)
            loginPage.classList.add("hidden");

        if (waitingPage)
            waitingPage.classList.remove("hidden");

        showRandomLine();

        autoCheckStatus();

    })

    .catch(function (err) {

        console.log(err);

        alert("Unable to check exam status.");

    });

}



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

    //------------------------------------------
    // Stop Waiting Timer
    //------------------------------------------

    stopStatusChecker();

    //------------------------------------------
    // Reset Flags
    //------------------------------------------

    examSubmitted = false;

    submitReason = "Manual Submit";

    focusWarnings = 0;

    focusLock = false;

    //------------------------------------------
    // Hide Other Pages
    //------------------------------------------

    document
        .getElementById("loginPage")
        ?.classList.add("hidden");

    document
        .getElementById("waitingPage")
        ?.classList.add("hidden");

    //------------------------------------------
    // Show Test Page
    //------------------------------------------

    document
        .getElementById("testPage")
        ?.classList.remove("hidden");

    //------------------------------------------
    // Student Details
    //------------------------------------------

    const nameBox =
        document.getElementById("showName");

    const regBox =
        document.getElementById("showReg");

    const paperBox =
        document.getElementById("showPaper");

    if (nameBox)
        nameBox.innerHTML = studentName;

    if (regBox)
        regBox.innerHTML = regNo;

    if (paperBox)
        paperBox.innerHTML = paperName;
    document.getElementById("showCourse").innerHTML = courseName;
document.getElementById("showMarks").innerHTML = totalMarks;
document.getElementById("showPassingMarks").innerHTML = passingMarks;

    //------------------------------------------
    // Student Photo
    //------------------------------------------

    loadStudentPhoto(regNo);

    //------------------------------------------
    // Instructions
    //------------------------------------------
    document
    .getElementById("verificationPage")
    ?.classList.remove("hidden");

document
    .getElementById("instructionPage")
    ?.classList.add("hidden");

document
    .getElementById("examArea")
    ?.classList.add("hidden");

    //------------------------------------------
    // Rules Checkbox
    //------------------------------------------

    const check =
        document.getElementById("acceptRules");

    if (check)
        check.checked = false;

    //------------------------------------------
    // Start Button
    //------------------------------------------

    const startBtn =
        document.getElementById("startExamBtn");

    if (startBtn)
        startBtn.disabled = true;

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

    .then(function (res) {

        if (!res.ok) {

            throw new Error("Unable to connect");

        }

        return res.text();

    })

    .then(function (status) {

        status = status.trim().toUpperCase();

        console.log("Current Status :", status);

        //------------------------------------------
        // TEST STARTED
        //------------------------------------------

        if (status === "ON") {

            openTest();

            return;

        }

        //------------------------------------------
        // WAITING PAGE
        //------------------------------------------

        const loginPage =
            document.getElementById("loginPage");

        const waitingPage =
            document.getElementById("waitingPage");

        if (loginPage)
            loginPage.classList.add("hidden");

        if (waitingPage)
            waitingPage.classList.remove("hidden");

        showRandomLine();

        autoCheckStatus();

    })

    .catch(function (err) {

        console.log(err);

        alert("Unable to check exam status.");

    });

}



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

function verifyStudentID(){

    let enteredId =
    document.getElementById("studentIdInput")
    .value
    .trim();

    if(enteredId===""){

        alert("Please enter Student ID.");

        return;

    }

    if(
        enteredId.toUpperCase() ===
        studentId.toUpperCase()
    ){

        document
        .getElementById("verificationPage")
        .classList.add("hidden");

        document
        .getElementById("instructionPage")
        .classList.remove("hidden");

    }
    else{

        alert("Invalid Student ID.");

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

        const span =
            document.createElement("span");

        span.innerHTML = option;

        label.appendChild(input);

        label.appendChild(span);

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

    const payload = {

        name: studentName,

        regNo: regNo,

        paperName: paperName,

        submitReason: submitReason,

        answers: answers,
        questions: questions
         

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
