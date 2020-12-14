<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PreMarketEnaggementDecisionPageController extends AbstractController
{

    public function preMarketEngagementDecision(){

        return $this->render('pages/premarket_engagement_decision.html.twig', [
            "pageTitle" => "Pre-Market Engagement Decision"
        ]);
    }

}