jstimer
=======

A simple HTML/JS timer web app for use in meetings and conferences.

My employer puts on an annual science symposium with a large number of attendees. We needed an easy-to-use session countdown timer with a simple display that speakers could understand that also worked off-line so it wasn't dependant on poor conference hotel wifi.

jstimer displays a large countdown clock along with a bar graph indicating the usage of total talk time (presentation and q&a) underneath it. Once the timer expires, jstimer flashes a large red inicator that the time is up.

Usage
-----

jstimer comes configured with a number of timer "preset" useful to me, but you'll probably want to configure it for your desired timings. To do this, simply edit the timer.html file and add in buttons for the timings you need. Near the bottom of the file, you'll see a number of button elements defined. Each one includes an onClick event which starts the timer with a specific countdown time. You can edit any of the existing buttons to set the timings you need.

Presentation vs. Q&A
--------------------

Often, conference talks consist of 2 parts:  a Presentation section and a Q&A section. jstimer makes it easy to break a talk into presentation and q&a sections. Once the Presentation timer expires, the clock automatically moves to the Q&A time and changes the display accordingly.

If you don't need the Q&A section, simply set the Q&A time to '0' in your buttons. If you want to temporarily disable the Q&A timer, uncheck the box for "Auto-advance to Q/A" in the gui.
