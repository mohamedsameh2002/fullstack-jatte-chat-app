let chatName=''
let chatSocket=null
let chatWindowUrl=window.location.href
let chatRoomUuid=Math.random().toString(36).slice(2,12)

const chatElement =document.querySelector('#chat')
const chatOpenElement =document.querySelector('#chat_open')
const chatIconElement =document.querySelector('#chat_icon')
const chatWelcomeElement =document.querySelector('#chat_welcome')
const chatRoomElement =document.querySelector('#chat_room')
const chatJoinElement =document.querySelector('#chat_join')
const chatNameElement =document.querySelector('#chat_name')
const chatLogElement =document.querySelector('#chat_log')
const chatInputElement =document.querySelector('#chat_message_input')
const chatSubmitElement =document.querySelector('#chat_message_submit')

function scroolToBottom() {
    chatLogElement.scrollTop=chatLogElement.scrollHeight
}

function getCookie(name){
    var cookieValue=null

    if (document.cookie && document.cookie != ''){
        var cookies =document.cookie.split(';')
        for (var i = 0; i< cookies.length; i++){
            var cookie=cookies[i].trim()
            if (cookie.substring(0,name.length +1) === (name+'=')){
                cookieValue=decodeURIComponent(cookie.substring(name.length +1))
                break

            }
        }
    }

    return cookieValue
}


function sendMessage (){
    chatSocket.send(JSON.stringify({
        'type':'message',
        'message':chatInputElement.value,
        'name':chatName,
    }))
    chatInputElement.value=''
}


function onChatMessage(data){
    if (data.type == 'chat_message'){
        let tmpinfo = document.querySelector('.writing')
        if (tmpinfo){
            tmpinfo.remove()
        }
        if (data.agent){
            chatLogElement.innerHTML+=`
            <div class="flex w-full mt-2 space-x-md max-w-md">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}</div>
                    <div style="padding: 0 10px;">
                        <div style="background-color: #828282;color: white;font-weight: 500;" class="bg-gray-300 p-3 rounded-l-lg rounded-br-lg"><p class="text-sm">${data.message}</p></div>
                        <span class="text-xs text-gray-500 leadin-none">${data.created_at} ago</span>
                    </div>
            </div>
            `
        }else{
            chatLogElement.innerHTML+=`
            <div class="flex w-full mt-2 space-x-md max-w-md ml-auto justify-end">
                    <div style="order:1;" class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}</div>
                    <div style="padding: 0 10px;">
                        <div style="background-color: #1e7bde;color: white;font-weight: 500;" class="bg-gray-300 p-3 rounded-l-lg rounded-br-lg"><p class="text-sm">${data.message}</p></div>
                        <span class="text-xs text-gray-500 leadin-none">${data.created_at} ago</span>
                    </div>
            </div>
            `
        }
        
    }
    else if (data.type == 'writing_active'){
        if (data.agent){
                chatLogElement.innerHTML+=`<div class="writing">the user is writng now....</div>`
        }
    }

    scroolToBottom()
}

async function joinChatRoom(){
    chatName=chatNameElement.value
    const data =new FormData()
    data .append('name',chatName)
    data.append('url',chatWindowUrl)
    await fetch(`/api/create-room/${chatRoomUuid}/`,{//data base tasck
        method:'POST',
        headers:{
            'X-CSRFToken':getCookie('csrftoken')
        },
        body:data
    })
    .then(function(res){
        return res.json()
    })
    .then(function(data){
    })
    chatSocket=new WebSocket(`ws://${window.location.host}/ws/${chatRoomUuid}/`)
    
    chatSocket.onmessage=function(e) {
        onChatMessage(JSON.parse(e.data))
    }

    
    chatSocket.onopen=function(e){
        scroolToBottom()
    }
    chatSocket.onclose=function(e){
    }
}



chatOpenElement.onclick=function(e){
    e.preventDefault()

    chatIconElement.classList.add('hidden')
    chatWelcomeElement.classList.remove('hidden')
    return false
}


chatJoinElement.onclick=function(e){
    e.preventDefault()

    chatWelcomeElement.classList.add('hidden')
    chatRoomElement.classList.remove('hidden')
    joinChatRoom()
    return false
}


chatSubmitElement.onclick=function(e){
    e.preventDefault()
    sendMessage()
    return false
}

chatInputElement.onkeyup=function(e){
    if (e.keyCode == 13){
        sendMessage()
    }
}