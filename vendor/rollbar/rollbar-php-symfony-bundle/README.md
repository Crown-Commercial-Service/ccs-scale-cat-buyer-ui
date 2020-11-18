# Rollbar for Symfony
[![codecov](https://codecov.io/gh/rollbar/rollbar-php-symfony3-bundle/branch/master/graph/badge.svg)](https://codecov.io/gh/rollbar/rollbar-php-symfony-bundle)
[![Build Status](https://travis-ci.org/rollbar/rollbar-php-symfony-bundle.svg?branch=master)](https://travis-ci.org/rollbar/rollbar-php-symfony-bundle)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

Rollbar full-stack error tracking for Symfony.

Supported Symfony versions: 3+, 4+.

**NOTE 10/08/2018**
The package has been renamed to `rollbar/rollbar-php-symfony-bundle` to reflect support for Symfony 3 and 4. If you have been using the package using the old name (`rollbar/rollbar-php-symfony3-bundle`) make sure to update your `composer.json` to use the new package name.

## Setup Instructions
1. [Sign up for a Rollbar account](https://rollbar.com/signup)
2. Follow the [Installation](https://docs.rollbar.com/v1.0.0/docs/symfony#section-installation) instructions in our [Symfony SDK docs](https://docs.rollbar.com/docs/symfony) to install `rollbar-php-symfony-bundle` and configure it for your platform.

# Usage and Reference

For complete usage instructions, see our [Symfony SDK docs](https://docs.rollbar.com/docs/symfony).

For complete configuration reference, see our [PHP SDK docs](https://docs.rollbar.com/v1.0.0/docs/php#section-configuration-reference)

# Release History & Changelog

See our [Releases](https://github.com/rollbar/rollbar-php-symfony3-bundle/releases) page for a list of all releases, including changes.

# Related projects

A range of examples of using Rollbar PHP is available here: [Rollbar PHP Examples](https://github.com/rollbar/rollbar-php-examples).

A Wordpress Plugin is available through Wordpress Admin Panel or through Wordpress Plugin directory: [Rollbar Wordpress](https://wordpress.org/plugins/rollbar/)

A Laravel-specific package is available for integrating with Laravel: [Rollbar Laravel](https://github.com/rollbar/rollbar-php-laravel)

A CakePHP-specific package is avaliable for integrating with CakePHP 2.x:
[CakeRollbar](https://github.com/tranfuga25s/CakeRollbar)

A Flow-specific package is available for integrating with Neos Flow: [m12/flow-rollbar](https://packagist.org/packages/m12/flow-rollbar)

Yii package: [baibaratsky/yii-rollbar](https://github.com/baibaratsky/yii-rollbar)

Yii2 package: [baibaratsky/yii2-rollbar](https://github.com/baibaratsky/yii2-rollbar)

# Help / Support

If you run into any issues, please email us at [support@rollbar.com](mailto:support@rollbar.com)

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar-php-symfony3-bundle/issues/new).

# Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

# Testing
Tests are in `tests`.
To run the tests: `composer test`
To fix code style issues: `composer fix`
