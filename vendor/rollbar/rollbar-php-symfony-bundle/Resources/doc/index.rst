Rollbar for Symfony 3
=====================

|codecov| |Build Status| |Software License|

Rollbar full-stack error tracking for Symfony 3

Description
-----------

Rollbar collects errors that happen in your application, notifies you,
and analyzes them so you can debug and fix them.

This plugin integrates Rollbar into your Symfony 3 installation.

Find out `how Rollbar can help you decrease development and maintenance
costs`_.

See `real companies improving their development workflow thanks to
Rollbar`_.

Requirements
------------

This bundle depends on `symfony/monolog-bundle`_.

Installation
------------

1. Add ``Rollbar for Symfony`` with composer:
   ``composer require rollbar/rollbar-php-symfony3-bundle``
2. Register ``Rollbar\Symfony\RollbarBundle`` in
   ``AppKernel::registerBundles()`` **after** registering the
   ``MonologBundle``
   (``new Symfony\Bundle\MonologBundle\MonologBundle()``).

.. code:: php


        public function registerBundles()
        {
            $bundles = [
                // ...
                new \Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
                // ...
                new Symfony\Bundle\MonologBundle\MonologBundle(),
                // ...
                new \SymfonyRollbarBundle\SymfonyRollbarBundle(),
                // ...
            ];

            return $bundles;
        }
        

3. Configure Rollbar and Monolog in your ``app/config.yml`` or
   ``app/config_*.yml``.

.. code:: yaml


    rollbar:
      access_token: YourAccessToken
      environment: YourEnvironmentName
        
    monolog:
      handlers:
        rollbar:
          type: service
          id: Rollbar\Monolog\Handler\RollbarHandler
        

Usage
-----

Exception reporting
~~~~~~~~~~~~~~~~~~~

Symfony 3 exceptions will be reported to Rollbar automatically after you
install and configure the bundle.

Manual reporting
~~~~~~~~~~~~~~~~

This bundle injects itself into the Monolog loggers. Thanks to this, all
of the Monolog logs will be automatically passed to Rollbar as well.

All you need to do is obtain the ``LoggerInterface`` implementation from
the service container.

\```php

namespace AppBundle:raw-latex:`\Controller`;

use
Sensio:raw-latex:`\Bundle`:raw-latex:`\FrameworkExtraBundle`:raw-latex:`\Configuration`:raw-latex:`\Route`;
use
Symfony:raw-latex:`\Bundle`:raw-latex:`\FrameworkBundle`:raw-latex:`\Controller`:raw-latex:`\Controller`;
use
Symfony:raw-latex:`\Component`:raw-latex:`\HttpFoundation`:raw-latex:`\Request`;
use Psr:raw-latex:`\Log`:raw-latex:`\LoggerInterface`;

class DefaultController extends Controller { /*\* \* @Route(“/”,
name=“homepage”) \*/ public function indexAction(Request $request,
LoggerInterface $logger) { $logger->error(‘Test info with person data’);

::

          // replace this example code with whatever you need
          return $this->rende

.. _how Rollbar can help you decrease development and maintenance costs: https://rollbar.com/features/
.. _real companies improving their development workflow thanks to Rollbar: https://rollbar.com/customers/
.. _symfony/monolog-bundle: https://github.com/symfony/monolog-bundle

.. |codecov| image:: https://codecov.io/gh/rollbar/rollbar-php-symfony3-bundle/branch/master/graph/badge.svg
   :target: https://codecov.io/gh/rollbar/rollbar-php-symfony3-bundle
.. |Build Status| image:: https://travis-ci.org/rollbar/rollbar-php-symfony3-bundle.svg?branch=master
   :target: https://travis-ci.org/rollbar/rollbar-php-symfony3-bundle
.. |Software License| image:: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
   :target: LICENSE