$().ready(function(){
    
    
    const video = document.getElementById('live-stream')
    let videoTime = 0
    
    
    video.oncanplay = () => {
        videoTime = video.duration
        let videoWidth = video.videoWidth / video.videoHeight * $('.live').height()
        $('#Global-Style').html(`
            .live-play {width:${videoWidth + 2}px;left:${($(window).width() / 2) - (videoWidth / 2)}px;}
        `)
        $('.live-play').css('opacity', '1')
        $(window).resize(() => {
            $('.live-play').css('left', `${($(window).width() / 2) - (videoWidth / 2)}px`)
        })
    }
    
    video.ontimeupdate = (Event) => {
        $('.live-stream-plan').css('width', Event.target.currentTime / videoTime * 100 + '%')
    }
    
    
    $('.play-pause').click(function(){
        let type = $(this).attr('data-play')
        if(type == 'true'){
            video.pause()
            $(this).attr('data-play', 'false')
            $($(this).find('i')).removeClass('fa-pause').addClass('fa-play')
        }else{
            video.play()
            $(this).attr('data-play', 'true')
            $($(this).find('i')).removeClass('fa-play').addClass('fa-pause')
        }
    })
    
    
})