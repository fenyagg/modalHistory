

;(function($) {
	$.modalHistory = {
		arModals: [],
        params: {
            template:   '<div class="modal-inner">'+
                            '<a href="javascript:void(0);" class="modalHistory-close">< Вернуться</a>'+
                            '<div class="modal-content"></div>'+
                        '</div>',
            container: "body",
            wrapperClass: '',
            cache: true,
            callbacs: {
                beforeOpen: function ($modal) {
                    $(".container").addClass('overflow');
                },
                afterLoad: function ($modal, data) {},
                beforeClose: function () {
                    $(".container").removeClass('overflow');
                },
            },
        },
        animate: {
            in: function ($modal) {
                $modal.addClass('slide-in');
            },
            out: function ($modal) {
                 $modal.removeClass('slide-in');
            }
        },
        open: function ( link, params) {
            if( !link ) {console.error("modalHistory: пустой аргумент link"); return;}
            var params = params || this.params;

            //добавляем в массив модальное окно

            var count = this.arModals.push({
                            "link": link
                        });
            var modalObj = this.arModals[count-1];

            //формируем модальное окно
            $(params.container)
                .append('<div class="modalHistory-container modal-'+count+" "+params.wrapperClass+'">'+params.template+'</div>');

            var $modal = $(".modalHistory-container.modal-"+count); 
            this.animate.in($modal);

            $modal.find(".modalHistory-close").attr("href", link);

            modalObj.$modal = $modal;

            params.callbacs.beforeOpen($modal);
            
            $.get(link)
                .done(function(data) {
                    params.callbacs.afterLoad($modal, data);
                    if(data) { 
                        $modal.find(".modal-content").html(data);
                        if(params.cache) modalObj.data = data;
                    }
                })
                .fail(function() {
                   console.log(error);
                });    
        },
        close: function (link) {
            if( !link ) {console.error("modalHistory: пустой аргумент link"); return;}
            var modalHistory = $.modalHistory;

            var arModals = $.modalHistory.arModals.filter(function(modal) {
                return modal.link === link;
            });
            arModals.forEach(function(el) {
                modalHistory.animate.out(el.$modal);
            });
        },
        init: function () {
            $(document).on('click', '.modalHistory-close', function(event) {
                event.preventDefault();
                var href = $(this).attr("href");
                if ( !href.length ) {console.log("modalHistory: пустой href у ссылки .modalHistory-close"); return;};

                $.modalHistory.close(href);
            });
        }
    }
    $.modalHistory.init();

	$.fn.modalHistory = function ( params ) {
		var	params = $.extend( $.modalHistory.params, params);        

		this.each(function(index, el) {
			var $link = $(this);
			$link.on('click', function(event) {
				event.preventDefault();
				$.modalHistory.open($link.attr("href"), params);
			});
		});
	}


	 //Свои модальные окна
    /*citrusUI.modal = {
        $container  : $("#citrus_modal_container"),
        $content    : $("#citrus_modal_content"),
        isOpen      : false,
        activeLink  : false,
        callbacs    : {
            beforeOpen: function () {
                $(".container").addClass('overflow');
            },
            afterOpen: function () {},
            afterLoad: function () {},
            beforeClose: function () {},
            afterClose: function () {
                $(".container").removeClass('overflow');
            },
        },
        open : function ( link ) {
            if( !link ) {console.error("citrus_modal: пустой аргумент link"); return;}

            var modal = this;

            modal.callbacs.beforeOpen.call(modal);

            modal.isOpen = true;
            modal.$container.addClass('_opened');
            modal.callbacs.afterOpen.call(modal);

            if( link !== modal.activeLink ) {
                modal.clear();
                //modal.$container.addClass('citrus-loading');
                $.get(link)
                    .done(function(data) {
                        modal.callbacs.afterLoad.call(modal);
                        //modal.$container.removeClass('citrus-loading');
                        if(data) {
                            modal.$content.html(data);
                        }
                        modal.activeLink = link;
                    })
                    .fail(function() {
                       console.log(error);
                    });
            }
        },
        close:function () {
            this.isOpen = false;
            this.callbacs.beforeClose.call(this);
            this.$container.removeClass('_opened');
            this.callbacs.afterClose.call(this);
        },
        clear: function () {
            this.$content.html("");
        }
    }
    //open popup on ready
    ;(function() {
        if(window.location.hash.indexOf('#citrus-modal:') + 1) {
            var hash = window.location.hash,
                link = hash.replace('#citrus-modal:',""),
                path = window.location.pathname;

            //если нет доп параметра то значит мы перешли по ссылке из вне
            if( !window.history.state || !window.history.state.citrus_modal_mode) {
                //меняем историю браузера чтобы перед ним встал очищенный юрл
                history.replaceState({}, document.title, path);
                history.pushState({"citrus_modal_mode": true}, document.title, path+hash);
            }

            citrusUI.modal.open(link);
        }
    }());

    //clear url
    //if( window.location.hash == "#citrus-modal" ) {window.history.back();}

    setTimeout(function(){
        citrusUI.modal.$container.addClass('transtition');
    }, 100)
    $(document)
        .on('click', '.citrus-modal', function(event) {
            event.preventDefault();
            var link = $(this).attr("href");
            citrusUI.modal.open(link);
            history.pushState({"citrus_modal_mode": true}, document.title, window.location.pathname+"#citrus-modal:"+link);
        })
        .on('click', '.citrus_modal_close', function(event) {
            event.preventDefault();
            citrusUI.modal.close();
            window.history.back();
        })
        .on('keyup', function(event) {
            if( citrusUI.modal.isOpen && event.keyCode == 27 ) {
                citrusUI.modal.close();
                window.history.back();
            }
        });

    window.onpopstate = function( e ) {
        if( citrusUI.modal.isOpen ) {e.preventDefault(); citrusUI.modal.close();  }
        if( e.target.location.hash.indexOf('#citrus-modal:') + 1 ) {
            var link = window.location.hash.replace('#citrus-modal:',"");
            citrusUI.modal.open(link);
        }
    }*/
}($));