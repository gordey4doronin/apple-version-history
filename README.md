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

```js
const appleVersionHistory = require('./../dist/index');

appleVersionHistory.listIosVersionsBuilds().forEach(group => {
    group.forEach(x => console.log(x));
    console.log(); // newline
});
```

```js
// iPhone OS 1.0 (1A543a)
// iPhone OS 1.0.1 (1C25)
// iPhone OS 1.0.2 (1C28)

// iPhone OS 1.1 (3A100a)
// iPhone OS 1.1 (3A101a)
// iPhone OS 1.1.1 (3A109a)
// iPhone OS 1.1.1 (3A110a)
// iPhone OS 1.1.2 (3B48b)
// iPhone OS 1.1.3 (4A93)
// iPhone OS 1.1.4 (4A102)
// iPhone OS 1.1.5 (4B1)

// iPhone OS 2.0 (5A347)
// iPhone OS 2.0.1 (5B108)
// iPhone OS 2.0.2 (5C1)

// iPhone OS 2.1 (5F136)
// iPhone OS 2.1 (5F137)
// iPhone OS 2.1 (5F138)
// iPhone OS 2.1.1 (5F136)
// iPhone OS 2.1.1 (5F137)
// iPhone OS 2.1.1 (5F138)

// iPhone OS 2.2 (5G77)
// iPhone OS 2.2 (5G77a)
// iPhone OS 2.2.1 (5H11)
// iPhone OS 2.2.1 (5H11a)

// iPhone OS 3.0 (7A341)
// iPhone OS 3.0.1 (7A400)

// iPhone OS 3.1 (7C144)
// iPhone OS 3.1 (7C145)
// iPhone OS 3.1 (7C146)
// iPhone OS 3.1.1 (7C144)
// iPhone OS 3.1.1 (7C145)
// iPhone OS 3.1.1 (7C146)
// iPhone OS 3.1.2 (7D11)
// iPhone OS 3.1.3 (7E18)

// iPhone OS 3.2 (7B367)
// iPhone OS 3.2.1 (7B405)
// iPhone OS 3.2.2 (7B500)

// iOS 4.0 (8A293)
// iOS 4.0.1 (8A306)
// iOS 4.0.2 (8A400)

// iOS 4.1 (8B117)

// iOS 4.2.1 (8C148)
// iOS 4.2.1 (8C148a)
// iOS 4.2.5 (8E128)
// iOS 4.2.6 (8E200)
// iOS 4.2.7 (8E303)
// iOS 4.2.8 (8E401)
// iOS 4.2.9 (8E501)
// iOS 4.2.10 (8E600)

// iOS 4.3 (8F190)
// iOS 4.3 (8F191)
// iOS 4.3.1 (8G4)
// iOS 4.3.2 (8H7)
// iOS 4.3.2 (8H8)
// iOS 4.3.3 (8J2)
// iOS 4.3.3 (8J3)
// iOS 4.3.4 (8K2)
// iOS 4.3.5 (8L1)

// iOS 5.0 (9A334)
// iOS 5.0.1 (9A405)
// iOS 5.0.1 (9A406)

// iOS 5.1 (9B176)
// iOS 5.1 (9B179)
// iOS 5.1.1 (9B206)
// iOS 5.1.1 (9B208)

// iOS 6.0 (10A403)
// iOS 6.0 (10A405)
// iOS 6.0 (10A406)
// iOS 6.0.1 (10A523)
// iOS 6.0.1 (10A525)
// iOS 6.0.1 (10A8426)
// iOS 6.0.2 (10A550)
// iOS 6.0.2 (10A551)
// iOS 6.0.2 (10A8500)

// iOS 6.1 (10B141)
// iOS 6.1 (10B142)
// iOS 6.1 (10B143)
// iOS 6.1 (10B144)
// iOS 6.1.1 (10B145)
// iOS 6.1.2 (10B146)
// iOS 6.1.2 (10B147)
// iOS 6.1.3 (10B329)
// iOS 6.1.4 (10B350)
// iOS 6.1.5 (10B400)
// iOS 6.1.6 (10B500)

// iOS 7.0 (11A465)
// iOS 7.0 (11A466)
// iOS 7.0.1 (11A470a)
// iOS 7.0.2 (11A501)
// iOS 7.0.3 (11B511)
// iOS 7.0.4 (11B554a)
// iOS 7.0.5 (11B601)
// iOS 7.0.6 (11B651)

// iOS 7.1 (11D167)
// iOS 7.1 (11D169)
// iOS 7.1.1 (11D201)
// iOS 7.1.2 (11D257)

// iOS 8.0 (12A365)
// iOS 8.0 (12A366)
// iOS 8.0.1 (12A402)
// iOS 8.0.2 (12A405)

// iOS 8.1 (12B410)
// iOS 8.1 (12B411)
// iOS 8.1.1 (12B435)
// iOS 8.1.1 (12B436)
// iOS 8.1.2 (12B440)
// iOS 8.1.3 (12B466)

// iOS 8.2 (12D508)

// iOS 8.3 (12F69)
// iOS 8.3 (12F70)

// iOS 8.4 (12H143)
// iOS 8.4.1 (12H321)

// iOS 9.0 (13A340)
// iOS 9.0 (13A342)
// iOS 9.0 (13A343)
// iOS 9.0 (13A344)
// iOS 9.0.1 (13A404)
// iOS 9.0.1 (13A405)
// iOS 9.0.2 (13A452)

// iOS 9.1 (13B143)

// iOS 9.2 (13C75)
// iOS 9.2.1 (13D15)
// iOS 9.2.1 (13D20)

// iOS 9.3 (13E233)
// iOS 9.3 (13E234)
// iOS 9.3 (13E236)
// iOS 9.3 (13E237)
// iOS 9.3.1 (13E238)
// iOS 9.3.2 (13F69)
// iOS 9.3.2 (13F72)
// iOS 9.3.3 (13G34)
// iOS 9.3.4 (13G35)
// iOS 9.3.5 (13G36)

// iOS 10.0 (14A403)
// iOS 10.0 (14A346)
// iOS 10.0.2 (14A456)
// iOS 10.0.3 (14A551)

// iOS 10.1 (14B72)
// iOS 10.1 (14B72c)
// iOS 10.1.1 (14B100)
// iOS 10.1.1 (14B150)

// iOS 10.2 (14C92)
// iOS 10.2.1 (14D27)

// iOS 10.3 (14E277)
// iOS 10.3.1 (14E304)
// iOS 10.3.2 (14F89)
// iOS 10.3.2 (14F8089)
// iOS 10.3.2 (14F90)
// iOS 10.3.2 (14F91)
// iOS 10.3.3 (14G60)

// iOS 11.0 (15A372)
// iOS 11.0.1 (15A402)
// iOS 11.0.1 (15A403)
// iOS 11.0.1 (15A8391)
// iOS 11.0.2 (15A421)
// iOS 11.0.3 (15A432)

// iOS 11.1 (15B93)
// iOS 11.1 (15B101)
// iOS 11.1.1 (15B150)
// iOS 11.1.2 (15B202)

// iOS 11.2 (15C114)
// iOS 11.2.1 (15C153)
// iOS 11.2.2 (15C202)
// iOS 11.2.5 (15D60)
// iOS 11.2.6 (15D100)

// iOS 11.3 (15E216)
// iOS 11.3 (15E218)
// iOS 11.3.1 (15E302)

// iOS 11.4 (15F79)
```