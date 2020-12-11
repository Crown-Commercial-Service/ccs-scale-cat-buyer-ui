<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class EOIvsRFIDecisionPageController extends AbstractController
{

    public function eoiRfiDecision(){
        return $this->render('pages/eoi_vs_rfi_decision.html.twig');
    }
}