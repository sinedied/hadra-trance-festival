# Analytics

Analytics in this app are managed through the [Angulartics](http://angulartics.github.io/) library.

It is already pre-configured to track page views, and provided directives and a service to track app events.
Here is a quick usage documentation, you can read further information on the official website.

## Tracking events

### Declarative event tracking
    
The simplest way to do event tracking is by adding the attributes `analytics-on` and `analytics-event` to the element.
Think of it as: ***on*** 'click', track ***event*** 'name'.

```html
<a href="file.pdf" analytics-on="click" analytics-event="Download">Download</a>
```

### Inferred values

`analytics-on` always needs to be present, because it is the attribute that enables event tracking for the element.
All other attributes will be inferred if omitted.

```html
<!-- infers analytics-event from the element inner text -->
<a href="file.pdf" analytics-on="click">Download</a>

<!-- infers the analytics-on value from the element type; for anchor is 'click' -->
<a href="file.pdf" analytics-on>Download</a>

<!-- same as adding analytics-event="Step 3" -->
<input type="submit" value="Step 3" analytics-on>
```

### Additional parameters

As we use *Google analytics* for now, we can add additional tracking properties for events: `category` and `label`.

```html
<button analytics-on analytics-event="Play" analytics-category="Videos" analytics-label="Gone with the Wind">Play</button>
```

### Using the API

In order to track *pageviews* and *events* from within your application logic, inject `$analytics` and invoke either the
`pageTrack()` or `eventTrack()` methods.

```js
module.controller('SampleCtrl', function ($analytics) {
  $analytics.pageTrack('/my/url');
  $analytics.eventTrack('eventName');
  $analytics.eventTrack('eventName', {  category: 'category', label: 'label' });
});
```
