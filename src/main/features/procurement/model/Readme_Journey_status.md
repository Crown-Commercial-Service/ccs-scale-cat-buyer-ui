# Journey status 

Journey service is used to store our journey status information (POST, PUT & GET).

# Flow

First when we load the procurement page we have to issue the `POST` method to initiate default journey status for the procurement.

`POST` Create Journey:

    curl --location --request POST 'https://dev-ccs-scale-cat-service.london.cloudapps.digital/journeys' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer ...' \
    --data-raw '{
        "journey-id": "ocds-abc-457",
        "states": [
            {
                "step": 1,
                "state": "Not started"
            },
            {
                "step": 2,
                "state": "Not started"
            },
            {
                "step": 3,
                "state": "Optional"
            }
        ]
    }'
`PUT` Update journey state step:

     curl --location --request PUT 'https://dev-ccs-scale-cat-service.london.cloudapps.digital/journeys/ocds-abc-457/steps/2' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer ...' \
    --data-raw '"In progress"

`GET` journey state:

    curl --location --request GET 'https://dev-ccs-scale-cat-service.london.cloudapps.digital/journeys/ocds-abc-457/steps' \ 2--header 'Authorization: Bearer ...'

> Journey ID should be the projectID - e.g. `1234`


## Current initial step and journey mapping

> **Procurement overview**  
> 
> Step 1 - Take a look at the available suppliers (Optional)  
> 
> Do pre-market engagement  
> 
> Step 2 - EOI / RFI  (Optional)
> 
> Step 3 - Write and publish your requirements (Not started)
> 
> Step 4 - Award your contract (Cannot start yet)
>
> Step 5 - Publish your contract (Cannot start yet)
>   
> 
> **pre-market engagement (RFI)**  
> 
> Step 6 - Name your project (Optional)
> 
> Step 7 - Change who is going to lead the procurement (Optional)
> 
> Step 8 - Add colleagues to your project (Optional)
> 
>   
> 
> Step 9 - Choose how to build your RfI (Not started)
> 
> Step 10 - Build your RfI (Cannot start yet)
> 
> Step 11- Upload documents or add links (Cannot start yet)
> 
> Step 12 - Confirm which suppliers you want to approach (Cannot start
> yet)
> 
> Step 13 - Your RfI timeline (Cannot start yet)
> 
> Step 14 - Review and publish your RfI (Cannot start yet)
> 
> Step 15 - Rfi completed ? (Cannot start yet) - Once user in Do
> pre-market engagement this status has to be changed to (In progress)
> 
>   
> 
> **pre-market engagement (EOI)**  
> 
> Step 16 - Name your project (Optional)
> 
> Step 17 - Change who is going to lead the procurement (Optional)
> 
> Step 18 - Add colleagues to your project (Optional)
> 
>   
> 
> Step 19 - Choose how to build your Eoi (Not started)
> 
> Step 20 - Build your Eoi (Cannot start yet)
> 
> Step 21- Upload documents or add links (Cannot start yet)
> 
> Step 22 - Confirm which suppliers you want to approach (Cannot start
> yet)
> 
> Step 23 - Your RfI timeline (Cannot start yet)
> 
> Step 24 - Review and publish your Eoi (Cannot start yet)
> 
> Step 25 - Eoi completed ? (Cannot start yet) - Once user in Do
> pre-market engagement this status has to be changed to (In progress)
>   
> 
> **Write and publish your requirements**  
> 
> Step 26 - Name your project (Optional)
> 
> Step 27 - Change who is going to lead the procurement (Optional)
> 
> Step 28 - Add colleagues to your project (Optional)
> 
>   
> *Context to your 1-stage further competition*
> Step 29 - IR35 acknowledgement (Not started)
> 
> Step 30 - Add context (Not started)
>
> *Your requirements and evaluation weightings*
> 
> Step 31- How would you like to create your requirements? (Cannot start yet)
> 
> Step 32 - Your requirements (Cannot start yet)
> 
>
>*Your assessment bases and evaluation weightings*
> Step 33 - Define your assessment bases (Cannot start yet)
> 
> Step 34 - Add your evaluation weightings (Cannot start yet)
> 
> Step 35 - How would you like to set your scoring criteria ? (Cannot start yet)
>
> Step 36 - Set your scoring criteria (Cannot start yet)
> 
>
>*Review and publish your 1-stage RfP*
> Step 37 - Upload documents or add links (Cannot start yet)
> 
> Step 38 - Look at the suppliers for this further competition (Cannot start yet)
> 
> Step 39 - Set response date and time ? (Cannot start yet)
>
> Step 40 - Review and publish ? (Cannot start yet)
>
>
> **requirements Choose route**
> Step 41 - One stage further competition (Not started)
> 
> Step 42 - Two stage further competition (Not started)
> 
> Step 43 - DA (Not started)
>
> Step 41,42 & 43 is for requirements/choose-route page. At first all must me To-Do then based on user selection we need to mark it as In-Progress
>
> **capability assessment**
> 1. Project and collaborators (Cannot start yet)
> 
> Step 44 - Name your project (Optional)
> 
> Step 45 - Change who is going to lead the procurement (Optional)
> 
> Step 46 - Add colleagues to your project (Optional)
>
> *If we are going to go via dynamic framwrok then Step 48 to 58 is not required*
>
> Step 47 - Stage 1: Complete a capability assessment (Not started)
>
> Step 48 - [ Learn about capability assessment ] (Optional)
>
> Step 49 - [ Enter your weightings ] (Not started)
>
> Step 50 - [ Choose your resources ] (Cannot start yet)
>
> Step 51 - [ Select your service capabilities ] (Cannot start yet)
>
> Step 52 - [ Will you accept suppliers working overseas? ] (Cannot start yet)
>
> Step 53 - [ How well the team can scale? ] (Cannot start yet)
>
> Step 54 - [ Where the work will be done ] (Cannot start yet)
>
> Step 55 - [ Will you accept sub-contractors? ] (Cannot start yet)
>
> Step 56 - [ Select your supplier for direct award ] (Cannot start yet)
>
> Step 57 - [ Enter your justification ] (Cannot start yet)
>
> Step 58 - [ Next steps ] (Cannot start yet)
>
> Update Step 47 as (Completed)
>
>
>*[ Stage 2: Progress to direct award ]*
>
> Step 59 - [ Stage 2: Progress to direct award ] (Cannot start yet)
>
> Step 60 - [ 1. Context ] (Cannot start yet)
>
> Step 61 - [ IR35 acknowledgement ] (Cannot start yet)
>
> Step 62 - [ Add context ] (Cannot start yet)
>
> Once Step 61 and 62 is completed mark Step 60 as completed
>
> Step 63 - [ 2. Your requirements ] (Cannot start yet)
>
> Step 64 - [ How would you like to create your requirements?] (Cannot start yet)
>
> Step 65 - [ Your requirements ] (Cannot start yet)
>
> Once Step 64 and 65 is completed mark Step 63 as completed
> Once Step 60 and 63 is completed mark Step 59 as completed
>
>
> *[ 3. Your assessment bases and evaluation weightings ]*
>
> Step 66 - [ 3. Your assessment bases and evaluation weightings ] (Cannot start yet)
>
> Step 67 - [ Define your assessment bases ] (Cannot start yet) 
> Step 68 - [ Add your evaluation weightings ] (Cannot start yet)
> Step 69 - [ How would you like to set your scoring criteria? ] (Cannot start yet)
> Step 70 - [ Set your scoring criteria ] (Cannot start yet)
>
> Once Step 67 - 70 is completed mark Step 66 as completed.
>
> *[ 4. Review and publish your direct award ]*
> Step 71 - Upload documents or add links (Cannot start yet)
> 
> Step 72 - Look at the suppliers for this further competition (Cannot start yet)
> 
> Step 73 - Set response date and time ? (Cannot start yet)
>
> Step 74 - Review and publish ? (Cannot start yet)

# UI Status --> API response

```
    Optional = 'Optional',
    TODO = 'Not started',
    CannotStartYet = 'Cannot start yet',
    InProgress = 'In progress',
    DONE = 'Completed'
