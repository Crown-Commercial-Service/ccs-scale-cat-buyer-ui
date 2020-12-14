<?php

namespace App\Controller;

use App\Models\ComercialAgreement;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CreateProcurementPageController extends AbstractController
{

    public function createProcurement(){

        $comercialAgreement = new ComercialAgreement();
        $comercialAgreementName = $comercialAgreement->getName();

        return $this->render('pages/create_procurement_page.html.twig',[
            'pageTitle' => 'Create your procurement project',
            'pageSubTitle' => 'Start de process by creating a procurement project',
            'comercialAgreementName' => $comercialAgreementName,
        ]);
    }
}