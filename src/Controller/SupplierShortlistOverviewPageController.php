<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SupplierShortlistOverviewPageController extends AbstractController
{

    public function supplierShortlistOverview(){
        return $this->render('pages/supplier_shortlist_overview_page.html.twig');
    }
}