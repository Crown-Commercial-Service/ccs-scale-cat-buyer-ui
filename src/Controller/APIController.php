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

        return new Response(
            '<html><body><h2>CaT Gov.UK PaaS Demo</h2><img src="lolcatz.jpg" /><h3>Request:</h3><p>'.$_ENV["PRIVATE_APP_URL"] .'/agreement-summaries</p><h3>Response:</h3><p>' . $content . '</p></body></html>'
        );
    }
}
