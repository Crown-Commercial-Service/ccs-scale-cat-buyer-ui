<?php

namespace App\Models;

class SuplierOverview{

    private $title = "Getting started with identifying suppliers";
    private $subtitle = "We'll help you identify suppliers who meet your needs.";
    private $content = "<p>The Crown Commercial Service's process is a great way to save time and find suppliers efficiently.
                        It helps you use our list of trusted and suitable suppliers of goods and services, 
                        in a way that is compliant with Commercial Agreements' terms and conditions.</p>

                        <p>As you start the process of identifying potential suppliers for your procurement project, you will be given options to choose from. 
                        These will narrow down the list of suppliers for you. The Service intends to make it as easy as possible for you to find the suppliers
                        you need.</p>";


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