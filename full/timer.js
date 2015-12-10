/*jslint browser: true */
var ticks=0, mins=0, secs=0, counter, timeStr, talkPart=0, qaTime, talkLen, elapsed=0;
var jstConfig = {
};

function initConfig() {
    // Define some initial defaults if local storage not setup yet
    console.log("Applying default presets");
    jstConfig.presets=[
	{name:'Keynote', pres:50, qa:10},
	{name:'Invited talk', pres:30, qa:10},
    ];
    jstConfig.presVocab='Presentation';
    jstConfig.qaVocab='Question / Answer';
    jstConfig.cfgVer='1.9';
    localStorage['jstConfig']=JSON.stringify(jstConfig);
}
function pageStartup() {
    console.log("Page startup...");
    try {
	jstConfig=JSON.parse(localStorage['jstConfig']);
    } catch(e) {
	initConfig();
    }
    if(typeof(jstConfig.cfgVer)==="undefined" ) {
        initConfig();
    }

     // Load the sound clip
    $("#timeupsnd").trigger('load');
    setupGui();
    updateDisplay();
}

function userTimer(F) {
    startTimer(F.userTalk.value*60, F.userQA.value*60);
}
function startTimer(talkSecs, qaSecs) {
    if (talkSecs>0) {
	elapsed=0;
	$("#mode").html(jstConfig["presVocab"]);
	ticks=talkSecs;
	talkPart=1;
	qaTime=qaSecs;
    } else {
	if (qaSecs>0) {
	    elapsed=0;
	    $("#mode").html(jstConfig["qaVocab"]);
	    talkPart=2;
	    ticks=qaSecs;
	}
    }
    updateDisplay();
    $("#graphholder").show("slow");
    $("#gui").hide("fast");
    var t=$("#timer")
    t.removeClass('timerred');
    t.css('fontSize', '');
    clearInterval(counter);
    counter=setInterval(timerFunc, 1000);
}
function updateDisplay() {
    var clock=$("#timer");
    var x=document.getElementById('autoQA');
    mins=Math.floor(ticks/60);
    secs=ticks-(mins*60);
    if(secs.toString().length<2) {
	secs='0'+secs;
    }
    clock.html(mins + ":" +secs);
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
	    $("#mode").html("Question / Answer");
	} else {
	    updateDisplay();
	    clearInterval(counter);
	    var elem=$("#timer");
	    elem.css('fontSize', "10em");
	    elem.html("Your time has expired!");
	    $("#mode").html("");
	    $("#graphholder").hide();
	    $("#timeupsnd").trigger('play');
	    $("#textdiv").effect("bounce", {times:3}, 400);
	    timeIsUp();
	    counter=setInterval(timeIsUp, 700);
	}
    } else {
	updateDisplay();
    }
}
function showGui() {
    setupGui();
    $("#timer").removeClass('timerred');
    $("#gui").show("fast");
    clearInterval(counter);
}
function timeIsUp() {
    $("#timer").toggleClass('timerred');
}
function clockFunc() {
    var now=new Date();
    var hour=now.getHours();
    var minute=now.getMinutes();
    if (hour > 12) { hour-=12; }
    if (minute < 10) { minute='0'+minute; }
    $("#timer").html(hour+":"+minute);
}
function showClock() {
    $("#mode").html("Time of Day");
    $("#gui").hide("fast");
    $("#graphholder").hide();
    var t=$("#timer")
    t.removeClass('timerred');
    t.css('fontSize', '');
    clearInterval(counter);
    clockFunc();
    counter=setInterval(clockFunc, 1000);
}
function setupGui() {
    var bStr, i;
    var presetpane=$("#presets");
    presetpane.html('');
    for (i=0, len=jstConfig.presets.length; i<len; i++) {
        var p=jstConfig.presets[i];
	psec=p.pres*60;
	qsec=p.qa*60;
	bStr="<button id='preset"+i+"' onClick='startTimer("+psec+","+
	    qsec+")'>"+p.name+"<br/>"+p.pres+" / "+p.qa+"</button>";
	presetpane.append(bStr);
    }
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
    var theKey=evt.which;
    // Disabled for now
    if(false && theKey>111 && theKey< 119) {
	// F1-F8 keys, - Activate presets
	evt.preventDefault();
	var presetNum=theKey-112;
	$("#preset"+presetNum).trigger("click");
    }
    var running=0;
    var guiState=$("#gui").css('display');
    if (guiState==='none') {
	running=1;
    }
    //alert(theKey);
    switch(theKey) {
	// Space bar - pause, or resume
	case 32:
	    if(running) { showGui(); }
	    else { startTimer(0,0); }
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
