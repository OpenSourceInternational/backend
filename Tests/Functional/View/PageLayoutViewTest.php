<?php
declare(strict_types = 1);

namespace TYPO3\CMS\Backend\Tests\Functional\View;

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

use TYPO3\CMS\Backend\View\PageLayoutView;
use TYPO3\CMS\Core\Core\Bootstrap;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\TestingFramework\Core\AccessibleObjectInterface;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

class PageLayoutViewTest extends FunctionalTestCase
{
    /**
     * @var PageLayoutView|AccessibleObjectInterface
     */
    private $subject;

    /**
     * Sets up this test case.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpBackendUserFromFixture(1);
        Bootstrap::initializeLanguageObject();

        $this->subject = $this->getAccessibleMock(PageLayoutView::class, ['dummy']);
        $this->subject->_set('siteLanguages', [
            0 => new SiteLanguage(0, '', '/', [
                'title' => 'default',
            ]),
            1 => new SiteLanguage(1, '', '/', [
                'title' => 'german',
            ]),
            2 => new SiteLanguage(2, '', '/', [
                'title' => 'french',
            ]),
            3 => new SiteLanguage(3, '', '/', [
                'title' => 'polish',
            ]),
        ]);
    }

    /**
     * @test
     */
    public function languageSelectorShowsAllAvailableLanguagesForTranslation()
    {
        $this->importCSVDataSet(ORIGINAL_ROOT . 'typo3/sysext/backend/Tests/Functional/View/Fixtures/LanguageSelectorScenarioDefault.csv');

        $result = $this->subject->languageSelector(17);

        $matches = [];

        preg_match_all('/<option value=.+<\/option>/', $result, $matches);
        $resultingOptions = GeneralUtility::trimExplode('</option>', $matches[0][0], true);
        $this->assertCount(4, $resultingOptions);
        // first entry is the empty option
        $this->assertStringEndsWith('german', $resultingOptions[1]);
        $this->assertStringEndsWith('french', $resultingOptions[2]);
        $this->assertStringEndsWith('polish', $resultingOptions[3]);
    }

    /**
     * @test
     */
    public function languageSelectorDoesNotOfferLanguageIfTranslationHasBeenDoneAlready()
    {
        $this->importCSVDataSet(ORIGINAL_ROOT . 'typo3/sysext/backend/Tests/Functional/View/Fixtures/LanguageSelectorScenarioTranslationDone.csv');
        $result = $this->subject->languageSelector(17);

        $matches = [];

        preg_match_all('/<option value=.+<\/option>/', $result, $matches);
        $resultingOptions = GeneralUtility::trimExplode('</option>', $matches[0][0], true);
        $this->assertCount(3, $resultingOptions);
        // first entry is the empty option
        $this->assertStringEndsWith('german', $resultingOptions[1]);
        $this->assertStringEndsWith('french', $resultingOptions[2]);
    }
}
