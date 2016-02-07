/*
*   Turin (HTML)
*   Copyright 2015, Limitless
*   www.limitless.company
*/


var windowHeight;
var windowWidth;
var settings;
var retina = false;

settings = {
	enableAnimations: true,
	enableLoader: true,
	portfolioAllText: "All",
	portfolioEnableHeader: true,
	portfolioEnableDetails: true,
	portfolioEnableFullscreen: true,
	portfolioEnableSharing: true,
	portfolioItemsPerPage: 20,
}

jQuery(document).ready(function($) {
   'use strict';

   	// Basic
    var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
	var root = (typeof exports === 'undefined' ? window : exports);
    if (root.devicePixelRatio > 1) {
	    if (root.matchMedia && root.matchMedia(mediaQuery).matches) {
	        retina = true;
	    }
    }

	$(".background.image").each(function() {
		var img = $(this).attr("data-url");
		var type = $(this).attr("data-type");
		if(img==undefined) return false;
		$(this).css("background-image", "url("+img+")");
	});

	$(".background.video").each(function() {
		var video = $(this).attr("data-url");
		var poster = $(this).attr("data-poster");
		if(video==undefined) return false;
		var h = "<video autoplay loop poster='"+poster+"'><source src='"+video+"' type='video/mp4'></video>";
		$(this).html(h);
	});

	$(".background").each(function() {
		if ($(this).hasClass("overlay-dark")) $(this).append("<div class='overlay-dark'></div>");
		if ($(this).hasClass("overlay-light")) $(this).append("<div class='overlay-light'></div>");
	});


   	// Navigate
	$("a[href^='#']").click(function(event){
    	event.preventDefault();
		$('html,body').stop().animate({scrollTop: $($(this).attr("href")).position().top-80}, 'slow');
	});


	// Navigation
   	$("nav.navigation .header .close").click(function(){
   		$("nav.navigation").removeClass("active");
   		adjustSizes();
   	});	


   	// Header
   	$("header.header .menu").append("<div class='select'></div><div class='toggle'></div>")
   	$("header.header .select").click(function(){
   		$("header.header").toggleClass("active");
		playAnimations();
		$("nav.navigation").toggleClass("active");
   		adjustSizes();
   	});	


   	// Landing
   	if($("section.landing").hasClass("slider")) {

   		$('section.landing.slider').flexslider({
		    animation: "fade",
		    animationLoop: true,
		    animationSpeed: 1500,
		    controlNav: true,
		    directionNav: false,
		    easing: "easeOutBack",
		    pauseOnHover: false,
		    selector: ".slides > .slide",
		    slideshow: true
	 	});
	 	
   	}


   	// Portfolio 
	var portfolio = $("section.portfolio");
	if(portfolio.length > 0) {

		if(!portfolio.find(".filter .content ul .all").length){
			var filterList = portfolio.find(".filter .albums .content ul");
			filterList.prepend("<li data-album='all' class='all selected'><span>"+settings.portfolioAllText+"</span></li>");
			portfolio.find(".filter .albums span.selected").text(settings.portfolioAllText);
		}

		$("section.portfolio.filterbar .filter .albums li").click(function(){
			if(!$(this).hasClass("selected")){
				$(this).addClass("selected").siblings().removeClass("selected");
				loadPortfolio("filterbar");
			}
		}); 

		$("section.portfolio.toolbar .filter .albums span.selected, section.portfolio.toolbar .filter .order span.selected").click(function(){
			var grid = $("section.portfolio.toolbar .grid");
			var list = $(this).parent().find("ul");
			if(grid.hasClass("blurred")) {

				if(list.hasClass("active")) {
					list.removeClass("active");
					setTimeout(function() {
						list.removeClass("visible");
					}, 600);
					grid.removeClass("blurred");
				} else {
					$("section.portfolio.toolbar .filter ul").removeClass("active");
					$("section.portfolio.toolbar .filter ul").removeClass("visible");
					list.addClass("visible");			
					setTimeout(function() {
						list.addClass("active");
					}, 100);
				}
			} else {
				grid.addClass("blurred");
				list.addClass("visible");			
				setTimeout(function() {
					list.addClass("active");
				}, 100);
			}
		});

		$("section.portfolio.toolbar .filter .albums li span").click(function(){
			if(!$(this).parent().hasClass("selected")){
				var album = $(this).text();
				var item = $(this).parent();
				$("section.portfolio.toolbar .filter .albums span.selected").text(album);
				item.addClass("selected").siblings().removeClass("selected");
				$("section.portfolio.toolbar .grid").removeClass("blurred");
				$("section.portfolio.toolbar .filter .albums ul").removeClass("active");
				loadPortfolio("toolbar");
			} else {
				$("section.portfolio.toolbar .grid").removeClass("blurred");
				$("section.portfolio.toolbar .filter .albums ul").removeClass("active");
			}
		});

		$("section.portfolio.toolbar .filter .order li span").click(function(){
			if(!$(this).parent().hasClass("selected")){
				var order = $(this).text();
				var orderType = $(this).parent().attr("data-type");
				var item = $(this).parent();
				$("section.portfolio.toolbar .filter .order span.selected").text(order);
				item.addClass("selected").siblings().removeClass("selected");
				var grid = $("section.portfolio.toolbar .grid").removeClass("blurred");
				var list = $("section.portfolio.toolbar .filter .order ul").removeClass("active");
				loadPortfolio("toolbar");
			} else {
				var grid = $("section.portfolio.toolbar .grid").removeClass("blurred").addClass(orderType);
				var list = $("section.portfolio.toolbar .filter .order ul").removeClass("active");
			}
		});

		$("section.portfolio.sidebar .filter .albums li").click(function(){
			if ( $(this).attr("data-album") != undefined || $(this).attr("data-album") != null) {
				if(!$(this).hasClass("selected")){
					$(this).addClass("selected").siblings().removeClass("selected");
					loadPortfolio("sidebar");
				}
			}
		}); 

	}


   	//Share Buttons
	$("section.social-sharing .facebook").click(function(){
		var url = $(location).attr('href');
		window.open("https://www.facebook.com/sharer/sharer.php?u="+url, "Share", "width=600, height=400, status=no, toolbar=no, menubar=no");
	});

	$("section.social-sharing .twitter").click(function(){
		var url = $(location).attr('href');
		window.open("https://twitter.com/home?status="+url, "Share", "width=600, height=400, status=no, toolbar=no, menubar=no");
	});

	$("section.social-sharing .google").click(function(){
		var url = $(location).attr('href');
		window.open("https://plus.google.com/share?url="+url, "Share", "width=600, height=400, status=no, toolbar=no, menubar=no");
	});

	$("section.social-sharing .email").click(function(){
		var url = $(location).attr('href');
		window.open("mailto:?body="+url,"_parent");
	});
   	//Share Buttons

});

$(window).load(function() {

	// Fixes
	adjustSizes();

	// Portfolio 
	loadPortfolio();

	// Loader
	playLoader();

	// Animations
	playAnimations();

});

$(window).resize(function() {
	adjustSizes();
});

var currentAlbum;
var currentOrder;
var currentSelector;
var firstLoad = true;
function loadPortfolio(selectorType) {

	if (selectorType != undefined || selectorType != null) {
		currentSelector = selectorType;
	}

	// Define Grid
	var portfolio = $("section.portfolio");
	var grid = portfolio.find(".grid > .content");
	grid.attr("data-width", grid.width());
	portfolio.css('min-height', windowHeight);

	// Create select for mobile view
	var albumFilter = portfolio.find(".filter .albums .content");
	var orderFilter = portfolio.find(".filter .order .content");
	if(!albumFilter.children("select").length) {
		albumFilter.append("<select></select>");
		var albums_select = albumFilter.find("select");
		albumFilter.find("li").each(function() {
			var albumTitle = $(this).text();
			var albumURL = $(this).attr("data-album");
			if ($(this).hasClass("selected")) {
				albums_select.append("<option data-album='"+albumURL+"' selected>"+albumTitle+"</option>");
			} else {
				albums_select.append("<option data-album='"+albumURL+"'>"+albumTitle+"</option>");
			}
		});

		albumFilter.find("select").change(function() {
			loadPortfolio("select");
		});
	}

	// Define album
	var album;

	if(currentSelector == "select") {
		album = albumFilter.find("select").find("option:selected").attr("data-album");
	} else {
		album = albumFilter.find("li.selected").attr("data-album");
	}


	var albumChanged = true;
	if(currentAlbum == album) {
		albumChanged = false;
	} else {
		currentAlbum = album;
	}

	// Define order
	var order = orderFilter.find("li.selected").attr("data-type");
	if(order===undefined) order = "masonry";
	portfolio.removeClass("list masonry grid");
	var orderChanged = true;
	if(currentOrder == order) {
		orderChanged = false;
	} else {
		currentOrder = order;
	}

	// Reset the stream if different album
	if(albumChanged || orderChanged) grid.find(".row").remove();
	if(albumChanged || orderChanged) grid.find(".file").removeClass("visible active awake");

	// Mark album images
	if(album == "all") {
		grid.children(".file").addClass("active");
	} else {
		grid.children(".file").each(function(){
			var itemAlbum = $(this).find("span[data-album]").attr("data-album");	
			if (itemAlbum == album) {
				$(this).addClass("active");
			} else {
				$(this).removeClass("active selected");
			}
		});
	}

	var loadStep = settings.portfolioItemsPerPage;
	var currentlyLoaded = parseInt(grid.children(".awake").length);
	var totalItems = parseInt(grid.children(".active").length);
	var target = currentlyLoaded + loadStep;

	if(target > totalItems) target = totalItems;

	for (var i = currentlyLoaded; i < target; i++) {
		var item = grid.find(".active").eq(i);
		var itemAlbum = item.find("span[data-album]").attr("data-album");
		if (itemAlbum == album || album == "all") item.addClass("selected");
	};

	// Remove Loading
	portfolio.find(".more.row").remove();

	// Show loading
	var loaderIcon = '<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a"><stop stop-color="#fff" stop-opacity="0" offset="0%"/><stop stop-color="#fff" stop-opacity=".631" offset="63.146%"/><stop stop-color="#fff" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" /></path><circle fill="#fff" cx="36" cy="18" r="1"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" /></circle></g></g></svg>'
	portfolio.find(".grid").after("<div class='portfolio-loading row'><div class='loading-icon'>"+loaderIcon+"</div></div>");

	var counter = 0;
	grid.children(".selected").each(function() {

		var item = $(this);
		var itemType = $(this).find("span[data-type]").attr("data-type");
		var itemSource = $(this).find("span[data-source]").attr("data-source");

		var image = $("<img />").attr('src', itemSource).load(function() {

		    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {

		    	// Issue an error message
		        console.log("("+this.src+") is broken :'(");

		    } else {

		    	// Define image properties
		    	var imageHeight = this.naturalHeight;
		    	var imagePath = this.src;
		    	var imageWidth = this.naturalWidth;

		    	// Save image to the background
				item.css("background-image", "url("+imagePath+")");

				// Mark the image as loaded
				item.addClass("awake");

				// Save original dimentions
				item.attr("data-width", imageWidth).attr("data-height", imageHeight);

				// Add file type as class
				item.addClass(itemType);

		    }

		    counter+=1;

		    // Resize once everything is loaded
		    if(counter == (grid.children(".selected").length)) {

				// Define Images
				var images = grid.children(".selected");
				var rowHeight = parseInt(grid.attr("data-item-height"));
				var colMargin = 0;

				// Define container width
				var containerWidth = grid.attr("data-width");
				var totalItemWidth = 0;

				// Create first row if there is no row
				if(grid.find(".row").length == 0) grid.append("<div class='row'></div>");

				// Create another row if all rows are full
				if(grid.find(".row").length == grid.find(".row.full").length) {
					grid.append("<div class='row'></div>"); 

				// Calculate 'total width' if the last row is not full
				} else {
					grid.find(".row").last().find(".file").each(function() {
					    totalItemWidth += parseInt($(this).attr("itemWidthRatio"));
					});
				}

				var rowCounter = 0;
				images.each(function() {

					// Define item
				    var item = $(this);

				    // Get properties
				    var type = item.find("span[data-source]").attr("data-source");

				    var itemWidth = item.attr("data-width");
				    var itemHeight = item.attr("data-height");

				    var itemWidthRatio = rowHeight * (itemWidth/itemHeight);

				    var itemWidthTemp = (itemWidth / rowHeight) * 100;
				    itemWidthTemp = itemWidthTemp - colMargin;
				    item.attr("itemWidthRatio", itemWidthRatio).css("width", itemWidthTemp);

				    
				    var totalItemWidthRatio = containerWidth/totalItemWidth;

				    if(order=="masonry") {

				    	var ref = 1.5;
				    	if(rowCounter == 0) ref = 2;

					    if (totalItemWidthRatio > ref && containerWidth > 479) {

					    	item.removeClass("selected");

				    		var itemHTML = item[0].outerHTML;

					    	grid.find(".row").last().append(itemHTML);

					    	totalItemWidth += itemWidthRatio;

					    } else {

					    	totalItemWidth = itemWidthRatio;

					    	item.removeClass("selected");

					    	var itemHTML = item[0].outerHTML;

					    	grid.find(".row").last().append(itemHTML);

							var totalItemWidth2 = 0;

							grid.find(".row").last().find(".file").each(function() {
							    totalItemWidth2 += parseInt($(this).attr("itemWidthRatio"));
							});

							var widthDiff = totalItemWidth2 - containerWidth;
							if(totalItemWidth2 < containerWidth) widthDiff = containerWidth - totalItemWidth2;

							grid.find(".row").last().find(".file").each(function() {
								var i = parseInt($(this).attr("itemWidthRatio"));
								var f = widthDiff * (i / totalItemWidth2);
								var r = i - f;
								if(totalItemWidth2 < containerWidth) r = i + f;

								var wi = (r / containerWidth) * 100;

								$(this).css('width', wi + "%");
								$(this).attr("data-width-adapted", r);
							});

							// Mark row as full
							grid.find(".row").last().addClass("full");

					    	grid.append("<div class='row'></div>");
					    	rowCounter+=1;

					    }

					} else {

						var ref = 0;
						if(order=="grid") ref = 4;
						if(order=="list") ref = 1;

						portfolio.addClass(order);

						var currentRowItems = grid.find(".row").last().find(".file").length;

					    if (currentRowItems < ref && containerWidth > 479) {

					    	// Remove .selected
					    	item.removeClass("selected");

					    	// Apend file to last row
				    		var itemHTML = item[0].outerHTML;
					    	grid.find(".row").last().append(itemHTML);

					    } else {

							// Mark row as full
							grid.find(".row").last().addClass("full");

					    	// Append new row
					    	grid.append("<div class='row'></div>");
					    	rowCounter+=1;

					    	// Remove .selected
					    	item.removeClass("selected");

					    	// Apend file to last row
				    		var itemHTML = item[0].outerHTML;
					    	grid.find(".row").last().append(itemHTML);

					    }

					}

				});

				// Final housekeeping
				grid.find(".row").each(function() {

					// Remove classes
					$(this).find("div").removeClass("awake active");
					$(this).find("div").addClass("view", "slow", "easeOutBack");

					// Add overlay to video
					var overlay = "<div class='overlay'></div>";
					$(this).find(".video").append(overlay);
					$(this).find(".youtube").append(overlay);
					$(this).find(".vimeo").append(overlay);

					// Clean empty rows
					if ($(this).find("div").length == 0) $(this).remove();

					// Register the "Preview" function
					$(this).find(".file").click(function(){
						previewImage($(this));
					});

				});

				// Remove loading 
				portfolio.find(".portfolio-loading").remove();


				// Mark last row as full if everything is loaded
				currentlyLoaded = parseInt(grid.children(".awake").length);
				totalItems = parseInt(grid.children(".active").length);
				if(currentlyLoaded == totalItems) {
					grid.find(".row").last().addClass("full");
				} else {

					// If not add the "more" button again
					if(!portfolio.find(".more.row").length) {
						portfolio.find(".grid").after("<div class='more row'><button class='button icon icon-more dark'></button></div>");
					}	

					// Run the function when click on load more
					portfolio.find(".row.more button").click(function(){
						loadPortfolio();
					});
				}

				// URLs
				if(firstLoad) loadURL();
				firstLoad = false;

			}
			
		});

	});

}

function previewImage(image) {

	// Define properties
	var image = image;
	var source = image.find(".properties span[data-source]").attr("data-source"); // File path
	var type = image.find(".properties span[data-type]").attr("data-type"); // Type
	var url = image.find(".properties span[data-url]").attr("data-url"); // Attached file path (for video)
	var caption = image.find(".properties span[data-caption]").attr("data-caption"); // Caption
	var album = image.find(".properties span[data-album]").attr("data-album"); // Album title
	var current = $('section.portfolio .grid .full .file.view').index(image); // Current index
	var total = $('section.portfolio .grid .full .file.view').length; //Total files in album

	// Calculate height values
	var heightMargin = 70;
	if(settings.portfolioEnableHeader || settings.portfolioEnableDetails) heightMargin = 130;
	var frameHeight = windowHeight - heightMargin;

	// Build the preview markup
	var frame;
	if(type=="image") {
		frame  = "<div class='frame row' style='height:"+frameHeight+"px'>";
		frame += "<div class='image' style='background-image: url("+source+")'></div>";
		frame += "<div class='full-screen'></div></div>";
	}

	if(type=="video" || type=="youtube" || type=="vimeo") {
		frame  = "<div class='frame row' style='height:"+frameHeight+"px'>";
		frame += "<div class='player'></div>";
		frame += "<div class='full-screen'></div></div>";
	}
	
	var nav = "<div class='head row'><div class='caption one-half column'><h3 class='title'>"+caption+"</h3></div><div class='nav one-half column'><div class='prev'></div><div class='close'></div><div class='next'></div></div></div>";
	var devider = "<div class='row'><div class='devider'></div></div>";
	var meta = "<div class='meta row'><div class='details one-half column'>";
	image.find(".details span").each(function() {
		if($(this).attr("data-title")!="album" && $(this).attr("data-title")!="date") {
			meta+= "<div class='detail'><p class='name'>"+$(this).attr("data-title")+"</p><p class='value'>"+$(this).text()+"</p></div>";
		}
	});
	meta+= "</div><div class='links one-half column'><div class='details'>";
	image.find(".details span").each(function() {
		if($(this).attr("data-title")=="album" || $(this).attr("data-title")=="date") {
			meta+= "<div class='detail'><p class='name'>"+$(this).attr("data-title")+"</p><p class='value'>"+$(this).text()+"</p></div>";
		}
	});
	meta+= "</div><div class='social-links'><div><p class='name'>Share</p></div><div class='social facebook'></div><div class='social twitter'></div><div class='social google'></div></div></div>"

	var preview = frame;
	if(settings.portfolioEnableHeader) preview+=nav;
	if(settings.portfolioEnableDetails && settings.portfolioEnableHeader) preview+=devider;
	if(settings.portfolioEnableDetails) preview+=meta;

	// Show the preview 
	$.magnificPopup.open({
		items: {
		    src: "<div class='work-preview'><div class='container'>"+preview+"</div></div>",
		    type: "inline"
		}
	});
	$(".mfp-close").remove();
	
	// Disable prev if first
	if(current==0) $('.work-preview .prev').addClass("disabled");

	// Disable next button if last
	if(current==total-1) $('.work-preview .nav .next').addClass("disabled");

	// Load Sharing Links
	if(settings.portfolioEnableSharing){
		var u = window.location.href;
		var s = u+"?f="+source;
		fixSharing(s);
	} else {
		$(".work-preview .social-links").addClass("disabled");
	}

	// Load video player if video
	if(type=="youtube" || type=="vimeo" || type=="video") {
		var w = $(".work-preview .frame .player").width();
		var h = $(".work-preview .frame .player").height();
		if(type==="video") {
			var d = "<video autoplay controls poster='"+source+"'><source src='"+url+"' type='video/mp4'></video>";
		} else if(type==="youtube") {
			var d = '<iframe width="'+w+'" height="'+h+'" src="//www.youtube.com/embed/'+ url +'?rel=0" frameborder="0" allowfullscreen></iframe>';
		} else if (type==="vimeo") {
			var d = '<iframe src="//player.vimeo.com/video/'+ url + '?autoplay=1;title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff" width="'+w+'" height="'+h+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
		}
		$(".work-preview .frame .player").html(d);
	}

	if(!settings.portfolioEnableFullscreen) $(".work-preview .frame .full-screen").addClass("hidden");

	$(".work-preview .frame").mousemove(function() {
		$(".work-preview .frame .full-screen").addClass("active");
	});

	$(".work-preview .frame").mousestop(900, function() {
	    $(".work-preview .frame .full-screen").removeClass("active");
	});

	// Close preview
	function previewClose(){
		var magnificPopup = $.magnificPopup.instance;
		magnificPopup.close();	
	
	}

	// Preview fullscreen
	function previewFullScreen(){

		if($(".work-preview .frame").hasClass("full")){
			$(".work-preview .frame").css("height", windowHeight - 130);
			$(".work-preview .frame").removeClass("full");
		} else {
			$(".work-preview .frame").css("height", windowHeight);
			$(".work-preview .frame").addClass("full");
		}
	
	}

	// Preview previous image/video
	function previewPrev(){

		if(current>0) {

			current--;

			var image = $('section.portfolio .grid .full .file.view').eq(current);
			var source = image.find(".properties span[data-source]").attr("data-source"); // File path
			var type = image.find(".properties span[data-type]").attr("data-type"); // Type
			var url = image.find(".properties span[data-url]").attr("data-url"); // Attached file path (for video)
			var caption = image.find(".properties span[data-caption]").attr("data-caption"); // Caption
			var album = image.find(".properties span[data-album]").attr("data-album"); // Album title

			var frame;
			if(type=="image") {
				frame  = "<div class='frame row' style='height:"+frameHeight+"px'>";
				frame += "<div class='image' style='background-image: url("+source+")'></div>";
				frame += "<div class='full-screen'></div></div>";
			}

			if(type=="video" || type=="youtube" || type=="vimeo") {
				frame  = "<div class='frame row' style='height:"+frameHeight+"px'>";
				frame += "<div class='player'></div>";
				frame += "<div class='full-screen'></div></div>";
			}

			$('.work-preview .frame').replaceWith(frame);

			// load video player if video
			if(type=="youtube" || type=="vimeo" || type=="video") {
				var w = $(".work-preview .frame .player").width();
				var h = $(".work-preview .frame .player").height();
				if(type==="video") {
					var d = "<video autoplay controls poster='"+source+"'><source src='"+url+"' type='video/mp4'></video>";
				} else if(type==="youtube") {
					var d = '<iframe width="'+w+'" height="'+h+'" src="//www.youtube.com/embed/'+ url +'?rel=0" frameborder="0" allowfullscreen></iframe>';
				} else if (type==="vimeo") {
					var d = '<iframe src="//player.vimeo.com/video/'+ url + '?autoplay=1;title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff" width="'+w+'" height="'+h+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
				}
				$(".work-preview .frame .player").html(d);
			}

			// Replace Caption
			var caption = "<div class='caption one-half column'><h3 class='title'>"+caption+"</h3></div>"
			$('.work-preview .caption').replaceWith(caption);

			// Replace image details
			var meta = "<div class='details one-half column'>";
			image.find(".details span").each(function() {
				if($(this).attr("data-title")!="album" && $(this).attr("data-title")!="date") {
					meta+= "<div class='detail'><p class='name'>"+$(this).attr("data-title")+"</p><p class='value'>"+$(this).text()+"</p></div>";
				}
			});
			meta+= "</div>";
			$('.work-preview .meta > .details').replaceWith(meta);

			// Replace Album and Date
			meta= "<div class='details'>";
			image.find(".details span").each(function() {
				if($(this).attr("data-title")=="album" || $(this).attr("data-title")=="date") {
					meta+= "<div class='detail'><p class='name'>"+$(this).attr("data-title")+"</p><p class='value'>"+$(this).text()+"</p></div>";
				}
			});
			meta+= "</div>";
			$('.work-preview .meta .links .details').replaceWith(meta);

			// Load Sharing Links
			if(settings.portfolioEnableSharing){
				var u = window.location.href;
				var s = u+"?f="+source;
				fixSharing(s);
			} else {
				$(".work-preview .social-links").addClass("disabled");
			}

			// Disable prev button if first
			if(current==0) $('.work-preview .nav .prev').addClass("disabled");

			// Enable next button if last
			if(current<total) $('.work-preview .nav .next').removeClass("disabled");

			// Fullscreen button
			$('.work-preview .full-screen').click(function(){
				previewFullScreen();
			});

			$(".work-preview .frame").mousemove(function() {
				$(".work-preview .frame .full-screen").addClass("active");
			});

			$(".work-preview .frame").mousestop(900, function() {
			    $(".work-preview .frame .full-screen").removeClass("active");
			});
			
		}
	
	}

	// Preview next image/video
	function previewNext(){

		if(current<total-1) {

			current++;

			var image = $('section.portfolio .grid .full .file.view').eq(current);
			var source = image.find(".properties span[data-source]").attr("data-source"); // File path
			var type = image.find(".properties span[data-type]").attr("data-type"); // Type
			var url = image.find(".properties span[data-url]").attr("data-url"); // Attached file path (for video)
			var caption = image.find(".properties span[data-caption]").attr("data-caption"); // Caption
			var album = image.find(".properties span[data-album]").attr("data-album"); // Album title

			if(type=="image") {
				frame  = "<div class='frame row' style='height:"+frameHeight+"px'>";
				frame += "<div class='image' style='background-image: url("+source+")'></div>";
				frame += "<div class='full-screen'></div></div>";
			}

			if(type=="video" || type=="youtube" || type=="vimeo") {
				frame  = "<div class='frame row' style='height:"+frameHeight+"px'>";
				frame += "<div class='player'></div>";
				frame += "<div class='full-screen'></div></div>";
			}

			$('.work-preview .frame').replaceWith(frame);

			// load video player if video
			if(type=="youtube" || type=="vimeo" || type=="video") {
				var w = $(".work-preview .frame .player").width();
				var h = $(".work-preview .frame .player").height();
				if(type==="video") {
					var d = "<video autoplay controls poster='"+source+"'><source src='"+url+"' type='video/mp4'></video>";
				} else if(type==="youtube") {
					var d = '<iframe width="'+w+'" height="'+h+'" src="//www.youtube.com/embed/'+ url +'?rel=0" frameborder="0" allowfullscreen></iframe>';
				} else if (type==="vimeo") {
					var d = '<iframe src="//player.vimeo.com/video/'+ url + '?autoplay=1;title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff" width="'+w+'" height="'+h+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
				}
				$(".work-preview .frame .player").html(d);
			}

			// Replace Caption
			var caption = "<div class='caption one-half column'><h3 class='title'>"+caption+"</h3></div>"
			$('.work-preview .caption').replaceWith(caption);

			// Replace image details
			var meta = "<div class='details one-half column'>";
			image.find(".details span").each(function() {
				if($(this).attr("data-title")!="album" && $(this).attr("data-title")!="date") {
					meta+= "<div class='detail'><p class='name'>"+$(this).attr("data-title")+"</p><p class='value'>"+$(this).text()+"</p></div>";
				}
			});
			meta+= "</div>";
			$('.work-preview .meta > .details').replaceWith(meta);

			// Replace Album and Date
			meta= "<div class='details'>";
			image.find(".details span").each(function() {
				if($(this).attr("data-title")=="album" || $(this).attr("data-title")=="date") {
					meta+= "<div class='detail'><p class='name'>"+$(this).attr("data-title")+"</p><p class='value'>"+$(this).text()+"</p></div>";
				}
			});
			meta+= "</div>";
			$('.work-preview .meta .links .details').replaceWith(meta);

			// Load Sharing Links
			if(settings.portfolioEnableSharing){
				var u = window.location.href;
				var s = u+"?f="+source;
				fixSharing(s);
			} else {
				$(".work-preview .social-links").addClass("disabled");
			}

			// Enable previous button if not first
			if(!current==0) $('.work-preview .nav .prev').removeClass("disabled");

			// Disable next button if last
			if(current==total-1) $('.work-preview .nav .next').addClass("disabled");

			// Fullscreen button
			$('.work-preview .full-screen').click(function(){
				previewFullScreen();
			});

			$(".work-preview .frame").mousemove(function() {
				$(".work-preview .frame .full-screen").addClass("active");
			});

			$(".work-preview .frame").mousestop(900, function() {
			    $(".work-preview .frame .full-screen").removeClass("active");
			});
			
		}
	
	}

	// Close button
	$('.work-preview .close').click(function(){
		previewClose();
	});

	// Fullscreen button
	$('.work-preview .full-screen').click(function(){
		previewFullScreen();
	});

	// Navigation buttons
	$('.work-preview .prev').click(function(){
		previewPrev();
	});

	$('.work-preview .next').click(function(){
		previewNext();
	});

	$('.work-preview .frame').on("swipeleft",function(){
		previewNext();
	});

	$('.work-preview .frame').on("swiperight",function(){
		previewPrev();
	});

	// Keyboard navigation
	$(document).keydown(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '37') previewPrev();
	});
	$(document).keydown(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '39') previewNext();
	});

}

function fixSharing(url) {
	var url = url;
	$(".work-preview .social-links .facebook").click(function(){
		window.open("https://www.facebook.com/sharer/sharer.php?u="+url, "Share", "width=600, height=400, status=no, toolbar=no, menubar=no");
	});

	$(".work-preview .social-links .twitter").click(function(){
		window.open("https://twitter.com/home?status="+url, "Share", "width=600, height=400, status=no, toolbar=no, menubar=no");
	});

	$(".work-preview .social-links .google").click(function(){
		window.open("https://plus.google.com/share?url="+url, "Share", "width=600, height=400, status=no, toolbar=no, menubar=no");
	});

	$(".work-preview .social-links .email").click(function(){
		window.open("mailto:?body="+url,"_parent");
	});

}

function loadURL() {
	var file = getUrlParameter('f');
	if(!file=="") {
		var p = /%2F/ig;
		file = file.replace(p, "/" );
		var s = $("span[data-source='"+file+"']");
		var f = s.parents(".file.view");
		if( f.length == 1 ) {
			previewImage(f);
		} else {
			console.log("The file you are looking for doesn't exist :(");
		}
	} else {
		console.log("There was no file parameters.");
	}

}

function playLoader() {
	if(settings.enableLoader) {
		var loaderIcon = '<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a"><stop stop-color="#fff" stop-opacity="0" offset="0%"/><stop stop-color="#fff" stop-opacity=".631" offset="63.146%"/><stop stop-color="#fff" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" /></path><circle fill="#fff" cx="36" cy="18" r="1"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" /></circle></g></g></svg>'
		$("body").append("<div class='loading'><div class='loading-icon'>"+loaderIcon+"</div></div>");
		$(".loading").delay(1000).fadeOut(1000, function() {
			$("body > .wrapper").animate({ opacity: 1 }, 1000);
			$("body > .loading").remove();
	 	});
	} else {
		$("body > .wrapper").css("opacity", 1);
	}

}

function playAnimations() {

	if(settings.enableAnimations) {
		var delay = 3000;
		$(".animated").each(function() {
			var item = $(this);
			var t = item.offset().top;
			var r = windowHeight;
			item.css("opacity", 0);
			if (t<r) {
				setTimeout(function(){
					item.addClass("fadeIn");
			        item.removeAttr("style");
				}, delay);
				delay += 400;
			} else {
				item.waypoint(function() {
			        setTimeout(function() {
			            item.addClass("fadeIn");
			            item.removeAttr("style");
			        }, 400);
			    }, {
			        offset: '100' 
			    });
			}
		});
	}

}

function adjustSizes() {

	windowHeight = $(window).height();
	windowWidth = $(window).width();

	//Fullscreen
	$(".fullscreen").css('height', windowHeight);
	$("div.work-preview .frame.full").css('height', windowHeight);
	adjustVideo();

	//Vertical Center
	$(".vertical-center").each(function() {
		$(this).css('margin-top', ($(this).parent().height() - $(this).height()) / 2);
	});

	// Adjust Navigation
	$("nav.navigation .menu").css('margin-top', (windowHeight - $("nav.navigation .menu").height() - $("nav.navigation .header").height() - 140 - $("nav.navigation .links").height()) / 2);

	// Adjust Page
	$("section.page").each(function() {
		var content = $(this).find(".content");
		var h = content.height() + 132;
		if(h<windowHeight) content.css("padding-top", (windowHeight - content.height())/2);
	});

	// Adjust Portfolio
	var portfolio = $("section.portfolio");
	var grid = portfolio.find(".grid .content");
	grid.attr("data-item-height", 300);
	if(windowWidth < 767) grid.attr("data-item-height", 200);

   	//Fix Video Backgrounds
	$(".background.video").each(function() {
		var h = windowHeight;
		var w = windowWidth;
		var rat = w/h;
		if (rat > (16/9)) {
			var v = w * (16/9);
			$(this).find("video").css('width', w);
			$(this).find("video").css('height', v);
			var vc = ($(this).find("video").height() - h) / 2;
			$(this).find("video").css('margin-top', '-'+vc+'px');
			$(this).find("video").css('margin-left', '0px');
		} else {
			var v = h * (16/9);
			$(this).find("video").css('height', h);
			$(this).find("video").css('width', v);
			var vc = ($(this).find("video").width() - w) / 2;
			$(this).find("video").css('margin-top', '0px');
			$(this).find("video").css('margin-left', '-'+vc+'px');
		}
	});
   	//Basic

}

function adjustVideo() {

	$(".js-video").each(function() {
		var poster = $(this).attr("data-poster");
		if(!poster=="") $(this).css("background-image", "url("+poster+")");
	});

}

function playVideo(video) {

	var type = video.attr("data-type");
	var url = video.attr("data-url");
	var poster = video.attr("data-poster");


	if(type=="video"){
		var h = "<video autoplay poster='"+poster+"'><source src='"+url+"' type='video/mp4'></video>";
		video.html(h);
		var h = video.height();
		var w = video.width();
		var rat = w / h;
		if (rat > (16/9)) {
			var v = w * (16/9);
			video.find("video").css('width', w);
			video.find("video").css('height', v);
			var vc = (video.find("video").height() - h) / 2;
			video.find("video").css('margin-top', '-'+vc+'px');
			video.find("video").css('margin-left', '0px');
		} else {
			var v = h * (16/9);
			video.find("video").css('height', h);
			video.find("video").css('width', v);
			var vc = (video.find("video").width() - w) / 2;
			video.find("video").css('margin-top', '0px');
			video.find("video").css('margin-left', '-'+vc+'px');
		}

	} else if (type=="youtube") {
		var h = "<iframe src='https://www.youtube.com/embed/"+url+"?showinfo=0&controls=0&rel=0&color=black&autoplay=1' frameborder='0'></iframe>";
		video.html(h);
	}

	var container = video.parents(".item");
	var controls = container.find(".controls");
	controls.addClass("active");

}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }

}

(function($) {
    $.event.special.mousestop = {
        setup: function(data) {
            $(this).data('mousestop', _data(data))
                   .bind('mouseenter.mousestop', _mouseenter)
                   .bind('mouseleave.mousestop', _mouseleave)
                   .bind('mousemove.mousestop', _mousemove);
        },
        teardown: function() {
            $(this).removeData('mousestop')
                   .unbind('.mousestop');
        }
    };

    function _mouseenter() {
        var _self = this,
            data = $(this).data('mousestop');

        this.movement = true;

        if(data.timeToStop) {
            this.timeToStopTimer = window.setTimeout(function() {
                _self.movement = false;
                window.clearTimeout(_self.timer);
            }, data.timeToStop);
        }
    }

    function _mouseleave() {
        window.clearTimeout(this.timer);
        window.clearTimeout(this.timeToStopTimer);
    }
    
    function _mousemove() {
        var $el = $(this),
            data = $el.data('mousestop');

        if(this.movement) {
            window.clearTimeout(this.timer);
            this.timer = window.setTimeout(function() {
                $el.trigger('mousestop');
            }, data.delay);
        }
    }

    function _data(data) {
        if($.isNumeric(data)) {
            data = {delay: data};
        }
        else if(typeof data !== 'object') {
            data = {};
        }

        return $.extend({}, $.fn.mousestop.defaults, data);
    }

    $.fn.mousestop = function(data, fn) {
        if (typeof data === 'function') { fn = data; }
        return arguments.length > 0 ? this.bind('mousestop', data, fn) : this.trigger('mousestop');
    };

    $.fn.mousestop.defaults = {
        delay: 300,
        timeToStop: null
    };

})(jQuery);