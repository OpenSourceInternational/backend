/**
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

/**
 * Flashmessage rendered by ExtJS
 *
 * @author Steffen Kamper <info@sk-typo3.de>
 */
Ext.ns('TYPO3');

/**
 * Object for named severities
 */
TYPO3.Severity = {
	notice: 0,
	information: 1,
	ok: 2,
	warning: 3,
	error: 4
};

/**
 * @class TYPO3.Flashmessage
 * Passive popup box singleton
 * @singleton
 *
 * Example (Information message):
 * TYPO3.Flashmessage.display(1, 'TYPO3 Backend - Version 4.4', 'Ready for take off', 3);
 */
TYPO3.Flashmessage = function() {
	var messageContainer;
	var severities = ['notice', 'information', 'ok', 'warning', 'error'];
	var classMap = {
		'notice': 'notice',
		'information': 'info',
		'ok': 'success',
		'warning': 'warning',
		'error': 'danger'
	}

	function createBox(severity, title, message) {
		var className = (severity !== undefined && severities[severity] ? classMap[severities[severity]] : classMap['information']);
		return ['<div class="typo3-messages"><div class="alert alert-', className, '" style="width: 400px">',
				'<div class="pull-right t3-icon fa fa-close t3js-icon-actions-message-close" style="cursor: pointer;"></div>',
				'<h4>', title, '</h4>',
				'<div class="alert-body">', message, '</div>',
				'</div></div>'].join('');
	}

	return {
		/**
		 * Shows popup
		 * @member TYPO3.Flashmessage
		 * @param int severity (0=notice, 1=information, 2=ok, 3=warning, 4=error)
		 * @param string title
		 * @param string message
		 * @param float duration in sec (default 5)
		 */
		display : function(severity, title, message, duration) {
			duration = duration || 5;
			if (!messageContainer) {
				messageContainer = Ext.DomHelper.insertFirst(document.body, {
					id   : 'msg-div',
					style: 'position:absolute;z-index:10000'
				}, true);
			}

			var box = Ext.DomHelper.append(messageContainer, {
				html: createBox(severity, title, message)
			}, true);
			messageContainer.alignTo(document, 't-t');
			box.child('.t3js-icon-actions-message-close').on('click', function (e, t, o) {
				var node;
				node = new Ext.Element(Ext.get(t).findParent('div.typo3-messages'));
				node.hide();
				Ext.removeNode(node.dom);
			}, box);
			box.slideIn('t').pause(duration).ghost('t', {remove: true});
		}
	};
}();
