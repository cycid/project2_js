import os 
from datetime import datetime
from flask import Flask, session,render_template, redirect, request, url_for, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
app.secret_key = '56fgpknn5kpsxxakk'

image=''
now=()
message={}
current=""
a=[];
channels=[];
@socketio.on("submit channel")
def channel(data):
    channel=''
    channel=data["channel"]
    channels.append(channel)
    data["channel"]=[]
    
    emit("total", {'channel':channel}, broadcast=True)



@app.route("/")
def index():
    if 'username' in session:
        return render_template ("index.html", channels=channels)
    return render_template("login.html")


@app.route("/registration", methods=["POST"],)
def registration():
    username=request.form.get("username")
    session['username']=username
    return redirect (url_for('index'))



#function of channel List returning
@app.route("/channelList")
def list():
    return jsonify(channels);

#adding message to list with socketio
@socketio.on("submit message")
def mess(data):

    now=datetime.now()
    time=now.strftime("%Y-%m-%d, %H:%M:%S");
    ##me(data["message"])
    state=data["currentstate"]
    image=data["image"]
    
    message={'mess': data["message"],'tim': time, 'user': session['username'], 'channel':state, 'image':image};
    a.append(message);
    n=0
    #limiting mesages per channel function
    for i in range(len(a)):
        if a[i]["channel"]==state:
            n+=1
            if n==1:
                value=i
            if n>=10:
                del a[value]
    #experiment with channel
    emit("messresponse", message, broadcast=True)
    time=();

@app.route("/channel/")
def channel():
    return jsonify(a);
#check if channel name exist
@app.route("/check", methods=["POST"])
def check():
    return jsonify(channels)



@app.route('/sign_out')
def sign_out():
    session.pop('username', None)
    return redirect(url_for('index'))




    




if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
