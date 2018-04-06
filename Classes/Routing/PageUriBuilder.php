<?php
declare(strict_types = 1);
namespace TYPO3\CMS\Backend\Routing;

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

use Psr\Http\Message\UriInterface;
use TYPO3\CMS\Core\Exception\SiteNotFoundException;
use TYPO3\CMS\Core\Http\Uri;
use TYPO3\CMS\Core\SingletonInterface;
use TYPO3\CMS\Core\Site\SiteFinder;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * Responsible for generates URLs to pages which are NOT bound to any permissions or frontend restrictions.
 *
 * If a page is built with a site in the root line, the base of the site (+ language) is used
 * and the &L parameter is then dropped explicitly.
 *
 * @internal as this might change until TYPO3 v9 LTS
 * @todo: check handling of MP parameter.
 */
class PageUriBuilder implements SingletonInterface
{
    /**
     * Generates an absolute URL
     */
    const ABSOLUTE_URL = 'url';

    /**
     * Generates an absolute path
     */
    const ABSOLUTE_PATH = 'path';

    /**
     * @var SiteFinder
     */
    protected $siteFinder;

    /**
     * PageUriBuilder constructor.
     */
    public function __construct()
    {
        $this->siteFinder = GeneralUtility::makeInstance(SiteFinder::class);
    }

    /**
     * Main entrypoint for generating an Uri for a page.
     *
     * @param int $pageId
     * @param array $queryParameters
     * @param string $fragment
     * @param array $options ['language' => 123, 'rootLine' => etc.]
     * @param string $referenceType
     * @return UriInterface
     */
    public function buildUri(int $pageId, array $queryParameters = [], string $fragment = null, array $options = [], string $referenceType = self::ABSOLUTE_PATH): UriInterface
    {
        // Resolve site
        $languageOption = isset($options['language']) ? (int)$options['language'] : null;
        $languageQueryParameter = isset($queryParameters['L']) ? (int)$queryParameters['L'] : null;
        $languageId = $languageOption ?? $languageQueryParameter ?? null;

        // alternative page ID - Used to set as alias as well
        $alternativePageId = $options['alternativePageId'] ?? $pageId;
        $siteLanguage = null;
        try {
            $site = $this->siteFinder->getSiteByPageId($pageId, $options['rootLine'] ?? null);
            if ($site) {
                // Resolve language (based on the options / query parameters, and remove it from GET variables,
                // as the language is determined by the language path
                unset($queryParameters['L']);
                $siteLanguage = $site->getLanguageById($languageId ?? 0);
            }
        } catch (SiteNotFoundException | \InvalidArgumentException $e) {
        }

        // If something is found, use /en/?id=123&additionalParams
        // Only if a language is configured for the site, build a URL with a site prefix / base
        if ($siteLanguage) {
            unset($options['legacyUrlPrefix']);
            $prefix = $siteLanguage->getBase() . '?id=' . $alternativePageId;
        } else {
            // If nothing is found, use index.php?id=123&additionalParams
            $prefix = $options['legacyUrlPrefix'] ?? null;
            if ($prefix === null) {
                $prefix = $referenceType === self::ABSOLUTE_URL ? GeneralUtility::getIndpEnv('TYPO3_SITE_URL') : '';
            }
            $prefix .= 'index.php?id=' . $alternativePageId;
            if ($languageId !== null) {
                $queryParameters['L'] = $languageId;
            }
        }

        // Add the query parameters as string
        $queryString = http_build_query($queryParameters, '', '&', PHP_QUERY_RFC3986);
        $uri = new Uri($prefix . ($queryString ? '&' . $queryString : ''));
        if ($fragment) {
            $uri = $uri->withFragment($fragment);
        }
        if ($referenceType === self::ABSOLUTE_PATH && !isset($options['legacyUrlPrefix'])) {
            $uri = $uri->withScheme('')->withHost('')->withPort(null);
        }
        return $uri;
    }
}
