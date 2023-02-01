//@ts-nocheck

const path = require('path');
const fs = require('fs');
const Mocha = require('mocha');
const { questionSetup } = require('test/utils/qsData');

let mocha = new Mocha({
    reporter: 'mochawesome',
    reporterOptions: {
    reportFilename:'mocha-dos6',
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


mocha.addFile(path.join(__dirname, 'chooseAgreement.test.ts'));
mocha.addFile(path.join(__dirname, 'dnameYourProject.test.ts'));
mocha.addFile(path.join(__dirname, 'daddcolabrator.test.ts'));
mocha.addFile(path.join(__dirname, 'contextQuestionsGet.test.ts'));
 mocha.addFile(path.join(__dirname, 'uploadDocs.test.ts'));
mocha.addFile(path.join(__dirname, 'assessmentQuestionsGet.test.ts'));
mocha.addFile(path.join(__dirname, 'scoringCriteria.test.ts'));
mocha.addFile(path.join(__dirname, 'timeLine.test.ts'));
 mocha.addFile(path.join(__dirname, 'reviewAndpublish.test.ts'));

mocha.run().on('fail', function(test, err) {
    console.log('Test fail');
    console.log(test.title);
    //console.log(err);
}).on('end', function() {
    console.log('All done');
});


// require('test/utils/qsData').getqs().then(function () {  })

