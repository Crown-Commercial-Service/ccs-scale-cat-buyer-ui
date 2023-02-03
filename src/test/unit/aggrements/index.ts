//@ts-nocheck

const path = require('path');
const fs = require('fs');
const Mocha = require('mocha');
//const { questionSetup } = require('test/utils/mcf/rfi/qsData');
const { getProcurmentJson } = require('test/utils/getJson');
//const { questionSetup } = require('test/utils/mcf/rfi/qsData');

let mocha = new Mocha({
    reporter: 'mochawesome',
    reporterOptions: {
    reportFilename:'mocha-MCF',
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


 //mocha.addFile(path.join("src/test/unit/aggrements", "aggrements.test.ts"));
 //mocha.addFile(path.join("src/test/unit/procurements", "procurements.test.ts"));
 mocha.addFile(path.join("src/test/unit/mcf/rfi", "rfiTaskList.test.ts"));
 mocha.addFile(path.join("src/test/unit/mcf/rfi", "rfiNameAproject.test.ts"));
 mocha.addFile(path.join("src/test/unit/mcf/rfi", "rfiProcurementLead.test.ts"));
 mocha.addFile(path.join("src/test/unit/mcf/rfi", "rfiAddCollabarator.test.ts"));
 
 
Promise.all([getProcurmentJson(1)]).then((values) => {
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


// mocha.run().on('fail', function(test, err) {
//     console.log('Test fail');
//     //console.log(err);
// }).on('end', function() {
//     console.log('All done');
// });


