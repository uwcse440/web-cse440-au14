browserDetect.init();
var imgCloudUrl = window.location.protocol == 'http:' ? '//561f5b186ef3d1bbffae-670dcfae82c728eff02629d9c4d77cbb.r43.cf2.rackcdn.com/' : '//e92360842a005b2d5215-670dcfae82c728eff02629d9c4d77cbb.ssl.cf2.rackcdn.com/';
var loading_Stage_Check = "Not Loaded";
//window.shimIndexedDB.__useShim();

$(document).ready(function(e)
{
	var all = $.event.props, len = all.length, res = [];
	while (len--) 
	{
		var el = all[len];
		if (el != 'layerX' && el != 'layerY') res.push(el);
	}
	$.event.props = res;	
	document.onselectstart = function () { return false; };  // fix the chrome cursor problem.
});

// Invalid browser
if(browserDetect.browser == 'Explorer' || /Trident/.test(navigator.userAgent) || browserDetect.browser == 'Opera')
{
	$(document).ready(function(e)
	{	
		$("body").empty().append($("#tmplInvalid").tmpl());
		return;
	});
} 

// print mode
else if (window.g_print == true && window.g_preview != undefined)
{
	dbStorage.init();

	$(document).ready(function(e)
	{
		function previewInit() {
		preview.load(g_preview); // just show all pages at once - a few style changes to below!
		setTimeout(window.print, 1000);
		return false;	
		}

		storage.init(previewInit);
	});
}

// Preview mode. 
else if (window.g_preview != undefined) {

	dbStorage.init();

    // load the project without drawing it afterwards
    // when async is done, get branding and do other things

    // create a <style> that sets the #homePage BG image
    var homePageStyle = document.createElement('style');
    homePageStyle.id = 'homePageStyle';
    homePageStyle.type = 'text/css';
    homePageStyle.innerHTML = '#homePage { background-image: none; }';
    // append the style to the <head>
    document.head.appendChild(homePageStyle);

    preview.load(window.g_preview, preview.afterPreviewLoad );


}
else
{
	dbStorage.init();

	//load svg ui icons for editor - first attempt from indexedDB, ajax load if failed
	if(dbStorage.dbAvailable) {
		dbStorage.onReady(function() {
			dbStorage.get('uiIcons', 'svgIcons', function(results) {
				//failed indexedDb search, fetch from server
				if(results.failed.length) {
					fetchSvgIcons();
					//found in indexedDb
				} else {
					document.head.insertAdjacentHTML('beforeend', results.resultsObj.svgIcons.data);
				}
			});
		});
	} else {
		fetchSvgIcons();
	}

	if( !window.pagesCache ) window.pagesCache = {};

	// break free from iFrame
	if (window !== window.top)
	{
		window.parent.location = window.location.href;
	}

	function editorInit(e) // once js is downloaded. 
	{
        lib.loadWdgDefinitions();
		account.setLoadingStep(0);
		var pid = 'last';

		//console.log("Instance ID at load", instanceId, "[" + window.name + "]");
		widget.useCanvas = ((browserDetect.browser == 'Safari')  || (navigator.userAgent.match(/Android/i))) ?  true : false;;

		if(account.isBrandNewUser() == true || !fluid.main.account)
		{
			account.setup(); // sets up the accounts localvar
			account.createUser(); // creates a "new" user - free account.

			//adding project is asynchronous now since new project needs to be saved to indexedDb
			//TODO: will later adjust project.add to return a model and proceed immediately
			fluid.waitForNewProject = true;
			pid = project.add(e, "New Project", false, function() {
				setTimeout(function() {
					windowLoad();
				}, 1);

			}); // e not used, but necessary.
		}

		if ((g_pid != "") && (g_imgFullCanvas == "true"))
		{
			pid = g_pid;
		}

		account.checkIntegrity(); // check for accName, accType, maxProjects, maxPages
		var accId = account.get("id");
		var accObj = storage.get(accId);

		var loading = "NewUser";

		if(accObj.accType == "New" || accObj.accType == null)
		{
			account.drawSignup();
		}
		else
		{
			account.draw(accObj);
			loading = "LoggedInUser";
		}

		function windowLoad() // after everything is downloaded.
		{
			importexport.init();
			notification.init();
			upload.init(); // allow the user to do desktop upload Safari only?
			userActionsInit2();	//load actions that need to happen before project.open happens - page frame hack fix.
			project.load(); // loads all the projects into the projects menu

			userActionsInit(); 	// initialise the ui. must come after project is opened TODO: - bad idea - should be independent (and be before - wont impact css/cpu)
			//lib.init(); // maybe wait till after first zoom even - if we can make it fast enough!?

			propInspector.init();
			staticWidgets.initMenus();
			screensize.width = $(window).width();
			screensize.height = $(window).height();
			tracker.record("loadEditor" + loading, 1);
			loading_Stage_Check = "Editor Loaded";
			//init the grid

			checkUserSession();     // session cookie still ok? if not -- logout
			watchUserSession(true); // periodic checks for sesson cookie valitity

			//console.log("Loading account - checking for latest version.");
			account.validateState(); // everything is loaded, but make sure its correct.
            account.validateProjectsCount();

			function checkHash() {
				var accountStatus = account.get('status');
				var pendingCardUpdate = accountStatus == 'pendingCardUpdate';

				// TODO: all this location hash check should be redone properly
				switch (window.location.hash) {
					case "#signin":
						if (!pendingCardUpdate) {
						if (account.get('loggedIn') === "no") {
							fluidMenu.show();
						}
						//just fyi window.location.hash = "" leaves the #.
						//this is sub-optimal - I shouldn't have to do this. We append to the url in a few places
						//instead of adding to it sensibly - this should change (another time).
						}
						break;

					case "#upgrade":
						if (!pendingCardUpdate && account.get('loggedIn') === "yes") {
							userSettings.goToUpgrade();
						}
						break;

					case "#card":
						userSettings.open(null, $("#userSettingsPanelCard"));
						userSettings.goToCardUpdate();
						break;

					default:
						if (!pendingCardUpdate) {
						var match = /^#buy(?:-([\w-]+))?$/.exec(window.location.hash);
						if (match && match.length > 0) {
							if (account.get("loggedIn") != "yes")
							{
								userSettings.goToCreateAccount(null, match[1]);
							}
							else
							{
								userSettings.goToUpgrade(null, match[1]);
							}
						} else {
							match = /^#offer(?:-(\w+))?$/.exec(window.location.hash);
							if (match && match.length > 0) {
								userSettings.goToUpgrade(null, null, (match[1] || '').toUpperCase());
							}
						}
						}
						break;
				}

				history.pushState('', document.title, window.location.pathname);
			}

			checkHash();
			window.onhashchange = checkHash;

			//if (!account.validateState())
			// {
				// project.open(pid, function() {
					// TODO: this should not be here; devise controller initialization procedure
					// fluid.controllers.bin.init();
				// }); // opens the last project they had open.	Sets zoom.

				function afterLibReady() {
					if (account.isStandard()) {
						var userLibs = account.get('libraries');
						if (userLibs && userLibs.length > 0) {
							for (var idx = 0; idx < userLibs.length; idx++) {
								lib.addLibrary(storage.get(userLibs[idx]));
							}
						} else {
							// upgrade account to enable custom widgets
							account.createDefaultUserLib();
						}
					}
					
					fluid.command.create('open', {
						id: pid,
						onLoad: function () {
							fluid.controllers.bin.init();
						}
					}).dispatchTo('fluid.controllers.project');

					showPostLoadMessage();

					account.setLoadingStep(5);

					$('#font-preloader').remove();

					fluid.main.fire('editor.loaded');
				}

				if(lib.ready) afterLibReady();
				else fluid.main.on('libready', afterLibReady);

			if (window.location.hash === "#signin") {
				if (account.get('loggedIn') === "no") {
					fluidMenu.show();
				}
				history.pushState('', document.title, window.location.pathname); //remove the hash
				//just fyi window.location.hash = "" leaves the #.
				//this is sub-optimal - I shouldn't have to do this. We append to the url in a few places
				//instead of adding to it sensibly - this should change (another time).
			}
		}

		function windowLoadPreview()    //Only loads project for preview Full canvas
		{
			fullCanvas.init(pid);
			$('#font-preloader').remove();
		}

		if (g_imgFullCanvas == "true")
		{
			$(window).load(windowLoadPreview);
		}
		else
		{
			//in most cases document has already loaded in chrome
			if(document.readyState === 'complete' && !fluid.waitForNewProject) {
					windowLoad();
			} else if(!fluid.waitForNewProject) {
			$(window).load(windowLoad);
		}
			//dbStorage.onReady(windowLoad);
        }

//			account.doAccountStatusAction();
	}

	
	if(localStorage)
	{
		var restoreId = localStorage.getItem("refreshing");
		if(restoreId)
		{
			localStorage.removeItem("refreshing"); // dont do anything if they are just refreshing. 
			g_instanceId = parseInt(restoreId);
			//console.log("Reusing old instance ID after refresh: ", g_instanceId)
		}
		else
		{
			g_instanceId = parseInt(Math.random()*100000000); // for making sure all tabs are up to date. 
		}
		localStorage.setItem("instanceId", g_instanceId); // dont do anything if they are just refreshing. 
		
		// clean up a removed feature.
		localStorage.removeItem("storageCleared"); // dont do anything if they are just refreshing. 
	}	
	
	//if there are any accounts and projects saved on indexedDB, these are loaded and models are created
	//standard init procedure is ran after success or failure
	$(function() {
		storage.init(editorInit);
	});

	//$(document).ready(editorInit);


	/*
	window.addEventListener('storage', function(event) {
		// TODO: this is a prototype. will go to a separate file if proves working and useful.
		
		if (event.key.substr(0,2) == 'p_' && project.get('id') == event.key)
		{
			//notification.add('alert', 'Project modified blah blah blah');
			//project.reopen();
		}
		
	}, false);
	*/
}
