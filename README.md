# apple-version-history

### Build (under macOS)
```bash
npm run build
```

### Build and run (under macOS)

```bash
npm run build && node examples/examples.js
```

### Examples

#### iOS

```js
const appleVersionHistory = require('./../dist/index');
appleVersionHistory.listIosVersionsBuilds().forEach(group => {
    group.forEach(x => console.log(x));
    console.log(); // newline
});

// iPhone OS 1.0 (1A543a)
// ...

// ...
// ...
// ...

// iOS 11.4 (15F79)
```

#### macOS

```js
const appleVersionHistory = require('./../dist/index');
appleVersionHistory.listMacosVersionsBuilds().forEach(group => {
    group.forEach(x => console.log(x));
    console.log(); // newline
});

// Mac OS X 10.0 (4K78)
// ...

// ...
// ...
// ...

// OS X 10.11 (15A284)
// ...
// ...

// ...
// macOS 10.13.5 (17F77)
```

#### tvOS

```js
const appleVersionHistory = require('./../dist/index');
appleVersionHistory.listTvosVersionsBuilds().forEach(group => {
    group.forEach(x => console.log(x));
    console.log(); // newline
});

// tvOS 9.0 (13T396)
// ...

// ...
// ...
// ...

// ...
// tvOS 11.4 (15L577)
```
