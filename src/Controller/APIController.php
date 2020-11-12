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
            $_ENV["PRIVATE_APP_URL"]
        );
        
        $content = $response->getContent();

        return new Response(
            '<html><body><h2>Endpoint: '.$_ENV["PRIVATE_APP_URL"] .'</h2><p>' . $content . '</p></body></html>'
        );
    }
}
