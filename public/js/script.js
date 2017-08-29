'use strict';

const socket = io();
var me = {};
me.avatar = "https://pixabay.com/en/avatar-icon-placeholder-1577909";
var bot = {};
bot.avatar = "";
const outputMe = document.querySelector('.output-me');
const outputBot = document.querySelector('.output-bot');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputMe.textContent = text;
  console.log(outputMe.textContent)
  insertChat("me", outputMe.textContent, 0);
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);
console.log(replyText)
insertChat("bot", replyText,1500);
  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});



function insertChat(who, text, time = 0){
    var control = "";
    
    if (who == "me"){
        
        control = '<li style="width:100%">' +
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ me.avatar+'" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';                    
    }else{
        control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+bot.avatar+'" /></div>' +                                
                  '</li>';
    }
    
     setTimeout(
        function(){                        
            $("ul").append(control);

        }, time);
}

function resetChat(){
    $("ul").empty();
}