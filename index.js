var regression = require('regression');

var data = require('./data.json');
var lessData = data.filter((line, i) => i % 100 === 0);

var dataSeries = lessData.map((line, index) => ([
    index, // (new Date(line[2])).getTime(),
    line[0]
]))

regression('linear', dataSeries)

dataSeries.forEach((line, i) => {
    if (i < 50) {
        return;
    }

    console.log([].concat(
        line,
        regression('linear', dataSeries.slice(i - 10, i)).equation[0] > 0.0075
    ));
})

// lessData.forEach((line, i) => {
//     console.log(i)

//     console.log(lessData.slice(i, Math.max(i - 50, 0)).map(l => [
//         new Date(l[2]).getTime(),
//         l[0]
//     ]))

//     // console.log(regression(
//     //     'linear',
//     //     lessData.slice(i, Math.max(i - 50, 0)).map(l => [
//     //         new Date(l[2]).getTime(),
//     //         l[0]
//     //     ])
//     // ))
// })