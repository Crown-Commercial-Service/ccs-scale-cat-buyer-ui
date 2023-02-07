//@ts-nocheck

const path = require('path');
const fs = require('fs');
const Mocha = require('mocha');
const { questionSetup } = require('test/utils/mcf/rfi/qsData');

let mocha = new Mocha({
    reporter: 'mochawesome',
    reporterOptions: {
    reportFilename:'mocha-MCF-RFI',
    inlineAssets:true,
    reportTitle:'CAS-buyer-frontend-unit-test-all',
    quiet: true,
    json:false
    },
});

// fs.readdirSync(__dirname).filter(function(file){
//     return file.substr(-8) === '.test.ts';
// }).forEach(function(file){
//     mocha.addFile(path.join(__dirname, file));
// });

console.log("__dirname",__dirname);

// mocha.addFile(path.join(__dirname, 'chooseAgreement.test.ts'));
// mocha.addFile(path.join(__dirname, 'dnameYourProject.test.ts'));
// mocha.addFile(path.join(__dirname, 'daddcolabrator.test.ts'));
// mocha.addFile(path.join(__dirname, 'contextQuestionsGet.test.ts'));
//  mocha.addFile(path.join(__dirname, 'uploadDocs.test.ts'));
// mocha.addFile(path.join(__dirname, 'assessmentQuestionsGet.test.ts'));
// mocha.addFile(path.join(__dirname, 'scoringCriteria.test.ts'));
// mocha.addFile(path.join(__dirname, 'timeLine.test.ts'));
//  mocha.addFile(path.join(__dirname, 'reviewAndpublish.test.ts'));
<<<<<<< HEAD
//mocha.addFile(path.join(__dirname, 'rfiNameAproject.test.ts'));
mocha.addFile(path.join(__dirname, 'rfiAddCollabarator.test.ts'));
=======
mocha.addFile(path.join(__dirname, 'rfiAddContext.test.ts'));
//path1 = path.join("users/admin/files", "index.html");
>>>>>>> c2111b3d8f3c627bd8564e15933ecdf976be2155

Promise.all([questionSetup(1)]).then((values) => {
    mocha.run()
    // .on('test', function(test) {
    //     console.log('Test started: '+test.title);
    // })
    // .on('test end', function(test) {
    //     console.log('Test done: '+test.title);
    // })
    // .on('pass', function(test) {
    //     console.log('Test passed');
    //     console.log(test.title);
    // })
    .on('fail', function(test, err) {
        console.log('Test fail');
        //console.log(test.title);
        //console.log(err);
    })
    .on('end', function() {
        console.log('All done');
    });
});

// mocha.run().on('fail', function(test, err) {
//     console.log('Test fail 111111');
//     //console.log(test.title);
//     //console.log(err);
// }).on('end', function() {
//     console.log('All done');
// });


// require('test/utils/qsData').getqs().then(function () {  })

