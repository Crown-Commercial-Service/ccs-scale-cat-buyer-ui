<?php
// src/Controller/APIController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;

/*
 * Throwaway class to demonstrate connecting to the API app and using Rollbar to manually log errors. 
 * Any non-caught errors are logged automatically.
 */
class APIController extends AbstractController
{

    private $client;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

    public function getData(LoggerInterface $logger): Response
    {

        // Note - Rollbar symfony bundle will only report levels of ERROR or higher
        // If debug logs are required, need to use the SDK directly - see:
        // https://github.com/rollbar/rollbar-php-symfony-bundle/issues/57
        // Will leave this decision to devs based on requirements
        $logger->error('CCS Scale CaT UI: APIController.getData(): example of logging an error');

        $response = $this->client->request(
            'GET',
            $_ENV["PRIVATE_APP_URL"]. "/agreement-summaries"
        );

        $content = $response->getContent();

        return $this->render('pages/landing_page.html.twig', [
            'response' => $content,
            'endpoint' => $_ENV["PRIVATE_APP_URL"]
        ]);
    }
}
