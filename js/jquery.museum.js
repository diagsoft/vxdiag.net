/*

jquery-museum v1
by Murat Ayfer

Project page: http://muratayfer.com/jquery-museum
Git repo:     http://github.com/mayfer/jquery-museum

*/
/* 代码整理：懒人之家 www.lanrenzhijia.com */
;(function($) {

    $.museum = function(el, options) {

        var defaults = {
            namespace: 'msm',
            padding: 25,
            disable_url_hash: false,
        }

        var plugin = this;
        plugin.settings = {}
        plugin.current_image = null;
        plugin.loaded = false;

        var init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.el = el;
            plugin.images = [];
            plugin.el.each(function(i, e) {
                var src = $(e).attr('src');
                var title = $(e).attr('title');
                plugin.images[i] = {
                    src: src,
                    title: title,
                    elem: e,
                };
                $(this).wrap($('<a>').attr('href', src).bind('click', function(ev){
                	
                    if(!ev.metaKey) {
                        ev.preventDefault(); 
                        plugin.show_image(i);
                    }
                    
                }));
            });
            $(document).keydown(function(e) {
                if (e.keyCode == 27) {
                    // escape key
                    plugin.close();
                } else if(e.keyCode == 39) {
                    // right key
                    plugin.next_image()
                } else if(e.keyCode == 37) {
                    // left key
                    plugin.prev_image()
                }
            });

            $(window).on('hashchange.'+plugin.settings.namespace, plugin.set_image_based_on_hash)
            plugin.set_image_based_on_hash()

        }

        plugin.set_image_based_on_hash = function() {
            if((window.location.hash == '' || window.location.hash == '#') && plugin.loaded === true) {
                plugin.close();
            } else {
                var plugin_hash ='#' + plugin.settings.namespace+'-gallery';
                if(window.location.hash.substring(0, plugin_hash.length) === plugin_hash) {
                    var image_id = window.location.hash.split('-')[2];
                    if(parseInt(image_id) != parseInt(plugin.current_image)) {
                        plugin.show_image(image_id);
                    }
                }
            }
        }

        plugin.show_image = function(i) {
            if(plugin.loaded === false) {
                plugin.container = $('<div>')
                    .addClass(plugin.settings.namespace + '-gallery')
                    .appendTo($('body'))
                    .css({
                        'position': 'absolute',
                        'top': '0',
                        'left': '0',
                       // 'width': $(document).width() + 'px',  //wenww
                        'width':'100%',
                      //  'height':'100%',
                        'height': $(document).height() + 'px',
                     //   'background': 'rgba(0, 0, 0, 0.7)',
                        'text-align': 'center',                        
                        'z-index': '7900',//wenww 弹出图片背景 层在导航菜单之上
                    })
                    .bind('click', function(e){
                        e.preventDefault();
                        plugin.close();
                    });

                plugin.content = $("<div class='museumDiv'  >")
                    .addClass(plugin.settings.namespace + '-content')
                    .css({
                        'visibility': 'invisible',
                        'z-index': '8000', //wenww 弹出图片 在导航菜单之上
                        'position': 'relative',//wenww 弹出图片 在导航菜单之上                        
                        
                    })
                    .on('click', 'img', function(e) {
                        e.stopPropagation();
                    //wenww    plugin.next_image();
                    	plugin.close();
                    });

                plugin.loaded = true;
            }

            if(plugin.settings.disable_url_hash !== true) {
                window.location.hash = plugin.settings.namespace + '-gallery-' + i;
            }

            plugin.current_image = i;
            plugin.content.empty();
            var window_height = window.innerHeight ? window.innerHeight : $(window).height()
            var window_width = window.innerWidth ? window.innerWidth : $(window).width()
            
            
            plugin.image = $("<img class='museumImgs' >")
            /*    .css({ 
                    		'box-shadow': '0 0 15px 0 #000',
				                'cursor': 'pointer',
				                'background': 'rgba(0,0,0,0.6)',
				              //wenww 设置position='fixed',同时设置top 和left的值, 使单击弹出的图片一直显示,不受页面滚动影响
				                'top': '0',
				               'bottom': '0',
				                'left': '0',
				                'right': '0',
				               // 'right': '10%',
				                'padding-top':'2%',
				                'padding-bottom':'100%',
				                'padding-left':'12%',
				                'padding-right':'12%',
				                //'right':'20px',
				                'position': 'fixed',
				              	//wenww 使弹出的图片自适应浏览器宽度.
				              	'width':'100%',
				              	'text-align':'center',
				              	'border':'1px solid red',
				              	'display': 'inline-block',
                })		*/
                .attr('src', plugin.images[i].src)
								.appendTo(plugin.content);								                
													                
													
                		

						
            plugin.show_image_when_available();
        }

        plugin.show_image_when_available = function() {
            // we will know how wide/tall the image is once it starts downloading it
            if(plugin.image[0].height && plugin.image[0].width) {
                plugin.content = plugin.content.appendTo(plugin.container);

                var window_height = window.innerHeight ? window.innerHeight : $(window).height()
                var window_width = window.innerWidth ? window.innerWidth : $(window).width()

                var margin_top = ($(document).scrollTop() + ((window_height - plugin.image.height()) / 2));
                var margin_left = ($(document).scrollLeft() + ((window_width - plugin.image.width()) / 2));

                plugin.content.css({
                    'margin-top': margin_top + 'px',
                    'margin-left': margin_left + 'px',
                    'width': plugin.image.width(),
                    'height': plugin.image.height(),
                    
                });
                plugin.content.css({
                    'visibility': 'visible',
                });
            } else {
                setTimeout(plugin.show_image_when_available, 50);
            }
        }

        plugin.next_image = function() {
            plugin.show_image((plugin.current_image + 1) % plugin.images.length);
        }

        plugin.prev_image = function() {
            var index = (plugin.images.length + plugin.current_image - 1) % plugin.images.length;
            plugin.show_image(index);
        }

        plugin.close = function() {
            plugin.loaded = false;
            plugin.current_image = null;
            if(plugin.settings.disable_url_hash !== true) {
               //wenww window.location.hash = '';
               		window.history.back();
            }
            plugin.container.remove();
        }

        init();
    }

})(jQuery);
/* 代码整理：懒人之家 www.lanrenzhijia.com */