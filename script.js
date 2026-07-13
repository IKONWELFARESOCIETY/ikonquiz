//=============================
// IKON ONLINE TEST
//=============================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxvJs4QgvlSBAbcg5zuRyS8TeAzAt-en0h5Kb0V_FUtR6r3HVk-XOxchf0EnKiqEhbr6w/exec";


// Test Title & Date

window.onload = function(){

    if(document.getElementById("testTitle")){

        document.getElementById("testTitle").innerHTML =
        testConfig.testTitle;

    }


    if(document.getElementById("testDate")){

        document.getElementById("testDate").innerHTML =
        "Test Date : " + testConfig.testDate;

    }

};


// Student Details

let studentName = "";
let regNo = "";


// Question Control

let currentQuestion = 0;


// Answers

let answers = new Array(questions.length).fill(null);


// Timer

let totalTime = 30 * 60;
let timer;



//=============================
// START TEST LOGIN
//=============================

function startTest(){


    studentName =
    document.getElementById("studentName")
    .value.trim();


    regNo =
    document.getElementById("regNo")
    .value.trim();



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


        result=result.trim();


        if(result=="VALID"){


            // Login Success
            // Now Check Test Status

            checkTestStatus();


        }

        else{


            alert("Invalid Name or Registration Number");


        }


    })


    .catch(error=>{

        console.log(error);

        alert("Server Error");

    });


}



//=============================
// CHECK TEST STATUS
//=============================

function checkTestStatus(){


    fetch(
        SCRIPT_URL + "?action=status"
    )


    .then(res=>res.text())


    .then(status=>{


        status=status.trim();


        console.log("STATUS:",status);



        if(status=="ON"){


            openTest();


        }

        else{


            document.getElementById("loginPage")
            .classList.add("hidden");


            document.getElementById("waitingPage")
            .classList.remove("hidden");



            showMotivation();



            autoCheckTest();


        }


    });


}



//=============================
// WAITING AUTO CHECK
//=============================

function autoCheckTest(){


    let check=setInterval(function(){


        fetch(
            SCRIPT_URL + "?action=status"
        )


        .then(res=>res.text())


        .then(status=>{


            if(status.trim()=="ON"){


                clearInterval(check);


                openTest();


            }


        });



    },5000);


}




//=============================
// OPEN TEST
//=============================

function openTest(){


    document.getElementById("waitingPage")
    .classList.add("hidden");


    document.getElementById("loginPage")
    .classList.add("hidden");


    document.getElementById("testPage")
    .classList.remove("hidden");



    document.getElementById("showName")
    .innerHTML=studentName;



    document.getElementById("showReg")
    .innerHTML=regNo;



    loadQuestion();


    startTimer();


}




//=============================
// RANDOM MOTIVATION
//=============================

function showMotivation(){


    const lines=[

    "Believe in yourself. You are prepared.",

    "Stay focused, success is waiting for you.",

    "Your hard work today creates your success tomorrow.",

    "Be confident and give your best.",

    "Every question is a step towards success."

    ];



    document.getElementById("motivationText")
    .innerHTML =
    lines[Math.floor(Math.random()*lines.length)];


}




//=============================
// LOAD QUESTION
//=============================

function loadQuestion(){


    const q=questions[currentQuestion];


    document.getElementById("questionNumber")
    .innerHTML=
    "Question "+
    (currentQuestion+1)+
    " of "+
    questions.length;



    document.getElementById("questionText")
    .innerHTML=q.question;



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
       onclick="saveAnswer(${index}, '${option}')">

        ${option}

        </label>

        `;


    });



    document.getElementById("options")
    .innerHTML=html;



    updateProgress();


}




//=============================
// SAVE ANSWER
//=============================

function saveAnswer(index, optionText){

    answers[currentQuestion]=optionText;

}



//=============================
// NEXT
//=============================

function nextQuestion(){


    if(currentQuestion < questions.length-1){


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
// PROGRESS
//=============================

function updateProgress(){


    let percent=
    ((currentQuestion+1)/questions.length)*100;



    document.getElementById("progressBar")
    .style.width=
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



document.getElementById("timer")
.innerHTML=
minutes+":"+seconds;



if(totalTime<=0){


clearInterval(timer);

submitTest();


}



},1000);



}




//=============================
// SUBMIT TEST
//=============================

function submitTest(){


if(!confirm("Are you sure you want to submit the test?")){

return;

}



clearInterval(timer);



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


showSuccess();


});



}




//=============================
// SUCCESS
//=============================

function showSuccess(){


document.getElementById("testPage")
.classList.add("hidden");



document.getElementById("successPage")
.classList.remove("hidden");


}




//=============================
// BACK BUTTON BLOCK
//=============================

history.pushState(null,null,location.href);


window.onpopstate=function(){

history.go(1);

};
