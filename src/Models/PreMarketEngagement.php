<?php

namespace App\Models;

class PreMarketEngagement
{

    private $pageTitle = "Pre-Market Engagement Decision";
    private $pageHeader = "Do you need pre-market engagement?";
    private $pageSubTitle = "Pre-market engagement gives you the opportunity to consult with suppliers before starting the formal bidding process";

    public function getPageTitle(){
        return $this->pageTitle;
    }

    public function getPageHeader(){
        return $this->pageHeader;
    }

    public function getPageSubTitle(){
        return $this->pageSubTitle;
    }
}