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

mocha.addFile(path.join(__dirname, 'rfiAddContextPost.test.ts'));

Promise.all([questionSetup(1)]).then((values) => {
    mocha.run()
   
    .on('fail', function(test, err) {
        console.log('Test fail');
        //console.log(test.title);
        //console.log(err);
    })
    .on('end', function() {
        console.log('All done');
    });
});


