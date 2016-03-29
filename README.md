jstimer
=======

Download the latest release <a href="https://github.com/48kRAM/jstimer/releases/latest">here.</a>

A simple HTML5/JS countdown timer app for use in meetings and conferences.

My employer puts on an annual science symposium with a large number of attendees. We needed an easy-to-use session countdown timer with a simple display that speakers could understand that also worked off-line so it wasn't dependent on poor conference hotel wifi.

jstimer displays a large countdown timer along with a clock widget indicating the speaker's progress through the talk and Q&A time. Once the timer expires, jstimer flashes a large red indicator that the time is up and plays a "UN style" double beep.

jstimer has an auto-hiding GUI for selecting timer presets or entering a time manually. Once timing begins, the GUI is hidden so that an attractive countdown is shown to the speaker. Clicking on the counting time pauses the countdown and displays the GUI again. You can resume the countdown by clicking the "Resume Countdown" button and the GUI will once again disapper and the timer will contiue counting from the point at which it was paused. As of version 1.0, presets can be configured easily (no more editing the file) and will be saved for future use (preset are saved in HTML5 local storage).

There is a live demo version available on [my homepage](http://www.cv.nrao.edu/~jmalone/tools/jstimer/)

Usage
-----

jstimer can be configured with a number of timer "presets". To do this, click the "Configure" button at the bottom of the green control panel on the left-hand side of the screen. On the configuration screen, you can edit the names and times (in minutes) of the presets. Only 3 presets are available at this time. Click "Save settings" to save the new presets or "Cancel" to discard your changes.

The "full" jstimer uses Chart.js to display a clock-like widget behind the timer text. This widget shows the amount of time remaining in both the "Presentation" and "Q&A" parts of the session, whereas the bar graph in the "lite" version only shows total time. The "full" version is the most actively developed and is the one used in the OSX "app" release". Most people should use this version.

jstimer "lite" is a single-file HTML/javascript timer application. To use it, open it in the web browser of your choice (Firefox and Safari tested). For best results, set your browser in fullscreen mode and hide any toolbars. Use this version only if you really need a single-file timer. To change presets in the "lite" version you have to edit the timer.html file and change or add buttons for the timings you need.


Presentation vs. Q&A
--------------------

Often, conference talks consist of 2 parts:  a Presentation section and a Q&A section. jstimer makes it easy to break a talk into presentation and q&a sections. Once the Presentation timer expires, the clock automatically moves to the Q&A time and changes the display accordingly; it can also play a single chime at the start of Q&A (set in the configuration screen).

If you don't need the Q&A section, simply set the Q&A time to '0' in your buttons. If you want to temporarily disable the Q&A timer during the conference, uncheck the box for "Auto-advance to Q/A" in the gui.

Presets
-----

In the configuration screen, you can configure several preset timers with names such as "Keynote" or "Invited talk" etc. These presets configure the Presentation and Q&A times, in minutes. If you don't want a preset to have Q&A timer, simply leave that setting empty or set to zero. Presets are saved, along with the rest of the configuration options, in HTML5 local storage so they will persist across app sessions.