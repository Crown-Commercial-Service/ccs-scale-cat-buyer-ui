//@ts-nocheck

const path = require('path');
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

mocha.addFile(path.join(__dirname, 'chooseAgreement.test.ts'));
mocha.addFile(path.join(__dirname, 'dnameYourProject.test.ts'));
mocha.addFile(path.join(__dirname, 'daddcolabrator.test.ts'));
mocha.addFile(path.join(__dirname, 'contextQuestionsGet.test.ts'));
mocha.addFile(path.join(__dirname, 'contextQuestionsPost.test.ts'));
mocha.addFile(path.join(__dirname, 'uploadDocs.test.ts'));
mocha.addFile(path.join(__dirname, 'assessmentQuestionsGet.test.ts'));
mocha.addFile(path.join(__dirname, 'assessmentQuestionsPost.test.ts'));
mocha.addFile(path.join(__dirname, 'scoringCriteria.test.ts'));
mocha.addFile(path.join(__dirname, 'timeLine.test.ts'));
mocha.addFile(path.join(__dirname, 'reviewAndpublish.test.ts'));

Promise.all([questionSetup(3),questionSetup(2)]).then((values) => {
    mocha.run().on('fail', function(test, err) {
        // console.log(test.title);
        // console.log(err);
    }).on('end', function() {
        console.log('-----All done-----');
    });
});
