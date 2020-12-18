<?php

namespace App\Controller;

use App\Models\PreMarketEngagement;
use App\Models\Validators\ValidateUserInput;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class PreMarketEnaggementDecisionPageController extends AbstractController
{

    public function preMarketEngagementDecision(Request $request){

        $preMarketEngagement = new PreMarketEngagement();
        $preMarketEngagementTitle = $preMarketEngagement->getPageTitle();
        $preMarketEngagementSubTitle = $preMarketEngagement->getPageSubTitle();
        $preMarketEngagementHeader = $preMarketEngagement->getPageHeader();

        if($request->getMethod() == "POST"){

            $postData = $request->request->all();

            $validate = $this->validateUserAnswer($postData);

            if(!$validate->isValid()){
                return $this->render('pages/premarket_engagement_decision.html.twig', [
                    "pageTitle" => $preMarketEngagementTitle,
                    "pageHeader" => $preMarketEngagementHeader,
                    "pageSubTitle" => $preMarketEngagementSubTitle,
                    "errorMessage" => $validate->getErrorMessage()
                ]);
            }

            if($postData['preMarket'] == 'yes'){
                return $this->redirect('/eoi-vs-rfi-decision');
            }
            return $this->redirect('/rfp-decision');
        }

        return $this->render('pages/premarket_engagement_decision.html.twig', [
            "pageTitle" => $preMarketEngagementTitle,
            "pageHeader" => $preMarketEngagementHeader,
            "pageSubTitle" => $preMarketEngagementSubTitle,
            "errorMessage" => ''
        ]);
    }
    private function validateUserAnswer(array $userInput)
    {
        return new ValidateUserInput($userInput);
    }

}
