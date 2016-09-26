# SVGPathPainter
A jQuery plugin that animates SVG paths in handdrawn style.

## Version
1.0.1

## Changelog
### Version 1.0.1
The selector for paths to animate was changed to be less rigid. Now, animateable paths can be specifically defined in the SVG by giving them the class `ssp`. A group of paths can be addressed when wrapped in a `<g class="ssp">`. Formerly (in v1.0.0), such a group plus a class on each path was required.

## Howto
See the [Github page](https://eckify.github.io/SVGPathPainter) for information and examples.

## TODOs
* Documentation / readme
* Add further hints for SVG file preparation and processing to the Github page

## Possible Features
* Reverse mode
* Group delay
* Option: automatic sorting of groups by x-coordinates
