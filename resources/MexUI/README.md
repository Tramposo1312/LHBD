mexui - a UI API/GUI for GTA:Connected.

Free to use.

I recommend waiting for GTA:Connected to add support for partical/full HTML/CSS support for GUIs instead of using this resource.

This resource is just for if you need GUIs right now.

# Window
`mexui.window(x, y, w, h, title, styles);`

# Controls
*All of these return an object of the specified control type.*
* `window.button(x, y, w, h, text, styles, callback)`
* `window.character(x, y, w, h, text, styles, callback)`
* `window.characters(x, y, w, h, text, styles, callback)`
* `window.checkBox(x, y, w, h, text, styles, callback)`
* `window.day(x, y, w, h, text, styles, callback)`
* `window.date(x, y, w, h, text, styles, callback)`
* `window.digit(x, y, w, h, text, styles, callback)`
* `window.digits(x, y, w, h, text, styles, callback)`
* `window.dropDown(x, y, w, h, text, styles, callback)`
* `window.grid(x, y, w, h, styles)`
* `window.hour(x, y, w, h, text, styles, callback)`
* `window.image(x, y, w, h, filePath, styles)`
* `window.integer(x, y, w, h, text, styles, callback)`
* `window.letter(x, y, w, h, text, styles, callback)`
* `window.letters(x, y, w, h, text, styles, callback)`
* `window.letterDigit(x, y, w, h, text, styles, callback)`
* `window.lettersDigits(x, y, w, h, text, styles, callback)`
* `window.line(x, y, w, h, styles, callback)`
* `window.list(x, y, w, h, styles, callback)`
* `window.minute(x, y, w, h, text, styles, callback)`
* `window.month(x, y, w, h, text, styles, callback)`
* `window.number(x, y, w, h, text, styles, callback)`
* `window.password(x, y, w, h, text, styles, callback)`
* `window.progressBar(x, y, w, h, text, styles)`
* `window.radioButton(x, y, w, h, text, groupId, styles, callback)`
* `window.rangedInteger(x, y, w, h, text, min, max, styles, callback)`
* `window.rangedNumber(x, y, w, h, text, min, max, styles, callback)`
* `window.rectangle(x, y, w, h, styles, callback)`
* `window.scrollBar(x, y, w, h, isVertical, styles, callback)`
* `window.second(x, y, w, h, text, styles, callback)`
* `window.slider(x, y, w, h, isVertical, text, minText, maxText, styles, callback)`
* `window.tabPanel(x, y, w, h, styles, callback)`
* `window.text(x, y, w, h, text, styles)`
* `window.textArea(x, y, w, h, text, styles, callback)`
* `window.textInput(x, y, w, h, text, styles, callback)`
* `window.time(x, y, w, h, text, styles, callback)`
* `window.tree(x, y, w, h, styles, callback)`
* `window.week(x, y, w, h, text, styles, callback)`
* `window.year(x, y, w, h, text, styles, callback)`

# Controls Methods/Properties
*The term "element" here pertains to the object returned by all control types as listed above*
* `element.bindTo(element);`

# Styles
*Styles are used as objects, and apply designs to GUI components*
*Use sub objects (somewhat similar to CSS pseudo classes) for style transitions on specific actions, like hover*
Example:
```js
{
    main: {
        backgroundColour: toColour(0, 0, 0, 255),
        textColour: toColour(255, 255, 255, 255),
        hover: {
            backgroundColour: toColour(255, 255, 255, 255),
            textColour: toColour(0, 0, 0, 255),
            transitionTime: 500,
            transitionDelay: 0,
        }
    }
}
```
