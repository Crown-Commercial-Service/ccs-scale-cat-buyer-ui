<?php
// src/Controller/APIController.php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class APIController
{

    private $client;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

    public function getData(): Response
    {
        $response = $this->client->request(
            'GET',
            $_ENV["PRIVATE_APP_URL"]. "/agreement-summaries"
        );

        $content = $response->getContent();

        return $this->render('pages/landing_page.html.twig', [
            // this array defines the variables passed to the template,
            // where the key is the variable name and the value is the variable value
            // (Twig recommends using snake_case variable names: 'foo_bar' instead of 'fooBar')
            'response' => $content,
            'endpoint' => $_ENV["PRIVATE_APP_URL"]
        ]);
    }
}
