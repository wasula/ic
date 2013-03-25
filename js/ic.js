// IC - Infinite Carousel 
// Inspired by Remy Sharp's tutorial located on  http://jqueryfordesigners.com/jquery-infinite-carousel/
// Free to use/modify at your own risk.
// Implemented by: Wasula Kankanamge(https://github.com/wasula)

(function(window, document, undefined) {
	(function($){
		$.fn.ic = function( settings, callback ){
			function repeat( str, n ){
				n = n ? n : 0;
				return new Array(n+1).join(str);
			}
			var options = {margin:0, single:false }
			if( settings ){
				options = settings;
				options.margin = parseInt(options.margin, 10);
				options.margin = options.margin ? options.margin : 0;
				options.vertical = options.vertical ? true : false;
				options.curPage = settings.curPage ? settings.curPage : 1;
			}

			return this.each(function(){

				var $wrapper = $('> div.wrapper', this).css('overflow','hidden'),
						$slider = $wrapper.find('> div.slider'),
						$items = $slider.find('> div.item'),
						$single = $items.filter(':first'),

						singleWidth = (options.vertical?$single.outerHeight():$single.outerWidth()) + ( options.margin ? options.margin*2 : 0 ),
						visible = options.single ? 1 : Math.ceil((options.vertical?$wrapper.innerHeight():$wrapper.innerWidth())/singleWidth),
						curPage = 1,
						pages = Math.ceil($items.length/visible),
						scroll = options.vertical?'scrollTop':'scrollLeft';

				if( $items.length % visible != 0 ){
					var needsToFill = visible - ($items.length%visible);
					$items.filter(':last').after($items.slice(0, needsToFill).clone().removeClass('active').addClass('cloned'));
					//$slider.append(repeat('<div class="item empty"></div>', visible - ($items.length%visible)));
					$items = $slider.find('> div.item');
				}
				
				$items.filter(':first').before($items.slice(-visible).clone().removeClass('active').addClass('cloned'));
				$items.filter(':last').after($items.slice(0, visible).clone().removeClass('active').addClass('cloned'));
				$items = $slider.find('> div.item');
				$wrapper[scroll](singleWidth * visible * options.curPage );
				curPage = options.curPage;
				function gotoPage( page ){
					var dir = page < curPage ? -1 : 1,
							n = Math.abs(curPage - page),
							left = singleWidth * dir * visible * n;
					$items.removeClass('active');
					var props = {}
					props[scroll] = '+=' + left;
					$wrapper.filter(':not(:animated)').animate(props, 500, function(){
						if(  page == 0 ){
							$wrapper[scroll]( singleWidth * visible * pages );
							page = pages;
						}
						else if( page > pages ){
							$wrapper[scroll]( singleWidth * visible );
							page = 1;
						}
						curPage = page;
						for (var i = curPage; i < (curPage+visible); i++) {
							$($items[i]).addClass('active');
						};
					});
					return false;
				}

				$('.move-left', this).click(function(){
					return gotoPage( curPage - 1 );
				});
				$('.move-right', this).click(function(){
					return gotoPage( curPage + 1 );
				});
				
				$(this).bind('goto', function( event, page ){
					gotoPage( page );
				});
				callback( true );
			});
		}
	})(jQuery);
})(window, document);