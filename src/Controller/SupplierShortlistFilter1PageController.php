<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SupplierShortlistFilter1PageController extends AbstractController
{

    public function supplierShortlistFilter1(){
        return $this->render('pages/supplier_shortlist_filter_1.html.twig', [
            "pageTitle" => "Review your identified suppliers"
        ]);
    }
}