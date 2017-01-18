/*jslint browser: true */
var ticks=0, mins=0, secs=0, counter, timeStr, talkPart=0, qaTime, talkLen, elapsed=0, timerRunning=0;
var ctx, pieChart; // For the canvas and pie graph
// Global configuration array
var jstConfig = {
};
// App versoin
var jstVersion="2.99.2";

function saveConfig() {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        chrome.storage.local.set({'jstConfig': JSON.stringify(jstConfig) });
    } else {
        // Normal HTML5 browser mode
        localStorage['jstConfig']=JSON.stringify(jstConfig);
    }
}
function initConfig() {
    // Define some initial defaults if local storage not setup yet
    jstConfig.presets=[
	{name:'Keynote', pres:50, qa:10},
	{name:'Invited talk', pres:30, qa:10},
    ];
    jstConfig.presVocab='Presentation';
    jstConfig.qaVocab='Question / Answer';
    jstConfig.cfgVer='1.9';
    saveConfig();
}
function pageStartup() {
    // First startup - called when page is ready
    // Get config string either from HTML5 of chrome storage
    var configString;
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
    	configString = chrome.storage.local.get('jstConfig', function(result) {
	    configString = result.jstConfig;
	});
    } else {
	// Normal HTML5 browser mode
	configString=localStorage['jstConfig'];
    }
    try {
	jstConfig=JSON.parse(configString);
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
    ctx = document.getElementById("piegraph").getContext("2d");
    // Set canvas size based on viewport dimensions
    Chart.defaults.global.animation=false;
    pieChart = new Chart(ctx).Pie(timedata, {
        segmentShowStroke : false
    });
    // Replacement for the onClick elements
    document.getElementById("demobutton").addEventListener("click",
    	function() {
	    setTimer(10,5);
    });
    document.getElementById("rtcbutton").addEventListener("click",
	showClock, false);
    document.getElementById("userbutton").addEventListener("click",
    	function() {
    });
    document.getElementById("resumebutton").addEventListener("click",
	beginTiming, false);
    document.getElementById("configbutton").addEventListener("click",
	goConfigure, false);
    document.getElementById("helpbutton").addEventListener("click",
	goHelp, false);
    document.getElementById("textdiv").addEventListener("click",
	showGui, false);
    document.getElementById("userbutton").addEventListener("click",
	userTimer, false);
    // config buttons
}

function userTimer() {
    setTimer(
	document.getElementById("user1").value * 60,
	document.getElementById("user2").value * 60
    );
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
    // Remove keyboard focus from all buttons
    $('button').each(function() {
    	$(this).blur();
    });
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
	bStr="<button id='preset"+i+"'>"+p.name+"<br/>"+p.pres+" / "+p.qa+"</button>\n";
	presetpane.append(bStr);
	// Loate the button we just created
	var pButton=document.getElementById('preset'+i);
	pButton.qsec=qsec;
	pButton.psec=psec;
	// Configure the button to start a timer when clicked
	pButton.addEventListener("click", function(e) {
	    setTimer(e.target.psec, e.target.qsec);
	}, false);
	// Bind a number key shortcut to the button
	var scNumKey=i+1;
	shortcut.remove(scNumKey.toString() );
	shortcut.add(scNumKey.toString(), function(event) {
	    // Run a preset triggered by pressing a number key on kbd
	    // Only if another timer is not running (safety)
	    if (!timerRunning) {
		// Presets are numbered from 0 but shortcut keys start at 1
		var presetNum = event.which - 49;
		$("#preset"+presetNum).trigger("click");
	    }
	},
	{'type':'keydown','disable_in_input':true} );
    }
    $("#version").html("JSTimer ver. "+jstVersion);
}
function goConfigure() {
    if(ticks>0) {
	if(!confirm("Are you sure you want to configure now?")) {
	    return (false);
	}
    }
    //window.location.href="configure.html";
    // Build config page from jstConfig
    var presetDiv=$("#cfgpre");
    for (var i=0, len=jstConfig.presets.length; i<len; i++) {
    	var p=jstConfig.presets[i];
	var pStr="<li class='ui-state-default' ><span class='ui-icon ui-icon-arrowthick-2-n-s'></sp an><input type='text' size=16 name='name' value='"+p.name+"'/><br/><input type='text' size=3 name='pres' value='"+p.pres+"'/> / <input type='text' size=3 name='qa' value='"+p.qa+"'/> <button class='remPre'>Del</button> <br/></li>";
	presetDiv.append(pStr);
    }
    $("input[name='presVoc']").val(jstConfig.presVocab);
    $("input[name='qaVoc']").val(jstConfig.qaVocab);
    // Sortable preset list
    $(".remPre").click( function(e) {
	$(this).closest("li").remove();
    });
    $("input[name='qasndon']").prop('checked', jstConfig.qasoundOn);

    $("#graphholder").hide();
    $("#textdiv").hide();
    $("#gui").hide();
    $("#configtable").show();
    $("#cfgpre").sortable();
    $("#addpre").click( function(e) {
	e.preventDefault();
	$("#cfgpre").append("<li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span><input type='text' size=16 name='name' /><br/><input type='text' size=3 name='pres' /> / <input type='text' size=3 name='qa'/> <br/></li>");
    });
    $("#cfgsave").click( function(e) {
        jstConfig.presets = [];
        var pElem=$("input[name='pres']");
        var qElem=$("input[name='qa']");
        var nElem=$("input[name='name']");
        jstConfig.presVocab=$("input[name='presVoc']").val();
        jstConfig.qaVocab=$("input[name='qaVoc']").val();

        for (var i=0, len=pElem.length; i<len; i++) {
            console.log("Saving preset "+i+", name: "+nElem.eq(i).val());
            jstConfig.presets[i]={
                name: nElem.eq(i).val(),
                pres: pElem.eq(i).val(),
                qa: qElem.eq(i).val()
            };
        }
        jstConfig.qasoundOn=$("input[name='qasndon']").is(':checked');
	saveConfig();
	$("#configuration").hide();
	$("#graphholder").show();
	$("#textdiv").show();
	$("#gui").show();
        window.location.href="index.html";
    });
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

// Javascript startup code - moved from HTMl file
document.addEventListener('DOMContentLoaded', function() {
    pageStartup();
    handleResize();

}, false);
