<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class PreMarketEnaggementDecisionPageController extends AbstractController
{

    public function preMarketEngagementDecision(Request $request){

        if($request->getMethod() == "POST"){

            $postData = $request->request->all();
            if($postData['preMarket'] == 'pre-market'){
                return $this->redirect('/eoi-vs-rfi-decision');
            }
            return $this->redirect('/rfp-decision');
        }

        return $this->render('pages/premarket_engagement_decision.html.twig', [
            "pageTitle" => "Pre-Market Engagement Decision"
        ]);
    }

}