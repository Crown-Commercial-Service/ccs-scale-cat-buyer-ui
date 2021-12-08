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

> Journey ID should be the event ID - e.g. `ocds-b5fd17-####`

## Create files and folders

The file explorer is accessible using the button in left corner of the navigation bar. You can create a new file by clicking the **New file** button in the file explorer. You can also create folders by clicking the **New folder** button.

## Current initial step and journey mapping

> **Procurement overview**  
> 
> Step 1 - Take a look at the available suppliers (Optional)  
> 
> Do pre-market engagement  
> 
> Step 2 - EOI  (Optional)
> 
> Step 3 - RFI  (Optional)
> 
> Step 4 - Write and publish your requirements (Not started)
> 
> Step 5 - Award your contract (Cannot start yet)
> 
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


```