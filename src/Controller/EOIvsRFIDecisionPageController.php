<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class EOIvsRFIDecisionPageController extends AbstractController
{

    public function eoiRfiDecision(Request $request){

        if($request->getMethod() == "POST"){

            $postData = $request->request->all();
//            dd($postData);
            if($postData['eoi-rfi'] == 'EOI'){
                return $this->redirect('/eoi-overview');
            }
            return $this->redirect('/rfi-overview');
        }

        return $this->render('pages/eoi_vs_rfi_decision.html.twig', [
            "pageTitle" => "EOI vs RFI Decision"
        ]);
    }
}