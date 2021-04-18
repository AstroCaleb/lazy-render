/*!
 * lazy-render.js v1.1.0
 * https://github.com/AstroCaleb/lazy-render
 *
 * Copyright 2021-Present Caleb Dudley
 * Released under the MIT license
 */
class LazyRender {
    /**
     * Create a new LazyRender instance.
     * @param {Object} [options={}] - The configuration options.
     */
    constructor(options = {}) {
        if (options.distanceThreshold !== undefined && typeof options.distanceThreshold !== 'number') {
            throw new Error('The distance from viewport for rendering must be a a number, preferably 0-100. A default value of 50 is used if this is not defined. 0 being that the element will render when immediately outside the viewport. 100 being where the element is 100% the viewport height or width away from being in view when rendered.');
        }

        this.options = options;
        this.threshold = options.distanceThreshold || 50;
        this.callback = options.callback || function(){};
        this.lazyRenderThrottleTimeout;

        let existingStyleTags = document.getElementsByTagName('style');
        let customStyleTagExists = false;
        for (let tag of existingStyleTags) {
            (tag.dataset.lazyRenderStyle) && (customStyleTagExists = true);
        }

        if (!customStyleTagExists) {
            let delayItemCSS = `
                @keyframes lazyRenderDelayElementIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                [data-lazy-render] { opacity: 0 !important; }
                [data-lazy-render].fade-in { animation: lazyRenderDelayElementIn 0.4s ease 0.3s normal forwards; }
            `;
            let documentHead = document.head || document.getElementsByTagName('head')[0];
            let styleTag = document.createElement('style');
            styleTag.setAttribute('data-lazy-render-style', 'lazy-render');
            styleTag.appendChild(document.createTextNode(delayItemCSS));
            documentHead.appendChild(styleTag);
        }

        let elementNearOrInView = (el) => {
            let rect = el.getBoundingClientRect();
            let windowHeight = (window.innerHeight || document.documentElement.clientHeight);
            let windowWidth = (window.innerWidth || document.documentElement.clientWidth);

            // If the element is within a specified distance of the viewport
            return (
                rect.top >= (0 - (windowHeight * (this.threshold * 0.01))) &&
                rect.left >= (0 - (windowWidth * (this.threshold * 0.01))) &&
                rect.bottom <= (windowHeight + (windowHeight * (this.threshold * 0.01))) &&
                rect.right <= (windowWidth + (windowWidth * (this.threshold * 0.01)))
            );
        };

        let lazyRender = () => {
            if (this.lazyRenderThrottleTimeout) {
                clearTimeout(this.lazyRenderThrottleTimeout);
            }

            this.lazyRenderThrottleTimeout = setTimeout(() => {
                document.querySelectorAll('[data-lazy-render]').forEach((el) => {
                    if (elementNearOrInView(el)) {
                        try {
                            let newAttr = el.dataset.lazyRender.split(';')
                            el[newAttr[0]] = newAttr[1];
                        } catch (e) {}

                        if (!el.classList.contains('fade-in')) {
                            el.classList.add('fade-in');
                            this.callback();
                        }

                        setTimeout(() => {
                            el.classList.remove('fade-in');
                            delete el.dataset.lazyRender;
                        }, 700);
                    }
                });

                if (!document.querySelectorAll('[data-lazy-render]').length) {
                    document.removeEventListener('DOMContentLoaded', lazyRender, false);
                    window.removeEventListener('scroll', lazyRender, false);
                    window.removeEventListener('load', lazyRender, false);
                    window.removeEventListener('resize', lazyRender, false);
                    window.removeEventListener('orientationChange', lazyRender, false);
                }
            }, 10);
        };

        if (document.querySelectorAll('[data-lazy-render]').length) {
            document.addEventListener('DOMContentLoaded', lazyRender, false);
            window.addEventListener('scroll', lazyRender, false);
            window.addEventListener('load', lazyRender, false);
            window.addEventListener('resize', lazyRender, false);
            window.addEventListener('orientationChange', lazyRender, false);
        }
    }
}

export default LazyRender;
