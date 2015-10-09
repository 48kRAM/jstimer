/*jslint browser: true */
var ticks=0, mins=0, secs=0, counter, timeStr, talkPart=0, qaTime, talkLen, elapsed=0;

function userTimer(F) {
    startTimer(F.userTalk.value*60, F.userQA.value*60);
}
function startTimer(talkSecs, qaSecs) {
    if (talkSecs>0) {
	elapsed=0;
	document.getElementById("mode").innerHTML=localStorage["presVocab"];
	ticks=talkSecs;
	talkPart=1;
	qaTime=qaSecs;
    } else {
	if (qaSecs>0) {
	    elapsed=0;
	    document.getElementById("mode").innerHTML=localStorage["qaVocab"];
	    talkPart=2;
	    ticks=qaSecs;
	}
    }
    updateDisplay();
    document.getElementById('graphholder').style.visibility='visible';
    document.getElementById('gui').style.visibility='hidden';
    document.getElementById('timer').style.color='#000';
    document.getElementById("timer").style.fontSize="17em";
    clearInterval(counter);
    counter=setInterval(timerFunc, 1000);
}
function updateDisplay() {
    var clock=document.getElementById("timer");
    var x=document.getElementById('autoQA');
    mins=Math.floor(ticks/60);
    secs=ticks-(mins*60);
    if(secs.toString().length<2) {
	secs='0'+secs;
    }
    clock.innerHTML=mins + ":" +secs;
    if(elapsed>0 || ticks>0) {
	pieChart.segments[0].value=elapsed;
	if (talkPart==2) {
	    pieChart.segments[1].value=0;
	    if (x.checked && qaTime>0) { pieChart.segments[2].value=ticks; }
	} else {
	    pieChart.segments[1].value=ticks;
	    if(x.checked && qaTime>0) { pieChart.segments[2].value=qaTime; }
	    else { pieChart.segments[2].value=0; }
	}
	pieChart.update();
    }
}
function timerFunc() {
    ticks=ticks-1;
    elapsed=elapsed+1;
    if (ticks <=0 ) {
	var x=document.getElementById('autoQA');
	if (talkPart==1 && x.checked) {
	    talkPart=2;
	    ticks=qaTime;
	    updateDisplay();
	    document.getElementById("mode").innerHTML="Question / Answer";
	} else {
	    updateDisplay();
	    clearInterval(counter);
	    var elem=document.getElementById("timer");
	    elem.style.fontSize="10em";
	    elem.innerHTML="Your time has expired!";
	    document.getElementById("mode").innerHTML="";
	    timeIsUp();
	    counter=setInterval(timeIsUp, 700);
	}
    } else {
	updateDisplay();
    }
}
function showGui() {
    setupGui();
    document.getElementById('timer').style.color='black';
    document.getElementById("gui").style.visibility='visible';
    clearInterval(counter);
}
function timeIsUp() {
    var elem=document.getElementById("timer");
    if (elem.style.color === "black") {
	elem.style.color = "red";
    }
    else {
	elem.style.color = "black";
    }
}
function clockFunc() {
    var now=new Date();
    var hour=now.getHours();
    var minute=now.getMinutes();
    if (hour > 12) { hour-=12; }
    if (minute < 10) { minute='0'+minute; }
    document.getElementById("timer").innerHTML=hour+":"+minute;
}
function showClock() {
    document.getElementById("mode").innerHTML="Time of Day";
    document.getElementById('gui').style.visibility='hidden';
    document.getElementById('graphholder').style.visibility='hidden';
    document.getElementById('timer').style.color='#000';
    document.getElementById("timer").style.fontSize="17em";
    clearInterval(counter);
    clockFunc();
    counter=setInterval(clockFunc, 1000);
}
function setupGui() {
    var presetpane=document.getElementById("presets"), bStr, i;
    presetpane.innerHTML='';
    for (i=0; i<3; i++) {
	pmin=localStorage["pr"+i];
	qmin=localStorage["qa"+i];
	name=localStorage["name"+i];
	psec=pmin*60;
	qsec=qmin*60;
	bStr="<button id='preset"+i+"' onClick='startTimer("+psec+","+
	    qsec+")'>"+name+"<br/>"+pmin+" / "+qmin+"</button>";
	presetpane.innerHTML+=bStr;
    }
}
function pageStartup() {
    if(typeof(localStorage["pr0"])==="undefined") {
	// Define some initial defaults if local storage not setup yet
	localStorage["name0"]="Keynote";
	localStorage["pr0"]=50;
	localStorage["qa0"]=10;
	localStorage["name1"]="Invited talk";
	localStorage["pr1"]=30;
	localStorage["qa1"]=10;
	localStorage["name2"]="Contributed";
	localStorage["pr2"]=15;
	localStorage["qa2"]=5;
    }
    if(typeof(localStorage["presVocab"])==="undefined") {
	localStorage["presVocab"]="Presentation";
    }
    if(typeof(localStorage["qaVocab"])==="undefined") {
	localStorage["qaVocab"]="Question / Answer";
    }
    if(typeof(macgap)!="undefined") {
	// Add some handlers if using MacGap binary
	macgap.menu.getItem("Help").submenu().getItem("JS Timer Help").setCallback(
	    function() { goHelp(); } );
	macgap.menu.getItem("Run").submenu().getItem('Preset 1').setCallback(
	    function() { document.getElementById('preset0').click(); } );
	macgap.menu.getItem("Run").submenu().getItem('Preset 2').setCallback(
	    function() { document.getElementById('preset1').click(); } );
	macgap.menu.getItem("Run").submenu().getItem('Preset 3').setCallback(
	    function() { document.getElementById('preset2').click(); } );
	macgap.menu.getItem("Run").submenu().getItem('Demo').setCallback(
	    function() { document.getElementById('demo').click(); } );
	macgap.menu.getItem("Run").submenu().getItem('Clock').setCallback(
	    function() { showClock(); } );
    } // End macgap setup
    var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
    if(isNode) {
	// GUI handler options for running in node-webkit
	var gui = require('nw.gui');
	var win = gui.Window.get();
	var menubar = new gui.Menu({type: 'menubar'});
	var mrun = new gui.Menu();
	menubar.append(new gui.MenuItem( {label: 'Run...', submenu: mrun}));

	mrun.append(new gui.MenuItem({
	    label: 'Preset 1',
	    click: function() { document.getElementById('preset0').click(); },
	    key: 'F1'
	}));
	mrun.append(new gui.MenuItem({
	    label: 'Preset 2',
	    click: function() { document.getElementById('preset1').click(); },
	    key: 'F2'
	}));
	mrun.append(new gui.MenuItem({
	    label: 'Preset 3',
	    click: function() { document.getElementById('preset2').click(); },
	    key: 'F3'
	}));
	mrun.append(new gui.MenuItem({
	    label: 'Demo',
	    click: function() { document.getElementById('demo').click(); },
	    key: 'F4'
	}));
	mrun.append(new gui.MenuItem({
	    label: 'Clock',
	    click: function() { showClock(); },
	    key: 'c'
	}));

	win.menu = menubar;
    } // End node setup
    setupGui();
    updateDisplay();
}
function goConfigure() {
    if(ticks>0) {
	if(confirm("Are you sure you want to configure now?")) {
	    window.location.href="configure.html";
	}
    } else {
	window.location.href="configure.html";
    }
}
function goHelp() {
    if(ticks>0) {
	if(confirm("This will reset the current timer. Are you sure?")) {
	    window.location.href="help.html";
	}
    } else {
	window.location.href="help.html";
    }
}

function handleKey(evt) {
    var theKey=(evt.which) ? evt.which : evt.keyCode;
    if(theKey>111 && theKey< 116) {
	evt.preventDefault();
    }
    var running=0;
    if (document.getElementById('gui').style.visibility=='hidden') {
	running=1;
    }
    //alert(theKey);
    switch(theKey) {
	// Space bar - pause, or resume
	case 32:
	    if(running) { showGui(); }
	    else { startTimer(0,0); }
	    break;
	// F1-F4 keys, - Activate presets
	case 112:
	    document.getElementById('preset0').click();
	    break;
	case 113:
	    document.getElementById('preset1').click();
	    break;
	case 114:
	    document.getElementById('preset2').click();
	    break;
	case 115:
	    document.getElementById('demo').click();
	    break;
	// C key - display clock
	case 99:
	    showClock();
	    break;
    }
}
function handleResize() {
    var graphDiv=document.getElementById('graphholder');
    var pieGraph=document.getElementById('piegraph');
    var sHeight=window.innerHeight;
    var sWidth=window.innerWidth;
    var gH=sHeight-120;     // Leave room for mode and margins
    var gW=sWidth-(115*2)-20;
    ctx.canvas.width=gW;
    ctx.canvas.height=gH;
    pieGraph.style.width=gW.toString()+'px';
    pieGraph.style.height=gH.toString()+'px';
    pieChart.destroy();
    pieChart = new Chart(ctx).Pie(timedata, {
	    segmentShowStroke: false
    });
}

var timedata = [
    {
	value: 00,
	color: "#eee",
	label: "Time"
    }, {
	value: 40,
	color: "#3377ff",
	label: "Presentation"
    }, {
	value: 00,
	color: "#ff9900",
	label: "Question / Answer"
    }
];