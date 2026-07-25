/*=========================================
IKON STUDENT DASHBOARD
=========================================*/

//----------------------------------------
// Session Check
//----------------------------------------

const studentName = sessionStorage.getItem("studentName");
const regNo = sessionStorage.getItem("regNo");
const course = sessionStorage.getItem("course");
const studentPhoto = sessionStorage.getItem("studentPhoto");

//----------------------------------------
// Login Required
//----------------------------------------

if (!regNo) {

    alert("Please login first.");

    window.location.href = "index.html";

}

//----------------------------------------
// Show Student Details
//----------------------------------------

document.getElementById("studentName").textContent =
studentName || "Student";

document.getElementById("regNo").textContent =
regNo || "-";

document.getElementById("course").textContent =
course || "-";

if(studentPhoto){

    document.getElementById("studentPhoto").src =
    studentPhoto;

}

//----------------------------------------
// Start Exam
//----------------------------------------

function startExam(){

    /*
    NEXT PART ME
    Existing Exam Page Open Hoga
    */

    alert("Start Exam Module");

}

//----------------------------------------
// View Result
//----------------------------------------

function viewResult(){

    /*
    NEXT PART ME
    Result List Open Hogi
    */

    window.location.href="results.html";

}

//----------------------------------------
// Logout
//----------------------------------------

function logout(){

    if(confirm("Do you want to logout?")){

        sessionStorage.clear();

        window.location.href="index.html";

    }

}
