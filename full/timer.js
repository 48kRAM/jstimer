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
	{name:'Contributed Talk', pres:15, qa:5}
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
