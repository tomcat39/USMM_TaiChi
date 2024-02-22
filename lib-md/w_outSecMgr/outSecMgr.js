/* === Outline Section Manager =============================================== */
var outSecMgr = {
	fTimer : 30,
    fTimeOut : null,
    fPrevScrollVal : 0,
    fOverflowMethod : "hidden",
   	fCls : "mnuSec",

   	fStrings : ["défilement haut","Faire défiler le menu vers le haut",
	            "défilement bas","Faire défiler le menu vers le bas"],

/* === Public API =========================================================== */
	/** init function - must be called at the end of page body */
	init : function(pPathMain, pPathMnu){
		try {
			if (typeof pPathMain != "undefined") this.fPathMain = pPathMain;
			if (typeof pPathMnu != "undefined") this.fPathMnu = pPathMnu;

			this.fMain = scPaLib.findNode(this.fPathMain);
			var vMnu = scPaLib.findNode(this.fPathMnu);
			this.fOut = scPaLib.findNode("chi:ul", vMnu);
			if (!this.fMain || !vMnu || !this.fOut) return;

			this.fBeginTimer = this.fTimer;			

			var vLnks = scPaLib.findNodes("chi:li/chi:a", this.fOut);
			for (var i = 0; i < vLnks.length; i++) {
				var vLnk = vLnks[i];
				vLnk.onclick = function() {
					var vId = this.href.substring(this.href.indexOf("#")+1);
					outSecMgr.xAnimScroll(vId);
					return false;
				};
			}

			// Init Scroll
			this.fOut.style.overflow=this.fOverflowMethod;
			this.fOut.parentNode.className = this.fOut.scrollTop == 0 && scSiLib.getContentHeight(this.fOut) + scCoLib.toInt(window.getComputedStyle(this.fOut, null).getPropertyValue('padding')) - this.fOut.scrollTop == this.fOut.offsetHeight?"noScroll":"";			
			this.fSrlUp = scDynUiMgr.addElement("div", vMnu, this.fCls+"SrlUpFra", this.fOut);
			this.fSrlUpBtn = this.xAddBtn(this.fSrlUp, this.fCls+"SrlUpBtn", this.fStrings[0], this.fStrings[1]);
			this.fSrlDwn = scDynUiMgr.addElement("div", vMnu, this.fCls+"SrlDwnFra");
			this.fSrlDwnBtn = this.xAddBtn(this.fSrlDwn, this.fCls+"SrlDwnBtn", this.fStrings[2], this.fStrings[3]);

			scOnLoads[scOnLoads.length] = this;
			
		} catch(e){scCoLib.log("ERROR outSecMgr.init : "+e)}
	},

	onLoad : function() {
		// Init Scroll up button
		this.fSrlUp.onclick = function(){
			outSecMgr.scrollTask.fSpeed -= 2;
		}
		this.fSrlUp.onmouseover = function(){
			if(outSecMgr.scrollTask.fSpeed >= 0) {
				outSecMgr.scrollTask.fSpeed = -2; 
				scTiLib.addTaskNow(outSecMgr.scrollTask);
			}
		}
		this.fSrlUp.onmouseout = function(){
			outSecMgr.scrollTask.fSpeed = 0;
		}
		this.fSrlUpBtn.onclick = function(){
			outSecMgr.scrollTask.step(-20); 
			return false;
		}
		// Init Scroll down button
		this.fSrlDwn.onclick = function(){
			outSecMgr.scrollTask.fSpeed += 2;
		}
		this.fSrlDwn.onmouseover = function(){
			if(outSecMgr.scrollTask.fSpeed <= 0) {
				outSecMgr.scrollTask.fSpeed = 2; 
				scTiLib.addTaskNow(outSecMgr.scrollTask);
			}
		}
		this.fSrlDwn.onmouseout = function(){
			outSecMgr.scrollTask.fSpeed = 0;
		}
		this.fSrlDwnBtn.onclick = function(){
			outSecMgr.scrollTask.step(20);
			return false;
		}
		// Init scroll manager
		this.scrollTask.checkBtn();
		scSiLib.addRule(this.fOut, this.scrollTask);
		this.fOut.onscroll = function(){outSecMgr.scrollTask.checkBtn()};
		this.fOut.onmousewheel = function(){outSecMgr.scrollTask.step(Math.round(-event.wheelDelta/(scCoLib.isIE ? 60 : 40)))}; //IE, Safari, Chrome, Opera.
		if(this.fOut.addEventListener) this.fOut.addEventListener('DOMMouseScroll', function(pEvent){outSecMgr.scrollTask.step(pEvent.detail)}, false);
	},

/* === Private =========================================================== */
	xStopShow: function(){
		clearTimeout(this.fTimeOut);
		this.fTimer = this.fBeginTimer;
	},

	xGetPageScroll : function()
	{
		return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
	},

	xAnimScroll : function (pId)
	{
		this.xStopShow();
		var vPos, vDir, vStep;
		var vIllus = sc$("illus");
		var vMainTop =  this.fMain.offsetTop;
		var vPageOffSetTop = this.xGetPageScroll();
		var vNodeOffsetTop = sc$(pId).offsetTop;
		
		if (vIllus){
			var vNodeOffsetTop = sc$(pId).offsetTop + 440;
		}

		if (vPageOffSetTop === null || isNaN(vPageOffSetTop) || vPageOffSetTop === 'undefined') vPageOffSetTop = 0;

		var vCurrentScrollVal = vNodeOffsetTop - vPageOffSetTop;

		if (vCurrentScrollVal > vMainTop) {
			vPos = (vNodeOffsetTop - vMainTop - vPageOffSetTop); 
			vDir = 1;
		}

		if (vCurrentScrollVal < vMainTop) {
			vPos = (vPageOffSetTop + vMainTop) - vNodeOffsetTop;
			vDir = -1; 
		}

		if(vCurrentScrollVal !== vMainTop) {
			vStep = ~~((vPos / 4) +1) * vDir;

			if(this.fTimer > 1) this.fTimer -= 1; 
			else this.itter = 0; // decrease the timeout timer value but not below 0
			window.scrollBy(0, vStep);
			this.fTimeOut = window.setTimeout(function()
			{
				outSecMgr.xAnimScroll(pId);  
			}, this.fTimer); 
		}  

		if(Math.round(vCurrentScrollVal) === Math.round(vMainTop) || Math.round(this.fPrevScrollVal) == Math.round(vCurrentScrollVal)) 
		{ 
			this.xStopShow();
			return;
		}

		this.fPrevScrollVal = vCurrentScrollVal;
	},

	/** outMgr.xAddBtn : Add a HTML button to a parent node. */
	xAddBtn : function(pParent, pClassName, pCapt, pTitle, pNxtSib) {
		var vBtn = pParent.ownerDocument.createElement("a");
		vBtn.className = pClassName;
		vBtn.fName = pClassName;
		vBtn.href = "#";
		vBtn.target = "_self";
		if (pTitle) vBtn.setAttribute("title", pTitle);
		if (pCapt) vBtn.innerHTML = "<span>" + pCapt + "</span>"
		if (pNxtSib) pParent.insertBefore(vBtn,pNxtSib)
		else pParent.appendChild(vBtn);
		return vBtn;
	},

	/* === Tasks ============================================================== */
	/** outSecMgr.scrollTask : menu scroll timer & size task */
	scrollTask : {
		fClassOffUp : "btnOff",
		fClassOffDown : "btnOff",
		fSpeed : 0,
		execTask : function(){
			try {
				if(this.fSpeed == 0) return false;
				outSecMgr.fOut.scrollTop += this.fSpeed;
				return true;
			}catch(e){
				this.fSpeed = 0;
				return false;
			}
		},
		step: function(pPx) {
			try { outSecMgr.fOut.scrollTop += pPx; }catch(e){}
		},
		checkBtn: function(){
			var vScrollTop = outSecMgr.fOut.scrollTop;
			var vContentH = scSiLib.getContentHeight(outSecMgr.fOut);
			var vBtnUpOff = outSecMgr.fSrlUp.className.indexOf(this.fClassOffUp);
			var vBtnDownOff = outSecMgr.fSrlDwn.className.indexOf(this.fClassOffDown);

			outSecMgr.fOut.parentNode.className = vScrollTop == 0 && vContentH - vScrollTop - 5 <= outSecMgr.fOut.offsetHeight?"noScroll":"";
			if(vScrollTop <= 0) {
				if(vBtnUpOff < 0) outSecMgr.fSrlUp.className+= " "+this.fClassOffUp;
			} else {
				if(vBtnUpOff >= 0) outSecMgr.fSrlUp.className = outSecMgr.fSrlUp.className.substring(0, vBtnUpOff);
			}			
			if(vContentH - vScrollTop - 5 <= outSecMgr.fOut.offsetHeight){
				if(vBtnDownOff < 0) outSecMgr.fSrlDwn.className+= " "+this.fClassOffDown;
			} else {
				if(vBtnDownOff >=0) outSecMgr.fSrlDwn.className = outSecMgr.fSrlDwn.className.substring(0, vBtnDownOff);
			}
		},
		onResizedAnc:function(pOwnerNode, pEvent){
			if(pEvent.phase==2) this.checkBtn();
		},
		ruleSortKey : "checkBtn"
	},

	loadSortKey : "Z"
}