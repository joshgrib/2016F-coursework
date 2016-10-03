
## Class notes 9-26-16

### HW1
* Can use HTML tables for calendar
* Use express with electron
    * Yes this is a slight antipattern
* Yes you should make the calendar in a 7 col grid

### What is a component?
* Plugability
* Isolate functionality and data
* Modular (access points)
* Perform one thing (generally speaking)
* Reusable

### JQuery
* The beginning
    * DOM manipulation
    * Ajax
    * Cross-browser
* JQuery UI
    * Way overused today
    * A series of plugins to make "components"
        * This can be bad because you can use it to create DOM elements and 
        change them, so you end up mixing your views and models, and work 
        against the benefits of compartmentalization and isolating your concerns

### Web components
* Currently experimental, browser-native web components
* The problem is each browser wants to use their implementation, so they all 
have different competing ways to do things
* A modern web component (modern frontend component) needs:
    * Templating
    * Abstraction
    * Modularity
* Which would enable
    * Custom elements
    * HTML templates
    * Shadow DOM

When we build out web components, we want to make a distinction between the 
view and the logic

Web development has a big history of "Fake it until you make it" and this is 
true for components too. The "components" we have now are not truly components,
they're mostly smoke and mirrors to give the same interfase, but often with
an inconvenient implementation.

A lot of problems came up from having to do this. Classes and IDs are used for
both semantic meaning and styling, but then also for JS work. Any change to the
HTML layout, the style, or the javascript means changes to all of them, or else
they won't match up anymore

### Attempts as solutions
* **Angular**
    * Directives
    * Custom elements
    * As of recently, components (Done kay, not well)
* **React**
    * Focusses on views
    * Makes better components
    * At the end of the day, it's basically an element state manager. You
    control things based on the state of the element, which can also trigger
    javascript methods
    * Does diffing for rendering - only makes the changes it needs to, making
    it render a lot faster

### Lecture code
* .jsx files
    * Not valid javascript, like how SASS is not valid CSS
    * Generates the actual javascript files
    * **Babel** takes new-age javascript and turns it into the old javascript
    so you get newer syntax and abilities, and it will work with old tech
        * The humor here is that the "old" tech is the current tech. It's just
        not advancing as fast as it needs to
        * Can help you get away from promises and write better async code in
        a synchronous style
* the vendor folder and vendor.js
    * Combines all dependencies into one file so it's a single request and
    download

### Misc notes
* Check out redux and flux as React architectures
* Maybe use flow - a static type checker for JS

## Class notes 10-03-16

### Changes to assignment 1
* You can use or not use pretty much whatever, but you need to make a custom 
grid and use it somewhere
    * You can just make a 7 column grid for the calendar and do bootstrap
    everywhere else
* You need to:
    * Make a custom grid that you use somewhere
    * Make the assignment as described
* Add a way to get back to the month view from the other view(s)
* Calendar data can be stored in any way, just a big JSON array of dates and
events works fine

### Terms
* A **web role** handles access to data though an API/UI, this is our server
that takes and handles requests
* A **worker role** handles computation - these are useful to do heavy
computing without blocking the server


**Note:** just realizing that the reason I keep putting off doing web dev
homework is probably because I'm doing web development at work all day so then
I don't want to do it more. Maybe time to start thinking differently or taking
a new approach