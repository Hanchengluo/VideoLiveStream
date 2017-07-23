window.onload = () => {
    particlesJS('background', {
      particles: {
        color: '#ddd',
        shape: 'circle', // "circle", "edge" or "triangle"
        opacity: 1,
        size: 4,
        size_random: true,
        nb: 150,
        line_linked: {
          enable_auto: true,
          distance: 100,
          color: '#ddd',
          opacity: 1,
          width: 1,
          condensed_mode: {
            enable: false,
            rotateX: 600,
            rotateY: 600
          }
        },
        anim: {
          enable: true,
          speed: 1
        }
      },
      interactivity: {
        enable: true,
        mouse: {
          distance: 250
        },
        detect_on: 'canvas', // "canvas" or "window"
        mode: 'grab',
        line_linked: {
          opacity: .5
        },
        events: {
          onclick: {
            enable: true,
            mode: 'push', // "push" or "remove" (particles)
            nb: 4
          }
        }
      },
      /* Retina Display Support */
      retina_detect: true
    });
    
    
    $('.Login-sogin-on').click(function(){
        let type =  $('.Login').attr('data-type')
        let UserName = $('#UserName').val()
        let PassWord = $('#PassWord').val()
        let PassWordTwo = $('#PassWord-two').val()
        if(UserName.length > 0 && PassWord.length > 0){
            if(type == 'login'){
                $.post('./Login', {
                    name: UserName,
                    pass: PassWord
                }, (data) => {
                    if(data.code == 200){
                        localStorage.UserName = UserName
                        localStorage.PassWord = data.data.key
                        location.href = localStorage.referer
                    }
                })
            }else{
                if(PassWord == PassWordTwo && UserName.length > 0){
                    $.post('./Sogin', {
                        name: UserName,
                        pass: PassWord
                    }, (data) => {
                        if(data.code == 200){
                            $($('.Login-of-Sogin button')[1]).css('border-bottom', '')
                            $($('.Login-of-Sogin button')[1]).removeClass('tab-on')
                            $($('.Login-of-Sogin button')[0]).css('border-bottom', '1px solid #f00222')
                            $($('.Login-of-Sogin button')[0]).addClass('tab-on')
                            $('.Login-sogin-on button').text('登录')
                            $('.Login').attr('data-type', 'login')
                            $('#PassWord-two').addClass('Login-input-hide')
                            $('#PassWord').attr('placeholder', '密码')
                        }
                    })
                }
            }
        }
    })
    
    
    $('.Login-of-Sogin button').click(function(){
        let type = $(this).attr('data-type')
        for(let i of $('.Login-of-Sogin button')){
            if($(i).attr('data-type') == type){
                $(i).css('border-bottom', '1px solid #f00222')
                $(i).addClass('tab-on')
                $('.Login-sogin-on button').text('注册')
                $('.Login').attr('data-type', 'sogin')
            }else{
                $(i).css('border-bottom', '')
                $(i).removeClass('tab-on')
                $('.Login-sogin-on button').text('登录')
                $('.Login').attr('data-type', 'login')
            }
        }
        if(type == 'sogin'){
            $('#PassWord-two').removeClass('Login-input-hide')
            $('#PassWord').attr('placeholder', '再次输入密码')
        }else{
            $('#PassWord-two').addClass('Login-input-hide')
            $('#PassWord').attr('placeholder', '密码')
        }
    })
    
    
}