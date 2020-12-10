<?php

declare(strict_types=1);

namespace App\Controller;
use Symfony\Component\HttpFoundation\Response;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class LandingPageController extends AbstractController{


    public function landingPage(){

        return $this->render('pages/landing_page.html.twig');
    }
}