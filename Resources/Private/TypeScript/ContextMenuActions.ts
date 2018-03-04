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

import * as $ from 'jquery';
import InfoWindow = require('./InfoWindow');
import Modal = require('./Modal');
import ModuleMenu = require('./ModuleMenu');
import Severity = require('./Severity');
import Viewport = require('./Viewport');

/**
 * @exports TYPO3/CMS/Backend/ContextMenuActions
 */
class ContextMenuActions {
  /**
   * @returns {string}
   */
  public static getReturnUrl(): string {
    return top.rawurlencode(top.list_frame.document.location.pathname + top.list_frame.document.location.search);
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static editRecord(table: string, uid: number): void {
    Viewport.ContentContainer.setUrl(
      top.TYPO3.settings.FormEngine.moduleUrl + '&edit[' + table + '][' + uid + ']=edit&returnUrl=' + ContextMenuActions.getReturnUrl()
    );
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static viewRecord(table: string, uid: number): void {
    const $viewUrl = $(this).data('preview-url');
    if ($viewUrl) {
      const previewWin = window.open($viewUrl, 'newTYPO3frontendWindow');
      previewWin.focus();
    }
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static openInfoPopUp(table: string, uid: number): void {
    InfoWindow.showItem(table, uid);
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static mountAsTreeRoot(table: string, uid: number): void {
    if (table === 'pages') {
      Viewport.NavigationContainer.PageTree.setTemporaryMountPoint(uid);
    }
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static newPageWizard(table: string, uid: number): void {
    Viewport.ContentContainer.setUrl(
      top.TYPO3.settings.NewRecord.moduleUrl + '&id=' + uid + '&pagesOnly=1&returnUrl=' + ContextMenuActions.getReturnUrl()
    );
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static newContentWizard(table: string, uid: number): void {
    let $wizardUrl = $(this).data('new-wizard-url');
    if ($wizardUrl) {
      $wizardUrl += '&returnUrl=' + ContextMenuActions.getReturnUrl();
      Viewport.ContentContainer.setUrl($wizardUrl);
    }
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static newRecord(table: string, uid: number): void {
    Viewport.ContentContainer.setUrl(
      top.TYPO3.settings.FormEngine.moduleUrl + '&edit[' + table + '][-' + uid + ']=new&returnUrl=' + ContextMenuActions.getReturnUrl()
    );
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static openHistoryPopUp(table: string, uid: number): void {
    Viewport.ContentContainer.setUrl(
      top.TYPO3.settings.RecordHistory.moduleUrl + '&element=' + table + ':' + uid + '&returnUrl=' + ContextMenuActions.getReturnUrl()
    );
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static openListModule(table: string, uid: number): void {
    const pageId = table === 'pages' ? uid : $(this).data('page-uid');
    ModuleMenu.App.showModule('web_list', 'id=' + pageId);
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static pagesSort(table: string, uid: number): void {
    const pagesSortUrl = $(this).data('pages-sort-url');
    if (pagesSortUrl) {
      Viewport.ContentContainer.setUrl(pagesSortUrl);
    }
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static pagesNewMultiple(table: string, uid: number): void {
    const pagesSortUrl = $(this).data('pages-new-multiple-url');
    if (pagesSortUrl) {
      Viewport.ContentContainer.setUrl(pagesSortUrl);
    }
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static disableRecord(table: string, uid: number): void {
    Viewport.ContentContainer.setUrl(
      top.TYPO3.settings.RecordCommit.moduleUrl
      + '&data[' + table + '][' + uid + '][hidden]=1'
      + '&redirect=' + ContextMenuActions.getReturnUrl()
    ).done((): void => {
      Viewport.NavigationContainer.PageTree.refreshTree();
    });
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static enableRecord(table: string, uid: number): void {
    Viewport.ContentContainer.setUrl(
      top.TYPO3.settings.RecordCommit.moduleUrl
      + '&data[' + table + '][' + uid + '][hidden]=0'
      + '&redirect=' + ContextMenuActions.getReturnUrl()
    ).done((): void => {
      Viewport.NavigationContainer.PageTree.refreshTree();
    });
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static deleteRecord(table: string, uid: number): void {
    const $anchorElement = $(this);
    const $modal = Modal.confirm(
      $anchorElement.data('title'),
      $anchorElement.data('message'),
      Severity.warning, [
        {
          text: $(this).data('button-close-text') || TYPO3.lang['button.cancel'] || 'Cancel',
          active: true,
          btnClass: 'btn-default',
          name: 'cancel'
        },
        {
          text: $(this).data('button-ok-text') || TYPO3.lang['button.delete'] || 'Delete',
          btnClass: 'btn-warning',
          name: 'delete'
        }
      ]);

    $modal.on('button.clicked', (e: JQueryEventObject): void => {
      if (e.target.getAttribute('name') === 'delete') {
        Viewport.ContentContainer.setUrl(
          top.TYPO3.settings.RecordCommit.moduleUrl
          + '&redirect=' + ContextMenuActions.getReturnUrl()
          + '&cmd[' + table + '][' + uid + '][delete]=1'
        ).done((): void => {
          if (table === 'pages' && Viewport.NavigationContainer.PageTree) {
            Viewport.NavigationContainer.PageTree.refreshTree();
          }
        });
      }
      Modal.dismiss();
    });
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static copy(table: string, uid: number): void {
    const url = TYPO3.settings.ajaxUrls.contextmenu_clipboard
      + '&CB[el][' + table + '%7C' + uid + ']=1'
      + '&CB[setCopyMode]=1';

    $.ajax(url).always((): void => {
      ContextMenuActions.triggerRefresh(Viewport.ContentContainer.get().location.href);
    });
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static clipboardRelease(table: string, uid: number): void {
    const url = TYPO3.settings.ajaxUrls.contextmenu_clipboard
      + '&CB[el][' + table + '%7C' + uid + ']=0';

    $.ajax(url).always((): void => {
      ContextMenuActions.triggerRefresh(Viewport.ContentContainer.get().location.href);
    });
  }

  /**
   * @param {string} table
   * @param {number} uid
   */
  public static cut(table: string, uid: number): void {
    const url = TYPO3.settings.ajaxUrls.contextmenu_clipboard
      + '&CB[el][' + table + '%7C' + uid + ']=1'
      + '&CB[setCopyMode]=0';

    $.ajax(url).always((): void => {
      ContextMenuActions.triggerRefresh(Viewport.ContentContainer.get().location.href);
    });
  }

  /**
   * @param {string} iframeUrl
   */
  public static triggerRefresh(iframeUrl: string): void {
    if (iframeUrl.indexOf('record%2Fedit') === -1) {
      Viewport.ContentContainer.refresh(true);
    }
  }

  /**
   * Clear cache for given page uid
   *
   * @param {string} table pages table
   * @param {number} uid uid of the page
   */
  public static clearCache(table: string, uid: number): void {
    const url = top.TYPO3.settings.WebLayout.moduleUrl
      + '&id=' + uid + '&clear_cache=1';
    $.ajax(url);
  }

  /**
   * Paste db record after another
   *
   * @param {string} table any db table except sys_file
   * @param {number} uid uid of the record after which record from the cliboard will be pasted
   */
  public static pasteAfter(table: string, uid: number): void {
    ContextMenuActions.pasteInto.bind($(this))(table, -uid);
  }

  /**
   * Paste page into another page
   *
   * @param {string} table any db table except sys_file
   * @param {number} uid uid of the record after which record from the cliboard will be pasted
   */
  public static pasteInto(table: string, uid: number): void {
    const $anchorElement = $(this);
    const performPaste = (): void => {
      const url = '&CB[paste]=' + table + '%7C' + uid
        + '&CB[pad]=normal'
        + '&redirect=' + ContextMenuActions.getReturnUrl();

      Viewport.ContentContainer.setUrl(
        top.TYPO3.settings.RecordCommit.moduleUrl + url
      ).done((): void => {
        if (table === 'pages' && Viewport.NavigationContainer.PageTree) {
          Viewport.NavigationContainer.PageTree.refreshTree();
        }
      });
    };
    if (!$anchorElement.data('title')) {
      performPaste();
      return;
    }
    const $modal = Modal.confirm(
      $anchorElement.data('title'),
      $anchorElement.data('message'),
      Severity.warning, [
        {
          text: $(this).data('button-close-text') || TYPO3.lang['button.cancel'] || 'Cancel',
          active: true,
          btnClass: 'btn-default',
          name: 'cancel'
        },
        {
          text: $(this).data('button-ok-text') || TYPO3.lang['button.ok'] || 'OK',
          btnClass: 'btn-warning',
          name: 'ok'
        }
      ]);

    $modal.on('button.clicked', (e: JQueryEventObject): void => {
      if (e.target.getAttribute('name') === 'ok') {
        performPaste();
      }
      Modal.dismiss();
    });
  }
}

export = ContextMenuActions;
