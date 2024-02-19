/**
 * LICENCE[[
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1/CeCILL 2.O
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is kelis.fr code.
 *
 * The Initial Developer of the Original Code is 
 * samuel.monsarrat@kelis.fr
 *
 * Portions created by the Initial Developer are Copyright (C) 2016
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * or the CeCILL Licence Version 2.0 (http://www.cecill.info),
 * in which case the provisions of the GPL, the LGPL or the CeCILL are applicable
 * instead of those above. If you wish to allow use of your version of this file
 * only under the terms of either the GPL, the LGPL or the CeCILL, and not to allow
 * others to use your version of this file under the terms of the MPL, indicate
 * your decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL, the LGPL or the CeCILL. If you do not
 * delete the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL, the LGPL or the CeCILL.
 * ]]LICENCE
 */

/* === Office outline manager =============================================== */
var outMgr = {
	fUrlOutline : null,
	fIsLocal : window.location.protocol == "file:",
	
/* === Public functions ===================================================== */
	declareOutline : function(pUrl){
		this.fUrlOutline = pUrl;
	},

/* === Private functions ==================================================== */
	xGetOutline : function() {
		try{
			var vReq = this.xGetHttpRequest();
			vReq.open("GET",this.fUrlOutline,false);
			vReq.send();
			return this.xDeserialiseObjJs(vReq.responseText);
		}catch(e){}
	},

	/* === Utilities ========================================================== */
	xGetHttpRequest: function(){
		if (window.XMLHttpRequest && (!this.fIsLocal || !window.ActiveXObject)) return new XMLHttpRequest();
		else if (window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
	},

	xDeserialiseObjJs : function(pStr){
		if(!pStr) return {};
		var vVal;
		eval("vVal="+pStr);
		return vVal;
	}
}
