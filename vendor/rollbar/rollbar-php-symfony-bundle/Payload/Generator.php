<?php

namespace Rollbar\Symfony\RollbarBundle\Payload;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Kernel;

/**
 * Class Generator
 *
 * @package Rollbar\Symfony\RollbarBundle\Payload
 */
class Generator
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * @var Kernel
     */
    protected $kernel;

    /**
     * Generator constructor.
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->kernel    = $container->get('kernel');
    }

    /**
     * Get payload a log record.
     *
     * @param \Exception $exception
     *
     * @return array
     */
    public function getExceptionPayload($exception)
    {
        /**
         * Build payload
         * @link https://rollbar.com/docs/api/items_post/
         */
        $payload = [
            'body'             => [],
            'framework'        => Kernel::VERSION,
            'server'           => $this->getServerInfo(),
            'language_version' => phpversion(),
            'request'          => $this->getRequestInfo(),
            'environment'      => $this->getKernel()->getEnvironment(),
        ];

        // @link http://php.net/manual/en/reserved.constants.php
        // @link http://php.net/manual/en/language.errors.php7.php
        if (!($exception instanceof \Exception) || PHP_MAJOR_VERSION > 7 && !($exception instanceof \Throwable)) {
            $payload['body'] = $this->buildGeneratorError($exception, __FILE__, __LINE__);

            return ['Undefined error', $payload];
        }

        // handle exception
        $chain = new TraceChain();
        $item  = new TraceItem();

        $data            = $item($exception);
        $message         = $data['exception']['message'];
        $payload['body'] = ['trace_chain' => $chain($exception)];

        return [$message, $payload];
    }

    /**
     * Build generator error.
     *
     * @param object $object
     * @param string $file
     * @param int    $line
     *
     * @return array
     */
    protected function buildGeneratorError($object, $file, $line)
    {
        $item = new ErrorItem();

        return ['trace' => $item(0, serialize($object), $file, $line)];
    }

    /**
     * Get error payload.
     *
     * @param int    $code
     * @param string $message
     * @param string $file
     * @param int    $line
     *
     * @return array
     */
    public function getErrorPayload($code, $message, $file, $line)
    {
        $item = new ErrorItem();

        $payload = [
            'body'             => ['trace' => $item($code, $message, $file, $line)],
            'request'          => $this->getRequestInfo(),
            'environment'      => $this->getKernel()->getEnvironment(),
            'framework'        => Kernel::VERSION,
            'language_version' => phpversion(),
            'server'           => $this->getServerInfo(),
        ];

        return [$message, $payload];
    }

    /**
     * Get request info.
     *
     * @return array
     */
    protected function getRequestInfo()
    {
        $request = $this->getContainer()->get('request_stack')->getCurrentRequest();
        if (empty($request)) {
            $request = new Request();
        }

        return [
            'url'          => $request->getRequestUri(),
            'method'       => $request->getMethod(),
            'headers'      => $request->headers->all(),
            'query_string' => $request->getQueryString(),
            'body'         => $request->getContent(),
            'user_ip'      => $request->getClientIp(),
        ];
    }

    /**
     * Get server info.
     *
     * @return array
     */
    protected function getServerInfo()
    {
        $args   = isset($_SERVER['argv']) ? $_SERVER['argv'] : [];
        $kernel = $this->getKernel();

        return [
            'host' => gethostname(),
            'root' => $kernel->getRootDir(),
            'user' => get_current_user(),
            'file' => array_shift($args),
            'argv' => implode(' ', $args),
        ];
    }

    /**
     * Get container.
     *
     * @return ContainerInterface
     */
    public function getContainer()
    {
        return $this->container;
    }

    /**
     * Get kernel.
     *
     * @return Kernel
     */
    public function getKernel()
    {
        return $this->kernel;
    }
}
