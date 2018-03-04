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
define(["require","exports","jquery","./InfoWindow","./Modal","./ModuleMenu","./Severity","./Viewport"],function(e,t,n,o,r,a,i,l){"use strict";return function(){function e(){}return e.getReturnUrl=function(){return top.rawurlencode(top.list_frame.document.location.pathname+top.list_frame.document.location.search)},e.editRecord=function(t,n){l.ContentContainer.setUrl(top.TYPO3.settings.FormEngine.moduleUrl+"&edit["+t+"]["+n+"]=edit&returnUrl="+e.getReturnUrl())},e.viewRecord=function(e,t){var o=n(this).data("preview-url");o&&window.open(o,"newTYPO3frontendWindow").focus()},e.openInfoPopUp=function(e,t){o.showItem(e,t)},e.mountAsTreeRoot=function(e,t){"pages"===e&&l.NavigationContainer.PageTree.setTemporaryMountPoint(t)},e.newPageWizard=function(t,n){l.ContentContainer.setUrl(top.TYPO3.settings.NewRecord.moduleUrl+"&id="+n+"&pagesOnly=1&returnUrl="+e.getReturnUrl())},e.newContentWizard=function(t,o){var r=n(this).data("new-wizard-url");r&&(r+="&returnUrl="+e.getReturnUrl(),l.ContentContainer.setUrl(r))},e.newRecord=function(t,n){l.ContentContainer.setUrl(top.TYPO3.settings.FormEngine.moduleUrl+"&edit["+t+"][-"+n+"]=new&returnUrl="+e.getReturnUrl())},e.openHistoryPopUp=function(t,n){l.ContentContainer.setUrl(top.TYPO3.settings.RecordHistory.moduleUrl+"&element="+t+":"+n+"&returnUrl="+e.getReturnUrl())},e.openListModule=function(e,t){var o="pages"===e?t:n(this).data("page-uid");a.App.showModule("web_list","id="+o)},e.pagesSort=function(e,t){var o=n(this).data("pages-sort-url");o&&l.ContentContainer.setUrl(o)},e.pagesNewMultiple=function(e,t){var o=n(this).data("pages-new-multiple-url");o&&l.ContentContainer.setUrl(o)},e.disableRecord=function(t,n){l.ContentContainer.setUrl(top.TYPO3.settings.RecordCommit.moduleUrl+"&data["+t+"]["+n+"][hidden]=1&redirect="+e.getReturnUrl()).done(function(){l.NavigationContainer.PageTree.refreshTree()})},e.enableRecord=function(t,n){l.ContentContainer.setUrl(top.TYPO3.settings.RecordCommit.moduleUrl+"&data["+t+"]["+n+"][hidden]=0&redirect="+e.getReturnUrl()).done(function(){l.NavigationContainer.PageTree.refreshTree()})},e.deleteRecord=function(t,o){var a=n(this);r.confirm(a.data("title"),a.data("message"),i.warning,[{text:n(this).data("button-close-text")||TYPO3.lang["button.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:n(this).data("button-ok-text")||TYPO3.lang["button.delete"]||"Delete",btnClass:"btn-warning",name:"delete"}]).on("button.clicked",function(n){"delete"===n.target.getAttribute("name")&&l.ContentContainer.setUrl(top.TYPO3.settings.RecordCommit.moduleUrl+"&redirect="+e.getReturnUrl()+"&cmd["+t+"]["+o+"][delete]=1").done(function(){"pages"===t&&l.NavigationContainer.PageTree&&l.NavigationContainer.PageTree.refreshTree()}),r.dismiss()})},e.copy=function(t,o){var r=TYPO3.settings.ajaxUrls.contextmenu_clipboard+"&CB[el]["+t+"%7C"+o+"]=1&CB[setCopyMode]=1";n.ajax(r).always(function(){e.triggerRefresh(l.ContentContainer.get().location.href)})},e.clipboardRelease=function(t,o){var r=TYPO3.settings.ajaxUrls.contextmenu_clipboard+"&CB[el]["+t+"%7C"+o+"]=0";n.ajax(r).always(function(){e.triggerRefresh(l.ContentContainer.get().location.href)})},e.cut=function(t,o){var r=TYPO3.settings.ajaxUrls.contextmenu_clipboard+"&CB[el]["+t+"%7C"+o+"]=1&CB[setCopyMode]=0";n.ajax(r).always(function(){e.triggerRefresh(l.ContentContainer.get().location.href)})},e.triggerRefresh=function(e){-1===e.indexOf("record%2Fedit")&&l.ContentContainer.refresh(!0)},e.clearCache=function(e,t){var o=top.TYPO3.settings.WebLayout.moduleUrl+"&id="+t+"&clear_cache=1";n.ajax(o)},e.pasteAfter=function(t,o){e.pasteInto.bind(n(this))(t,-o)},e.pasteInto=function(t,o){var a=n(this),s=function(){var n="&CB[paste]="+t+"%7C"+o+"&CB[pad]=normal&redirect="+e.getReturnUrl();l.ContentContainer.setUrl(top.TYPO3.settings.RecordCommit.moduleUrl+n).done(function(){"pages"===t&&l.NavigationContainer.PageTree&&l.NavigationContainer.PageTree.refreshTree()})};a.data("title")?r.confirm(a.data("title"),a.data("message"),i.warning,[{text:n(this).data("button-close-text")||TYPO3.lang["button.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:n(this).data("button-ok-text")||TYPO3.lang["button.ok"]||"OK",btnClass:"btn-warning",name:"ok"}]).on("button.clicked",function(e){"ok"===e.target.getAttribute("name")&&s(),r.dismiss()}):s()},e}()});