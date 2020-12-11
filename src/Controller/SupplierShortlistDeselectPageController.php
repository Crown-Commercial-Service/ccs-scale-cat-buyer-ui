<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SupplierShortlistDeselectPageController extends AbstractController
{

    public function supplierShortlistDeselect(){
        return $this->render('pages/supplier_shortlist_deselect.html.twig');
    }
}