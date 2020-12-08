<?php

namespace Rollbar\Symfony\RollbarBundle\Tests\DependencyInjection;

use Rollbar\Config;
use Rollbar\Defaults;
use Rollbar\Symfony\RollbarBundle\DependencyInjection\RollbarExtension;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Class ConfigurationTest
 *
 * @package Rollbar\Symfony\RollbarBundle\Tests\DependencyInjection;
 */
class ConfigurationTest extends KernelTestCase
{
    /**
     * Test parameters.
     */
    public function testParameters()
    {
        static::bootKernel();
        $container = isset(static::$container) ? static::$container : static::$kernel->getContainer();

        $config = $container->getParameter(RollbarExtension::ALIAS . '.config');

        $configOptions = Config::listOptions();
        $rollbarDefaults = Defaults::get();

        $defaults = [];
        foreach ($configOptions as $option) {
            // Handle the "branch" exception
            switch ($option) {
                case "branch":
                    $method = "gitBranch";
                    break;
                default:
                    $method = $option;
                    break;
            }

            try {
                $default = $rollbarDefaults->fromSnakeCase($method);
            } catch (\Exception $e) {
                $default = null;
            }

            $defaults[$option] = $default;
        }

        $this->assertNotEmpty($config);
        $this->assertEquals($defaults, $config);
    }
}
