jstimer
=======

Download the latest release <a href="https://github.com/48kRAM/jstimer/releases/latest">here.</a>

A simple HTML/JS timer app for use in meetings and conferences.

My employer puts on an annual science symposium with a large number of attendees. We needed an easy-to-use session countdown timer with a simple display that speakers could understand that also worked off-line so it wasn't dependant on poor conference hotel wifi.

jstimer displays a large countdown clock along with a bar graph indicating the usage of total talk time (presentation and q&a) underneath it. Once the timer expires, jstimer flashes a large red inicator that the time is up.

jstimer has an auto-hiding GUI for selecting timer presets or entering a time manually. Once timing begins, the GUI is hidden so that an attractive countdown is shown to the speaker. Clicking on the counting time pauses the countdown and displays the GUI again. You can resume the countdown by clicking the "Resume Countdown" button and the GUI will once again disapper and the timer will contiue counting from the point at which it was paused.

There is a live demo version available at http://www.cv.nrao.edu/~jmalone/tools/jstimer/timer.html

Usage
-----

jstimer lite is a single-file HTML/javascript timer application. To use it, open it in the web browser of your choice (Firefox and Safari tested). For best results, set your browser in fullscreen mode and hide any toolbars.

jstimer comes configured with a number of timer "preset" useful to me, but you'll probably want to configure it for your desired timings. To do this, simply edit the timer.html file and add in buttons for the timings you need. Near the bottom of the file, you'll see a number of button elements defined. Each one includes an onClick event which starts the timer with a specific countdown time. You can edit any of the existing buttons to set the timings you need.

The "full" jstimer uses Chart.js to display a clock-like widget behind the timer text. This widget shows the amount of time remaining in the session just like the bar graph does in the "lite" version. Use this version if you don't mind having to deal with more than one file in the application.


Presentation vs. Q&A
--------------------

Often, conference talks consist of 2 parts:  a Presentation section and a Q&A section. jstimer makes it easy to break a talk into presentation and q&a sections. Once the Presentation timer expires, the clock automatically moves to the Q&A time and changes the display accordingly.

If you don't need the Q&A section, simply set the Q&A time to '0' in your buttons. If you want to temporarily disable the Q&A timer during the conference, uncheck the box for "Auto-advance to Q/A" in the gui.
