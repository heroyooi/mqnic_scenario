var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
var runToast = false;

$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null){
    return null;
  }
  else {
    return decodeURI(results[1]) || 0;
  }
}

var GUI = window.GUI || (function(){
  return {
    init: function(){
      GUI.baseUI($(document));

      AOS.init({ // https://github.com/michalsnik/aos#1-initialize-aos
        duration: 600,
        once: true,
      });
      
      if ($('.menu-wrap').length) {
        GUI.gnbMenu();
      }

      // setTimeout(function(){
      //   $('.lnb-wrap .btn-menu').click();
      // }, 250);
    },
    baseUI: function($this){
      var _ = $this;
      var $win = $(window);

      var inputUI = _.find('.input-base');
      var inputCountUI = _.find('.input-wrap.w-count');
      var textareaCountUI = _.find('.textarea-wrap');
      var selectUI = _.find(".select-base");
      var csSelectUI = _.find('.select-box');
      var tabUI = _.find('.tab-base');
      var controlUI = _.find('.counter-base');
      var popupUI = _.find('.popup-wrap');
      var csPopupUI = _.find('.cs-popup-wrap');
      
      var $lnb = $('.lnb-wrap');
      var $container = $('#container');
      var $map = $('.map-container');
      var tipUI = $('.btn-tip');
      var treeUI = $('.tree-wrap');
      var resultUI = $('.result-list');

      if ($lnb.length) {
        var activeLnb = $lnb.find('.lnb').data('active');
        if (activeLnb) {
          $lnb.find('.lnb').find('li').eq(activeLnb - 1).addClass('on');
        }
        $lnb.find('.btn-menu').on('click', function(e){
          e.preventDefault();
          if (!$lnb.hasClass('on')) {
            $lnb.addClass('on');
            if ($map.length) {
              $map.addClass('activeLnb');
            }
            if ($container.length) {
              $container.addClass('activeLnb');
            }
          } else {
            $lnb.removeClass('on');
            if ($map.length) {
              $map.removeClass('activeLnb');
            }
            if ($container.length) {
              $container.removeClass('activeLnb');
            }
          }
        });
        $lnb.children('.lnb-content-area').children('.btn-close').on('click', function(e){
          e.preventDefault();
          $lnb.removeClass('activeSearch');
          $map.find('.btn-map-search').show();
        });
      }

      if ($map.length) {
        $(window).on('load resize', function(){
          $map.css('height', $(window).height());
        });
        $map.find('.btn-map-search').on('click', function(e){
          e.preventDefault();
          $lnb.addClass('activeSearch');
          $(this).hide();
        });
      }

      if (tipUI.length) {
        tipUI.on('click', function(e){
          e.preventDefault();
          
          if (!$(this).hasClass('on')) {
            $(this).addClass('on');
            if ($(this).hasClass('in-tip')) { // 사용처 : 영상정보 목록(regist_video.html)
              $(this).closest('.w-tip').next('.tip-area').show();
              return;
            }
            if ($(this).attr('href') != '#') {
              $($(this).attr('href')).show();
              return;
            }
            $(this).next('.tip-area').show();
          } else {
            $(this).removeClass('on');
            if ($(this).hasClass('in-tip')) { // 사용처 : 영상정보 목록(regist_video.html)
              $(this).closest('.w-tip').next('.tip-area').hide();
              return;
            }
            $($(this).attr('href')).hide();
          }
        });
        $('.tip-area .btn-close').on('click', function(e){
          e.preventDefault();
          $(this).closest('.tip-area').prev('.btn-tip').removeClass('on');
          $(`a[href="#${$(this).closest('.tip-area').attr('id')}"]`).removeClass('on'); // ITSK-UI-006
          if ($(this).closest('.tip-area').prev().hasClass('w-tip')) { // 사용처 : 영상정보 목록(regist_video.html)
            $(this).closest('.tip-area').prev().children('.btn-tip').removeClass('on');
          }
          $(this).closest('.tip-area').hide();
        })
      }

      if (treeUI.length) {
        treeUI.find('dt').on('click', function(){
          var target = $(this).closest('.tree-wrap');
          
          if (!target.hasClass('on')) {
            if (target.closest('.tree-frame').hasClass('swith')) {
              target.siblings().removeClass('on');
            }
            target.addClass('on');
          } else {
            target.removeClass('on');
          }
        })
        treeUI.find('.tree-list li .btn-toggle').on('click', function(e){
          e.preventDefault();
          if (!$(this).closest('li').hasClass('on')) {
            $(this).closest('li').addClass('on');
          } else {
            $(this).closest('li').removeClass('on');
          }
        })
      }
      
      if (resultUI.length) {
        resultUI.find('dt').on('click', function(){
          var target = $(this).closest('li');
          if (!target.hasClass('on')) {
            target.addClass('on');
          } else {
            target.removeClass('on');
          }
        });
      }

      if (inputUI.length) {
        inputUI.each(function(){
          if ($(this).val().length && $(this).closest('.input-wrap').hasClass('w-del')) {
            $(this).closest('.input-wrap').addClass('active');
          }
        });
        inputUI.on('mousedown', function(e){
          if ($(this).hasClass('disabled')) {
            e.preventDefault();
          }
        });
        inputUI.on('keyup', function(){
          if ($(this).val().length) {
            $(this).closest('.input-wrap').addClass('active');
          } else {
            $(this).closest('.input-wrap').removeClass('active');
          }
        });
        inputUI.closest('.input-wrap').find('.btn-del').on('click', function(){
          if ($(this).prev('.input-base').hasClass('disabled')) {
            return;
          }
          $(this).closest('.input-wrap').removeClass('active');
          $(this).prev('.input-base').val('').focus();
        })
      }
      if (inputCountUI.length) {
        inputCountUI.each(function(){
          var $input = $(this).find('.input-base');
          var $inputCount = $(this).find('.tx-count'); 
          var $inputTotal = Number($inputCount.text().split('/')[1]);
          var inputMemo = null;

          $input.on('keyup', function(){
            if ($(this).val().length > $inputTotal) {
              $(this).val(inputMemo)
            } else {
              inputMemo = $(this).val();
            }
            $inputCount.find('em').text($(this).val().length);
          })
        })
      }
      if (textareaCountUI.length) {
        textareaCountUI.each(function(){
          var $textarea = $(this).find('textarea');
          var $textareaCount = $(this).find('.tx-count');
          var $textareaTotal = Number($textareaCount.text().split('/')[1]);
          var textareaMemo = null;

          $textarea.on('keyup', function(){
            if ($(this).val().length > $textareaTotal) {
              $(this).val(textareaMemo)
            } else {
              textareaMemo = $(this).val();
            }
            $textareaCount.find('em').text($(this).val().length);
          })
        })
      }

      if (selectUI.length) {
        selectUI.find('select').each(function(){
          // if ($(this).closest('.select-base').hasClass('disabled')) {
          //   return true;
          // }
          if ($(this).find('option:eq(0)').attr('value') === undefined) {
            $(this).find('option:eq(0)').val(0);
          }
          if (parseInt($(this).val()) === 0) {
            $(this).closest('.select-base').removeClass('active');
          } else {
            $(this).closest('.select-base').addClass('active');
          }
        });
        selectUI.find('select').on("change",function(){
          if ($(this).closest('.select-base').hasClass('disabled')) {
            return true;
          }
          if (parseInt($(this).val()) === 0) {
            $(this).closest('.select-base').removeClass('active');
          } else {
            $(this).closest('.select-base').addClass('active');
          }
          $(this).prev().html($(this).find("option:selected").text());
        }).prev().html(function() {
          return $(this).next().find("option:selected").text();
        });
      }
      if (csSelectUI.length) {
        csSelectUI.each(function(){
          if ($(this).data('active')) {
            var activeIndex = $(this).find('li').eq($(this).data('active') - 1);
            if (activeIndex.text() !== '선택') {
              $(this).addClass('active');
            }
            activeIndex.addClass('on');          
            if (activeIndex.text() === '') {
              return;
            } else {
              $(this).find('.value').text(activeIndex.text());
            }
          }
        })
        csSelectUI.find('.value').on('click', function(e){
          e.preventDefault();
          var $target = $(this).closest('.select-box');
          if ($target.hasClass('disabled')) {
            return;
          }
          if (!$target.hasClass('on')) {
            $('.select-box').removeClass('on');
            $target.addClass('on');
          } else {
            $target.removeClass('on');
          }
        });
        csSelectUI.find('li a').on('click', function(e){
          e.preventDefault();
          if ($(this).text() === '선택') {
            $(this).closest('.select-box').removeClass('active');
          } else {
            $(this).closest('.select-box').addClass('active');
          }
          $(this).closest('li').addClass('on');
          $(this).closest('li').siblings().removeClass('on');
          var $target = $(this).closest('.select-box');
          $target.data('active', parseInt($(this).closest('li').index()) + 1);
          $target.find('.value:not(.fixed)').text($(this).text());
          $target.removeClass('on');
        })
      }

      if (tabUI.length) {
        tabUI.each(function(){
          var target = $(this).find('li.on').find('a').attr('href');
          $(target).show();
        })
        tabUI.find('a').on('click', function(e){
          e.preventDefault();
          var target = $(this).attr('href');
          $(this).closest('li').addClass('on');
          $(this).closest('li').siblings().removeClass('on');
          $(target).show();
          $(target).siblings().hide();
        });
      }

      if (controlUI.length) {
        controlUI.each(function(){
          var $input = $(this).find('input'),
              $minus = $(this).find('.btn-minus'),
              $plus = $(this).find('.btn-plus');
          var min = $(this).data('min'),
              max = $(this).data('max');

          $minus.on('click', function(){
            if (min) {
              if ($input.val() > min) $input.val(Number($input.val()) - 1);
            } else {
              if ($input.val() > 0) $input.val(Number($input.val()) - 1);
            }
          });

          $plus.on('click', function(){
            if (max) {
              if ($input.val() < max) $input.val(Number($input.val()) + 1);
            } else {
              $input.val(Number($input.val()) + 1);
            }
          });
        });
      }

      if (popupUI.length) {
        var posY = null;
        var magnificPopupConfiguration = function() {
          return {
            beforeOpen: function() {
              posY = window.pageYOffset;
              $('html').css('overflow', 'hidden');
              $('body').css({'position': 'fixed', 'top': -posY});
            },
            resize: function() {
              if ($('.fix-bottom').length) {
                var $coWrap = $('.fix-bottom .popup-wrap .con-wrap');
                if ($coWrap.hasClass('ws')) {
                  $coWrap.children('div').css('max-height', $win.height() - 202 + 'px');
                }
                if ($coWrap.outerHeight() > $win.height() / 3 * 2.3) {
                  $coWrap.addClass('ws');
                  $coWrap.children('div').css('max-height', $win.height() - 202 + 'px');
                }
              }
            },
            open: function() {},
            beforeClose: function() {
              $('html').css('overflow', '');
              $('body').css({'position': '', 'top': ''});
              window.scrollTo(0, posY);
            }
          }
        }
  
        //팝업 (공통) - jquery magnific 팝업
        _.find('.btn-base.disabled, .all-view.disabled, .add-mylist.disabled').on('click', function (e) { // 비활성화 버튼
          e.preventDefault();
        });
        _.find('.btn-popup-modal a').magnificPopup({
          type: 'inline',
          preloader: false,
          modal: false
        });
        $(document).on('click', '.b-mfp-close', function (e) {
          e.preventDefault();
          $.magnificPopup.close();
        });
        
        _.find('.btn-popup-anim-1:not(.disabled) a, a.btn-popup-anim-1:not(.disabled)').magnificPopup({
          type: 'inline',
          fixedContentPos: true,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'mfp-zin'
        });
        _.find('.btn-popup-anim-2:not(.disabled) a').magnificPopup({
          type: 'inline',
          fixedContentPos: false,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'mfp-slide-b'
        });
        _.find('.btn-popup-anim-3:not(.disabled) a, a.btn-popup-anim-3:not(.disabled)').magnificPopup({
          type: 'inline',
          fixedContentPos: true,
          fixedBgPos: true,
          overflowY: 'auto',
          closeBtnInside: true,
          preloader: false,
          midClick: true,
          removalDelay: 300,
          mainClass: 'fade-slideup fix-bottom',
          callbacks: magnificPopupConfiguration()
        });

		    $('.popup-wrap').each(function(){
          if ($(this).data('width')) {
            $(this).css('width', $(this).data('width'));
          }
        });
      }

      if ($('.s-popup-wrap').length) {
        $('.s-popup-wrap').each(function(){
          if ($(this).data('width')) {
            $(this).css('width', $(this).data('width'));
          }
        });
        $('.s-popup-wrap .mfp-close').on('click', function(){
          $(this).closest('.s-popup-wrap').fadeOut(200);
        });
      }

      if (csPopupUI.length) {
        csPopupUI.find('.mfp-close').on('click', function(){
          var target = $(this).closest('.cs-fullpage').attr('id');
          closeCSPopup();
          if (target === 'popup-find-address') $('.mfp-wrap').show(); // 2중 풀페이지 팝업 시
        });
        $('.cs-popup-dimm').on('click', function(){
          var target = $(this).next('.cs-popup-wrap').attr('id');
          if (target === 'popup-find-address') $('.mfp-wrap').show(); // 2중 풀페이지 팝업 시
          closeCSPopup();
        });

        resizeScrollFrame($win);
        
        $win.on('resize', function(){
          resizeScrollFrame($win);
        });
      }

      _.on('click', function(e){
        if (csSelectUI.length) {
          if (!$(e.target).closest('.select-box .value, .select-box ul').length) {
            csSelectUI.removeClass('on');
          }
        }
        if ($('.tip-area').length) {
          if (!$(e.target).closest('.tip-area, .btn-tip').length && $('.tip-area').css('display') == 'block') {
            tipUI.removeClass('on');
            $('.tip-area').hide();
          }
        }
      });
    },
    gnbMenu: function(){
      var $areaMenu = $('.menu-wrap');

      $(window).on('load resize', function(){
        $('.m-container').each(function(){
          var frameH = $(window).height() - 62;
          var $frame = $(this).children('div');
          $frame.css({ 'height': frameH });
          if ($frame.find('.m-inner').outerHeight() > frameH) {
            $(this).addClass('is-scroll');
          } else {
            $(this).removeClass('is-scroll');
          }
        });
      });

      $('.fm-wrap li.menu a').on('click', function(e){
        e.preventDefault();
        openGNB();
      });

      $areaMenu.find('.btn-back').on('click touchstart', function(e){
        e.preventDefault();
        closeGNB();
      });
    },
    toastUI: function(text, bottom, zIndex) {      
      if (!runToast) {
        runToast = true;
        var $toast = $('.toast-area');
        if (zIndex) $toast.css('z-index', zIndex);        
        $toast.stop().css('display', 'block');
        $toast.append('<p class="txt">'+ text +'</p>');
        setTimeout(function(){
          if (bottom) {
            $toast.css({ bottom: bottom });
          }        
          $toast.addClass('on');
          setTimeout(function(){
            $toast.attr('style', null);
            $toast.removeClass('on');
            setTimeout(function(){
              $toast.stop().css('display', 'none');
              $toast.find('.txt').remove();
              runToast = false;
            }, 500);
          }, 2000);
        }, 150);
      }
    },
    loadingUI: function(type) {
      if (type === 'open') {
        $('.loading-dimm, .loading-wrp').show();
      }
      if (type === 'close') {
        $('.loading-dimm, .loading-wrp').fadeOut(300);
      }
    },
    checkAllUI: function(selector, callback){
      var chkGroup = $(selector).closest('.tb-wrap');
      var chkInput = chkGroup.find('.chk-base input');
      var allChecked = null;
    
      $(selector).on('click', function(){
        chkInput.prop('checked', $(this).is(":checked"));
        if (typeof callback === 'function') {
          callback($(this).is(":checked"));
        }
      });
    
      chkInput.on('change', function(){
        allChecked = chkGroup.find('tbody .chk-base input:checked').length === chkGroup.find('tbody .chk-base input').length;
        $(selector).prop('checked', allChecked);
        callback(allChecked);
      });
    },
  }
}());

$(function(){
  GUI.init();
});

// 주행환경검색 맵 전용
var openSPopup = function(id) {
  $('.s-popup-wrap' + id).fadeIn(200);
};
var closeSPopup = function(id) {
  $('.s-popup-wrap').fadeOut(200); 
}
function generateFilterSlider(id, { min, max, values, step }) {
  var rangeH = $(id + " .slider-horizon");
  var rangeH_result = $(id + ' .filter-result');
  rangeH.slider({
    range: true,
    min,
    max,
    values,
    step,
    slide: function( event, ui ) {
      rangeH_result.find('.min').val(ui.values[0] + '.00');
      rangeH_result.find('.max').val(ui.values[1] + '.00');
      if (ui.values[0] == min && ui.values[1] == max) {
        rangeH.addClass('full');
      } else {
        rangeH.removeClass('full');
      }
    }
  });
  rangeH_result.find('.min').val(rangeH.slider("values", 0) + '.00');
  rangeH_result.find('.max').val(rangeH.slider("values", 1) + '.00');
  if (rangeH.slider("values", 0) == min && rangeH.slider("values", 1) == max) {
    rangeH.addClass('full');
  } else {
    rangeH.removeClass('full');
  }
}

// 이중 팝업을 열고 닫기 위한 함수
var openCSPopup = function(id) {
  $('.cs-popup-dimm#' + id + '-dimm, .cs-popup-wrap#' + id).fadeIn(200);
};
var closeCSPopup = function(id) {
  $('.cs-popup-dimm, .cs-popup-wrap').fadeOut(200); 
}

// 이중 팝업 높이 재계산을 위한 함수
var resizeScrollFrame = function(win){
  var $csBottom = $('.cs-popup-wrap.cs-bottom');
  var $csFullpage = $('.cs-popup-wrap.cs-fullpage');
  if ($csBottom.length) {
    var $coWrap = $csBottom.find('.con-wrap');
    if ($coWrap.hasClass('ws')) {
      $coWrap.children('div').css('max-height', win.height() - 202 + 'px');
    }
    if ($coWrap.outerHeight() > win.height() / 3 * 2) {
      $coWrap.addClass('ws');
      $coWrap.children('div').css('max-height', win.height() - 202 + 'px');
    }
  }
  if ($csFullpage.length) {
    var $coWrap = $csFullpage.find('.con-wrap');
    if ($coWrap.find('.m-scrollbar').length || $coWrap.find('.o-scrollbar').length) {
      $coWrap.children('div.m-scrollbar').css('height', win.height() - 82 + 'px');
      $coWrap.children('div.o-scrollbar').css('height', win.height() - 82 + 'px');
    }

    setTimeout(function(){
      if ($coWrap.find('.inner').outerHeight() > win.height() - 62) {
        $csFullpage.addClass('is-scroll');
      } else {
        $csFullpage.removeClass('is-scroll');
      }
    }, 300);
  }
};

// 메뉴 활성화, 비활성화를 위한 변수 및 함수
var rememberY = null;
var openGNB = function() {
  $('.menu-wrap').addClass('on');
  $('.menu-dimm').fadeIn(150);
  $('.m-section#menu-area').addClass('on');
  rememberY = window.pageYOffset;
  $('html').css('overflow', 'hidden');
  $('body').css({'position': 'fixed', 'top': -rememberY});
}
var closeGNB = function(){
  $('.menu-wrap').removeClass('on');
  $('.menu-dimm').fadeOut(150);
  $('html').css('overflow', '');
  $('body').css({'position': '', 'top': ''});
  window.scrollTo(0, rememberY);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getOptions(id, closeOnBgClick) {
  return {
    items: {
      src: id,
      type: 'inline',
    },
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'mfp-zin',
    closeOnBgClick: closeOnBgClick ?? true,
  };
}