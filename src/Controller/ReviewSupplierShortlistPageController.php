<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ReviewSupplierShortlistPageController extends AbstractController
{

    public function reviewSupplierShortlist(){
        return $this->render('pages/review_supplier_shortlist.html.twig', [
            "pageTitle" => "Review Supplier Shortlisting"
        ]);
    }
}