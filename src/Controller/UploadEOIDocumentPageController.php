<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UploadEOIDocumentPageController extends AbstractController
{

    public function uploadEoiDocument(){
        return $this->render('pages/upload_eoi_document.html.twig');
    }
}