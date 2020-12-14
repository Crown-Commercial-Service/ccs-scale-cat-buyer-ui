<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ReviewIssueEOIPageController extends AbstractController
{

    public function reviewIssueEoi(){
        return $this->render('pages/review_issue_eoi.html.twig', [
            "pageTitle" => "Review & Issue EOI"
        ]);
    }
}