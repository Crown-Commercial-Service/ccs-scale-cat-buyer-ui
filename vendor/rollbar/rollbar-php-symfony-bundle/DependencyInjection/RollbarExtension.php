<?php

namespace Rollbar\Symfony\RollbarBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

/**
 * Class RollbarExtension
 *
 * @package Rollbar\Symfony\RollbarBundle\DependencyInjection
 */
class RollbarExtension extends Extension
{
    const ALIAS = 'rollbar';

    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config        = $this->processConfiguration($configuration, $configs);

        // load services and register listeners
        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.yml');

        // store parameters for external use
        $container->setParameter(static::ALIAS . '.config', $config);
    }

    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return static::ALIAS;
    }
}
