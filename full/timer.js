/*jslint browser: true */
var ticks=0, mins=0, secs=0, counter, timeStr, talkPart=0, qaTime, talkLen, elapsed=0, timerRunning=0;
// Global configuration array
var jstConfig = {
};
// App versoin
var jstVersion="2.99.1";

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
    // First startup - called when page is ready
    console.log("Page startup...");
    try {
	jstConfig=JSON.parse(localStorage['jstConfig']);
    } catch(e) {
	initConfig();
    }
    if(typeof(jstConfig.cfgVer)==="undefined" ) {
        initConfig();
    }

    setupGui();
     // Load the sound clip
    $("#timeupsnd").trigger('load');

    // Configure global shortcut Space to run/pause timer
    shortcut.add("Space", function() {
        if (timerRunning) { showGui(); }
	else { beginTiming(); }
    }, { 'type':'keydown', 'disable_in_input':true } );
    // Configure global shortcut key C for ToD clock
    shortcut.add("c", function() {
	if (!timerRunning) {
	    showClock();
	}
    }, { 'type':'keydown', 'disable_in_input':true } );
    timerRunning=0;
    updateDisplay();
}

function userTimer(F) {
    setTimer(F.userTalk.value*60, F.userQA.value*60);
}
// Just start timing - don't reset the counters
function beginTiming() {
    updateDisplay();
    $("#graphholder").show("slow");
    $("#gui").hide("fast");
    var t=$("#timer")
    t.removeClass('timerred');
    t.css('fontSize', '');
    timerRunning=1;
    clearInterval(counter);
    counter=setInterval(timerFunc, 1000);
}
// Set the timing counters and start the clock timing
function setTimer(talkSecs, qaSecs) {
    qaTime=0;
    if (talkSecs>0) {
	elapsed=0;
	$("#mode").html(jstConfig["presVocab"]);
	ticks=talkSecs;
	talkPart=1;
	qaTime=qaSecs;
    } else if (qaSecs>0) {
	elapsed=0;
	$("#mode").html(jstConfig["qaVocab"]);
	talkPart=2;
	ticks=qaSecs;
	qaTime=qaSecs;
    }
    beginTiming();
}
function updateDisplay() {
    // Redraws the time clock and pie chart - called
    // each time a second elapses
    var clock=$("#timer");
    var x=document.getElementById('autoQA');
    mins=Math.floor(ticks/60);
    secs=ticks-(mins*60);
    if(secs.toString().length<2) {
	secs='0'+secs;
    }
    clock.html(mins + ":" +secs);
    if(elapsed>0 || ticks>0) {
        // Update the pie chart settings
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
    // timerFunc is the main tick handler
    ticks=ticks-1;
    elapsed=elapsed+1;
    if (ticks <=0 ) {
	var x=document.getElementById('autoQA');
	if (talkPart==1 && x.checked && qaTime > 0) {
	    // This code advances from Presentation to Q&A
	    talkPart=2;
	    // Reset the ticks counter to seconds for the Q&A part
	    ticks=qaTime;
	    updateDisplay();
	    if(jstConfig.qasoundOn) {
	        // Play the Q&A chime if it's turned on in config
		$("#qasnd").trigger('play');
	    }
	    // Change the screen text
	    $("#mode").html(jstConfig["qaVocab"]);
	} else {
	    updateDisplay();
	    clearInterval(counter);
	    var elem=$("#timer");
	    elem.css('fontSize', "10em");
	    elem.html("Your time has expired!");
	    // Clear the Pres/QA mode text
	    $("#mode").html("");
	    // Remove the pie chart
	    $("#graphholder").hide();
	    // Play the time-up sound
	    $("#timeupsnd").trigger('play');
	    // Animate the time-up text
	    $("#textdiv").effect("bounce", {times:3}, 400);
	    // Start flashing the time-up text
	    timeUpFlash();
	    counter=setInterval(timeUpFlash, 700);
	}
    } else {
    	// Normal countdown tick - show the new time
	updateDisplay();
    }
}
function showGui() {
    $("#timer").removeClass('timerred');
    $("#gui").show("fast");
    // Interrupt the countdown whenever GUI is shown
    timerRunning=0;
    clearInterval(counter);
}
function timeUpFlash() {
    // Flash the time-up text red / black
    $("#timer").toggleClass('timerred');
}
function clockFunc() {
    // Tick handler for the time-of-day (ToD) clock mode
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
    // Make sure the countdown is stopped
    clearInterval(counter);
    // Show the ToD clock
    clockFunc();
    // Update clock every second
    counter=setInterval(clockFunc, 1000);
}

function setupGui() {
    // Draw the controls GUI - called at page startup only
    var bStr, i;
    var presetpane=$("#presets");
    for (i=0, len=jstConfig.presets.length; i<len; i++) {
        var p=jstConfig.presets[i];
	psec=p.pres*60;
	qsec=p.qa*60;
	bStr="<button id='preset"+i+"' onClick='setTimer("+psec+","+
	    qsec+")'>"+p.name+"<br/>"+p.pres+" / "+p.qa+"</button>";
	presetpane.append(bStr);
	// Bind a number key shortcut to the button
	var scNumKey=i+1;
	shortcut.remove(scNumKey.toString() );
	shortcut.add(scNumKey.toString(), function(event) {
	    // Run a preset triggered by pressing a number key on kbd
	    // Only if another timer is not running (safety)
	    if (!timerRunning) {
		// Presets are numbered from 0 but shortcut keys start at 1
		var presetNum = event.which - 49;
		console.log ("shortcut " +presetNum.toString() );
		$("#preset"+presetNum).trigger("click");
	    }
	},
	{'type':'keydown','disable_in_input':true} );
    }
    $("#version").html("JSTimer ver. "+jstVersion);
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

function handleResize() {
    var graphDiv=document.getElementById('graphholder');
    var pieGraph=document.getElementById('piegraph');
    var sHeight=window.innerHeight;
    var sWidth=window.innerWidth;
    // Leave room for mode and margins
    var gH=sHeight-120;
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

// Initial timer settings just to get a full pie chart
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
