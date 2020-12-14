<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProcurementNamePageController extends AbstractController
{

    public function procurementName(){
        return $this->render('pages/procurement_name_page.html.twig', [
            "pageTitle" => "Name Your Procurement Project"
        ]);
    }
}