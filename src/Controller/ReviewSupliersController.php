<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ReviewSupliersController extends AbstractController
{

    public function reviewSuppliers(){
        return $this->render('pages/review-suppliers.html.twig', [
            "pageTitle" => "Review your identified suppliersa"
        ]);
    }
}