
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
	
a=''


	socket.on('connect', () => {
		document.querySelector('#chanform').onsubmit = () => {
            var channel = document.querySelector('#newChannel').value;
            if (channel==''){
                alert("please enter channel name")
            }
            else{
                const request= new XMLHttpRequest();
                request.open("POST", '/check');
                
                request.onload = () =>{
                    response=JSON.parse(request.response)
                    if (response.includes(channel)==true){
                        alert("the channel already exist")
                        console.log("already exist");    
                    }                     
                      
                        
                    
                    else {
                        console.log("function is going this way")
                        socket.emit('submit channel', {'channel': channel});
                        document.querySelector('#newChannel').value = '';
                        return false;

                    }
                } 
                request.send()          

            }
            
return false;
            };
    });
function activeclick() {
	document.querySelectorAll(".channelhref").forEach(link => {
                    link.onclick = () => {
                        // Push state to URL.
                    
                    	
                        const channel = link.dataset.page;
                        window.localStorage.setItem('channelname', channel);
                        document.title = name;
                        history.pushState({'title': channel}, channel, channel);
                    	load_channel(channel);
                        return false;
                    };
    });
};


document.addEventListener('DOMContentLoaded', () => {
    load_list(); 
    load_channel_info();
    console.log(history.state)
});


//function of adding image
function encodeImage(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    console.log('RESULT', reader.result)
    a=reader.result
    
  
}
  reader.readAsDataURL(file);
};










//loading all channels to webpage
function load_list(){  
    const request = new XMLHttpRequest();
    request.open('GET','/channelList');
    request.onload = () => {
        list=JSON.parse(request.response);
        document.querySelector('#chanels').innerHTML='';
        list.forEach(element =>{
            console.log(element)
            add_channel(element)
        })
    }
    request.send()
};


//function of addind channel info after reloading page or closed browser
function load_channel_info(){
    name=window.localStorage.getItem('channelname')
    load_channel(name);
};

//function of adding channel info to page
    function load_channel(name) {
    	const request = new XMLHttpRequest();
    	request.open('GET', '/channel');
    	request.onload = () => {
            
            
            newvar=JSON.parse(request.response);
            document.querySelector('#chanel-contain').innerHTML='';
                console.log(newvar);
                newvar.forEach(element => {
                    if (element.channel==name) {
                        add_post(element)
                    }
                    else {//pass
                    }
                
                });
            
                    
                    
        };
        request.send();
    };

// Update text on popping state.
            window.onpopstate = e => {
                const data = e.state;
                document.title = data.title;
                document.querySelector('#chanel-contain').innerHTML = data.text;
            };

                //adding to the web page
    socket.on('total', data => {
        add_channel(data.channel)

    });

        

                // Create new channel.
                function add_channel(channel){
                    const ch = document.createElement('li');
                    var href = document.createElement('a');
                    href.setAttribute('class', 'channelhref')
                    href.setAttribute('data-page', channel);
                    href.setAttribute('href', 'javascript:activeclick();');
                    href.innerHTML=channel;
                    ch.append(href);
                
                

                    // Add channel to DOM.
                    document.querySelector('#chanels').append(ch);
                }
            

// sending message to server
socket.on('connect', () => {
		document.querySelector('#message').onsubmit = () => {
            if (history.state==null){
                console.log("state title is null")
                alert("please choose or create channel")
                return false;
            }
            else{


            var message = document.querySelector('#newMessage').value;
            
            // identifying channel
            var currentstate=history.state.title;
            console.log(a, "this is image")
            socket.emit('submit message', {'message': message, 'currentstate': currentstate, 'image':a});
            document.querySelector('#newMessage').value = '';
            document.querySelector('#upload').value='';
            a='';
            return false;
            }
        };
    });
// adding message to webpage
socket.on('messresponse', (data) => {
    
    if (data.channel==history.state.title){
        console.log("values get")
        console.log(data.image, "this is image file")
        console.log(history.state.title)

                // Add post.
                add_post(data);

    }
    else {//pass
        console.log("function was passed")
        
    }
                
            });
function add_post(contents) {

                // Create new post.
                console.log("function is working")
                const post = document.createElement('div');
                post.setAttribute('class', 'post');
                const ptime = document.createElement('p')
                ptime.innerHTML = contents.tim;
                const puser = document.createElement('p')
                puser.innerHTML = contents.user
                const pmess = document.createElement('p')
                pmess.innerHTML = contents.mess
                const image=document.createElement('img')
                image.setAttribute('src', contents.image)
                image.setAttribute('class', 'post_img')
                // experiment with currentchannel
                
                
                post.appendChild(puser);
                post.appendChild(pmess);
                post.appendChild(ptime);
                post.appendChild(image);
                 

                

                // Add post to DOM.
                document.querySelector('#chanel-contain').append(post);
            };