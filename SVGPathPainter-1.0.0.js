/**
 * SVGPathPainter
 * A jQuery plugin that animates SVG paths to look like handdrawn.
 *
 * @version 1.0.0
 * @license MIT
 * @author Sebastian Eck
 */
(function () {
    SVGPathPainter = new function () {
        /**
         * Class representing a path in an SVG
         * @param elem The HTML element (not jQuery)
         * @param delay The delay after which the animation starts
         * @param speed The speed factor for animation duration
         * @constructor
         */
        this.Path = function (elem, delay, speed) {
            var cssTransition;

            this.pathLength = elem.getTotalLength();
            this.$elem = $(elem)
                .css({
                    '-webkit-transition': 'none',
                    'transition': 'none'
                })
                .attr({
                    'stroke-dashoffset': this.pathLength,
                    'stroke-dasharray': this.pathLength
                });
            this.delay = delay;
            this.speed = speed;
            this.duration = Math.floor( this.pathLength * this.speed);
            // FF workaround: set the stroke width to 0 and reset it when animation begins,
            // because FF would show dots at path starts otherwise
            this.strokeWidth = this.$elem.css('stroke-width');
            this.$elem.css('stroke-width', 0);

            cssTransition = 'stroke-dashoffset ' + this.duration + 'ms ' + this.delay + 'ms linear, '+
                'stroke-width 0ms ' + this.delay + 'ms linear';

            this.paint = function () {
                this.$elem
                    .css({
                        'stroke-width': this.strokeWidth,
                        '-webkit-transition': cssTransition,
                        'transition': cssTransition
                    })
                    .attr('stroke-dashoffset', '0');
            };
        };
        /**
         * Plugin methods. 'this' refers to the plugin instance.
         * Call methods like $('#elem').plugin('method');
         */
        this.methods = {
            /**
             * Initializes the plugin. Called when no method name
             * was passed as a string in the plugin call.
             * @param options
             * @returns {*}
             */
            init: function (options) {
                var me = this,
                    defaults = {
                        initialDelay: 300,
                        pathDelay: 50,
                        speed: 1.5
                    };
                /**
                 * Holds all found paths as SVGPathPainter.Path objects
                 * @type {Array}
                 */
                me.paths = [];

                // just some defaults
                if (typeof options !== 'undefined') {
                    me.options = $.extend(defaults, options);
                }
                else {
                    me.options = defaults;
                }

                return me.each(function (index, selector) {
                    var $svg, $paths, pths, pth, animatePaths, pathDelay, i, pathDuration, pathPrevDuration;

                    /**
                     * The currently handled SVG the plugin is called with
                     * @type {*|jQuery|HTMLElement}
                     */
                    $svg = $(this);
                    /**
                     * The path elements in the current SVG
                     * @type {*|jQuery|HTMLElement}
                     */
                    $paths = $('g.spp path.spp', $svg);
                    /**
                     * Holds all found paths as SVGPathPainter.Path objects
                     * @type {Array}
                     */
                    pths = [];
                    /**
                     * Delay for a path to animate; changes with iteration over paths
                     * @type {number}
                     */
                    pathDelay = 0;
                    /**
                     * Calls animation of the current SVG's paths
                     */
                    animatePaths = function () {
                        var i;
                        for (i = 0; i < $paths.length; i++) {
                            pths[i].paint();
                        }
                    };

                    /*
                     * Iterate through the current SVG's paths
                     */
                    for (i = 0; i < $paths.length; i++) {
                        // use 0 or the value of pathDuration used for the previous path
                        pathPrevDuration = pathDuration || 0;
                        // set this path's aniamtion delay to the prvious duration plus the pathDelay
                        pathDelay += pathPrevDuration + me.options.pathDelay;
                        // create a SVGPathPainter.Path new object
                        pth = new SVGPathPainter.Path($paths[i], pathDelay, me.options.speed);
                        // ...and store it
                        pths.push(pth);
                        // remember this path's duration for the next path
                        pathDuration = pth.duration;
                    }
                    me.paths[index] = pths;
                    // animate the path after the set initial delay
                    if (me.options.initialDelay !== false) {
                        window.setTimeout(animatePaths, me.options.initialDelay);
                    }
                });
            },

            paint: function () {
                var me = this;

                return me.each(function (index, selector) {
                    var i, j;
                    for (i = 0; i < me.paths.length; i++) {
                        for (j = 0; j < me.paths[i].length; j++) {
                            me.paths[i][j].paint();
                        }
                    }
                });
            }
        };
        /**
         * Define the basic plugin
         * @param methodOrOptions A plugin method to call or options to initialize the plugin
         * @returns {*}
         */
        this.plugin = function (methodOrOptions) {
            if (SVGPathPainter.methods[methodOrOptions]) {
                return SVGPathPainter.methods[ methodOrOptions ].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
                // Default to "init"
                return SVGPathPainter.methods.init.apply(this, arguments);
            }
            else {
                console.error('Method ' + methodOrOptions + ' does not exist in jQuery.SVGPathPainter');
                return false;
            }
        }
    };
    /**
     * Actually initialize plugin
     */
    $.fn.SVGPathPainter = SVGPathPainter.plugin;
}());