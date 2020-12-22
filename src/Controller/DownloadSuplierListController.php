<?php

declare(strict_types=1);
namespace App\Controller;
 
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use App\Models\SupliersList;

class DownloadSuplierListController{

    public function downloadSuplierList(){

        $suplierListModel = new SupliersList();
        $documentSupliersfilePath = $suplierListModel->getDocumentSupliersPath();
        $getDocumentSupliersName = $suplierListModel->getDocumentSupliersName();

        $response = new BinaryFileResponse($documentSupliersfilePath);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT,$getDocumentSupliersName);
        return $response;
    }
}

?>