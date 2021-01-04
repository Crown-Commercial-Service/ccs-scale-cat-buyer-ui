<?php 

namespace App\Models;

class SupliersList{

    private $pageTitle = "Review your identified suppliers";
    private $regionSelectedNr = 8;
    private $serviceTypeSelectedNr = 2;
    private $suplierDeselectedNr = 2;

    private $documentSupliersPath = "../files/Supplier Shortlist Ex - With Deselection.xlsx";
    private $documentSupliersName = "Supplier Shortlist Ex - With Deselection.xlsx";

    private $supliers =[
        0 => [
            'name' => '1ST BIOTECH LIMITED',
            'small_madium_ent' => 1
        ],

        1 => [
            'name' => 'Express Linen Services Limited'
        ],
        2 => [
            'name' => 'Northern Care Alliance NHS Group'
        ],
        3 => [
            'name' => 'Synergy LMS',
            'small_madium_ent' => 1
        ],
        4 => [
            'name' => 'CENTRAL LAUNDRY LIMITED',
            'small_madium_ent' => 1
        ],
        5 => [
            'name' => 'Communication Services'
        ],
        6 => [
            'name' => 'Contact Centre Services'
        ],
        7 => [
            'name' => 'Costs Lawyer Services'
        ],
        8 => [
            'name' => 'Spike95 Limited'
        ],
        9 => [
            'name' => 'Swiss Post Solutions Ltd'
        ]
    ];

    public function getPageTitle(){
        return $this->pageTitle;
    }

    public function getList(){
            return $this->supliers;
    }

    public function getRegionSelectedNr(){
        return $this->regionSelectedNr;
    }

    public function getServiceTypeSelectedNr(){
        return $this->serviceTypeSelectedNr;
    }

    public function getSuplierDeselectedNr(){
        return $this->suplierDeselectedNr;
    }

    public function getDocumentSupliersPath(){
        return $this->documentSupliersPath;
    }

    public function getDocumentSupliersName(){
        return $this->documentSupliersName;
    }

}

?>