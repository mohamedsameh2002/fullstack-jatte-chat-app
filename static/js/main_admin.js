
const chatRoom =document.querySelector('#room_uuid').textContent.replaceAll('"','')
let chatSocket=null


const chatLogElement =document.querySelector('#chat_log')
const chatInputElement =document.querySelector('#chat_message_input')
const chatSubmitElement =document.querySelector('#chat_message_submit')


function scroolToBottom() {
    chatLogElement.scrollTop=chatLogElement.scrollHeight
}

function sendMessage (){
    chatSocket.send(JSON.stringify({
        'type':'message',
        'message':chatInputElement.value,
        'name':document.querySelector('#user_name').textContent.replaceAll('"',''),
        'agent':document.querySelector('#user_id').textContent.replaceAll('"',''),
    }))
    chatInputElement.value=''
}




function onChatMessage(data){
    if (data.type == 'chat_message'){
        if (!data.agent){
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

    scroolToBottom()
}


chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoom}/`)


chatSocket.onopen=function(e){
    scroolToBottom()
}

chatSocket.onmessage=function(e){
    onChatMessage(JSON.parse(e.data))
}

chatSocket.onclose=function(e){
    console.log('on close  ')
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


chatInputElement.onfocus=function (e) {
    chatSocket.send(JSON.stringify({
        'type':'update',
        'message':'writing_active',
        'name':document.querySelector('#user_name').textContent.replaceAll('"',''),
        'agent':document.querySelector('#user_id').textContent.replaceAll('"',''),
    }))
    
}