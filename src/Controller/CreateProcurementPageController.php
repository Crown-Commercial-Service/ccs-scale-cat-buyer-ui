<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class CreateProcurementPageController extends AbstractController
{

    public function createProcurement(){
        return $this->render('pages/create_procurement_page.html.twig');
    }
}