const {
    json
} = require('express');
const fetch = require('node-fetch');

/**
 * Note: This code (and all the code in this project) can be thrown away entirely and started from scratch.
 * 
 * This was written by a non-NodeJS developer purely to test the infrastructure side of deployment via Travis
 * and connection to Conclave and the internal CCS Tenders API (in development). 
 * 
 * Please feel free to delete it all and start again (entire project).
 */
module.exports = {
    get_event_types: async function (req, res) {

        /** 
         * Extract some secrets as variables from the User Provided Service
         */

        console.log('VCAP SERVICES +++++++++++++++++++++++++++++++++++++++');
        var app_info = JSON.parse( process.env.VCAP_SERVICES)
        console.log(app_info);
        console.log(app_info["user-provided"][1]);
        console.log('VCAP SERVICES +++++++++++++++++++++++++++++++++++++++');

        // ["user-provided"][1] is hardcoded at the moment for the demo - actual code will need to check list for match - {name: '{ENV}-ccs-scale-cat-ups-service'}
        // The debug output above should illustrate this (i.e. that 'user-provided' is an array of items - need to select the correct one)
        var app_info = JSON.parse( process.env.VCAP_SERVICES)
        var ups_service_credentials = app_info["user-provided"][1].credentials;
        var conclave_url = ups_service_credentials["conclave-url"];
        var conclave_client_id = ups_service_credentials["conclave-client-id"];
        var conclave_client_secret = ups_service_credentials["conclave-client-secret"];
        var conclave_api_key = ups_service_credentials["conclave-api-key"];
        var tenders_svc_url = ups_service_credentials["tenders-svc-url"];
        var tenders_svc_port = ups_service_credentials["tenders-svc-port"];

        /** 
         * GET an Access Token from Conclave
         * This can be cached - I think it is valid for 30 mins (you will need to check/confirm this)
         */

        // Each user will require their own login details
        // This will need appropriate accounts creating in Conclave and Jaggaer
        const username = "{TODO}}@crowncommercial.gov.uk";
        const password = "{TODO}";

        const body = {
            "username": username,
            "password": password,
            "client_id": conclave_client_id,
            "client_secret": conclave_client_secret
        };

        const data = await fetch(conclave_url + '/test/oauth/token', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': conclave_api_key
            },
        }).then((response) => response.json()).catch((error) => {
            console.log('ERROR');
            console.log(error);
        })

        if ( typeof data !== 'undefined' && data ) {

            console.log("Got Access Token: " + data.accessToken);

            /** 
             * Use Access Token to call the CCS Tenders API
             * This example will return event types from the API
             */
            const eventTypes = await fetch(tenders_svc_url + ':' + tenders_svc_port + '/tenders/event-types', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + data.accessToken
                },
            }).then((response) => response.json()).catch((error) => {
                console.log('ERROR');
                console.log(error);
            })

            // Retrived Event Types
            console.log("Got Event Types: " + eventTypes);

            return eventTypes;

        } else {

            return "Could not get Access Token - check credentials are correct";

        }
    }
}