<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class EOIOverviewPageController extends AbstractController
{

    public function eoiOverview(){
        return $this->render('pages/eoi_overview.html.twig', [
            "pageTitle" => "EOI Overview"
        ]);
    }
}