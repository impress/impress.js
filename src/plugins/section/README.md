Section plugin
==============

Sections for impress.js presentations

Usage
-----

Add `<section>` and `<h1>` tags to group your steps as you can see here:

```html
<div id="title" class="step">
    <h1>Title of Presentation</h1>

    <p>Our agenda for today:</p>
    <ul id="impress-section-agenda"></ul>
</div>

<section>
  <h1>Section Title</h1>
  <div id="first-slide" class="step">

  </div>

  <!-- Nested sections are supported as well -->
  <section>
    <h1>Sub Section Title</h1>
    <div id="second-slide" class="step">

    </div>
  </section>
</section>
```

The section name and the current index of the section will be displayed in your presentation.
Therefore, add a div for displaying the current section and/or progress as you can see it here:


```html
<div id="impress-section-overview">
    <div class="impress-section-numbers"></div>
    <div class="impress-current-section"></div>
</div>
```

```css
#impress-section-overview {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}

#impress-section-overview .impress-section-numbers {
    display: inline-block;
    margin-top: .25em;
    padding: .1em .25em;
    color: white;
    background: #aaa;
}

#impress-section-overview .impress-current-section {
    padding-left: 5px;
}

#impress-section-overview .impress-current-section .section-spacer {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
}
```

Feel free to change the style of your section overview as you like by editing the CSS file.

Additionally, the plugin will generate an agenda outline for you if you want it to. Therefore, add a `ul` tag with the 
id `impress-section-agenda` to any of your divs of the presentation (as shown in the aforementioned HTML snippet).

Furthermore, this plugin adds the class `active-section` to all steps of the action section and `hidden-section` to all
steps that do not belong to this section. You can use this classes, e.g. to hide the steps of another section:

```css
.step.hidden-section {
    opacity: 0;
}
```

Author
------

Copyright 2020: Marc Schreiber (@schrieveslaach)
