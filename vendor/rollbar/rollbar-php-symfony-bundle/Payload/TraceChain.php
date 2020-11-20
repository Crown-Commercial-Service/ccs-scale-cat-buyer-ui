<?php

namespace Rollbar\Symfony\RollbarBundle\Payload;

/**
 * Class TraceChain
 *
 * @package Rollbar\Symfony\RollbarBundle\Payload
 */
class TraceChain
{
    /**
     * Invoke.
     *
     * @param $throwable
     *
     * @return array
     */
    public function __invoke($throwable)
    {
        $chain = [];
        $item  = new TraceItem();

        while (!empty($throwable)) {
            $chain[] = $item($throwable);
            $throwable = $throwable->getPrevious();
        }

        return $chain;
    }
}
