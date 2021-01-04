<?php
declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Models\SupliersList;

class ReviewSupplierShortlistPageController extends AbstractController
{

    public function reviewSupplierShortlist(){

        $suplierListModel = new SupliersList();
        $reviewSuplierPageTitle = $suplierListModel->getPageTitle();
        $suplierList = $suplierListModel->getList();

        return $this->render('pages/review_supplier_shortlist.html.twig', [
            "pageTitle" => $reviewSuplierPageTitle,
            "pageSubTitle" => "There are ".count($suplierList)." suppliers who can meet your needs",
            "content" => "You can download a spreadsheet of your identified suppliers and the selection criteria you applied. The suppliers' contact details will be in the downloaded file.",
            'suplierLists' => $suplierList,
            'regionSelectedNr' => $suplierListModel->getRegionSelectedNr(),
            'serviceTypeSelectedNr' => $suplierListModel->getServiceTypeSelectedNr(),
            'suplierDeselectedNr' => $suplierListModel->getSuplierDeselectedNr()
        ]);
    }

}