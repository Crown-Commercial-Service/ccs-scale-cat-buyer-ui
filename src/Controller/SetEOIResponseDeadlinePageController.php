<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SetEOIResponseDeadlinePageController extends AbstractController
{

    public function setEoiRresponseDeadline(){
        return $this->render('pages/set_eoi_response_deadline.html.twig', [
            "pageTitle" => "Set EOI Response Deadline"
        ]);
    }
}