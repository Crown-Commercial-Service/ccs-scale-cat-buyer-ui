<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UploadEOISupportingDocumentPageController extends AbstractController
{

    public function uploadEoiSupportingDocument(){
        return $this->render('pages/upload_eoi_supporting_document.html.twig', [
            "pageTitle" => "Upload EOI Supporting Document"
        ]);
    }
}