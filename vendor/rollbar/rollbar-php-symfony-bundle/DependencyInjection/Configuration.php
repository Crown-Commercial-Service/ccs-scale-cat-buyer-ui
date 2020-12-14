<?php

namespace Rollbar\Symfony\RollbarBundle\DependencyInjection;

use Rollbar\Config;
use Rollbar\Defaults;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * Class Configuration
 *
 * @link https://rollbar.com/docs/notifier/rollbar-php/#configuration-reference
 *
 * @package Rollbar\Symfony\RollbarBundle\DependencyInjection
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rollbarConfigNode = $treeBuilder->root(RollbarExtension::ALIAS);
        $rollbarConfigNodeChildren = $rollbarConfigNode->children();

        $configOptions = Config::listOptions();
        $rollbarDefaults = Defaults::get();

        foreach ($configOptions as $option) {
            switch ($option) {
                case 'branch':
                    $method = 'gitBranch';
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

            if (is_array($default)) {
                $rollbarConfigNodeChildren
                    ->arrayNode($option)
                        ->scalarPrototype()->end()
                        ->defaultValue($default)
                    ->end();
            } else {
                $rollbarConfigNodeChildren
                    ->scalarNode($option)
                        ->defaultValue($default)
                    ->end();
            }
        }

        return $treeBuilder;
    }
}
