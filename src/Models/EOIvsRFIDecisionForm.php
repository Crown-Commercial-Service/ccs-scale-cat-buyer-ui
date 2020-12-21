<?php

namespace App\Models;

class EOIvsRFIDecisionForm
{

    private $eOIvsRFIChoices = [
        0 => [
            "title" => "Expression of Interest (EOI)",
            "body" => "<p>An EOI is used to understand more about suppliers' level of interest and availability. It can also
                        help you to further narrow down a list of suppliers on a lot to those that can meet your needs.</p>",
            "value" => "eoi"
        ],
        1 => [
            "title" => "Request for Information (RFI)",
            "body" => "<p>An RFI helps you understand more about potential suppliers and how they can help you meet
                          your project's needs.</p>

                       <p>An RFI should not be used to narrow the list of suppliers invited to participate in the formal
                          bidding process</p>",
            "value" => "rfi"
        ]
    ];

    public function getChoices(){
        return $this->eOIvsRFIChoices;
    }
}
