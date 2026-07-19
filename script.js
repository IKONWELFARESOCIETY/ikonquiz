//================================
// IKON ONLINE TEST SYSTEM
// SCRIPT.JS PART 1
//================================



// GOOGLE APP SCRIPT URL

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxvJs4QgvlSBAbcg5zuRyS8TeAzAt-en0h5Kb0V_FUtR6r3HVk-XOxchf0EnKiqEhbr6w/exec";




//================================
// GLOBAL VARIABLES
//================================


let studentName = "";

let regNo = "";

let paperName = "";

let currentQuestion = 0;

let answers = [];

let totalTime = 30 * 60;

let timer = null;

let statusChecker = null;





//================================
// PAGE LOAD
//================================


window.onload = function(){


    loadTestDate();

    loadTestTime();

    loadDuration();


};








//================================
// LOAD TEST DATE
//================================


function loadTestDate(){


fetch(SCRIPT_URL+"?action=testDate")


.then(res=>res.text())


.then(data=>{


let el=document.getElementById("testDate");


if(el){

el.innerHTML="📅 Test Date : "+data;

}


});


}









//================================
// LOAD TEST TIME
//================================


function loadTestTime(){


fetch(SCRIPT_URL+"?action=testTime")


.then(res=>res.text())


.then(data=>{


let el=document.getElementById("testTime");


if(el){


el.innerHTML="🕒 Test Time : "+data;


}


});


}









//================================
// LOAD DURATION
//================================


function loadDuration(){


fetch(SCRIPT_URL+"?action=duration")


.then(res=>res.text())


.then(data=>{


let min=parseInt(data);



if(isNaN(min)){


min=30;


}



totalTime=min*60;


showTimer();



});


}









function showTimer(){


let minutes=Math.floor(totalTime/60);


let seconds=totalTime%60;



minutes =
minutes<10 ?
"0"+minutes :
minutes;



seconds =
seconds<10 ?
"0"+seconds :
seconds;




let timerBox=document.getElementById("timer");


if(timerBox){


timerBox.innerHTML =
minutes+":"+seconds;


}



}









//================================
// LOGIN SYSTEM
//================================


function startTest(){



studentName =
document.getElementById("studentName")
.value.trim();




regNo =
document.getElementById("regNo")
.value.trim();






if(studentName==="" || regNo===""){


alert(
"Please enter Name and Registration Number."
);


return;


}









fetch(

SCRIPT_URL+
"?action=login"+
"&regNo="+encodeURIComponent(regNo)+
"&name="+encodeURIComponent(studentName)

)






.then(res=>res.text())



.then(result=>{



let data;



try{


data=JSON.parse(result);


}

catch(e){


alert("Server Response Error");


return;


}







if(data.status==="VALID"){



studentName=data.name;


regNo=data.regNo;


paperName=data.paperName;





checkTestStatus();




}






else if(data.status==="ALREADY_SUBMITTED"){



alert(
"You have already submitted this test."
);



}






else{



alert(
"Invalid Registration Number or Name."
);



}






})






.catch(err=>{


console.log(err);


alert(
"Unable to connect with server."
);



});
}

//================================
// CHECK TEST STATUS
//================================


function checkTestStatus(){


fetch(
SCRIPT_URL+"?action=status"
)



.then(res=>res.text())


.then(status=>{


status=status.trim().toUpperCase();




if(status==="ON"){


openTest();


}


else{


let login=document.getElementById("loginPage");

let waiting=document.getElementById("waitingPage");



if(login){

login.classList.add("hidden");

}



if(waiting){

waiting.classList.remove("hidden");

}



showRandomLine();


autoCheckStatus();


}



});



}









//================================
// AUTO CHECK TEST START
//================================


function autoCheckStatus(){



if(statusChecker!==null){

return;

}



statusChecker=setInterval(function(){



fetch(
SCRIPT_URL+"?action=status"
)



.then(res=>res.text())


.then(status=>{


status=status.trim().toUpperCase();




if(status==="ON"){



clearInterval(statusChecker);


statusChecker=null;


openTest();



}



});




},5000);



}









//================================
// OPEN TEST
//================================


function openTest(){



let login=document.getElementById("loginPage");

let waiting=document.getElementById("waitingPage");

let test=document.getElementById("testPage");





if(login){

login.classList.add("hidden");

}




if(waiting){

waiting.classList.add("hidden");

}





if(test){

test.classList.remove("hidden");

}








let nameBox =
document.getElementById("showName");

let regBox =
document.getElementById("showReg");

let paperBox =
document.getElementById("showPaper");







if(nameBox){

nameBox.innerHTML=studentName;

}





if(regBox){

regBox.innerHTML=regNo;

}





if(paperBox){

paperBox.innerHTML=paperName;

}







if(typeof questions !== "undefined"){


answers =
new Array(questions.length)
.fill("");



}




loadQuestion();


startTimer();



}










//================================
// MOTIVATION MESSAGE
//================================


function showRandomLine(){



const lines=[


"Believe in yourself.",

"Stay calm and focused.",

"Success begins with confidence.",

"Give your best today.",

"Every question is an opportunity.",

"Hard work always pays.",

"Think before you answer.",

"You are ready to succeed."


];





let box =
document.getElementById("motivationText");



if(box){


box.innerHTML =
lines[
Math.floor(
Math.random()*lines.length
)
];


}




}










//================================
// LOAD QUESTION
//================================


function loadQuestion(){



if(typeof questions==="undefined"){


console.log(
"Questions not loaded"
);


return;


}






const q =
questions[currentQuestion];





if(!q){

return;

}








let qNo =
document.getElementById("questionNumber");



if(qNo){



qNo.innerHTML =
"Question "+
(currentQuestion+1)+
" of "+
questions.length;



}







let qText =
document.getElementById("questionText");




if(qText){


qText.innerHTML =
q.question;


}









let html="";







q.options.forEach(function(option,index){



let checked="";



if(
answers[currentQuestion]===option
){


checked="checked";


}






html+=`


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








let optionBox =
document.getElementById("options");



if(optionBox){


optionBox.innerHTML=html;


}





updateProgress();


createQuestionPalette();





}











//================================
// SAVE ANSWER
//================================


function saveAnswer(index){



answers[currentQuestion] =
questions[currentQuestion]
.options[index];



createQuestionPalette();



}









//================================
// QUESTION PALETTE
//================================


function createQuestionPalette(){



let box =
document.getElementById(
"questionNumbers"
);




if(!box){

return;

}





box.innerHTML="";







questions.forEach(function(q,index){



let btn =
document.createElement("button");



btn.innerHTML=index+1;



btn.className="q-btn";





if(index===currentQuestion){


btn.classList.add("active");


}







if(
answers[index]!=="" &&
answers[index]!==undefined
){


btn.classList.add("done");


}






btn.onclick=function(){


currentQuestion=index;


loadQuestion();


};





box.appendChild(btn);



});




}









//================================
// NEXT QUESTION
//================================


function nextQuestion(){



if(
currentQuestion <
questions.length-1
){


currentQuestion++;


loadQuestion();


}



}










//================================
// PREVIOUS QUESTION
//================================


function previousQuestion(){



if(currentQuestion>0){



currentQuestion--;


loadQuestion();



}



}









//================================
// PROGRESS BAR
//================================


function updateProgress(){



let bar =
document.getElementById(
"progressBar"
);




if(!bar){

return;

}




let percent =
((currentQuestion+1)/
questions.length)*100;




bar.style.width =
percent+"%";



}









//================================
// START TIMER
//================================


function startTimer(){



if(timer!==null){


clearInterval(timer);


}







timer=setInterval(function(){



totalTime--;





let minutes =
Math.floor(totalTime/60);



let seconds =
totalTime%60;





minutes =
minutes<10 ?
"0"+minutes :
minutes;



seconds =
seconds<10 ?
"0"+seconds :
seconds;






let timerBox =
document.getElementById(
"timer"
);





if(timerBox){


timerBox.innerHTML =
minutes+":"+seconds;


}






if(totalTime<=0){



clearInterval(timer);



submitTest(true);



}




},1000);





}
    //================================
// SUBMIT TEST
//================================


function submitTest(autoSubmit=false){



if(!autoSubmit){



let confirmSubmit =
confirm(
"Are you sure you want to submit the test?"
);



if(!confirmSubmit){


return;


}


}







if(timer!==null){


clearInterval(timer);


}









const data={



name:studentName,


regNo:regNo,


paperName:paperName,


submittedAt:
new Date().toLocaleString(),



answers:answers



};









fetch(SCRIPT_URL,{


method:"POST",


body:JSON.stringify(data)



})







.then(res=>res.text())



.then(result=>{



result=result.trim();





if(result==="SUCCESS"){



showSuccess();



}


else{


alert(result);



}



})







.catch(err=>{



console.log(err);



alert(
"Unable to submit responses."
);



});






}











//================================
// SUCCESS PAGE
//================================


function showSuccess(){



let test =
document.getElementById(
"testPage"
);



let waiting =
document.getElementById(
"waitingPage"
);



let success =
document.getElementById(
"successPage"
);







if(test){


test.classList.add("hidden");


}






if(waiting){


waiting.classList.add("hidden");


}






if(success){


success.classList.remove("hidden");


}



}









//================================
// GO TO LOGIN PAGE
//================================


function goLogin(){



let success =
document.getElementById(
"successPage"
);



let test =
document.getElementById(
"testPage"
);



let waiting =
document.getElementById(
"waitingPage"
);



let login =
document.getElementById(
"loginPage"
);









if(success){


success.classList.add("hidden");


}






if(test){


test.classList.add("hidden");


}






if(waiting){


waiting.classList.add("hidden");


}






if(login){


login.classList.remove("hidden");


}









// RESET DATA


studentName="";


regNo="";


paperName="";


currentQuestion=0;


answers=[];









let name =
document.getElementById(
"studentName"
);



let reg =
document.getElementById(
"regNo"
);







if(name){


name.value="";


}






if(reg){


reg.value="";


}







if(timer!==null){


clearInterval(timer);


timer=null;


}




}









//================================
// DISABLE RIGHT CLICK
//================================


document.addEventListener(
"contextmenu",
function(e){


e.preventDefault();


});









//================================
// DISABLE COPY
//================================


document.addEventListener(
"copy",
function(e){


e.preventDefault();


});









//================================
// DISABLE CUT
//================================


document.addEventListener(
"cut",
function(e){


e.preventDefault();


});









//================================
// KEYBOARD SECURITY
//================================


document.addEventListener(
"keydown",
function(e){





if(



e.key==="F12" ||



(e.ctrlKey &&
e.shiftKey &&
e.key==="I") ||



(e.ctrlKey &&
e.shiftKey &&
e.key==="J") ||



(e.ctrlKey &&
e.shiftKey &&
e.key==="C") ||



(e.ctrlKey &&
e.key==="U")



){



e.preventDefault();



}




});









//================================
// PREVENT BACK BUTTON
//================================


history.pushState(
null,
null,
location.href
);



window.onpopstate=function(){


history.go(1);
};
document.querySelector(".navigation .secondary").onclick = function () {
    alert("Previous Click");
    previousQuestion();
};

document.querySelector(".navigation .primary").onclick = function () {
    alert("Next Click");
    nextQuestion();
};

document.querySelector(".submit-area .success").onclick = function () {
    alert("Submit Click");
    submitTest();
};

