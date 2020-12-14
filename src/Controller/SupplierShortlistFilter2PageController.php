<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SupplierShortlistFilter2PageController extends AbstractController
{

    public function supplierShortlistFilter2(){
        return $this->render('pages/supplier_shortlist_filter_2.html.twig', [
            "pageTitle" => "Supplier Shortlisting Filter 2"
        ]);
    }
}