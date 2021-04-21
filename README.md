# lazy-render

[![Size](https://img.shields.io/github/size/astrocaleb/lazy-render/dist/lazy-render.min.js)](https://www.npmjs.com/package/@astrocaleb/lazy-render)
![npm](https://img.shields.io/npm/dw/@astrocaleb/lazy-render)

> A super simple lazy render script for whatever element(s) you want.

## Getting started

```text
dist/
├── lazy-render.js
└── lazy-render.min.js
```

### Installation

```bash
# npm
npm i @astrocaleb/lazy-render
```

In browser:

```html
<script src="/path/to/lazy-render.js"></script>
```

### Usage

#### Markup Structure

```html
<... data-lazy-render="<attribute>;<value>" ...>
```

#### JS Syntax

```js
new LazyRender([options])
```

- **options** (optional)
  - Type: `Object`
  - The options for rendering. Check out the available [options](#options).

#### Example

```html
<img data-lazy-render="src;picture-1.jpg">
<img data-lazy-render="src;picture-1.jpg">
<img data-lazy-render="src;picture-2.jpg">
<img data-lazy-render="src;picture-3.jpg">
```

```js
import LazyRender from '@astrocaleb/lazy-render';

// Delay rendering of elements, all default values
new LazyRender();

// or

// Delay rendering, passing in options
new LazyRender({
  threshold: 75,
  callback: function() {
    alert("I rendered!");
  }
});
```

## Options

You can set LazyRender options with `new LazyRender(options)`.

### threshold

- Type: `Number`
- Default: `50`

Adjust when elements load, relative to the viewport. Threshold is a percentage of the viewport height and width, similar to the CSS `vh` or `vw` unit.

### callback

- Type: `Function`
- Default: no-op

Callback that fires immediately after the element is set to render.

## License

MIT
