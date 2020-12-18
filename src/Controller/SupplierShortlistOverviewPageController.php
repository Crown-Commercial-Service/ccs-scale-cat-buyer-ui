<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Models\Supplier;
use App\Models\SuplierOverview;

class SupplierShortlistOverviewPageController extends AbstractController
{

    public function supplierShortlistOverview(){

        $suplierModel = new Supplier();
        $supliers = $suplierModel->getSupliers();

        $supliersContent = new SuplierOverview();
        
        return $this->render('pages/supplier_shortlist_overview_page.html.twig', [
            "pageTitle" => $supliersContent->getTitle(),
            "pageSubTitle" => $supliersContent->getSubTitle(),
            "content" => $supliersContent->getContent(),
            "supliers" => $supliers
        ]);
    }
}