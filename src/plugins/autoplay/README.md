# Autoplay

The [autoplay](/src/plugins/autoplay/autoplay.js) plugin automatically advances the presentation after a certain timeout expired. 

## USAGE

You first have to enable the plugin by setting a global ```data-autoplay``` value on the impress-div. Then you can change individual ```data-autoplay``` values on each *step* by adding ```data-autoplay``` to it. If this value is set to ```0```, there will be no more auto-advancing on this *step*. The value you enter is time in seconds to switch to the next slide.

## EXAMPLE

Note: This only shows part of the HTML. If you want to know how to set up a presentation, I highly recommend you read our [Getting Started Guide](/GettingStarted.md)
```
<div id=impress data-autoplay="5">
    <div class="step" data-autoplay="0">
        This slide will not auto-advance
    </div>
     <div class="step">
        This slide will auto-advance at the globally defined rate.
    </div>
     <div class="step" data-autoplay="10">
        This slide will auto-advance after 10 seconds
    </div>
</div>
```