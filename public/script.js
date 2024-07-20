const socket = io('http://localhost:3005')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

if(messageForm != null){
const Name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', roomName, Name)

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName,message)
    messageInput.value = ''
})
}
socket.on('room-created', room => {
    const roomElement = document.createElement('div')
    roomElement.innerText = room
    const roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = 'join'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
    appendMessage(`${data.Name}: ${data.message}`)
})

socket.on('user-connected', Name => {
    appendMessage(`${Name} connected`)
})

socket.on('user-disconnected', Name => {
    appendMessage(`${Name} disconnected`)
})


function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')//mesajların altaltaeklenmesini sağlıo kutucukseklinde
    messageElement.innerText = message
    messageContainer.insertBefore(messageElement, messageContainer.firstChild)
}
