// Skin-specific Javascript code.
if ("searchMgr" in window){
	if (scPaLib.findNode("ide:outSec")) searchMgr.fPathSchBoxParent = "ide:outSec";
	else searchMgr.fPathSchBoxParent = "ide:header";
}

// Adaptive illustration height
(function (){
	var vIllus = scPaLib.findNode('des:.illus');
	if (vIllus){
		vIllus.media = scPaLib.findNode("chi:img|video", vIllus);
		window.illustrationNode = vIllus;
		window.resizeIllustration = function () {
			var vHeaderHeight = sc$("header").offsetHeight;
			var vTitleHeight = scPaLib.findNode("des:h2", sc$("content")).clientHeight
			var vIllusHeight =  Math.min(440+vTitleHeight, illustrationNode.media.clientHeight);
			illustrationNode.style.height = vIllusHeight + "px";
			illustrationNode.style.top = vHeaderHeight +"px";
			sc$("content").style.marginTop = Math.max(0,vIllusHeight-vTitleHeight) + "px";
		}
		scSiLib.addRule(illustrationNode, {
			onResizedDes : function(pOwnerNode, pEvent) {},
			onResizedAnc : function(pOwnerNode, pEvent) {
				if(pEvent.phase==1) resizeIllustration();
			}
		});
		if (vIllus.media.id=="videoIllustration") {
			if (vIllus.media.videoWidth) resizeIllustration();
			else vIllus.media.addEventListener("loadeddata", resizeIllustration, false);
		} else {
			if (vIllus.media.naturalWidth) resizeIllustration();
			else vIllus.media.addEventListener("load", resizeIllustration, false);
		}
	} 
})();