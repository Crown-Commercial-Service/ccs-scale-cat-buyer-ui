<?php

namespace Rollbar\Symfony\RollbarBundle\Tests\Payload;

use Rollbar\Symfony\RollbarBundle\Payload\TraceChain;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Class TraceChainTest
 *
 * @package Rollbar\Symfony\RollbarBundle\Tests\Payload
 */
class TraceChainTest extends KernelTestCase
{
    /**
     * Test invoke.
     */
    public function testInvoke()
    {
        $previous = new \Exception('Exception', 1);
        $previous = new \Exception('Exception', 2, $previous);
        $ex       = new \Exception('Exception', 3, $previous);

        $trace = new TraceChain();
        $chain = $trace($ex);

        $this->assertCount(3, $chain);

        foreach ($chain as $item) {
            $this->assertArrayHasKey('exception', $item);
            $this->assertArrayHasKey('frames', $item);
        }
    }
}
