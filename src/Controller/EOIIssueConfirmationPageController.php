<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class EOIIssueConfirmationPageController extends AbstractController
{

    public function eoiIssueConfirmation(){
        return $this->render('pages/eoi_issue_confirmation.html.twig');
    }
}