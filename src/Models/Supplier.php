<?php
namespace App\Models;

class Supplier{

    private $supliers = [
        0 => [
            "title" => "Identify suppliers by the location they serve",
            "body" =>  "<p>You can choose to narrow down the list of suitable suppliers based on the location they serve. This step is optional.</p>"
        ],
        1 => [
            "title" => "Identify suppliers by the services they provide",
            "body" =>  "<p>You can choose to narrow down the list of suitable suppliers based on the services they provide. This step is optional.</p>"
        ],
        2 => [
            "title" => "Use your professional knowledge to Refine supplier list",
            "body" =>  "<p>This Commercial Agreement allows you to refine your supplier list by removing suppliers based on additional criteria. This step is optional.</p>"
        ],
        3 => [
            "title" => "Download a record of your suppliers",
            "body" =>  "<p>You will be able to download a spreadsheet containing a list of suppliers who you have identified can meet your needs. This step is optional.</p>"
        ]
    ];

    public function getSupliers(){
        return $this->supliers;
    }

}