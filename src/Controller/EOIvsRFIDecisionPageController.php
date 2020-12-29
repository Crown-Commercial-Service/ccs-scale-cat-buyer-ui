<?php

namespace App\Controller;

use App\Models\EOIvsRFIDecision;
use App\Models\EOIvsRFIDecisionForm;
use App\Models\Validators\ValidateUserInput;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Models\Validators\ErrorMessages;

class EOIvsRFIDecisionPageController extends AbstractController
{

    public function eoiRfiDecision(Request $request){

        $eOivsRFI = new EOIvsRFIDecision();
        $pageTitle = $eOivsRFI->getPageTitle();
        $eOivsRFISubTitle = $eOivsRFI->getPageSubTitle();
        $eOivsRFIHeader = $eOivsRFI->getPageHeader();
        $eOivsRFIContent = $eOivsRFI->getContent();

        $eOivsRFIForm = new EOIvsRFIDecisionForm();
        $eOivsRFIForms = $eOivsRFIForm->getChoices();

        if($request->getMethod() == "POST"){

            $postData = $request->request->all();

            $validate = new ValidateUserInput($postData);

            if(!$validate->isValid()){
                return $this->render('pages/eoi_vs_rfi_decision.html.twig', [
                    "pageTitle" => $pageTitle,
                    "eOivsRFIHeader" => $eOivsRFIHeader,
                    "eOivsRFISubTitle" => $eOivsRFISubTitle,
                    "eOivsRFIForms" => $eOivsRFIForms,
                    "eOivsRFIContent" => $eOivsRFIContent,
                    "errorMessage" => $validate->getErrorMessage(),
                    "showError" => true
                ]);
            }

            if($postData['eoi-rfi'] == 'eoi'){
                return $this->redirect('/eoi-overview');
            }
            return $this->redirect('/rfi-overview');
        }

        return $this->render('pages/eoi_vs_rfi_decision.html.twig', [
            "pageTitle" => $pageTitle,
            "eOivsRFIHeader" => $eOivsRFIHeader,
            "eOivsRFISubTitle" => $eOivsRFISubTitle,
            "eOivsRFIForms" => $eOivsRFIForms,
            "eOivsRFIContent" => $eOivsRFIContent,
            "errorMessage" => ErrorMessages::EMPTY_USER_ANSWER,
        ]);
    }
}