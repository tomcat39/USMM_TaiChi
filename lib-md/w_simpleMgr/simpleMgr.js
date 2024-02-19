var simpleMgr = {

	init : function(){
		try{
			this.fVideo = sc$("videoIllustration");
			this.fButton = scPaLib.findNode("ide:accessibility/chi:li.tplWaiStopVideoIllustration/chi:a");
			if (tplMgr.fStore.get("videoIllustration")=="false") this.toggleVideoIllutration(false);
		}catch(e){scCoLib.log("ERROR - simpleMgr.init : "+e)}
	},
	
	toggleVideoIllutration : function (pForce){
		var vPlay = (typeof pForce != "undefined" ? pForce : this.fVideo.paused)
		if (vPlay){
			this.fVideo.play()
			this.fButton.title = "Arreter la video illustrative"
			this.fButton.className = "playing";
 		} else {
			this.fVideo.pause()
			this.fButton.title = "Lancer la video illustrative"
			this.fButton.className = "paused";
		}
		tplMgr.fStore.set("videoIllustration", !this.fVideo.paused);
	}
}

