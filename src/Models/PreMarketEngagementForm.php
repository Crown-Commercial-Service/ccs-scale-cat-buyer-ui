<?php


namespace App\Models;


class PreMarketEngagementForm
{

    private $preMarketChoices = [
            0 => [
                "title" => "Yes",
                "body" => "<p>You can choose to run an Expression of Interest (EOI) and a Request for Information (RFI).</p> 

                            <p>An EOI is used to understand more about suppliers' level of interest, in addition to their availability
                            An RFI helps you to understand more about suppliers' ability and what they can provide</p>",
                "value" => "yes"
            ],
            1 => [
                "title" => "No",
                "body" => "<p>Start to build your Request for Proposal (RFP) without any pre-market engagement.</p>",
                "value" => "no"
            ]
        ];

    public function getChoices(){
        return $this->preMarketChoices;
    }

}