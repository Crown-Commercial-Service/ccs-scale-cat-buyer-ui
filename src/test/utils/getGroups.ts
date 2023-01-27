const axios = require('axios');
// const data = [
//   {
//       "nonOCDS": {
//           "prompt": "Enter the expected contract length and any optional extension period you wish to define.",
//           "mandatory": false,
//           "order": 18
//       },
//       "OCDS": {
//           "id": "Group 18",
//           "description": "How long the project will last"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "Describe the organisation or policy goal the work supports. <br><br>Describe any legal or regulatory changes influencing the work. This can be how a new law changes the way users receive government payments, for example.<br><br>Include any important dates. You must say if you need the work to be done by a certain date. This will help suppliers understand any time constraints.",
//           "task": "Why the work is being done",
//           "mandatory": true,
//           "order": 7
//       },
//       "OCDS": {
//           "id": "Group 7",
//           "description": "Why the work is being done"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>To help suppliers understand the current team shape, describe the team the supplier will be working with and if it involves working with another supplier.<br><br>Include job titles and a brief description of duties.\n</p>",
//           "mandatory": false,
//           "order": 13
//       },
//       "OCDS": {
//           "id": "Group 13",
//           "description": "Existing team"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "Select the locations where you would expect the supplied staff to work. You can select multiple locations. If you do not need them to work in an office select ‘No specific location’.",
//           "task": "Add Where the supplied staff will work",
//           "mandatory": true,
//           "order": 5
//       },
//       "OCDS": {
//           "id": "Group 5",
//           "description": "Where the supplied staff will work "
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>You may have already made a start on this project . For example, you might have completed a discovery phase. Enter any details about that work here.</p>",
//           "task": "Add work complete so far",
//           "mandatory": false,
//           "order": 11
//       },
//       "OCDS": {
//           "id": "Group 11",
//           "description": "Work done so far"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "You should use the standard contract unless your organisation needs to include any special terms and conditions that the supplier will be required to meet. \nEnter and explain any special terms or conditions you wish to include.",
//           "task": "Add another special term or condition",
//           "mandatory": false,
//           "order": 19
//       },
//       "OCDS": {
//           "id": "Group 19",
//           "description": "Special terms and conditions"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "Say when you need suppliers to start work. When you shortlist, you can exclude suppliers who cannot start by this date.",
//           "mandatory": true,
//           "order": 17
//       },
//       "OCDS": {
//           "id": "Group 17",
//           "description": "Latest start date"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>Tell suppliers if you are buying products and services on behalf of another organisation.</p>",
//           "task": "Add buyer details",
//           "mandatory": false,
//           "order": 6
//       },
//       "OCDS": {
//           "id": "Group 6",
//           "description": "Who the buying organisation is"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>As the buyer, you are the supplier’s client when buying a supply of resource (people to do the work).</p><p>This means that you’re responsible for deciding if the off-payroll working rules (IR35) apply to them. You must meet your legal obligations where they do.</p><p>Choose whether you need a contracted out service or a supply of resource.</p>",
//           "mandatory": true,
//           "order": 21
//       },
//       "OCDS": {
//           "id": "Group 21",
//           "description": "Confirm if you require a contracted out service or supply of resource"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "Explain any terms and acronyms that you use. This will help suppliers to understand your requirements and reduce the number of supplier questions.",
//           "task": "Add terms and acronyms1",
//           "mandatory": false,
//           "order": 2
//       },
//       "OCDS": {
//           "id": "Group 2",
//           "description": "Terms and acronyms"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>Outline the situation and why it needs to be addressed. For example, patients cannot access their medical records.<br><br>Detail any risks or challenges the supplier should be aware of. You can include what your expected deliverables or outcomes are.</p>",
//           "mandatory": true,
//           "order": 8
//       },
//       "OCDS": {
//           "id": "Group 8",
//           "description": "The business problem you need to solve"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>Let suppliers know if any work has been started, and which phase you think the project is in. <br><br> Find out more about service design phases.</p>",
//           "mandatory": true,
//           "order": 12
//       },
//       "OCDS": {
//           "id": "Group 12",
//           "description": "Which phase the project is in"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>Help suppliers decide whether or not to view your requirements and make a bid.<br>Provide a high level summary of the project goals and the problem you are trying to solve.</p>",
//           "task": "Add Summary of work",
//           "mandatory": true,
//           "order": 3
//       },
//       "OCDS": {
//           "id": "Group 3",
//           "description": "Summary of work"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>Provide information about the different types of people who will use the service you want to develop. Give as much information as possible, including if your service users have specific needs.<br><br>Use the format:<br><br><ul><li>Name of user… (user type)</li><br><li>I need to… (what does the user want to do?)</li><br><li>So that… (why does the user want to do this?)</li></ul>\nFor example: Carer. As a carer I need to know if I can get Carer&#38;s Allowance, so that I know if I should apply for it or not.</p>",
//           "task": "Add another service user type",
//           "mandatory": false,
//           "order": 9
//       },
//       "OCDS": {
//           "id": "Group 9",
//           "description": "The people who will use your product or service"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>Tell the supplier if you have done any pre-market engagement, and give details about the outcome. You can include any recommendations or suggestions you received.</p>",
//           "task": "Add market engagement",
//           "mandatory": false,
//           "order": 10
//       },
//       "OCDS": {
//           "id": "Group 10",
//           "description": "Describe any pre-market engagement done"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>It would be helpful to provide a budget range so that suppliers can understand the scope and size of the project.\nYou can also provide context for the figures you enter.<br><br>The following is an example indicative maximum with a context statement:<br><br>The budget for this service is up to £4 million, which is divided into two parts: <ul><li>Maintenance and support of the platform, with a budget of up to £1 million.</li><li>The delivery of data projects, which has a variable demand. We anticipate spending up to £3 million on this, but there is no commitment to do so if there is no demand from colleagues.</li></ul><p>",
//           "mandatory": false,
//           "order": 20
//       },
//       "OCDS": {
//           "id": "Group 20",
//           "description": "Set your budget "
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "Select the required level(s) of security clearance for all supplier team members. Choose all that apply, providing more information if needed.",
//           "mandatory": false,
//           "order": 16
//       },
//       "OCDS": {
//           "id": "Group 16",
//           "description": "Security and vetting requirements"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>Describe how you want to work with the supplier’s staff. Explain why you want to work with them in this way. Include any limits on expenses.<br><br>For example: the supplier will be required to work in our Leeds office 2 days per week for face-to-face team meetings, and 3 days remotely. Expenses will be capped at £5,000 for the duration of the contract, and all travel and subsistence will require prior approval.</p>",
//           "mandatory": true,
//           "order": 15
//       },
//       "OCDS": {
//           "id": "Group 15",
//           "description": "Working arrangements"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "<p>Well-written requirements make it easier for a supplier to understand your needs and propose a solution.<br><br>Long, complex briefs can be hard to understand and respond to.<br><br>Help suppliers decide whether to apply by:<ui><li>providing a clear and specific summary of the work</li><li>explaining the problem you want to solve</li><li>describing who the users are and what they need to do</li><li>detailing any work that has already been done</li><li>focusing on the outcome</li><li>describing the budget</li><li>telling suppliers about any pre-tender market engagement</ui> </p>",
//           "task": "Add context",
//           "mandatory": false,
//           "order": 1
//       },
//       "OCDS": {
//           "id": "Group 1",
//           "description": "Learn about adding context and requirements"
//       }
//   },
//   {
//       "nonOCDS": {
//           "prompt": "Provide specific location details of the office, or offices, where the work will take place.",
//           "task": "Add Where the work will be done",
//           "mandatory": true,
//           "order": 14
//       },
//       "OCDS": {
//           "id": "Group 14",
//           "description": "Where the work will be done"
//       }
//   }
// ]

export async function getGroups(OauthToken:any) {
 //return data;
    return axios({
      method: 'get',
      url: 'https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/13808/events/ocds-pfhb7i-14385/criteria/Criterion 3/groups',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${OauthToken}`,   
        },
    }).then(function (response:any) {
      return response.data;
    });
}




     
