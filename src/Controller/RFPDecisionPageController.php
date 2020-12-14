<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RFPDecisionPageController extends AbstractController
{

    public function rfpDecision(){
        return $this->render('pages/rfp_decision.html.twig', [
            "pageTitle" => "RFP Decision"
        ]);
    }
}