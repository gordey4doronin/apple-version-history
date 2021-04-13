const appleVersionHistory = require('./../dist/src/index');

console.log('iOS versions builds:');
appleVersionHistory.listIosVersionsBuilds().forEach(group => {
    group.forEach(x => console.log(x));
    console.log(); // newline
});

console.log('macOS versions builds:');
appleVersionHistory.listMacosVersionsBuilds().forEach(group => {
    group.forEach(x => console.log(x));
    console.log(); // newline
});

console.log('tvOS versions builds:');
appleVersionHistory.listTvosVersionsBuilds().forEach(group => {
    group.forEach(x => console.log(x));
    console.log(); // newline
});
