<?php
namespace App\Models;

class Supplier{

    private $supliers = [
        0 => [
            "title" => "Identify suppliers by the location they serve",
            "body" =>  "<p>You will be able to find suppliers using the locations they serve.</p>
                       <p>You can choose to proceed without using any location criteria to get a full list of suppliers associated with this lot.</p>"
        ],
        1 => [
            "title" => "Identify suppliers by the services they provide",
            "body" =>  "<p>You will be able to find suppliers using the type of service they can provide and if they meet your needs.</p>
                        <p>You can choose to proceed without using any service criteria to get a full list of suppliers associated with this lot.</p>"
        ],
        2 => [
            "title" => "Use your professional knowledge",
            "body" =>  "<p>There will also be the opportunity to refine your list of results of potential suppliers based on other criteria to best meet your procurement project's needs.</p>"
        ],
        3 => [
            "title" => "Download a record of your suppliers",
            "body" =>  "<p>You will be able to download a record of your search criteria and supplier results. This document will include suppliers' contact details.
                             You can view a list of suppliers associated with this lot on the CCS website.</p>"
        ],
        4 => [
            "title" => "Review your search choices",
            "body" =>  "<p>You will have the opportunity to review the supplier search criteria before you issue any pre-market engagement or tenders to suppliers.</p>"
        ],
    ];

    public function getSupliers(){
        return $this->supliers;
    }

}