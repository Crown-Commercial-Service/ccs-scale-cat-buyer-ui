<?php

namespace App\Models;

class SuplierOverview{

    private $title = "Getting started with identifying suppliers";
    private $subtitle = "We'll help you identify suppliers who meet your needs";
    private $content = "<p>We can help you find suppliers who can meet your needs in a way that is compliant with the Commercial Agreement's terms and conditions.</p>
                        <p>You will be able to narrow down the list of suitable suppliers based on criteria set out in the Commercial Agreement.</p>";


    public function getTitle(){
        return $this->title;
    }


    public function getSubTitle(){
        return $this->subtitle;
    }
    
    public function getContent(){
        return $this->content;
    }

}

?>