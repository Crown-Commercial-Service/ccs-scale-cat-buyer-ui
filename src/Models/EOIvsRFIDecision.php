<?php

namespace App\Models;

class EOIvsRFIDecision
{

    private $pageTitle = "EOI vs RFI Decision";
    private $pageHeader = "What type of pre-market engagement would you like to use?";
    private $pageSubTitle = "You can issue an Expression of Interest (EOI) and a Request for Information (RFI). Both of these options can be run, in any order, during the procurement process.";
    private $content = "<p>You will have the opportunity to run the other option later in the process.</p>";

    public function getPageTitle(){
        return $this->pageTitle;
    }

    public function getPageHeader(){
        return $this->pageHeader;
    }

    public function getPageSubTitle(){
        return $this->pageSubTitle;
    }

    public function getContent(){
        return $this->content;
    }
}
