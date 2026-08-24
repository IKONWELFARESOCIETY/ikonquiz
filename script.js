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
let verificationCode = "";
let courseName = "";
let totalMarks = "";
let passingMarks = "";
//====================================================
// RESULT PAGE NAVIGATION CONTROL
//====================================================

let resultNavigationToken = 0;

//====================================================
// QUESTION DATA
//====================================================

let questions = [];
let answers = [];
let currentQuestion = 0;
//====================================================
// PRACTICAL TIMER
//====================================================

let practicalDuration = 30;

let practicalTotalTime = practicalDuration * 60;

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
let adminToken = "";
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

//====================================================
// STUDENT LOGIN
// REG NO + NAME ONLY
//====================================================

//====================================================
// STUDENT LOGIN
// REG NO + NAME ONLY
//====================================================

function startTest(){

    //================================================
    // GET INPUTS
    //================================================

    const nameInput =
        document.getElementById(
            "studentName"
        );

    const regInput =
        document.getElementById(
            "regNo"
        );


    if(
        !nameInput ||
        !regInput
    ){

        alert(
            "Login fields not found."
        );

        return;

    }


    //================================================
    // READ VALUES
    //================================================

    studentName =
        nameInput.value
        .trim();

    regNo =
        regInput.value
        .trim();


    //================================================
    // VALIDATION
    //================================================

    if(
        studentName === "" ||
        regNo === ""
    ){

        alert(
            "Please enter Registration Number and Student Name."
        );

        return;

    }


    //================================================
    // LOGIN BUTTON
    //================================================

    const loginBtn =
        document.getElementById(
            "loginBtn"
        );


    if(loginBtn){

        loginBtn.disabled =
            true;

        loginBtn.innerHTML =
            "Verifying...";

    }


    //================================================
    // LOGIN API
    // ONLY REG NO + NAME
    //================================================

    const loginURL =
        SCRIPT_URL +
        "?action=login" +
        "&regNo=" +
        encodeURIComponent(
            regNo
        ) +
        "&name=" +
        encodeURIComponent(
            studentName
        );


    console.log(
        "Login URL:",
        loginURL
    );


    fetch(loginURL)

    .then(function(res){

        if(!res.ok){

            throw new Error(
                "Server Error: " +
                res.status
            );

        }

        return res.json();

    })

    .then(function(data){

        console.log(
            "Login Response:",
            data
        );


        //================================================
        // RESET BUTTON
        //================================================

        if(loginBtn){

            loginBtn.disabled =
                false;

            loginBtn.innerHTML =
                "LOGIN";

        }


        //================================================
        // VALID LOGIN
        //================================================

        if(
            data.status ===
            "VALID"
        ){

            //============================================
            // SAVE STUDENT DATA
            //============================================

            studentName =
                data.name || studentName;


            regNo =
                data.regNo || regNo;


            courseName =
                data.course || "";


            totalMarks =
                data.totalMarks || "";


            passingMarks =
                data.passingMarks || "";


            theoryPapers =
                Array.isArray(
                    data.theoryPapers
                )
                ?
                data.theoryPapers
                :
                [];


            practicalPapers =
                Array.isArray(
                    data.practicalPapers
                )
                ?
                data.practicalPapers
                :
                [];


            // Student ID server se mil raha hai,
            // lekin login par verify nahi ho raha.

            studentId =
                data.idNo || "";


            //============================================
            // CHECK AVAILABLE EXAMS
            //============================================

            if(
                theoryPapers.length === 0 &&
                practicalPapers.length === 0
            ){

                alert(
                    "All assigned examinations have already been completed."
                );

                return;

            }


            //============================================
            // OPEN EXAM TYPE PAGE
            //============================================

            openExamTypePage();

            return;

        }


        //================================================
        // ALL PAPERS SUBMITTED
        //================================================

        if(
            data.status ===
            "ALL_SUBMITTED"
        ){

            alert(
                "All assigned examinations have already been completed."
            );

            return;

        }


        //================================================
        // INVALID LOGIN
        //================================================

        alert(
            data.message ||
            "Invalid Registration Number or Student Name."
        );

    })


    .catch(function(error){

        console.error(
            "Login Error:",
            error
        );


        if(loginBtn){

            loginBtn.disabled =
                false;

            loginBtn.innerHTML =
                "LOGIN";

        }


        alert(
            "Unable to connect with server."
        );

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

//====================================================
// OPEN PRACTICAL PAGE
//====================================================

//====================================================
// OPEN PRACTICAL VERIFICATION
//====================================================

function continuePracticalExam(){

    const select =
        document.getElementById(
            "practicalPaperSelect"
        );


    if(
        !select ||
        select.value === ""
    ){

        alert(
            "Please Select Practical Paper"
        );

        return;

    }


    //================================================
    // SAVE PAPER
    //================================================

    paperName =
        select.value;


    examMode =
        "PRACTICAL";


    //================================================
    // HIDE PRACTICAL PAPER PAGE
    //================================================

    document
        .getElementById(
            "practicalPaperPage"
        )
        ?.classList.add(
            "hidden"
        );


    //================================================
    // HIDE PRACTICAL PAGE
    //================================================

    document
        .getElementById(
            "practicalPage"
        )
        ?.classList.add(
            "hidden"
        );


    //================================================
    // SHOW VERIFICATION PAGE
    //================================================

    document
        .getElementById(
            "practicalVerificationPage"
        )
        ?.classList.remove(
            "hidden"
        );


    //================================================
    // CLEAR OLD VALUES
    //================================================

    const idBox =
        document.getElementById(
            "practicalStudentIdInput"
        );


    const codeBox =
        document.getElementById(
            "practicalVerificationCodeInput"
        );


    if(idBox){

        idBox.value = "";

    }


    if(codeBox){

        codeBox.value = "";

    }


    //================================================
    // FOCUS ID
    //================================================

    setTimeout(
        function(){

            if(idBox){

                idBox.focus();

            }

        },
        100
    );

}
//====================================================
// PRACTICAL INSTRUCTION CHECKBOX
//====================================================

function togglePracticalStart(){

    const check =
        document.getElementById(
            "practicalInstructionCheck"
        );

    const startBtn =
        document.getElementById(
            "startPracticalBtn"
        );

    if(!check || !startBtn){

        return;

    }

    startBtn.disabled =
        !check.checked;

}
//====================================================
// START PRACTICAL EXAM
//====================================================

function startPracticalExam(){

    const check =
        document.getElementById(
            "practicalInstructionCheck"
        );

    if(!check || !check.checked){

        alert(
            "Please read and accept the Practical Examination Instructions."
        );

        return;

    }


    //---------------------------------------
    // Hide Instructions
    //---------------------------------------

    document
        .getElementById("practicalInstructionPage")
        ?.classList.add("hidden");


    //---------------------------------------
    // Show Questions
    //---------------------------------------

    document
        .getElementById("practicalQuestionArea")
        ?.classList.remove("hidden");


    //---------------------------------------
    // Load Questions
    //---------------------------------------

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

'<div class="prQuestionHindi">' +

    (q.hindiQuestion || '') +

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

//====================================================
// VERIFY THEORY STUDENT
// REG NO + NAME + STUDENT ID + VERIFICATION CODE
//====================================================

//====================================================
// THEORY STUDENT VERIFICATION
// REG NO + NAME + STUDENT ID + VERIFICATION CODE
//====================================================

function verifyStudentID(){

    //================================================
    // GET ELEMENTS
    //================================================

    const idBox =
        document.getElementById(
            "studentIdInput"
        );

    const codeBox =
        document.getElementById(
            "examVerificationCode"
        );

    const verifyPage =
        document.getElementById(
            "verificationPage"
        );

    const instructionPage =
        document.getElementById(
            "instructionPage"
        );

    const examArea =
        document.getElementById(
            "examArea"
        );

    const verifyBtn =
        verifyPage
        ? verifyPage.querySelector(
            ".primary"
        )
        : null;


    //================================================
    // ELEMENT CHECK
    //================================================

    if(
        !idBox ||
        !codeBox ||
        !verifyPage ||
        !instructionPage
    ){

        console.error(
            "Theory verification elements not found."
        );

        alert(
            "Verification page error. Please refresh the page."
        );

        return;

    }


    //================================================
    // GET VALUES
    //================================================

    const enteredId =
        idBox.value
            .trim()
            .toUpperCase();


    const enteredCode =
        codeBox.value
            .trim()
            .toUpperCase();


    //================================================
    // VALIDATION
    //================================================

    if(
        enteredId === "" ||
        enteredCode === ""
    ){

        alert(
            "Please enter Student ID and Verification Code."
        );

        if(
            enteredId === ""
        ){

            idBox.focus();

        }else{

            codeBox.focus();

        }

        return;

    }


    //================================================
    // DISABLE VERIFY BUTTON
    //================================================

    if(verifyBtn){

        verifyBtn.disabled =
            true;

        verifyBtn.innerHTML =
            "Verifying...";

    }


    //================================================
    // SERVER URL
    //================================================

    const verifyURL =
        SCRIPT_URL +

        "?action=verifyExamStudent" +

        "&regNo=" +
        encodeURIComponent(
            regNo
        ) +

        "&name=" +
        encodeURIComponent(
            studentName
        ) +

        "&studentId=" +
        encodeURIComponent(
            enteredId
        ) +

        "&verificationCode=" +
        encodeURIComponent(
            enteredCode
        );


    console.log(
        "THEORY VERIFICATION REQUEST"
    );


    //================================================
    // SERVER VERIFICATION
    //================================================

    fetch(
        verifyURL
    )

    .then(function(response){

        if(!response.ok){

            throw new Error(
                "Server Error: " +
                response.status
            );

        }

        return response.json();

    })

    .then(function(data){

        console.log(
            "THEORY VERIFICATION RESPONSE:",
            data
        );


        //================================================
        // VALID
        //================================================

        if(
            data.status ===
            "VALID"
        ){

            //============================================
            // SAVE VERIFIED DETAILS
            //============================================

            studentId =
                data.studentId ||
                enteredId;


            verificationCode =
                enteredCode;


            //============================================
            // HIDE VERIFICATION PAGE
            //============================================

            verifyPage.classList.add(
                "hidden"
            );


            //============================================
            // KEEP QUESTION AREA HIDDEN
            //============================================

            if(examArea){

                examArea.classList.add(
                    "hidden"
                );

            }


            //============================================
            // SHOW INSTRUCTION PAGE
            //============================================

            instructionPage.classList.remove(
                "hidden"
            );


            //============================================
            // RESET INSTRUCTION CHECKBOX
            //============================================

            const acceptRules =
                document.getElementById(
                    "acceptRules"
                );


            if(acceptRules){

                acceptRules.checked =
                    false;

            }


            //============================================
            // DISABLE START EXAM BUTTON
            //============================================

            const startExamBtn =
                document.getElementById(
                    "startExamBtn"
                );


            if(startExamBtn){

                startExamBtn.disabled =
                    true;

            }


            //============================================
            // RESET QUESTION POSITION
            //============================================

            if(
                typeof currentQuestionIndex !==
                "undefined"
            ){

                currentQuestionIndex =
                    0;

            }


            //============================================
            // SUCCESS MESSAGE IN CONSOLE
            //============================================

            console.log(
                "Theory student verification successful."
            );


            return;

        }


        //================================================
        // INVALID
        //================================================

        alert(
            "Invalid Student ID or Verification Code."
        );


        // Clear both fields
        idBox.value =
            "";

        codeBox.value =
            "";


        // Focus Student ID
        idBox.focus();

    })

    .catch(function(error){

        console.error(
            "Theory Verification Error:",
            error
        );


        alert(
            "Unable to verify student details. Please try again."
        );

    })

    .finally(function(){

        //==============================================
        // RESTORE BUTTON
        //==============================================

        if(verifyBtn){

            verifyBtn.disabled =
                false;

            verifyBtn.innerHTML =
                "Verify";

        }

    });

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
    studentId = "";
verificationCode = "";
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
        .getElementById("leaderboardPage")
        ?.classList.add("hidden");

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

    const code =
        document
        .getElementById("resultStudentID")
        .value
        .trim();

    if(code==""){
        alert("Please Enter Verification Code");
        return;
    }

    if(code !== "16112001"){
        alert("Invalid Verification Code");
        return;
    }

    // -----------------------------------------------
    // CREATE UNIQUE REQUEST TOKEN
    // -----------------------------------------------

    const myToken = ++resultNavigationToken;


    fetch(
        SCRIPT_URL +
        "?action=studentResultList"
    )

    .then(res => res.json())

    .then(data => {

        // -------------------------------------------
        // OLD REQUEST CHECK
        // -------------------------------------------

        if(myToken !== resultNavigationToken){
            return;
        }


        if(data.status!="SUCCESS"){

            alert("Unable to load Result List");
            return;

        }


        // -------------------------------------------
        // SHOW RESULT PAGE
        // -------------------------------------------

        document
        .getElementById("loginPage")
        ?.classList.add("hidden");


        document
        .getElementById("resultVerifyPage")
        ?.classList.add("hidden");


        document
        .getElementById("studentResultPage")
        ?.classList.remove("hidden");


        const body =
            document.getElementById(
                "resultTableBody"
            );

        if(!body){
            return;
        }

        body.innerHTML = "";


        let visibleCount = 0;


        data.results.forEach(function(r){

            // Sirf Published Results Show Honge

            if(r.publishStatus !== "YES"){
                return;
            }


            visibleCount++;


            const tr =
                document.createElement("tr");


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

                    <button
                        class="viewMarksheetBtn"
                        onclick="verifyMarksheet('${r.paperName}')">

                        View Marksheet

                    </button>

                </td>

            `;


            body.appendChild(tr);

        });


        // -------------------------------------------
        // NO RESULT
        // -------------------------------------------

        if(visibleCount === 0){

            body.innerHTML = `

                <tr>

                    <td
                        colspan="18"
                        style="
                            text-align:center;
                            padding:45px;
                            color:#d32f2f;
                            font-size:22px;
                            font-weight:bold;
                            background:#fff8f8;
                        "
                    >

                        Results will be published soon.

                    </td>

                </tr>

            `;

        }

    })

    .catch(function(err){

        console.log(err);

        // Agar user meanwhile Leaderboard par chala gaya
        // to error popup bhi unnecessary nahi dikhayenge

        if(myToken !== resultNavigationToken){
            return;
        }

        alert("Unable to load Result List.");

    });

}
//====================================
// BACK LOGIN
//====================================

//====================================================
// BACK TO MAIN LOGIN PAGE
//====================================================

//====================================================
// BACK TO MAIN LOGIN PAGE
//====================================================

function backToLogin(){

    //================================================
    // CANCEL ANY RUNNING RESULT REQUEST
    //================================================

    resultNavigationToken++;


    //================================================
    // HIDE LEADERBOARD
    //================================================

    document
        .getElementById("leaderboardPage")
        ?.classList.add("hidden");


    //================================================
    // HIDE RESULT VERIFY PAGE
    //================================================

    document
        .getElementById("resultVerifyPage")
        ?.classList.add("hidden");


    //================================================
    // HIDE STUDENT RESULT LIST
    //================================================

    document
        .getElementById("studentResultPage")
        ?.classList.add("hidden");


    //================================================
    // HIDE ADMIN ANSWER DETAILS
    //================================================

    document
        .getElementById("adminAnswerDetailsPage")
        ?.classList.add("hidden");


    //================================================
    // HIDE MARKSHEET
    //================================================

    document
        .getElementById("marksheetPage")
        ?.classList.add("hidden");


    //================================================
    // HIDE ADMIN VERIFY PAGE
    //================================================

    document
        .getElementById("adminVerifyPage")
        ?.classList.add("hidden");


    //================================================
    // HIDE QR VERIFY PAGE
    //================================================

    document
        .getElementById("qrVerifyPage")
        ?.classList.add("hidden");


    //================================================
    // RESET ADMIN MODE
    //================================================

    isAdminMode = false;
    adminToken = "";


    //================================================
    // CLEAR RESULT SEARCH
    //================================================

    const search =
        document.getElementById("searchResult");

    if(search){
        search.value = "";
    }


    //================================================
    // CLEAR RESULT VERIFICATION CODE
    //================================================

    const resultID =
        document.getElementById("resultStudentID");

    if(resultID){
        resultID.value = "";
    }


    //================================================
    // CLEAR ADMIN CODE
    //================================================

    const adminCode =
        document.getElementById("adminVerifyCode");

    if(adminCode){
        adminCode.value = "";
    }


    //================================================
    // CLEAR RESULT TABLE
    //================================================

    const resultBody =
        document.getElementById("resultTableBody");

    if(resultBody){
        resultBody.innerHTML = "";
    }


    //================================================
    // CLEAR ADMIN ANSWER DETAILS
    //================================================

    const answerContainer =
        document.getElementById(
            "adminAnswerDetailsContainer"
        );

    if(answerContainer){
        answerContainer.innerHTML = "";
    }


    //================================================
    // SHOW LOGIN PAGE
    //================================================

    document
        .getElementById("loginPage")
        ?.classList.remove("hidden");


    //================================================
    // SCROLL TOP
    //================================================

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



        // Create Question Details

     
//====================================================
// BACK TO RESULT LIST FROM ANSWER DETAILS
//====================================================

function backToResultListFromAnswers(){
        hideStudentLoginForAdmin();

    // Hide Answer Details Page

    document
        .getElementById("adminAnswerDetailsPage")
        ?.classList.add("hidden");


    // Show Result List

    document
        .getElementById("studentResultPage")
        ?.classList.remove("hidden");

}
// =====================================================
// PROFESSIONAL ADMIN ANSWER DETAILS
// =====================================================

function openAdminAnswerDetails(regNo, paperName){

    if(!regNo || !paperName){
        alert("Student details missing.");
        return;
    }

    // Hide Result List
    document
        .getElementById("studentResultPage")
        ?.classList.add("hidden");

    // Show Answer Details
    document
        .getElementById("adminAnswerDetailsPage")
        ?.classList.remove("hidden");


    // Loading
    const container =
        document.getElementById(
            "adminAnswerDetailsContainer"
        );

    if(container){

        container.innerHTML = `
            <div class="answerLoading">

                <div class="loadingSpinner"></div>

                <p>
                    Loading Answer Details...
                </p>

            </div>
        `;
    }


    // Clear old data

    setText(
        "answerStudentName",
        "Loading..."
    );

    setText(
        "answerRegNo",
        regNo
    );

    setText(
        "answerPaperName",
        paperName
    );

    setText(
        "answerSubmitDate",
        "--"
    );


    // =================================================
    // FETCH ANSWER DETAILS
    // =================================================

    fetch(
        SCRIPT_URL +
        "?action=adminAnswerDetails" +
        "&regNo=" +
        encodeURIComponent(regNo) +
        "&paper=" +
        encodeURIComponent(paperName)
    )

    .then(function(res){

        return res.json();

    })

    .then(function(data){

        console.log(
            "ADMIN ANSWER DETAILS:",
            data
        );


        if(
            data.status !== "SUCCESS"
        ){

            showAnswerDetailsError(
                data.status ||
                "Unable to load answer details."
            );

            return;
        }


        renderAdminAnswerDetails(
            data
        );

    })

    .catch(function(error){

        console.log(
            "Answer Details Error:",
            error
        );

        showAnswerDetailsError(
            "Unable to connect with server."
        );

    });

}


// =====================================================
// SAFE TEXT
// =====================================================

function setText(id,value){

    const element =
        document.getElementById(id);

    if(element){

        element.textContent =
            value == null
            ? ""
            : String(value);

    }

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeAnswerHTML(value){

    if(value === null ||
       value === undefined){

        return "";
    }

    return String(value)

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}


// =====================================================
// RENDER ANSWER DETAILS
// =====================================================
//====================================================
// SET ANSWER PAGE TEXT
//====================================================

function setAnswerText(id, value){

    const element =
        document.getElementById(id);

    if(!element){
        console.warn(
            "Element not found:",
            id
        );
        return;
    }

    element.textContent =
        value === null ||
        value === undefined ||
        value === ""
            ? "--"
            : String(value);

}
//====================================================
// HIDE STUDENT LOGIN FOR ADMIN MODE
//====================================================

function hideStudentLoginForAdmin(){

    // Candidate Login
    document
        .getElementById("loginPage")
        ?.classList
        .add("hidden");

    // Result verification
    document
        .getElementById("resultVerifyPage")
        ?.classList
        .add("hidden");

    // Marksheet
    document
        .getElementById("marksheetPage")
        ?.classList
        .add("hidden");

    // Normal result page
    document
        .getElementById("resultPage")
        ?.classList
        .add("hidden");

    // Admin verification
    document
        .getElementById("adminVerifyPage")
        ?.classList
        .add("hidden");

}
function renderAdminAnswerDetails(data){

    // -------------------------------------------------
    // STUDENT DETAILS
    // -------------------------------------------------

    setText(
        "answerStudentName",
        data.name || "--"
    );

    setText(
        "answerRegNo",
        data.regNo || "--"
    );

    setText(
        "answerPaperName",
        data.paper || "--"
    );


    // -------------------------------------------------
    // DATE
    // -------------------------------------------------

    setText(
        "answerSubmitDate",
        data.date ||
        data.submitDate ||
        "--"
    );


    const details =
        Array.isArray(data.details)
        ? data.details
        : [];


    // -------------------------------------------------
    // COUNTS
    // -------------------------------------------------

    let total = details.length;

    let correct = 0;

    let wrong = 0;

    let unattempted = 0;


    details.forEach(function(item){

        const status =
            String(
                item.status || ""
            )
            .trim()
            .toUpperCase();


        if(status === "CORRECT"){

            correct++;

        }

        else if(status === "WRONG"){

            wrong++;

        }

        else{

            unattempted++;

        }

    });


    setText(
        "answerTotal",
        total
    );

    setText(
        "answerCorrect",
        correct
    );

    setText(
        "answerWrong",
        wrong
    );

    setText(
        "answerUnattempted",
        unattempted
    );


    // -------------------------------------------------
    // QUESTION CONTAINER
    // -------------------------------------------------

    const container =
        document.getElementById(
            "adminAnswerDetailsContainer"
        );


    if(!container){

        return;
    }


    if(details.length === 0){

        container.innerHTML = `

            <div class="answerEmpty">

                <div class="answerEmptyIcon">
                    📭
                </div>

                <h3>
                    No Answer Details Found
                </h3>

                <p>
                    Question-wise response data
                    is not available for this submission.
                </p>

            </div>

        `;

        return;
    }


    // -------------------------------------------------
    // BUILD QUESTIONS
    // -------------------------------------------------

    let html = "";


    details.forEach(function(item,index){

        const questionNo =
            item.qNo ||
            item.questionNo ||
            (index + 1);


        const question =
            item.question ||
            "Question not available";


        const studentAnswer =
            item.studentAnswer ||
            item.answer ||
            "";


        const correctAnswer =
            item.correctAnswer ||
            "";


        const status =
            String(
                item.status ||
                "UNATTEMPTED"
            )
            .trim()
            .toUpperCase();


        let statusClass =
            "statusUnattempted";

        let statusText =
            "UNATTEMPTED";


        if(status === "CORRECT"){

            statusClass =
                "statusCorrect";

            statusText =
                "✓ CORRECT";

        }

        else if(status === "WRONG"){

            statusClass =
                "statusWrong";

            statusText =
                "✕ WRONG";

        }


        const displayStudentAnswer =
            studentAnswer.trim() === ""
            ? "Not Attempted"
            : studentAnswer;


        html += `

            <div class="adminAnswerCard">


                <!-- QUESTION HEADER -->

                <div class="answerQuestionHeader">

                    <div class="questionNumber">

                        <div class="questionNumberBadge">
                            ${escapeAnswerHTML(questionNo)}
                        </div>

                        <span>
                            Question
                            ${escapeAnswerHTML(questionNo)}
                        </span>

                    </div>


                    <div class="
                        answerStatusBadge
                        ${statusClass}
                    ">

                        ${statusText}

                    </div>

                </div>


                <!-- QUESTION BODY -->

                <div class="answerQuestionBody">


                    <div class="answerQuestionText">

                        ${escapeAnswerHTML(question)}

                    </div>


                    <!-- ANSWER COMPARISON -->

                    <div class="answerCompareGrid">


                        <!-- STUDENT -->

                        <div class="
                            answerBox
                            studentAnswerBox
                        ">

                            <div class="answerBoxTitle">

                                Student Answer

                            </div>


                            <div class="answerValue">

                                ${escapeAnswerHTML(
                                    displayStudentAnswer
                                )}

                            </div>

                        </div>


                        <!-- CORRECT -->

                        <div class="
                            answerBox
                            correctAnswerBox
                        ">

                            <div class="answerBoxTitle">

                                Correct Answer

                            </div>


                            <div class="answerValue">

                                ${escapeAnswerHTML(
                                    correctAnswer ||
                                    "Not Available"
                                )}

                            </div>

                        </div>


                    </div>

                </div>

            </div>

        `;

    });


    container.innerHTML = html;

}
// =====================================================
// ANSWER DETAILS ERROR
// =====================================================

function showAnswerDetailsError(message){

    const container =
        document.getElementById(
            "adminAnswerDetailsContainer"
        );


    if(!container){

        return;
    }


    let text =
        "Unable to load answer details.";


    if(message === "RESULT_NOT_FOUND"){

        text =
            "Submitted result was not found.";

    }

    else if(
        message ===
        "OLD_DATA_NO_QUESTION_ORDER"
    ){

        text =
            "Question-wise details are not available for this old submission.";

    }


    container.innerHTML = `

        <div class="answerEmpty">

            <div class="answerEmptyIcon">
                ⚠️
            </div>

            <h3>
                Answer Details Unavailable
            </h3>

            <p>
                ${escapeAnswerHTML(text)}
            </p>

        </div>

    `;

}

//====================================================
// BACK TO RESULT LIST + REFRESH
//====================================================

function backToResultList(){
    resultNavigationToken++;

    // Hide Marksheet
    document
        .getElementById("marksheetPage")
        ?.classList.add("hidden");

    // Hide Leaderboard
    document
        .getElementById("leaderboardPage")
        ?.classList.add("hidden");

    // Show Result List
    document
        .getElementById("studentResultPage")
        ?.classList.remove("hidden");

    // Refresh Result List from Server
    verifyResultStudent();

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

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

//====================================================
// VERIFY ADMIN
//====================================================

//====================================================
// VERIFY ADMIN
//====================================================

//====================================================
// VERIFY ADMIN
//====================================================

function verifyAdmin(){

    const codeBox =
        document.getElementById(
            "adminVerifyCode"
        );


    if(!codeBox){

        alert(
            "Verification box not found."
        );

        return;

    }


    const code =
        codeBox.value.trim();


    if(code === ""){

        alert(
            "Please Enter Verification Code"
        );

        return;

    }


    //================================================
    // VERIFY WITH APPS SCRIPT
    //================================================

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

        console.log(
            "ADMIN VERIFICATION:",
            data
        );


        //================================================
        // SUCCESS
        //================================================

        if(
            data.status === "SUCCESS"
        ){

            //============================================
            // ADMIN MODE ON
            //============================================

            isAdminMode = true;


            //============================================
            // SAVE ADMIN TOKEN
            //============================================

            adminToken =
                data.token || "";


            console.log(
                "ADMIN TOKEN SAVED:",
                adminToken
            );


            //============================================
            // HIDE STUDENT LOGIN
            //============================================

            hideStudentLoginForAdmin();


            //============================================
            // HIDE ADMIN VERIFICATION PAGE
            //============================================

            document
                .getElementById(
                    "adminVerifyPage"
                )
                ?.classList
                .add("hidden");


            //============================================
            // SHOW ADMIN RESULT PAGE
            //============================================

            document
                .getElementById(
                    "studentResultPage"
                )
                ?.classList
                .remove("hidden");


            //============================================
            // LOAD THEORY RESULTS
            //============================================

            loadAdminResults();


            return;

        }


        //================================================
        // INVALID CODE
        //================================================

        alert(
            "Invalid Admin Verification Code"
        );


        codeBox.value = "";

        codeBox.focus();

    })

    .catch(function(err){

        console.error(
            "Admin Verification Error:",
            err
        );


        alert(
            "Unable to verify Admin."
        );

    });

}
//====================================================
// HIDE STUDENT LOGIN WHEN ADMIN MODE IS ACTIVE
//====================================================

function hideStudentLoginForAdmin(){

    // Candidate Login / Main Login Page
    document
        .getElementById("loginPage")
        ?.classList
        .add("hidden");


    // Result verification page
    document
        .getElementById("resultVerifyPage")
        ?.classList
        .add("hidden");


    // Marksheet page
    document
        .getElementById("marksheetPage")
        ?.classList
        .add("hidden");


    // Normal student result page
    // Admin result page को बाद में loadAdminResults()
    // खुद show करेगा.
}
//====================================================
// ADMIN RESULT LIST
// ONLY AVAILABLE AFTER ADMIN VERIFICATION
//====================================================

//====================================================
// ADMIN THEORY RESULT LIST
//====================================================

function loadAdminResults(){
    hideStudentLoginForAdmin();

    //================================================
    // ADMIN SECURITY CHECK
    //================================================

    if(isAdminMode !== true){

        console.warn(
            "Unauthorized attempt to open Admin Results."
        );

        return;

    }


    if(!adminToken){

        console.warn(
            "Admin token missing."
        );

        return;

    }


    //================================================
    // RESULT TABLE BODY
    //================================================

    const body =
        document.getElementById(
            "resultTableBody"
        );


    if(!body){

        console.error(
            "resultTableBody not found."
        );

        return;

    }


    //================================================
    // LOADING
    //================================================

    body.innerHTML = `

        <tr>

            <td
                colspan="9"
                style="
                    text-align:center;
                    padding:45px;
                    font-size:18px;
                    font-weight:700;
                    color:#1e3a8a;
                "
            >

                Loading Theory Results...

            </td>

        </tr>

    `;


    //================================================
    // CHANGE TABLE HEADER
    //================================================

    try{

        const table =
            body.closest("table");


        if(table){

            const headerRow =
                table.querySelector(
                    "thead tr"
                );


            if(headerRow){

                headerRow.innerHTML = `

                    <th>S.No.</th>

                    <th>Reg No</th>

                    <th>Student Name</th>

                    <th>Paper</th>

                    <th>Correct</th>

                    <th>Wrong</th>

                    <th>Unattempted</th>

                    <th>Result</th>

                    <th>Action</th>

                `;

            }

        }

    }

    catch(error){

        console.error(
            "Admin Header Error:",
            error
        );

    }


    //================================================
    // FETCH ADMIN RESULTS
    //================================================

    fetch(

        SCRIPT_URL +

        "?action=allResults" +

        "&adminToken=" +

        encodeURIComponent(
            adminToken
        )

    )

    .then(
        function(response){

            if(!response.ok){

                throw new Error(
                    "Server Error: " +
                    response.status
                );

            }

            return response.json();

        }
    )

    .then(
        function(data){

            console.log(
                "ADMIN THEORY RESULTS:",
                data
            );


            //================================================
            // ADMIN AUTHORIZATION CHECK
            //================================================

            if(
                data.status === "UNAUTHORIZED"
            ){

                alert(
                    "Admin verification required."
                );

                isAdminMode = false;

                adminToken = "";

                return;

            }


            //================================================
            // API ERROR
            //================================================

            if(
                data.status !== "SUCCESS"
            ){

                body.innerHTML = `

                    <tr>

                        <td
                            colspan="9"
                            style="
                                text-align:center;
                                padding:45px;
                                color:#dc2626;
                                font-weight:700;
                            "
                        >

                            Unable to load Admin Results.

                        </td>

                    </tr>

                `;

                return;

            }


            //================================================
            // GET RESULTS
            //================================================

            let results =
                Array.isArray(
                    data.results
                )
                ? data.results
                : [];


            //================================================
            // THEORY ONLY
            //
            // Practical / Viva / Notes /
            // Behaviour / Project are ignored.
            //================================================

            results =
                results.filter(
                    function(r){

                        const paper =
                            String(
                                r.paperName ||
                                r.paper ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        // अगर paper में practical/viva
                        // आदि है तो उसे Admin Theory
                        // list में मत दिखाओ.

                        if(
                            paper.includes(
                                "practical"
                            ) ||
                            paper.includes(
                                "viva"
                            ) ||
                            paper.includes(
                                "notes"
                            ) ||
                            paper.includes(
                                "behaviour"
                            ) ||
                            paper.includes(
                                "project"
                            )
                        ){

                            return false;

                        }


                        return true;

                    }
                );


            //================================================
            // CLEAR TABLE
            //================================================

            body.innerHTML = "";


            //================================================
            // NO THEORY RESULTS
            //================================================

            if(
                results.length === 0
            ){

                body.innerHTML = `

                    <tr>

                        <td
                            colspan="9"
                            style="
                                text-align:center;
                                padding:45px;
                                color:#64748b;
                                font-size:17px;
                                font-weight:700;
                            "
                        >

                            No Theory Results Found.

                        </td>

                    </tr>

                `;

                return;

            }


            //================================================
            // CREATE THEORY RESULT ROWS
            //================================================

            results.forEach(
                function(
                    r,
                    index
                ){

                    const tr =
                        document.createElement(
                            "tr"
                        );


                    //========================================
                    // STUDENT INFORMATION
                    //========================================

                    const regNo =
                        r.regNo ||
                        r.registrationNo ||
                        "";


                    const studentName =
                        r.studentName ||
                        r.name ||
                        "";


                    const paperName =
                        r.paperName ||
                        r.paper ||
                        "";


                    //========================================
                    // THEORY RESULT
                    //========================================

                    const correct =
                        r.correct ??
                        r.correctAnswer ??
                        0;


                    const wrong =
                        r.wrong ??
                        r.incorrect ??
                        0;


                    const unattempted =
                        r.unattempted ??
                        r.notAttempted ??
                        0;


                    const result =
                        r.result ||
                        r.grade ||
                        "";


                    //========================================
                    // ROW
                    //========================================

                    tr.innerHTML = `

                        <td>

                            ${index + 1}

                        </td>


                        <td>

                            ${escapeAdminHTML(
                                regNo
                            )}

                        </td>


                        <td>

                            <strong>

                                ${escapeAdminHTML(
                                    studentName
                                )}

                            </strong>

                        </td>


                        <td>

                            ${escapeAdminHTML(
                                paperName
                            )}

                        </td>


                        <td>

                            <span
                                style="
                                    display:inline-block;
                                    min-width:35px;
                                    padding:5px 9px;
                                    border-radius:7px;
                                    background:#dcfce7;
                                    color:#15803d;
                                    font-weight:700;
                                "
                            >

                                ${escapeAdminHTML(
                                    correct
                                )}

                            </span>

                        </td>


                        <td>

                            <span
                                style="
                                    display:inline-block;
                                    min-width:35px;
                                    padding:5px 9px;
                                    border-radius:7px;
                                    background:#fee2e2;
                                    color:#dc2626;
                                    font-weight:700;
                                "
                            >

                                ${escapeAdminHTML(
                                    wrong
                                )}

                            </span>

                        </td>


                        <td>

                            <span
                                style="
                                    display:inline-block;
                                    min-width:35px;
                                    padding:5px 9px;
                                    border-radius:7px;
                                    background:#f1f5f9;
                                    color:#475569;
                                    font-weight:700;
                                "
                            >

                                ${escapeAdminHTML(
                                    unattempted
                                )}

                            </span>

                        </td>


                        <td>

                            <strong>

                                ${escapeAdminHTML(
                                    result
                                )}

                            </strong>

                        </td>


                        <td>

                            <button
                                type="button"
                                class="viewAnswersBtn"
                                onclick="
                                    openAdminAnswerDetails(
                                        '${escapeJS(regNo)}',
                                        '${escapeJS(paperName)}'
                                    )
                                "
                            >

                                View Answers

                            </button>

                        </td>

                    `;


                    body.appendChild(
                        tr
                    );

                }
            );

        }
    )

    .catch(
        function(error){

            console.error(
                "Admin Theory Result Error:",
                error
            );


            body.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        style="
                            text-align:center;
                            padding:45px;
                            color:#dc2626;
                            font-weight:700;
                        "
                    >

                        Unable to connect with server.

                    </td>

                </tr>

            `;

        }
    );

}
//====================================================
// SAFE HTML
//====================================================

function escapeAdminHTML(value){

    if(
        value === null ||
        value === undefined
    ){

        return "";

    }


    return String(value)

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}


//====================================================
// SAFE JAVASCRIPT STRING
//====================================================

function escapeJS(value){

    if(
        value === null ||
        value === undefined
    ){

        return "";

    }


    return String(value)

        .replace(/\\/g,"\\\\")

        .replace(/'/g,"\\'")

        .replace(/"/g,'\\"')

        .replace(/\r/g,"")

        .replace(/\n/g,"\\n");

}
//====================================================
// OPEN ADMIN ANSWER DETAILS
// ADMIN ONLY
//====================================================

function openAdminAnswerDetails(
    regNo,
    paperName
){
     hideStudentLoginForAdmin();

    // -----------------------------------------------
    // SECURITY CHECK
    // -----------------------------------------------

    if(isAdminMode !== true){

        alert(
            "Admin verification required."
        );

        return;

    }


    if(
        !regNo ||
        !paperName
    ){

        alert(
            "Student details not available."
        );

        return;

    }


    // -----------------------------------------------
    // HIDE RESULT LIST
    // -----------------------------------------------

    document
        .getElementById("studentResultPage")
        ?.classList.add("hidden");


    // -----------------------------------------------
    // SHOW ANSWER PAGE
    // -----------------------------------------------

    const answerPage =
        document.getElementById(
            "adminAnswerDetailsPage"
        );


    if(!answerPage){

        alert(
            "Answer Review page not found in HTML."
        );

        return;

    }


    answerPage.classList.remove(
        "hidden"
    );


    // -----------------------------------------------
    // LOADING
    // -----------------------------------------------

    const container =
        document.getElementById(
            "adminAnswerDetailsContainer"
        );


    if(container){

        container.innerHTML = `

            <div class="answerLoading">

                <div class="loadingSpinner"></div>

                <p>
                    Loading Answer Details...
                </p>

            </div>

        `;

    }


    // -----------------------------------------------
    // LOAD DETAILS
    // -----------------------------------------------

    fetch(
        SCRIPT_URL +
        "?action=adminAnswerDetails" +
        "&adminToken=" +
    encodeURIComponent(adminToken) +
        "&regNo=" +
        encodeURIComponent(regNo) +
        "&paper=" +
        encodeURIComponent(paperName)
    )

    .then(function(res){

        return res.json();

    })

    .then(function(data){

        console.log(
            "ANSWER DETAILS:",
            data
        );


        if(
            data.status !== "SUCCESS"
        ){

            showAnswerDetailsError(
                data.status
            );

            return;

        }


        renderAdminAnswerDetails(
            data
        );

    })

    .catch(function(error){

        console.error(
            "Answer Details Error:",
            error
        );


        showAnswerDetailsError(
            "CONNECTION_ERROR"
        );

    });

}
//====================================================
// RENDER ADMIN ANSWER DETAILS
//====================================================

function renderAdminAnswerDetails(data){

    // -----------------------------------------------
    // STUDENT INFO
    // -----------------------------------------------

    setAnswerText(
        "answerStudentName",
        data.name ||
        data.studentName ||
        "--"
    );


    setAnswerText(
        "answerRegNo",
        data.regNo ||
        "--"
    );


    setAnswerText(
        "answerPaperName",
        data.paper ||
        data.paperName ||
        "--"
    );


    setAnswerText(
        "answerSubmitDate",
        data.date ||
        data.submitDate ||
        data.resultDate ||
        "--"
    );


    // -----------------------------------------------
    // DETAILS
    // -----------------------------------------------

    const details =
        Array.isArray(data.details)
        ? data.details
        : [];


    let correct = 0;
    let wrong = 0;
    let unattempted = 0;


    details.forEach(
        function(item){

            const status =
                String(
                    item.status ||
                    ""
                )
                .trim()
                .toUpperCase();


            if(status === "CORRECT"){

                correct++;

            }

            else if(status === "WRONG"){

                wrong++;

            }

            else{

                unattempted++;

            }

        }
    );


    // -----------------------------------------------
    // SUMMARY
    // -----------------------------------------------

    setAnswerText(
        "answerTotal",
        details.length
    );


    setAnswerText(
        "answerCorrect",
        correct
    );


    setAnswerText(
        "answerWrong",
        wrong
    );


    setAnswerText(
        "answerUnattempted",
        unattempted
    );


    // -----------------------------------------------
    // QUESTION CONTAINER
    // -----------------------------------------------

    const container =
        document.getElementById(
            "adminAnswerDetailsContainer"
        );


    if(!container){

        return;

    }


    if(details.length === 0){

        container.innerHTML = `

            <div class="answerEmpty">

                <div class="answerEmptyIcon">
                    📭
                </div>

                <h3>
                    No Answer Details Found
                </h3>

                <p>
                    Question-wise answer data
                    is not available.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    details.forEach(
        function(item,index){

            const qNo =
                item.qNo ||
                item.questionNo ||
                index + 1;


            const question =
                item.question ||
                "Question not available";


            const studentAnswer =
                item.studentAnswer ||
                item.answer ||
                "";


            const correctAnswer =
                item.correctAnswer ||
                "";


            const status =
                String(
                    item.status ||
                    "UNATTEMPTED"
                )
                .trim()
                .toUpperCase();


            let statusClass =
                "statusUnattempted";


            let statusText =
                "⚪ UNATTEMPTED";


            if(status === "CORRECT"){

                statusClass =
                    "statusCorrect";

                statusText =
                    "✓ CORRECT";

            }

            else if(status === "WRONG"){

                statusClass =
                    "statusWrong";

                statusText =
                    "✕ WRONG";

            }


            const studentDisplay =
                String(
                    studentAnswer
                ).trim() === ""
                ? "Not Attempted"
                : studentAnswer;


            html += `

                <div
                    class="adminAnswerCard"
                >


                    <!-- HEADER -->

                    <div
                        class="answerQuestionHeader"
                    >

                        <div
                            class="questionNumber"
                        >

                            <div
                                class="
                                    questionNumberBadge
                                "
                            >
                                ${escapeAdminHTML(
                                    qNo
                                )}
                            </div>

                            <span>
                                Question
                                ${escapeAdminHTML(
                                    qNo
                                )}
                            </span>

                        </div>


                        <div
                            class="
                                answerStatusBadge
                                ${statusClass}
                            "
                        >

                            ${statusText}

                        </div>

                    </div>


                    <!-- BODY -->

                    <div
                        class="answerQuestionBody"
                    >

                        <div
                            class="answerQuestionText"
                        >

                            ${escapeAdminHTML(
                                question
                            )}

                        </div>


                        <div
                            class="
                                answerCompareGrid
                            "
                        >


                            <!-- STUDENT ANSWER -->

                            <div
                                class="
                                    answerBox
                                    studentAnswerBox
                                "
                            >

                                <div
                                    class="answerBoxTitle"
                                >
                                    Student Answer
                                </div>

                                <div
                                    class="answerValue"
                                >

                                    ${escapeAdminHTML(
                                        studentDisplay
                                    )}

                                </div>

                            </div>


                            <!-- CORRECT ANSWER -->

                            <div
                                class="
                                    answerBox
                                    correctAnswerBox
                                "
                            >

                                <div
                                    class="answerBoxTitle"
                                >
                                    Correct Answer
                                </div>

                                <div
                                    class="answerValue"
                                >

                                    ${escapeAdminHTML(
                                        correctAnswer ||
                                        "Not Available"
                                    )}

                                </div>

                            </div>


                        </div>

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML = html;


    // Scroll to top

    window.scrollTo({

        top:0,

        behavior:"smooth"

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
isAdminMode = false;
    adminToken = "";

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
// LEADERBOARD
//====================================================

function openLeaderboard(){
      // -----------------------------------------------
    // CANCEL ANY OLD RESULT PAGE REQUEST
    // -----------------------------------------------

    resultNavigationToken++;

    //------------------------------------------------
    // HIDE RESULT LIST
    //------------------------------------------------

    document
        .getElementById("studentResultPage")
        ?.classList.add("hidden");


    //------------------------------------------------
    // SHOW LEADERBOARD
    //------------------------------------------------

    document
        .getElementById("leaderboardPage")
        ?.classList.remove("hidden");


    //------------------------------------------------
    // RESET
    //------------------------------------------------

    const select =
        document.getElementById(
            "leaderboardPaperSelect"
        );

    if(select){

        select.innerHTML = `

            <option value="">
                -- Select Paper --
            </option>

        `;

    }
//================================================
// RESET LEADERBOARD TABLE
//================================================

const table =
    document.getElementById(
        "leaderboardTableContainer"
    );

const empty =
    document.getElementById(
        "leaderboardEmpty"
    );

const loading =
    document.getElementById(
        "leaderboardLoading"
    );

const body =
    document.getElementById(
        "leaderboardTableBody"
    );


// Hide old leaderboard table
if(table){

    table.classList.add("hidden");

}


// Hide old empty message
if(empty){

    empty.classList.add("hidden");

}


// Hide loading
if(loading){

    loading.classList.add("hidden");

}


// Clear old rows
if(body){

    body.innerHTML = "";

}

    //------------------------------------------------
    // LOAD PAPERS
    //------------------------------------------------

    fetch(
        SCRIPT_URL +
        "?action=leaderboard"
    )

    .then(function(res){

        return res.json();

    })

    .then(function(data){

        console.log(
            "LEADERBOARD PAPERS:",
            data
        );


        if(
            data.status !==
            "SUCCESS"
        ){

            alert(
                "Unable to load Leaderboard."
            );

            return;

        }


        //------------------------------------------------
        // ADD PAPERS
        //------------------------------------------------

        if(
            select &&
            data.papers
        ){

            data.papers.forEach(
                function(paper){

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        paper;

                    option.textContent =
                        paper;

                    select.appendChild(
                        option
                    );

                }
            );

        }

    })

    .catch(function(error){

        console.log(
            "Leaderboard Error:",
            error
        );

        alert(
            "Unable to connect with server."
        );

    });

}
//====================================================
// PRINT MARKSHEET
//====================================================

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


    // Remove previous print modes
    document.body.classList.remove(
        "print-hall-ticket",
        "print-marksheet"
    );


    // Activate Marksheet print mode
    document.body.classList.add(
        "print-marksheet"
    );


    // Print after CSS is applied
    setTimeout(function(){

        window.print();

    }, 100);


    // Remove print mode after printing
    window.onafterprint = function(){

        document.body.classList.remove(
            "print-marksheet"
        );

    };

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
    .getElementById(
        "practicalVerificationPage"
    )
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
    // Clear Practical Verification Student ID
const practicalIdBox =
    document.getElementById(
        "practicalStudentIdInput"
    );

if(practicalIdBox){

    practicalIdBox.value = "";

}


// Clear Practical Verification Code
const practicalCodeBox =
    document.getElementById(
        "practicalVerificationCodeInput"
    );

if(practicalCodeBox){

    practicalCodeBox.value = "";

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
//====================================================
// LOAD PAPER WISE LEADERBOARD
//====================================================

function loadLeaderboard(){

    const select =
        document.getElementById(
            "leaderboardPaperSelect"
        );

    if(!select){
        return;
    }


    const paper =
        select.value.trim();


    //------------------------------------------------
    // RESET
    //------------------------------------------------

    const table =
        document.getElementById(
            "leaderboardTableContainer"
        );

    const empty =
        document.getElementById(
            "leaderboardEmpty"
        );

    const loading =
        document.getElementById(
            "leaderboardLoading"
        );

    const body =
        document.getElementById(
            "leaderboardTableBody"
        );


    if(table){
        table.classList.add("hidden");
    }

    if(empty){
        empty.classList.add("hidden");
    }

    if(body){
        body.innerHTML = "";
    }


    //------------------------------------------------
    // PAPER NOT SELECTED
    //------------------------------------------------

    if(paper === ""){

        return;

    }


    //------------------------------------------------
    // SHOW LOADING
    //------------------------------------------------

    if(loading){

        loading.classList.remove(
            "hidden"
        );

    }


    //------------------------------------------------
    // FETCH
    //------------------------------------------------

    fetch(

        SCRIPT_URL +
        "?action=leaderboard" +
        "&paper=" +
        encodeURIComponent(
            paper
        )

    )

    .then(function(res){

        return res.json();

    })

    .then(function(data){

        console.log(
            "LEADERBOARD:",
            data
        );


        //------------------------------------------------
        // HIDE LOADING
        //------------------------------------------------

        if(loading){

            loading.classList.add(
                "hidden"
            );

        }


        //------------------------------------------------
        // ERROR
        //------------------------------------------------

        if(
            data.status !==
            "SUCCESS"
        ){

            alert(
                "Unable to load Leaderboard."
            );

            return;

        }


        //------------------------------------------------
        // NO RESULTS
        //------------------------------------------------

        if(
            !data.results ||
            data.results.length === 0
        ){

            if(empty){

                empty.classList.remove(
                    "hidden"
                );

            }

            return;

        }


        //------------------------------------------------
        // CREATE ROWS
        //------------------------------------------------

        data.results.forEach(
            function(r){

                const tr =
                    document.createElement(
                        "tr"
                    );


                //------------------------------------------------
                // RANK DESIGN
                //------------------------------------------------

                let rankHTML =
                    r.rank;


                if(r.rank === 1){

                    rankHTML =
                        "🥇 1";

                }
                else if(r.rank === 2){

                    rankHTML =
                        "🥈 2";

                }
                else if(r.rank === 3){

                    rankHTML =
                        "🥉 3";

                }


                //------------------------------------------------
                // PERCENTAGE
                //------------------------------------------------

                let percentage =
                    parseFloat(
                        r.percentage
                    );

                if(
                    !isNaN(percentage)
                ){

                    percentage =
                        percentage.toFixed(2) +
                        "%";

                }
                else{

                    percentage =
                        r.percentage ||
                        "0%";

                }


                //------------------------------------------------
                // ROW
                //------------------------------------------------

                tr.innerHTML = `

                    <td class="rank-cell">
                        ${rankHTML}
                    </td>

                    <td class="leader-name">
                        ${escapeLeaderboardHTML(
                            r.studentName
                        )}
                    </td>

                    <td>
                        ${escapeLeaderboardHTML(
                            r.course
                        )}
                    </td>

                    <td class="leader-marks">
                        ${r.totalMarks}
                    </td>

                    <td class="leader-percentage">
                        ${percentage}
                    </td>

                    <td>
                        ${escapeLeaderboardHTML(
                            r.grade
                        )}
                    </td>

                `;


                //------------------------------------------------
                // TOP 3 CLASS
                //------------------------------------------------

                if(r.rank === 1){

                    tr.classList.add(
                        "leaderboard-first"
                    );

                }
                else if(r.rank === 2){

                    tr.classList.add(
                        "leaderboard-second"
                    );

                }
                else if(r.rank === 3){

                    tr.classList.add(
                        "leaderboard-third"
                    );

                }


                body.appendChild(
                    tr
                );

            }
        );


        //------------------------------------------------
        // SHOW TABLE
        //------------------------------------------------

        if(table){

            table.classList.remove(
                "hidden"
            );

        }

    })

    .catch(function(error){

        console.log(
            "Leaderboard Error:",
            error
        );


        if(loading){

            loading.classList.add(
                "hidden"
            );

        }


        if(empty){

            empty.classList.remove(
                "hidden"
            );

            empty.innerHTML =
                "Unable to connect with server.";

        }

    });

}
//====================================================
// SAFE LEADERBOARD HTML
//====================================================

function escapeLeaderboardHTML(value){

    if(
        value === null ||
        value === undefined
    ){

        return "";

    }

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
//====================================================
//                    ANALYTICS MODULE
//====================================================


//====================================================
// SHOW ANALYTICS BUTTON
//====================================================

function showAnalyticsButton(){

    const btn =
        document.getElementById("analyticsAccess");

    if(btn){
        btn.style.display = "block";
    }

}


//====================================================
// OPEN ANALYTICS PASSWORD PAGE
//====================================================

function openAnalyticsPassword(){

    // Hide Result List Box
    const resultBox =
        document.querySelector(
            "#studentResultPage .result-list-box"
        );

    if(resultBox){
        resultBox.classList.add("hidden");
    }


    // Show Password Page
    const passwordPage =
        document.getElementById(
            "analyticsPasswordPage"
        );

    if(passwordPage){
        passwordPage.classList.remove("hidden");
    }


    // Clear Password
    const password =
        document.getElementById(
            "analyticsPassword"
        );

    if(password){

        password.value = "";

        setTimeout(function(){

            password.focus();

        },100);

    }

}


//====================================================
// VERIFY ANALYTICS PASSWORD
//====================================================

//====================================================
// VERIFY ANALYTICS PASSWORD
//====================================================

//====================================================
// VERIFY ANALYTICS PASSWORD
// FINAL VERSION
//====================================================

//====================================================
// VERIFY ANALYTICS PASSWORD
// PASSWORD SOURCE : GOOGLE SHEET SETTINGS!B15
//====================================================

function verifyAnalyticsPassword(){

    const passwordBox =
        document.getElementById(
            "analyticsPassword"
        );


    if(!passwordBox){

        console.warn(
            "Analytics password box not found."
        );

        return;

    }


    //================================================
    // GET ENTERED PASSWORD
    //================================================

    const password =
        passwordBox.value.trim();


    if(password === ""){

        alert(
            "Please Enter Admin Password."
        );

        passwordBox.focus();

        return;

    }


    //================================================
    // VERIFY WITH APPS SCRIPT
    // Settings!B15 is checked SERVER-SIDE
    //================================================

    fetch(
        SCRIPT_URL +
        "?action=verifyAdmin" +
        "&code=" +
        encodeURIComponent(password)
    )

    .then(function(res){

        return res.json();

    })

    .then(function(data){

        console.log(
            "ANALYTICS ADMIN VERIFICATION:",
            data
        );


        //================================================
        // SUCCESS
        //================================================

        if(
            data.status === "SUCCESS"
        ){

            //============================================
            // ADMIN MODE ON
            //============================================

            isAdminMode = true;


            //============================================
            // SAVE ADMIN TOKEN
            //============================================

            adminToken =
                data.token || "";


            if(!adminToken){

                alert(
                    "Admin token was not generated."
                );

                return;

            }


            console.log(
                "ANALYTICS ADMIN TOKEN CREATED:",
                adminToken
            );


            //============================================
            // CLEAR PASSWORD
            //============================================

            passwordBox.value = "";


            //============================================
            // HIDE PASSWORD PAGE
            //============================================

            document
                .getElementById(
                    "analyticsPasswordPage"
                )
                ?.classList.add("hidden");


            //============================================
            // HIDE RESULT LIST
            //============================================

            document
                .getElementById(
                    "studentResultPage"
                )
                ?.classList.add("hidden");


            //============================================
            // SHOW ANALYTICS
            //============================================

            document
                .getElementById(
                    "analyticsPage"
                )
                ?.classList.remove("hidden");


            //============================================
            // LOAD ANALYTICS
            //============================================

            loadAnalytics();

            return;

        }


        //================================================
        // INVALID PASSWORD
        //================================================

        if(
            data.status === "INVALID"
        ){

            alert(
                "Invalid Admin Password."
            );

            passwordBox.value = "";

            passwordBox.focus();

            return;

        }


        //================================================
        // CONFIGURATION ERROR
        //================================================

        if(
            data.status === "CONFIG_ERROR"
        ){

            alert(
                "Admin password is not configured in Settings!B15."
            );

            passwordBox.value = "";

            return;

        }


        //================================================
        // OTHER ERROR
        //================================================

        alert(
            data.message ||
            "Admin verification failed."
        );

    })

    .catch(function(error){

        console.error(
            "Analytics Admin Verification Error:",
            error
        );

        alert(
            "Unable to connect with server."
        );

    });

}

//====================================================
// LOAD ANALYTICS
//====================================================

//====================================================
// LOAD ANALYTICS
//====================================================

//====================================================
// LOAD EXAM ANALYTICS
//====================================================
// SOURCE : GOOGLE APPS SCRIPT
// ACTION : examAnalytics
//====================================================

function loadAnalytics(){

    //================================================
    // ADMIN TOKEN CHECK
    //================================================

    if(!adminToken){

        console.warn(
            "Admin token missing."
        );

        alert(
            "Admin verification required."
        );

        return;
    }


    //================================================
    // GET SELECTED PAPER
    //================================================

    const paperSelect =
        document.getElementById(
            "analyticsPaper"
        );


    const selectedPaper =
        paperSelect
            ? paperSelect.value.trim()
            : "";


    //================================================
    // SHOW LOADING
    //================================================

    setAnalyticsLoading();


    //================================================
    // BUILD API URL
    //================================================

    let url =
        SCRIPT_URL +
        "?action=examAnalytics" +
        "&adminToken=" +
        encodeURIComponent(
            adminToken
        );


    //================================================
    // PAPER FILTER
    //================================================

    if(selectedPaper !== ""){

        url +=
            "&paper=" +
            encodeURIComponent(
                selectedPaper
            );

    }


    console.log(
        "Analytics API:",
        url
    );


    //================================================
    // FETCH
    //================================================

    fetch(url)

    .then(function(response){

        if(!response.ok){

            throw new Error(
                "Server Error: " +
                response.status
            );

        }

        return response.json();

    })

    .then(function(data){

        console.log(
            "EXAM ANALYTICS RESPONSE:",
            data
        );


        //================================================
        // UNAUTHORIZED
        //================================================

        if(
            data.status ===
            "UNAUTHORIZED"
        ){

            alert(
                "Admin verification required."
            );

            isAdminMode = false;

            adminToken = "";

            return;
        }


        //================================================
        // API ERROR
        //================================================

        if(
            data.status !==
            "SUCCESS"
        ){

            showAnalyticsError(
                data.message ||
                "Unable to load examination analytics."
            );

            return;
        }


        //================================================
        // PAPER DROPDOWN
        //================================================

        if(
            Array.isArray(
                data.papers
            )
        ){

            const paperData =
                data.papers.map(
                    function(paper){

                        return {
                            paper: paper
                        };

                    }
                );


            populateAnalyticsPapers(
                paperData
            );

        }


        //================================================
        // SUMMARY
        //================================================

        const summary =
            data.summary || {};


        updateAnalyticsCards(

            Number(
                summary.totalStudents
            ) || 0,

            Number(
                summary.pass
            ) || 0,

            Number(
                summary.fail
            ) || 0,

            parseFloat(
                summary.passPercentage
            ) || 0,

            parseFloat(
                summary.averageMarks
            ) || 0,

            Number(
                summary.highestMarks
            ) || 0,

            Number(
                summary.lowestMarks
            ) || 0

        );


        //================================================
        // TOP PERFORMERS
        //================================================

        const topPerformers =
            Array.isArray(
                data.topPerformers
            )
            ?
            data.topPerformers
            :
            [];


        const topData =
            topPerformers.map(
                function(r){

                    return {

                        regNo:
                            r.regNo || "",

                        studentName:
                            r.studentName || "",

                        paper:
                            r.paper || "",

                        marks:
                            Number(
                                r.marks
                            ) || 0,

                        percentage:
                            parseFloat(
                                r.percentage
                            ) || 0,

                        result:
                            r.result || ""

                    };

                }
            );


        renderTopPerformers(
            topData
        );


        //================================================
        // STUDENTS REQUIRING ATTENTION
        //================================================

        const attention =
            Array.isArray(
                data.attention
            )
            ?
            data.attention
            :
            [];


        const attentionData =
            attention.map(
                function(r){

                    return {

                        regNo:
                            r.regNo || "",

                        studentName:
                            r.studentName || "",

                        paper:
                            r.paper || "",

                        marks:
                            Number(
                                r.marks
                            ) || 0,

                        percentage:
                            parseFloat(
                                r.percentage
                            ) || 0,

                        result:
                            r.result || ""

                    };

                }
            );


       renderWeakStudents(
    attentionData
);


        //================================================
        // PAPER COMPARISON
        //================================================

        renderServerPaperComparison(
            Array.isArray(
                data.paperComparison
            )
            ?
            data.paperComparison
            :
            []
        );


        //================================================
        // PERFORMANCE DISTRIBUTION
        //================================================

        renderServerPerformanceDistribution(
            data.distribution || {}
        );
            renderAnalyticsCharts(
                data
            );


        //================================================
        // SELECTED PAPER INFO
        //================================================

        console.log(
            "Selected Paper:",
            data.selectedPaper || "ALL"
        );


        console.log(
            "Analytics Loaded Successfully"
        );

    })

    .catch(function(error){

        console.error(
            "Analytics Error:",
            error
        );

        showAnalyticsError(
            "Unable to connect with server."
        );

    });

}

//====================================================
// POPULATE PAPER DROPDOWN
//====================================================

function populateAnalyticsPapers(
    results
){

    const select =
        document.getElementById(
            "analyticsPaper"
        );


    if(!select){
        return;
    }


    //================================================
    // CURRENT SELECTED VALUE
    //================================================

    const currentValue =
        select.value;


    //================================================
    // GET UNIQUE PAPERS
    //================================================

    const paperSet =
        new Set();


    results.forEach(
        function(r){

            const paper =
                String(
                    r.paperName ||
                    r.paper ||
                    ""
                )
                .trim();


            if(paper !== ""){

                paperSet.add(
                    paper
                );

            }

        }
    );


    //================================================
    // SORT PAPERS
    //================================================

    const papers =
        Array.from(
            paperSet
        ).sort(
            function(a,b){

                return a.localeCompare(
                    b
                );

            }
        );


    //================================================
    // CLEAR OPTIONS
    //================================================

    select.innerHTML =
        `
        <option value="">
            All Papers
        </option>
        `;


    //================================================
    // ADD PAPERS
    //================================================

    papers.forEach(
        function(paper){

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                paper;


            option.textContent =
                paper;


            select.appendChild(
                option
            );

        }
    );


    //================================================
    // RESTORE SELECTION
    //================================================

    if(
        currentValue &&
        papers.includes(
            currentValue
        )
    ){

        select.value =
            currentValue;

    }

}


//====================================================
// CALCULATE ANALYTICS
//====================================================

function calculateAnalytics(
    results,
    allResults
){

    //================================================
    // EMPTY RESULT
    //================================================

    if(
        !Array.isArray(results) ||
        results.length === 0
    ){

        updateAnalyticsCards(
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );


        clearAnalyticsTables();


        return;

    }


    //================================================
    // PREPARE DATA
    //================================================

    const prepared =
        results.map(
            function(r){

                return prepareAnalyticsRecord(
                    r
                );

            }
        );


    //================================================
    // TOTAL STUDENTS
    //================================================

    const total =
        prepared.length;


    //================================================
    // PASS / FAIL
    //================================================

    let pass = 0;

    let fail = 0;


    prepared.forEach(
        function(r){

            if(
                r.result
                    .toLowerCase()
                    .includes("pass")
            ){

                pass++;

            }
            else if(
                r.result
                    .toLowerCase()
                    .includes("fail")
            ){

                fail++;

            }

        }
    );


    //================================================
    // PASS PERCENTAGE
    //================================================

    const passPercent =
        total > 0
        ? (
            pass /
            total *
            100
        )
        : 0;


    //================================================
    // MARKS
    //================================================

    const marks =
        prepared.map(
            function(r){

                return r.marks;

            }
        );


    const totalMarks =
        marks.reduce(
            function(sum,value){

                return sum + value;

            },
            0
        );


    const average =
        total > 0
        ? totalMarks / total
        : 0;


    const highest =
        marks.length > 0
        ? Math.max(...marks)
        : 0;


    const lowest =
        marks.length > 0
        ? Math.min(...marks)
        : 0;


    //================================================
    // UPDATE KPI CARDS
    //================================================

    updateAnalyticsCards(

        total,

        pass,

        fail,

        passPercent,

        average,

        highest,

        lowest

    );


    //================================================
    // TOP PERFORMERS
    //================================================

    renderTopPerformers(
        prepared
    );


    //================================================
    // WEAK STUDENTS
    //================================================

    renderWeakStudents(
        prepared
    );


    //================================================
    // PAPER COMPARISON
    //
    // Use ALL theory results so that
    // comparison remains paper-wise
    //================================================

    renderPaperComparison(
        allResults
    );


    //================================================
    // PERFORMANCE DISTRIBUTION
    //================================================

    renderPerformanceDistribution(
        prepared
    );

}


//====================================================
// PREPARE SINGLE RESULT
//====================================================

function prepareAnalyticsRecord(
    r
){

    const regNo =
        String(
            r.regNo ||
            r.registrationNo ||
            r.reg ||
            ""
        ).trim();


    const studentName =
        String(
            r.studentName ||
            r.name ||
            ""
        ).trim();


    const paper =
        String(
            r.paperName ||
            r.paper ||
            ""
        ).trim();


    //================================================
    // MARKS
    //================================================

    let marks =
        parseFloat(
            r.totalMarks ??
            r.total ??
            r.obtainedMarks ??
            r.correct ??
            0
        );


    if(
        isNaN(marks)
    ){

        marks = 0;

    }


    //================================================
    // PERCENTAGE
    //================================================

    let percentage =
        parseFloat(
            r.percentage ??
            r.percent ??
            0
        );


    if(
        isNaN(percentage)
    ){

        percentage = 0;

    }


    //================================================
    // RESULT
    //================================================

    const result =
        String(
            r.result ||
            r.grade ||
            ""
        ).trim();


    return {

        original: r,

        regNo:
            regNo,

        studentName:
            studentName,

        paper:
            paper,

        marks:
            marks,

        percentage:
            percentage,

        result:
            result

    };

}


//====================================================
// UPDATE KPI CARDS
//====================================================

function updateAnalyticsCards(

    total,
    pass,
    fail,
    passPercent,
    average,
    highest,
    lowest

){

    const totalBox =
        document.getElementById(
            "analyticsTotalStudents"
        );


    const passBox =
        document.getElementById(
            "analyticsPass"
        );


    const failBox =
        document.getElementById(
            "analyticsFail"
        );


    const passPercentBox =
        document.getElementById(
            "analyticsPassPercent"
        );


    const averageBox =
        document.getElementById(
            "analyticsAverage"
        );


    const highestBox =
        document.getElementById(
            "analyticsHighest"
        );


    const lowestBox =
        document.getElementById(
            "analyticsLowest"
        );


    if(totalBox){

        totalBox.textContent =
            total;

    }


    if(passBox){

        passBox.textContent =
            pass;

    }


    if(failBox){

        failBox.textContent =
            fail;

    }


    if(passPercentBox){

        passPercentBox.textContent =
            passPercent.toFixed(1) +
            "%";

    }


    if(averageBox){

        averageBox.textContent =
            average.toFixed(1);

    }


    if(highestBox){

        highestBox.textContent =
            highest;

    }


    if(lowestBox){

        lowestBox.textContent =
            lowest;

    }

}


//====================================================
// TOP PERFORMERS
//====================================================

function renderTopPerformers(
    results
){

    const body =
        document.getElementById(
            "analyticsTopPerformers"
        );


    if(!body){
        return;
    }


    body.innerHTML = "";


    const sorted =
        [...results]
        .sort(
            function(a,b){

                return (
                    b.percentage -
                    a.percentage
                );

            }
        )
        .slice(0,10);


    if(sorted.length === 0){

        body.innerHTML =
            `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center;padding:25px;"
                >
                    No data available
                </td>
            </tr>
            `;

        return;

    }


    sorted.forEach(
        function(r,index){

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    <strong>
                        ${index + 1}
                    </strong>
                </td>

                <td>
                    ${escapeAnalyticsHTML(
                        r.regNo
                    )}
                </td>

                <td>
                    <strong>
                        ${escapeAnalyticsHTML(
                            r.studentName
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeAnalyticsHTML(
                        r.paper
                    )}
                </td>

                <td>
                    ${escapeAnalyticsHTML(
                        r.marks
                    )}
                </td>

                <td>
                    ${r.percentage.toFixed(1)}%
                </td>

                <td>
                    <strong>
                        ${escapeAnalyticsHTML(
                            r.result
                        )}
                    </strong>
                </td>

            `;


            body.appendChild(
                tr
            );

        }
    );

}


//====================================================
// WEAK STUDENTS
//====================================================

function renderWeakStudents(
    results
){

    const body =
        document.getElementById(
            "analyticsWeakStudents"
        );


    if(!body){
        return;
    }


    body.innerHTML = "";


    const sorted =
        [...results]
        .sort(
            function(a,b){

                return (
                    a.percentage -
                    b.percentage
                );

            }
        )
        .filter(
            function(r){

                return (
                    r.result
                        .toLowerCase()
                        .includes("fail") ||
                    r.percentage < 40
                );

            }
        )
        .slice(0,10);


    if(sorted.length === 0){

        body.innerHTML =
            `
            <tr>
                <td
                    colspan="6"
                    style="text-align:center;padding:25px;"
                >
                    No students requiring attention
                </td>
            </tr>
            `;

        return;

    }


    sorted.forEach(
        function(r){

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${escapeAnalyticsHTML(
                        r.regNo
                    )}
                </td>

                <td>
                    <strong>
                        ${escapeAnalyticsHTML(
                            r.studentName
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeAnalyticsHTML(
                        r.paper
                    )}
                </td>

                <td>
                    ${escapeAnalyticsHTML(
                        r.marks
                    )}
                </td>

                <td>
                    ${r.percentage.toFixed(1)}%
                </td>

                <td>
                    <strong>
                        ${escapeAnalyticsHTML(
                            r.result
                        )}
                    </strong>
                </td>

            `;


            body.appendChild(
                tr
            );

        }
    );

}


//====================================================
// PAPER COMPARISON
//====================================================

function renderPaperComparison(
    results
){

    const body =
        document.getElementById(
            "analyticsPaperComparison"
        );


    if(!body){
        return;
    }


    body.innerHTML = "";


    //================================================
    // GROUP PAPERS
    //================================================

    const groups = {};


    results.forEach(
        function(r){

            const record =
                prepareAnalyticsRecord(
                    r
                );


            if(
                !record.paper
            ){
                return;
            }


            const key =
                record.paper
                    .toLowerCase();


            if(
                !groups[key]
            ){

                groups[key] = {

                    paper:
                        record.paper,

                    students: 0,

                    totalPercent: 0,

                    pass: 0,

                    highest: 0

                };

            }


            groups[key].students++;

            groups[key].totalPercent +=
                record.percentage;


            if(
                record.result
                    .toLowerCase()
                    .includes("pass")
            ){

                groups[key].pass++;

            }


            if(
                record.marks >
                groups[key].highest
            ){

                groups[key].highest =
                    record.marks;

            }

        }
    );


    const paperGroups =
        Object.values(
            groups
        );


    if(
        paperGroups.length === 0
    ){

        body.innerHTML =
            `
            <tr>
                <td
                    colspan="5"
                    style="text-align:center;padding:25px;"
                >
                    No paper data available
                </td>
            </tr>
            `;

        return;

    }


    paperGroups
        .sort(
            function(a,b){

                return (
                    b.totalPercent /
                    b.students
                ) -
                (
                    a.totalPercent /
                    a.students
                );

            }
        )
        .forEach(
            function(group){

                const averagePercent =
                    group.students > 0
                    ? group.totalPercent /
                      group.students
                    : 0;


                const passPercent =
                    group.students > 0
                    ? group.pass /
                      group.students *
                      100
                    : 0;


                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        <strong>
                            ${escapeAnalyticsHTML(
                                group.paper
                            )}
                        </strong>
                    </td>

                    <td>
                        ${group.students}
                    </td>

                    <td>
                        ${averagePercent.toFixed(1)}%
                    </td>

                    <td>
                        ${passPercent.toFixed(1)}%
                    </td>

                    <td>
                        ${group.highest}
                    </td>

                `;


                body.appendChild(
                    tr
                );

            }
        );

}


//====================================================
// PERFORMANCE DISTRIBUTION
//====================================================

function renderPerformanceDistribution(
    results
){

    const box =
        document.getElementById(
            "analyticsDistribution"
        );


    if(!box){
        return;
    }


    box.innerHTML = "";


    const ranges = [

        {
            label:
                "0–39%",
            min:0,
            max:39,
            count:0
        },

        {
            label:
                "40–49%",
            min:40,
            max:49,
            count:0
        },

        {
            label:
                "50–59%",
            min:50,
            max:59,
            count:0
        },

        {
            label:
                "60–69%",
            min:60,
            max:69,
            count:0
        },

        {
            label:
                "70–79%",
            min:70,
            max:79,
            count:0
        },

        {
            label:
                "80–89%",
            min:80,
            max:89,
            count:0
        },

        {
            label:
                "90–100%",
            min:90,
            max:100,
            count:0
        }

    ];


    results.forEach(
        function(r){

            const percentage =
                Number(
                    r.percentage
                );


            ranges.forEach(
                function(range){

                    if(
                        percentage >=
                        range.min &&
                        percentage <=
                        range.max
                    ){

                        range.count++;

                    }

                }
            );

        }
    );


    const total =
        results.length;


    ranges.forEach(
        function(range){

            const percent =
                total > 0
                ? (
                    range.count /
                    total *
                    100
                )
                : 0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "analytics-distribution-item";


            item.innerHTML = `

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:6px;
                    "
                >

                    <strong>
                        ${range.label}
                    </strong>

                    <span>
                        ${range.count}
                        Students
                    </span>

                </div>

                <div
                    style="
                        width:100%;
                        height:10px;
                        background:#e2e8f0;
                        border-radius:20px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            width:${percent}%;
                            height:100%;
                            background:linear-gradient(
                                90deg,
                                #2563eb,
                                #0ea5e9
                            );
                            border-radius:20px;
                            transition:width .4s ease;
                        "
                    ></div>

                </div>

            `;


            box.appendChild(
                item
            );

        }
    );

}


//====================================================
// CLEAR ANALYTICS TABLES
//====================================================

function clearAnalyticsTables(){

    const top =
        document.getElementById(
            "analyticsTopPerformers"
        );


    const weak =
        document.getElementById(
            "analyticsWeakStudents"
        );


    const comparison =
        document.getElementById(
            "analyticsPaperComparison"
        );


    const distribution =
        document.getElementById(
            "analyticsDistribution"
        );


    if(top){

        top.innerHTML =
            `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center;padding:25px;"
                >
                    No data available
                </td>
            </tr>
            `;

    }


    if(weak){

        weak.innerHTML =
            `
            <tr>
                <td
                    colspan="6"
                    style="text-align:center;padding:25px;"
                >
                    No data available
                </td>
            </tr>
            `;

    }


    if(comparison){

        comparison.innerHTML =
            `
            <tr>
                <td
                    colspan="5"
                    style="text-align:center;padding:25px;"
                >
                    No data available
                </td>
            </tr>
            `;

    }


    if(distribution){

        distribution.innerHTML = "";

    }

}


//====================================================
// ANALYTICS LOADING
//====================================================

function setAnalyticsLoading(){

    const top =
        document.getElementById(
            "analyticsTopPerformers"
        );


    const weak =
        document.getElementById(
            "analyticsWeakStudents"
        );


    const comparison =
        document.getElementById(
            "analyticsPaperComparison"
        );


    if(top){

        top.innerHTML =
            `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    Loading...
                </td>
            </tr>
            `;

    }


    if(weak){

        weak.innerHTML =
            `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    Loading...
                </td>
            </tr>
            `;

    }


    if(comparison){

        comparison.innerHTML =
            `
            <tr>
                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    Loading...
                </td>
            </tr>
            `;

    }

}


//====================================================
// ANALYTICS ERROR
//====================================================

function showAnalyticsError(
    message
){

    const top =
        document.getElementById(
            "analyticsTopPerformers"
        );


    if(top){

        top.innerHTML =
            `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#dc2626;
                        font-weight:700;
                    "
                >
                    ${escapeAnalyticsHTML(
                        message
                    )}
                </td>
            </tr>
            `;

    }


    clearAnalyticsTables();

}


//====================================================
// BACK TO ADMIN DASHBOARD
//====================================================

//====================================================
// BACK TO ADMIN DASHBOARD
//====================================================

function backToAdminDashboard(){

    //================================================
    // HIDE ANALYTICS
    //================================================

    document
        .getElementById(
            "analyticsPage"
        )
        ?.classList.add("hidden");


    //================================================
    // HIDE ANALYTICS PASSWORD PAGE
    //================================================

    document
        .getElementById(
            "analyticsPasswordPage"
        )
        ?.classList.add("hidden");


    //================================================
    // SHOW STUDENT RESULT PAGE
    //================================================

    document
        .getElementById(
            "studentResultPage"
        )
        ?.classList.remove("hidden");


    //================================================
    // SHOW RESULT LIST BOX
    //================================================

    const resultBox =
        document.querySelector(
            "#studentResultPage .result-list-box"
        );

    if(resultBox){

        resultBox.classList.remove(
            "hidden"
        );

    }


    //================================================
    // HIDE ANALYTICS BUTTON
    // IMPORTANT
    //================================================

    const analyticsBtn =
        document.getElementById(
            "analyticsAccess"
        );

    if(analyticsBtn){

        analyticsBtn.style.display =
            "none";

    }


    //================================================
    // CLEAR ANALYTICS DATA
    //================================================

    clearAnalyticsTables();


    //================================================
    // RESET PAPER FILTER
    //================================================

    const paperSelect =
        document.getElementById(
            "analyticsPaper"
        );

    if(paperSelect){

        paperSelect.value = "";

    }

}


//====================================================
// CLOSE ANALYTICS PASSWORD
//====================================================

function closeAnalyticsPassword(){

    //================================================
    // HIDE PASSWORD PAGE
    //================================================

    document
        .getElementById(
            "analyticsPasswordPage"
        )
        ?.classList.add("hidden");


    //================================================
    // SHOW RESULT PAGE
    //================================================

    document
        .getElementById(
            "studentResultPage"
        )
        ?.classList.remove("hidden");


    //================================================
    // SHOW RESULT BOX
    //================================================

    const resultBox =
        document.querySelector(
            "#studentResultPage .result-list-box"
        );


    if(resultBox){

        resultBox.classList.remove(
            "hidden"
        );

    }


    //================================================
    // SHOW ANALYTICS BUTTON
    //================================================

    const analyticsBtn =
        document.getElementById(
            "analyticsAccess"
        );


    if(analyticsBtn){

        analyticsBtn.style.display =
            "block";

    }

}


//====================================================
// SAFE HTML
//====================================================

function escapeAnalyticsHTML(
    value
){

    if(
        value === null ||
        value === undefined
    ){

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
//====================================================
// SERVER PAPER COMPARISON
//====================================================

function renderServerPaperComparison(
    results
){

    const body =
        document.getElementById(
            "analyticsPaperComparison"
        );

    if(!body){
        return;
    }


    body.innerHTML = "";


    //================================================
    // EMPTY
    //================================================

    if(
        !Array.isArray(results) ||
        results.length === 0
    ){

        body.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:25px;
                    "
                >
                    No paper data available
                </td>
            </tr>
        `;

        return;
    }


    //================================================
    // SORT
    //================================================

    results
        .slice()
        .sort(
            function(a,b){

                return (
                    parseFloat(
                        b.averagePercentage
                    ) || 0
                )
                -
                (
                    parseFloat(
                        a.averagePercentage
                    ) || 0
                );

            }
        )
        .forEach(
            function(r){

                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        <strong>
                            ${
                                escapeAnalyticsHTML(
                                    r.paper || ""
                                )
                            }
                        </strong>
                    </td>

                    <td>
                        ${
                            Number(
                                r.students
                            ) || 0
                        }
                    </td>

                    <td>
                        ${
                            (
                                parseFloat(
                                    r.averagePercentage
                                ) || 0
                            ).toFixed(1)
                        }%
                    </td>

                    <td>
                        ${
                            (
                                parseFloat(
                                    r.passPercentage
                                ) || 0
                            ).toFixed(1)
                        }%
                    </td>

                    <td>
                        ${
                            Number(
                                r.highest
                            ) || 0
                        }
                    </td>

                `;


                body.appendChild(
                    tr
                );

            }
        );

}
//====================================================
// SERVER PAPER COMPARISON
//====================================================

function renderServerPaperComparison(
    results
){

    const body =
        document.getElementById(
            "analyticsPaperComparison"
        );

    if(!body){
        return;
    }


    body.innerHTML = "";


    //================================================
    // EMPTY
    //================================================

    if(
        !Array.isArray(results) ||
        results.length === 0
    ){

        body.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:25px;
                    "
                >
                    No paper data available
                </td>
            </tr>
        `;

        return;
    }


    //================================================
    // SORT
    //================================================

    results
        .slice()
        .sort(
            function(a,b){

                return (
                    parseFloat(
                        b.averagePercentage
                    ) || 0
                )
                -
                (
                    parseFloat(
                        a.averagePercentage
                    ) || 0
                );

            }
        )
        .forEach(
            function(r){

                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        <strong>
                            ${
                                escapeAnalyticsHTML(
                                    r.paper || ""
                                )
                            }
                        </strong>
                    </td>

                    <td>
                        ${
                            Number(
                                r.students
                            ) || 0
                        }
                    </td>

                    <td>
                        ${
                            (
                                parseFloat(
                                    r.averagePercentage
                                ) || 0
                            ).toFixed(1)
                        }%
                    </td>

                    <td>
                        ${
                            (
                                parseFloat(
                                    r.passPercentage
                                ) || 0
                            ).toFixed(1)
                        }%
                    </td>

                    <td>
                        ${
                            Number(
                                r.highest
                            ) || 0
                        }
                    </td>

                `;


                body.appendChild(
                    tr
                );

            }
        );

}
//====================================================
// SERVER PERFORMANCE DISTRIBUTION
//====================================================

function renderServerPerformanceDistribution(
    distribution
){

    const box =
        document.getElementById(
            "analyticsDistribution"
        );

    if(!box){
        return;
    }


    box.innerHTML = "";


    const ranges = [

        {
            label:"0–39%",
            key:"below40"
        },

        {
            label:"40–49%",
            key:"range40to49"
        },

        {
            label:"50–59%",
            key:"range50to59"
        },

        {
            label:"60–69%",
            key:"range60to69"
        },

        {
            label:"70–79%",
            key:"range70to79"
        },

        {
            label:"80–89%",
            key:"range80to89"
        },

        {
            label:"90–100%",
            key:"range90to100"
        }

    ];


    //================================================
    // TOTAL
    //================================================

    let total = 0;


    ranges.forEach(
        function(range){

            total +=
                Number(
                    distribution[
                        range.key
                    ]
                ) || 0;

        }
    );


    //================================================
    // DISPLAY
    //================================================

    ranges.forEach(
        function(range){

            const count =
                Number(
                    distribution[
                        range.key
                    ]
                ) || 0;


            const percent =
                total > 0
                ?
                (
                    count /
                    total *
                    100
                )
                :
                0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "analytics-distribution-item";


            item.innerHTML = `

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:6px;
                    "
                >

                    <strong>
                        ${range.label}
                    </strong>

                    <span>
                        ${count} Students
                    </span>

                </div>


                <div
                    style="
                        width:100%;
                        height:10px;
                        background:#e2e8f0;
                        border-radius:20px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            width:${percent}%;
                            height:100%;
                            background:linear-gradient(
                                90deg,
                                #2563eb,
                                #0ea5e9
                            );
                            border-radius:20px;
                            transition:width .4s ease;
                        "
                    ></div>

                </div>

            `;


            box.appendChild(
                item
            );

        }
    );

}
//====================================================
// PASS / FAIL CHART
//====================================================

function renderAnalyticsPassFailChart(
    pass,
    fail,
    total
){

    const chart =
        document.getElementById(
            "analyticsPassFailChart"
        );


    const passValue =
        document.getElementById(
            "chartPassValue"
        );


    const failValue =
        document.getElementById(
            "chartFailValue"
        );


    if(!chart){
        return;
    }


    pass =
        Number(pass) || 0;

    fail =
        Number(fail) || 0;

    total =
        Number(total) || 0;


    const passPercent =
        total > 0
        ?
        (pass / total) * 100
        :
        0;


    const passDegrees =
        passPercent * 3.6;


    chart.style.background =
        `
        conic-gradient(
            #16a34a 0deg,
            #16a34a ${passDegrees}deg,
            #dc2626 ${passDegrees}deg,
            #dc2626 360deg
        )
        `;


    chart.innerHTML = `

        <div class="pass-fail-center">

            <strong>
                ${passPercent.toFixed(1)}%
            </strong>

            <span>
                Pass Rate
            </span>

        </div>

    `;


    if(passValue){

        passValue.textContent =
            pass;

    }


    if(failValue){

        failValue.textContent =
            fail;

    }

}


//====================================================
// PAPER PERFORMANCE BAR CHART
//====================================================

function renderAnalyticsPaperChart(
    paperComparison
){

    const chart =
        document.getElementById(
            "analyticsPaperChart"
        );


    if(!chart){
        return;
    }


    chart.innerHTML = "";


    if(
        !Array.isArray(
            paperComparison
        ) ||
        paperComparison.length === 0
    ){

        chart.innerHTML = `

            <div class="chart-loading">

                No paper data available

            </div>

        `;

        return;
    }


    paperComparison
        .slice()
        .sort(
            function(a,b){

                return (

                    (
                        parseFloat(
                            b.averagePercentage
                        ) || 0
                    )

                    -

                    (
                        parseFloat(
                            a.averagePercentage
                        ) || 0
                    )

                );

            }
        )
        .forEach(
            function(paper){

                const average =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            parseFloat(
                                paper.averagePercentage
                            ) || 0
                        )
                    );


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "paper-chart-row";


                row.innerHTML = `

                    <div
                        class="paper-chart-name"
                        title="${escapeAnalyticsHTML(
                            paper.paper || ""
                        )}"
                    >

                        ${
                            escapeAnalyticsHTML(
                                paper.paper || ""
                            )
                        }

                    </div>


                    <div class="paper-chart-bar">

                        <div
                            class="paper-chart-fill"
                            style="
                                width:${average}%;
                            "
                        ></div>

                    </div>


                    <div
                        class="paper-chart-value"
                    >

                        ${average.toFixed(1)}%

                    </div>

                `;


                chart.appendChild(
                    row
                );

            }
        );

}


//====================================================
// RENDER ANALYTICS CHARTS
//====================================================

function renderAnalyticsCharts(
    data
){

    if(!data){
        return;
    }


    const summary =
        data.summary || {};


    //================================================
    // PASS / FAIL
    //================================================

    renderAnalyticsPassFailChart(

        Number(
            summary.pass
        ) || 0,

        Number(
            summary.fail
        ) || 0,

        Number(
            summary.totalStudents
        ) || 0

    );


    //================================================
    // PAPER PERFORMANCE
    //================================================

    renderAnalyticsPaperChart(

        Array.isArray(
            data.paperComparison
        )
        ?
        data.paperComparison
        :
        []

    );

}
//====================================================
// EXPORT STUDENT RESULT LIST TO EXCEL
//====================================================

function exportResultListExcel(){

    //================================================
    // CHECK XLSX LIBRARY
    //================================================

    if(
        typeof XLSX ===
        "undefined"
    ){

        alert(
            "Excel export library is not loaded."
        );

        return;

    }


    //================================================
    // GET RESULT TABLE
    //================================================

    const table =
        document.querySelector(
            "#studentResultPage .resultTable"
        );


    if(!table){

        alert(
            "Result table not found."
        );

        return;

    }


    //================================================
    // GET HEADER
    //================================================

    const headers = [];


    table
        .querySelectorAll(
            "thead tr th"
        )
        .forEach(
            function(th, index){

                // Last column = Action
                // Excel me nahi chahiye

                if(
                    index <
                    table.querySelectorAll(
                        "thead tr th"
                    ).length - 1
                ){

                    headers.push(
                        th.innerText
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .trim()
                    );

                }

            }
        );


    //================================================
    // GET VISIBLE ROWS
    //================================================

    const data = [];


    table
        .querySelectorAll(
            "tbody tr"
        )
        .forEach(
            function(tr){

                // Search/filter ke baad hidden rows
                // export nahi hongi

                if(
                    tr.style.display ===
                    "none"
                ){

                    return;

                }


                const row = [];


                const cells =
                    tr.querySelectorAll(
                        "td"
                    );


                cells.forEach(
                    function(td, index){

                        // Last column = Action
                        if(
                            index <
                            cells.length - 1
                        ){

                            row.push(
                                td.innerText
                                    .replace(
                                        /\s+/g,
                                        " "
                                    )
                                    .trim()
                            );

                        }

                    }
                );


                if(
                    row.length > 0
                ){

                    data.push(
                        row
                    );

                }

            }
        );


    //================================================
    // NO DATA
    //================================================

    if(
        data.length === 0
    ){

        alert(
            "No result data available to export."
        );

        return;

    }


    //================================================
    // CREATE WORKSHEET DATA
    //================================================

    const worksheetData = [

        headers,

        ...data

    ];


    //================================================
    // CREATE WORKBOOK
    //================================================

    const worksheet =
        XLSX.utils.aoa_to_sheet(
            worksheetData
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Result List"
    );


    //================================================
    // COLUMN WIDTHS
    //================================================

    worksheet["!cols"] = [

        { wch: 8 },

        { wch: 18 },

        { wch: 16 },

        { wch: 25 },

        { wch: 15 },

        { wch: 12 },

        { wch: 12 },

        { wch: 12 },

        { wch: 12 },

        { wch: 12 },

        { wch: 12 },

        { wch: 15 }

    ];


    //================================================
    // HEADER STYLE
    //================================================
    // SheetJS Community version limited styling,
    // so data remains clean and Excel compatible.


    //================================================
    // FILE NAME
    //================================================

    const today =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );


    const fileName =
        "IKON_Student_Result_List_" +
        today +
        ".xlsx";


    //================================================
    // DOWNLOAD
    //================================================

    XLSX.writeFile(
        workbook,
        fileName
    );

}
//====================================================
// EXPORT EXCEL WITH ADMIN PASSWORD
//====================================================

function exportResultListExcelWithPassword(){

    //================================================
    // ASK PASSWORD
    //================================================

    const password =
        prompt(
            "Enter Admin Password to Export Excel:"
        );


    // Cancel
    if(password === null){

        return;

    }


    const cleanPassword =
        password.trim();


    // Empty password
    if(cleanPassword === ""){

        alert(
            "Please enter Admin Password."
        );

        return;

    }


    //================================================
    // VERIFY PASSWORD FROM SETTINGS!B15
    //================================================

    fetch(
        SCRIPT_URL +
        "?action=verifyAdmin" +
        "&code=" +
        encodeURIComponent(
            cleanPassword
        )
    )

    .then(function(response){

        if(!response.ok){

            throw new Error(
                "Server Error: " +
                response.status
            );

        }

        return response.json();

    })

    .then(function(data){

        console.log(
            "EXPORT ADMIN VERIFICATION:",
            data
        );


        //================================================
        // PASSWORD CORRECT
        //================================================

        if(
            data.status === "SUCCESS"
        ){

            // Save token if returned
            if(data.token){

                adminToken =
                    data.token;

                isAdminMode = true;

            }


            // Download Excel
            exportResultListExcel();

            return;

        }


        //================================================
        // WRONG PASSWORD
        //================================================

        if(
            data.status === "INVALID"
        ){

            alert(
                "Invalid Admin Password."
            );

            return;

        }


        //================================================
        // SETTINGS ERROR
        //================================================

        if(
            data.status ===
            "CONFIG_ERROR"
        ){

            alert(
                "Admin password is not configured in Settings!B15."
            );

            return;

        }


        alert(
            data.message ||
            "Admin verification failed."
        );

    })

    .catch(function(error){

        console.error(
            "Excel Export Verification Error:",
            error
        );

        alert(
            "Unable to verify Admin Password."
        );

    });

}
//====================================================
// VERIFY PRACTICAL STUDENT
//====================================================

//====================================================
// VERIFY PRACTICAL STUDENT
// REG NO + NAME + STUDENT ID + VERIFICATION CODE
//====================================================

function verifyPracticalStudent(){

    const idBox =
        document.getElementById(
            "practicalStudentIdInput"
        );

    const codeBox =
        document.getElementById(
            "practicalVerificationCodeInput"
        );

    const verifyBtn =
        document.getElementById(
            "verifyPracticalBtn"
        );


    if(
        !idBox ||
        !codeBox
    ){

        alert(
            "Verification fields not found."
        );

        return;

    }


    const enteredStudentId =
        idBox.value
            .trim()
            .toUpperCase();


    const enteredCode =
        codeBox.value
            .trim()
            .toUpperCase();


    //================================================
    // VALIDATION
    //================================================

    if(
        enteredStudentId === "" ||
        enteredCode === ""
    ){

        alert(
            "Please enter Student ID and Verification Code."
        );

        return;

    }


    if(verifyBtn){

        verifyBtn.disabled =
            true;

        verifyBtn.innerHTML =
            "Verifying...";

    }


    //================================================
    // VERIFY FROM APPS SCRIPT
    //================================================

    fetch(

        SCRIPT_URL +
        "?action=verifyExamStudent" +

        "&regNo=" +
        encodeURIComponent(
            regNo
        ) +

        "&name=" +
        encodeURIComponent(
            studentName
        ) +

        "&studentId=" +
        encodeURIComponent(
            enteredStudentId
        ) +

        "&verificationCode=" +
        encodeURIComponent(
            enteredCode
        )

    )

    .then(function(response){

        if(!response.ok){

            throw new Error(
                "Server Error"
            );

        }

        return response.json();

    })

    .then(function(data){

        console.log(
            "PRACTICAL VERIFICATION:",
            data
        );


        //================================================
        // VALID
        //================================================

        if(
            data.status ===
            "VALID"
        ){

            studentId =
                data.studentId ||
                enteredStudentId;


            verificationCode =
                enteredCode;


            // Hide verification
            document
                .getElementById(
                    "practicalVerificationPage"
                )
                ?.classList.add(
                    "hidden"
                );


            // Show practical page
            document
                .getElementById(
                    "practicalPage"
                )
                ?.classList.remove(
                    "hidden"
                );


            // Show instructions
            document
                .getElementById(
                    "practicalInstructionPage"
                )
                ?.classList.remove(
                    "hidden"
                );


            // Hide questions
            document
                .getElementById(
                    "practicalQuestionArea"
                )
                ?.classList.add(
                    "hidden"
                );


            // Reset instruction checkbox
            const check =
                document.getElementById(
                    "practicalInstructionCheck"
                );


            if(check){

                check.checked =
                    false;

            }


            // Disable start button
            const startBtn =
                document.getElementById(
                    "startPracticalBtn"
                );


            if(startBtn){

                startBtn.disabled =
                    true;

            }


            // Stop timer before actual exam start
            stopPracticalTimer();


            // Fill student details
            const nameBox =
                document.getElementById(
                    "prStudentName"
                );

            const regBox =
                document.getElementById(
                    "prRegNo"
                );

            const courseBox =
                document.getElementById(
                    "prCourse"
                );

            const paperBox =
                document.getElementById(
                    "prPaper"
                );


            if(nameBox){

                nameBox.textContent =
                    studentName;

            }


            if(regBox){

                regBox.textContent =
                    regNo;

            }


            if(courseBox){

                courseBox.textContent =
                    courseName;

            }


            if(paperBox){

                paperBox.textContent =
                    paperName;

            }


            return;

        }


        //================================================
        // INVALID
        //================================================

        alert(
            "Invalid Student ID or Verification Code."
        );


        idBox.value = "";

        codeBox.value = "";

        idBox.focus();

    })

    .catch(function(error){

        console.error(
            "Practical Verification Error:",
            error
        );


        alert(
            "Unable to verify Student details."
        );

    })

    .finally(function(){

        if(verifyBtn){

            verifyBtn.disabled =
                false;

            verifyBtn.innerHTML =
                "Verify & Continue";

        }

    });

}
//====================================================
// HALL TICKET MODULE
//====================================================


//====================================================
// OPEN HALL TICKET VERIFY PAGE
//====================================================

f//====================================================
// OPEN HALL TICKET VERIFY PAGE
// DIRECTLY FROM LOGIN PAGE
//====================================================

function openHallTicketVerifyPage(){

    //================================================
    // HIDE LOGIN PAGE
    //================================================

    document
        .getElementById("loginPage")
        ?.classList.add("hidden");


    //================================================
    // HIDE HALL TICKET PAGE
    //================================================

    document
        .getElementById("hallTicketPage")
        ?.classList.add("hidden");


    //================================================
    // SHOW HALL TICKET VERIFY PAGE
    //================================================

    document
        .getElementById("hallTicketVerifyPage")
        ?.classList.remove("hidden");


    //================================================
    // CLEAR REGISTRATION NUMBER
    //================================================

    const regBox =
        document.getElementById(
            "hallTicketRegNo"
        );


    if(regBox){

        regBox.value = "";

        setTimeout(function(){

            regBox.focus();

        }, 100);

    }


    //================================================
    // SCROLL TOP
    //================================================

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


//====================================================
// VERIFY HALL TICKET
//====================================================

function verifyHallTicket(){

    const regBox =
        document.getElementById(
            "hallTicketRegNo"
        );


    if(!regBox){

        alert(
            "Registration Number field not found."
        );

        return;

    }


    //================================================
    // REGISTRATION NUMBER
    //================================================

    const enteredRegNo =
        regBox.value
            .trim()
            .toUpperCase();


    //================================================
    // VALIDATION
    //================================================

    if(enteredRegNo === ""){

        alert(
            "Please Enter Registration Number."
        );

        regBox.focus();

        return;

    }


    //================================================
    // VERIFY BUTTON
    //================================================

    const verifyBtn =
        document.querySelector(
            "#hallTicketVerifyPage .primary"
        );


    if(verifyBtn){

        verifyBtn.disabled = true;

        verifyBtn.innerHTML =
            "Verifying...";

    }


    //================================================
    // API URL
    //================================================

    const url =
        SCRIPT_URL +
        "?action=hallTicket" +
        "&regNo=" +
        encodeURIComponent(
            enteredRegNo
        );


    console.log(
        "Hall Ticket Request:",
        url
    );


    //================================================
    // FETCH DATA
    //================================================

    fetch(url)

    .then(function(response){

        if(!response.ok){

            throw new Error(
                "Server Error: " +
                response.status
            );

        }

        return response.json();

    })


    .then(function(data){

        console.log(
            "Hall Ticket Response:",
            data
        );


        //================================================
        // SUCCESS
        //================================================

        if(
            data.status ===
            "SUCCESS"
        ){

            populateHallTicket(
                data
            );


            // Hide Verification
            document
                .getElementById(
                    "hallTicketVerifyPage"
                )
                ?.classList.add(
                    "hidden"
                );


            // Show Hall Ticket
            document
                .getElementById(
                    "hallTicketPage"
                )
                ?.classList.remove(
                    "hidden"
                );


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });


            return;

        }


        //================================================
        // NOT FOUND
        //================================================

        if(
            data.status ===
            "NOT_FOUND"
        ){

            alert(
                "Registration Number not found."
            );

            regBox.value = "";

            regBox.focus();

            return;

        }


        //================================================
        // INVALID REQUEST
        //================================================

        if(
            data.status ===
            "INVALID_REQUEST"
        ){

            alert(
                data.message ||
                "Please enter Registration Number."
            );

            return;

        }


        //================================================
        // OTHER ERROR
        //================================================

        alert(
            data.message ||
            "Unable to load Hall Ticket."
        );

    })


    .catch(function(error){

        console.error(
            "Hall Ticket Error:",
            error
        );


        alert(
            "Unable to connect with server."
        );

    })


    .finally(function(){

        if(verifyBtn){

            verifyBtn.disabled = false;

            verifyBtn.innerHTML =
                "Verify & Continue";

        }

    });

}


//====================================================
// POPULATE HALL TICKET
//====================================================

function populateHallTicket(data){

    //================================================
    // COMMON DATA
    //================================================

    const hallRegNo =
        data.regNo || "";

    const hallName =
        data.name || "";

    const hallPaper =
        data.paperName || "";

    const hallCourse =
        data.courseName || "";

    const hallVerifyCode =
        data.verifyCode || "";


    //================================================
    // EXAM DATE
    //
    // Sheet1 Column N
    // Apps Script sends as data.examDate
    //================================================

    const examDate =
        data.examDate || "";


    let examTitle =
        "EXAM";


    if(examDate !== ""){

        examTitle =
            "EXAM " +
            examDate;

    }


    //================================================
    // PRACTICAL CARD
    //
    // Date = J
    // Time = K
    //================================================

    setHallText(
        "practicalExamTitle",
        examTitle
    );


    setHallText(
        "practicalHallRegNo",
        hallRegNo
    );


    setHallText(
        "practicalHallName",
        hallName
    );


    setHallText(
        "practicalHallPackage",
        hallPaper
    );


    setHallText(
        "practicalHallCourse",
        hallCourse
    );


    setHallText(
        "practicalHallDate",
        data.practicalDate || ""
    );


    setHallText(
        "practicalHallTime",
        data.practicalTime || ""
    );


    setHallText(
        "practicalHallVerifyCode",
        hallVerifyCode
    );


    //================================================
    // VIVA CARD
    //
    // Date = J
    // Time = K
    //
    // Same Practical Date & Time
    //================================================

    setHallText(
        "vivaExamTitle",
        examTitle
    );


    setHallText(
        "vivaHallRegNo",
        hallRegNo
    );


    setHallText(
        "vivaHallName",
        hallName
    );


    setHallText(
        "vivaHallPackage",
        hallPaper
    );


    setHallText(
        "vivaHallCourse",
        hallCourse
    );


    setHallText(
        "vivaHallDate",
        data.practicalDate || ""
    );


    setHallText(
        "vivaHallTime",
        data.practicalTime || ""
    );


    setHallText(
        "vivaHallVerifyCode",
        hallVerifyCode
    );


    //================================================
    // THEORY CARD
    //
    // Date = L
    // Time = M
    //================================================

    setHallText(
        "theoryExamTitle",
        examTitle
    );


    setHallText(
        "theoryHallRegNo",
        hallRegNo
    );


    setHallText(
        "theoryHallName",
        hallName
    );


    setHallText(
        "theoryHallPackage",
        hallPaper
    );


    setHallText(
        "theoryHallCourse",
        hallCourse
    );


    setHallText(
        "theoryHallDate",
        data.theoryDate || ""
    );


    setHallText(
        "theoryHallTime",
        data.theoryTime || ""
    );


    setHallText(
        "theoryHallVerifyCode",
        hallVerifyCode
    );


    //================================================
    // LOAD PHOTO
    //
    // Root/Main folder
    //
    // Example:
    // 0226I19097.jpeg
    //================================================

    loadHallTicketPhotos(
        hallRegNo
    );

}


//====================================================
// SAFE TEXT SETTER
//====================================================

function setHallText(
    id,
    value
){

    const element =
        document.getElementById(id);


    if(!element){

        console.warn(
            "Hall Ticket element not found:",
            id
        );

        return;

    }


    element.textContent =
        value == null
            ? ""
            : String(value);

}


//====================================================
// LOAD HALL TICKET PHOTO
//====================================================

function loadHallTicketPhotos(
    registrationNumber
){

    if(!registrationNumber){

        return;

    }


    //================================================
    // ROOT FOLDER PHOTO
    //================================================

    const photoFile =
        String(
            registrationNumber
        ).trim() +
        ".jpeg";


    console.log(
        "Hall Ticket Photo:",
        photoFile
    );


    //================================================
    // PRACTICAL PHOTO
    //================================================

    const practicalPhoto =
        document.getElementById(
            "practicalHallPhoto"
        );


    if(practicalPhoto){

        practicalPhoto.src =
            photoFile;


        practicalPhoto.onerror =
            function(){

                console.warn(
                    "Practical photo not found:",
                    photoFile
                );

                this.src =
                    "no-photo.jpeg";

            };

    }


    //================================================
    // VIVA PHOTO
    //================================================

    const vivaPhoto =
        document.getElementById(
            "vivaHallPhoto"
        );


    if(vivaPhoto){

        vivaPhoto.src =
            photoFile;


        vivaPhoto.onerror =
            function(){

                console.warn(
                    "Viva photo not found:",
                    photoFile
                );

                this.src =
                    "no-photo.jpeg";

            };

    }


    //================================================
    // THEORY PHOTO
    //================================================

    const theoryPhoto =
        document.getElementById(
            "theoryHallPhoto"
        );


    if(theoryPhoto){

        theoryPhoto.src =
            photoFile;


        theoryPhoto.onerror =
            function(){

                console.warn(
                    "Theory photo not found:",
                    photoFile
                );

                this.src =
                    "no-photo.jpeg";

            };

    }

}


//====================================================
// BACK TO LOGIN
//====================================================

function backToLoginFromHallTicket(){

    document
        .getElementById(
            "hallTicketVerifyPage"
        )
        ?.classList.add(
            "hidden"
        );


    document
        .getElementById(
            "hallTicketPage"
        )
        ?.classList.add(
            "hidden"
        );


    document
        .getElementById(
            "loginPage"
        )
        ?.classList.remove(
            "hidden"
        );


    const regBox =
        document.getElementById(
            "hallTicketRegNo"
        );


    if(regBox){

        regBox.value = "";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


//====================================================
// BACK TO HALL TICKET VERIFY PAGE
//====================================================

function backToHallTicketVerify(){

    document
        .getElementById(
            "hallTicketPage"
        )
        ?.classList.add(
            "hidden"
        );


    document
        .getElementById(
            "hallTicketVerifyPage"
        )
        ?.classList.remove(
            "hidden"
        );


    const regBox =
        document.getElementById(
            "hallTicketRegNo"
        );


    if(regBox){

        regBox.value = "";

        setTimeout(function(){

            regBox.focus();

        },100);

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


//====================================================
// PRINT HALL TICKET
//====================================================


//====================================================
// DOWNLOAD HALL TICKET PDF
//====================================================

async function downloadHallTicketPDF(){

    const hallTicket =
        document.querySelector(
            "#hallTicketPage .hallTicketA4"
        );


    if(!hallTicket){

        alert(
            "Hall Ticket not found."
        );

        return;

    }


    //================================================
    // CHECK HTML2CANVAS
    //================================================

    if(
        typeof html2canvas ===
        "undefined"
    ){

        alert(
            "PDF library is not loaded."
        );

        return;

    }


    //================================================
    // CHECK JSPDF
    //================================================

    if(
        !window.jspdf ||
        !window.jspdf.jsPDF
    ){

        alert(
            "PDF generator is not loaded."
        );

        return;

    }


    const downloadBtn =
        document.querySelector(
            "#hallTicketPage .hallTicketActions button:last-child"
        );


    try{

        if(downloadBtn){

            downloadBtn.disabled = true;

            downloadBtn.innerHTML =
                "Generating PDF...";

        }


        //================================================
        // CREATE CANVAS
        //================================================

        const canvas =
            await html2canvas(
                hallTicket,
                {

                    scale: 2,

                    useCORS: true,

                    allowTaint: false,

                    backgroundColor:
                        "#ffffff",

                    logging: false

                }
            );


        //================================================
        // CREATE A4 PDF
        //================================================

        const {
            jsPDF
        } = window.jspdf;


        const pdf =
            new jsPDF({

                orientation:
                    "portrait",

                unit:
                    "mm",

                format:
                    "a4"

            });


        const imageData =
            canvas.toDataURL(
                "image/jpeg",
                0.95
            );


        //================================================
        // FULL A4
        //================================================

        pdf.addImage(

            imageData,

            "JPEG",

            0,

            0,

            210,

            297

        );


        //================================================
        // FILE NAME
        //================================================

        const regBox =
            document.getElementById(
                "hallTicketRegNo"
            );


        let downloadRegNo =
            regBox
                ? regBox.value.trim()
                : "Student";


        downloadRegNo =
            downloadRegNo.replace(
                /[^a-zA-Z0-9_-]/g,
                "_"
            );


        //================================================
        // SAVE
        //================================================

        pdf.save(
            "Hall_Ticket_" +
            downloadRegNo +
            ".pdf"
        );

    }
    catch(error){

        console.error(
            "Hall Ticket PDF Error:",
            error
        );


        alert(
            "Unable to generate Hall Ticket PDF."
        );

    }
    finally{

        if(downloadBtn){

            downloadBtn.disabled =
                false;

            downloadBtn.innerHTML =
                "📄 Download PDF";

        }

    }

}
