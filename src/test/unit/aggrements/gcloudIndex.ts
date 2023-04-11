//@ts-nocheck

const path = require('path');
const fs = require('fs');
const Mocha = require('mocha');
//const { questionSetup } = require('test/utils/mcf/rfi/qsData');
const { getProcurmentJson } = require('test/utils/getJson');
//const { questionSetup } = require('test/utils/mcf/rfi/qsData');
const { questionSetup } = require('test/utils/mcf/rfi/qsData');
const { questionSetupGcloud } = require('test/utils/gcloud/qsData');

//const { getProcurmentGcloudJson } = require('test/utils/getGcloudJson');
const { getProcurmentGcloudJson } = require('test/utils/getGcloudJson');

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
 
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", "rfiTaskList.test.ts"));
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", "rfiNameAproject.test.ts"));
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", "rfiProcurementLead.test.ts"));
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", "rfiAddCollabarator.test.ts"));
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", 'rfiAddContext.test.ts'));
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", 'rfiAddContextPost.test.ts'));
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", 'rfiUploadDocuments.test.ts'));
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", 'rfiSupplier.test.ts'));
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", 'rfiResponseDate.test.ts'));
//  mocha.addFile(path.join("src/test/unit/mcf/rfi", 'rfiReview.test.ts'));
 
mocha.addFile(path.join("src/test/unit/gcloud", "rfiTaskList.test.ts"));
mocha.addFile(path.join("src/test/unit/gcloud", "rfiNameAproject.test.ts"));
mocha.addFile(path.join("src/test/unit/gcloud", "rfiProcurementLead.test.ts"));
mocha.addFile(path.join("src/test/unit/gcloud", "rfiAddCollabarator.test.ts"));
mocha.addFile(path.join("src/test/unit/gcloud", 'rfiAddContext.test.ts'));
mocha.addFile(path.join("src/test/unit/gcloud", 'rfiAddContextPost.test.ts'));
 mocha.addFile(path.join("src/test/unit/gcloud", 'rfiUploadDocuments.test.ts'));
 mocha.addFile(path.join("src/test/unit/gcloud", 'rfiSupplier.test.ts'));
 mocha.addFile(path.join("src/test/unit/gcloud", 'rfiResponseDate.test.ts'));
 mocha.addFile(path.join("src/test/unit/gcloud", 'rfiReview.test.ts'));
 
    //const aggrements =['RM6187','RM1557.13','RM1043.8'];

    const aggrements =['RM1557.13'];

    Promise.all([getProcurmentGcloudJson(1)],[questionSetupGcloud(1)]).then((values) => {
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
//}



// mocha.run().on('fail', function(test, err) {
//     console.log('Test fail');
//     //console.log(err);
// }).on('end', function() {
//     console.log('All done');
// });


