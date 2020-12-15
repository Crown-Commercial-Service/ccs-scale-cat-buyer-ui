<?php

namespace App\Models;

class ComercialAgreement{

    private $caNumber = "RM6154";
    private $lotNumber = "Lot 1a";
    private $name = "Commercial Agreement RM6154 Linen and Laundry Services, Lot 1a Linen Hire with Standard Wash Linen and Laundry Services";

    public function getName(){
        return $this->name;
    }

    public function getCANumber(){
        return $this->caNumber;
    }

    public function getlotNumber(){
        return $this->lotNumber;
    }
}


?>