    // 全局对象
    window.IndexPro = {
        os: navigator.appVersion,
        Touch: {
            type: true,
            start: {
                x: 0,
                y: 0
            },
            hend: {
                x: 0,
                y: 0
            },
            MinTouchWidth: 0.4,
            MinTouchHeight: 0.2
        },
        OpenFullScreen: (element)=>{
            element.requestFullscreen && element.requestFullscreen()
            element.mozRequestFullScreen && element.mozRequestFullScreen()
            element.webkitRequestFullscreen && element.webkitRequestFullscreen()
            element.msRequestFullscreen && element.msRequestFullscreen()
        },
        ExitFullscreen: ()=>{
            document.exitFullscreen && document.exitFullscreen()
            document.mozCancelFullScreen && document.mozCancelFullScreen()
            document.webkitExitFullscreen && document.webkitExitFullscreen()
        },
        Rotating: screen.orientation || screen.mozOrientation || screen.msOrientation,
        Notification: (name,body)=>{
            let View = (name,body)=>{
                let self = new Notification(name,{
                    icon: IndexPro.NotificationIcon,
                    body: body,
                    renotify: true,
                    silent: true,
                    sound: IndexPro.NotificationSound,
                    tag: 'Notification'
                })
                self.onshow = ()=>setTimeout(()=>self.close(), 5000)
                // N.onclick = () => 
            }
            if (Notification) {
                Notification.permission === "granted" && View(name, body)
                Notification.permission !== 'denied' && Notification.requestPermission((permission)=>{
                    permission === "granted" && View(name, body)
                })
            }
        },
        NotificationIcon: './image/favicon.png',
        NotificationSound: './image/sound.mp3',
        Worker: (Module)=>{
            if (typeof (Worker) !== "undefined") {
                let Workers = new Worker(Module)
                return {
                    on: (callback)=>{
                        Workers.onmessage = (Event)=>callback(Event.data)
                    },
                    emit: (data)=>Workers.postMessage(data),
                    exit: Workers.terminate
                }
            }
        },
        Geolocation: (callback)=>{
            let showPosition = (position) => callback(position)
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition)
            }
        },
        VisibilityState: (callback)=>{
            document.addEventListener('visibilitychange', function() {
                let pageVisibility = document.visibilityState
                if (document.visibilityState == 'hidden') {
                    callback(false, pageVisibility)
                } else if (document.visibilityState == 'visible') { 
                    callback(true, pageVisibility)
                }
            })
        },
		DeviceOrientationEvent: (callback)=>{
			if (window.DeviceOrientationEvent) {
				window.addEventListener('deviceorientation', (Event)=>{
					callback(Event)
				}, false)
			}
		},
        DeviceMotionEvent: (callback)=>{
            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', (Event)=>{
                    callback && callback(Event)
                }, false)
            }
        },
        Audio: ()=>{
            const handleSuccess = (stream) => {
                let context = new AudioContext()
                let input = context.createMediaStreamSource(stream)
                let processor = context.createScriptProcessor(1024,1,1)
                processor.connect(context.destination)
                processor.onaudioprocess = function(Event){
                    console.log((Event.inputBuffer))
                }
            }
            navigator.mediaDevices && navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess)
        }
    }