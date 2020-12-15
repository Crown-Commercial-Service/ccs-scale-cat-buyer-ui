<?php

namespace App\Controller;

use App\Models\ComercialAgreement;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProcurementNamePageController extends AbstractController
{

    public function procurementName(){

        $comercialAgreement = new ComercialAgreement();
        $comercialCANumber = $comercialAgreement->getCANumber();
        $comercialLOTNumber = $comercialAgreement->getlotNumber();

        return $this->render('pages/procurement_name_page.html.twig', [
            "pageTitle" => "Name Your Procurement Project",
            "pageSubTitle" => "You can use your organisation's internal project naming criteria to create a suitable name for your procurement project",
            "comercialCANumber" => $comercialCANumber,
            "comercialLOTNumber" => $comercialLOTNumber
        ]);
    }
}
