<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RFIOverviewPageController extends AbstractController
{

    public function rfiOverview(){
        return $this->render('pages/rfi_overview.html.twig', [
            "pageTitle" => "RFI Overview"
        ]);
    }
}