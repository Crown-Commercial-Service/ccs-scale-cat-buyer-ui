<?php

namespace Rollbar\Symfony\RollbarBundle\Tests\Payload;

use Rollbar\Symfony\RollbarBundle\Payload\TraceItem;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Class TraceItemTest
 *
 * @package Rollbar\Symfony\RollbarBundle\Tests\Payload
 */
class TraceItemTest extends KernelTestCase
{
    /**
     * Test invoke.
     */
    public function testInvoke()
    {
        $msg = 'Text exception - ' . md5(microtime());
        $ex  = new \Exception($msg, 7);

        $item = new TraceItem();
        $data = $item($ex);

        $this->assertNotEmpty($data['exception']);
        $this->assertNotEmpty($data['frames']);

        $exception = $data['exception'];
        $this->assertEquals(get_class($ex), $exception['class']);
        $this->assertContains($msg, $exception['message']);

        $this->assertGreaterThan(1, count($data['frames']));

        $frame = $data['frames'][0];
        $this->assertTrue(array_key_exists('filename', $frame));
        $this->assertTrue(array_key_exists('lineno', $frame));
        $this->assertTrue(array_key_exists('class_name', $frame));
    }
}
