/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(function(){
  $('#datepicker').datepicker({
                              inline: true,
                              //nextText: '&rarr;',
                              //prevText: '&larr;',
                              showOtherMonths: true,
                              //dateFormat: 'dd MM yy',
                              dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                              //showOn: "button",
                              //buttonImage: "img/calendar-blue.png",
                              //buttonImageOnly: true,
                              });
  });

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Called when a photo is successfully retrieved
//
var finalImageData;


document.addEventListener("deviceready",onDeviceReady,false);

// Cordova is ready to be used!
//
function onDeviceReady() {
    
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    $.mobile.page.prototype.options.degradeInputs.date = true;
    
    tmpDat = new Date();
    //                alert(""+ tmpDat.getMonth());
    FB.init({ appId: "appid", nativeInterface: CDV.FB, useCachedDialogs: false });
}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 25,
                                destinationType: destinationType.DATA_URL });
}


function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64 encoded image data
    // console.log(imageData);
    finalImageData = imageData;
    // Get image handle
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
}

function onFileSystemSuccess(fileSystem) {
    fileSystem.root.getDirectory("FoodDiary", {create: true, exclusive: false}, getDirSuccess, fail);
}


function getDirSuccess(dirEntry) {
    // Get a directory reader
    var directoryReader = dirEntry.createReader();
    // Get a list of all the entries in the directory
    directoryReader.readEntries(readerSuccess,fail);
}


function readerSuccess(entries) {
    addPhoto();
}




function addPhoto(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
}

function onFileSystemSuccess(fileSystem) {
    fileSystem.root.getDirectory("FoodDiary", {create: true, exclusive: false}, getDirSuccess, fail);
}


function getDirSuccess(dirEntry){
    
    var value = window.localStorage.getItem("numOfPics");
    
    if(value==null){
        window.localStorage.setItem("numOfPics", "1");
        value = window.localStorage.getItem("numOfPics");
    }
    
    else {
        value ++;
        window.localStorage.setItem("numOfPics",value);
        value = window.localStorage.getItem("numOfPics");
    }
    
    var hour = new Date().getHours();
    var day = new Date().getDate();
    var month = new Date().getMonth();
    
    //                alert("Month " + month);
    var year = new Date().getFullYear();
    
    var name = hour.toString() + "_"+ day.toString() + "_" + month.toString() + "_" + year.toString() + "_" + value+".fooddiary";
    //                alert("Taken Photo " + name);
    
    dirEntry.getFile(name, {create: true, exclusive: false}, gotFileEntry, fail);
    
    
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    writer.onwriteend = function(evt) {
        
    };
    writer.write(finalImageData);
    
}




// Called if something bad happens.
//
function onFail(message) {
   // alert('Failed because: ' + message);
    console.log('Failed because: ' + message);
}

function fail(error) {
    alert(error.code);
    console.log(error.code);
}


//Read Image Code

var selDat;
var MEAL;
var MOSTRECENT = 0;
var BREAKFAST = 1;
var LUNCH = 2;
var DINNER = 3;
var ALL = 5;
var POSTIMGS = 4;


function showDiary(usrOption,seldte){
    
    selDat = seldte;
//    alert("Show Diary " + selDat);
    var storage = window.localStorage;
     MEAL = usrOption;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemReadSuccess, fail);
    
}

function onFileSystemReadSuccess(fileSystem) {
    fileSystem.root.getDirectory("FoodDiary", {create: true, exclusive: false}, getDirReadSuccess, fail);
}

function getDirReadSuccess(dirEntry) {
    // Get a directory reader
    var directoryReader = dirEntry.createReader();
    // Get a list of all the entries in the directory
    directoryReader.readEntries(showImages,fail);
    // Get a list of all the entries in the directory
    
}

function showImages(entries){
    
//    alert("Showing Images " + selDat);
    if(isNaN(selDat)) selDat = new Date();
    
    var div = document.getElementById("resultsForFood");
    $('#resultsForFood').empty();
    
    
    var reader = new FileReader();
    
    
    if(MEAL == MOSTRECENT){
        
        if(entries.length > 1) {
            
            var mostRecent = entries[0];
            
            var mstRecent = mostRecent.name.split("_");
            var today=new Date();
            var dt = new Date(mstRecent[3], mstRecent[2], mstRecent[1], mstRecent[0]);
            var diff = today - dt;
            
            
            for (i = 0; i<entries.length; i++) {
                
                tstDat = entries[i].name.split("_");
                //
                tmpDate = new Date(tstDat[3], tstDat[2], tstDat[1], tstDat[0]);
                //
                tstDiff = today - tmpDate;
                
                //                                            alert("tstDiff " + tstDiff + " ,oldDiff " + diff);
                
                
                if(tstDiff <= diff){
                    mostRecent = entries[i];
                    diff = tstDiff;
                }
            }
            
            
            
            reader.onloadend = function(evt) {
                console.log("Read as text");
                
                
                var img = new Image();
                img.src = "data:image/jpeg;base64,"+evt.target.result;
                img.height=200;
                img.width=200;
                $('#resultsForFood').appendChild(img);
//                div.appendChild(img);
                
            };
            reader.readAsText(mostRecent);
            
        }
        
    }
    else {
        
        //                                        alert("Either breakfast, lunch or dinner");
        
        if(entries.length > 1) {
            
            //                                            Get all of todays images
            var todaysImages = [];
            for (i = 0; i<entries.length; i++) {
                
                //                                                alert("entres : " + i + " , " + entries[i].name);
                tstDat = entries[i].name.split("_");
                tmpDate = new Date(tstDat[3], tstDat[2], tstDat[1], tstDat[0]);
                
                
                if( tmpDate.getFullYear() == selDat.getFullYear() &&
                   tmpDate.getMonth() == selDat.getMonth() &&
                   tmpDate.getDate() == selDat.getDate() ){
                    
                    todaysImages.push(entries[i]);
                }
                
                
                
            }
            
            if(MEAL == POSTIMGS){
                alert("Posting " + todaysImages.length + " images");
                
                for( a = 0 ; a < todaysImages.length ; a++ ) {
                
                var imageURI= todaysImages[a].toURI();
                var options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                    console.log("File Name : " + options.fileName);
                    
                options.mimeType="image/jpeg";
                
                var params = new Object();

                params.value1 = "" + options.fileName;

                params.value1 = "test";
                params.value2 = "param";
              

                options.params = params;
                    
                var headers={'fileName':options.fileName};
                options.headers = headers;
                
                
                
                var ft = new FileTransfer();
                ft.upload(imageURI, "http://ssfoodid.herokuapp.com/upload", win, fail, options);
                
                    
                    
                
                function win(r) {
                    console.log("Code = " + r.responseCode);
                    console.log("Response = " + r.response);
                    console.log("Sent = " + r.bytesSent);
                }
                
                function fail(error) {
                    alert("An error has occurred: Code = " = error.code);
                }
                
                }
                
            }
            
            else{
                //                                            alert("No images today : " + todaysImages.length);
                
                var imagesToShow = [];
                
                //                                            alert("MEAL" + MEAL);
                for(j = 0; j < todaysImages.length; j++){
                    
                    todayTstDat = todaysImages[j].name.split("_");
                    tmpTodayDate = new Date(todayTstDat[3], todayTstDat[2], todayTstDat[1], todayTstDat[0]);
                    
                    
                    
                    switch(MEAL){
                            
                        case BREAKFAST :
                            if(tmpTodayDate.getHours() <= 11) imagesToShow.push(todaysImages[j]);
                            break;
                            
                        case LUNCH :
                            if(tmpTodayDate.getHours() > 11 && tmpTodayDate.getHours() <= 16){
//                                alert("Lunch condition met");
//                                alert("todayImage " + todaysImages[j].name + ", Hours : " + tmpTodayDate.getHours());
                                imagesToShow.push(todaysImages[j]);
                            }
                            break;
                            
                        case DINNER :
                            if(tmpTodayDate.getHours() > 16){
                                imagesToShow.push(todaysImages[j]);
                            }
                            break;
                            
                        case ALL :
                            imagesToShow.push(todaysImages[j]);
                            break;
                            
                    }
                    
                    
                    
                    
                }
                
                var readers = [];
                //                                            alert("Images for selected time " + imagesToShow.length);
                for(k = 0; k < imagesToShow.length; k++){
                    
                    readers.push(new FileReader());
                    
                    readers[k].onloadend = function(evt) {
                        console.log("Read as text");
                        
                        
                        var img = new Image();
                        img.src = "data:image/jpeg;base64,"+evt.target.result;
                        img.height=200;
                        img.width=200;
                        div.appendChild(img);
                        
                    };
                    
                    
                    
                    //                                                alert("Img " + imagesToShow[k].name);
                    readers[k].readAsText(imagesToShow[k]);
                    //                                                reader.readAsText(imagesToShow[1]);
                }
            }
            
        }
    }
}

//Facebook JS

            
            if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
            if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
            if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
            
            FB.Event.subscribe('auth.login', function(response) {
                               alert('auth.login event');
                               });
            
            FB.Event.subscribe('auth.logout', function(response) {
                               alert('auth.logout event');
                               });
            
            FB.Event.subscribe('auth.sessionChange', function(response) {
                               alert('auth.sessionChange event');
                               });
            
            FB.Event.subscribe('auth.statusChange', function(response) {
                               alert('auth.statusChange event');
                               });
            
            /*function getSession() {
                alert("session: " + JSON.stringify(FB.getSession()));
            }
            */
            function getLoginStatus() {
                FB.getLoginStatus(function(response) {
                                  if (response.status == 'connected') {
                                  alert('logged in');
                                  } else {
                                  alert('not logged in');
                                  }
                                  });
            }
            var friendIDs = [];
			var fdata;
            function me() {
                FB.api('/me/friends', { fields: 'id, name, picture' },  function(response) {
                       if (response.error) {
                       alert(JSON.stringify(response.error));
                       } else {
                       var data = document.getElementById('data');
					   fdata=response.data;
					   console.log("fdata: "+fdata);
                       response.data.forEach(function(item) {
                                             var d = document.createElement('div');
                                             d.innerHTML = "<img src="+item.picture+"/>"+item.name;
                                             data.appendChild(d);
                                             });
                       }
					var friends = response.data;
					console.log(friends.length); 
					for (var k = 0; k < friends.length && k < 200; k++) {
				        var friend = friends[k];
				        var index = 1;

				        friendIDs[k] = friend.id;
				        //friendsInfo[k] = friend;
					}
					console.log("friendId's: "+friendIDs);
                       });
            }
            
            function logout() {
                FB.logout(function(response) {
                          alert('logged out');
                          });
            }
            
            function login() {
                FB.login(
                         function(response) {
                         if (response.session) {
                         alert('logged in');
                         } else {
                         alert('not logged in');
                         }
                         },
                         { scope: "email" }
                         );
            }
			
			
			function facebookWallPost() {
			    console.log('Debug 1');
				var params = {
				    method: 'feed',
				    name: 'Facebook Dialogs',
				    link: 'https://developers.facebook.com/docs/reference/dialogs/',
				    picture: 'http://fbrell.com/f8.jpg',
				    caption: 'Reference Documentation',
				    description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
				  };
				console.log(params);
			    FB.ui(params, function(obj) { console.log(obj);});
			}
            
			function publishStoryFriend() {
				randNum = Math.floor ( Math.random() * friendIDs.length ); 

				var friendID = friendIDs[randNum];
				if (friendID == undefined){
					alert('please click the me button to get a list of friends first');
				}else{
			    	console.log("friend id: " + friendID );
			        console.log('Opening a dialog for friendID: ', friendID);
			        var params = {
			        	method: 'feed',
			            to: friendID.toString(),
			            name: 'Facebook Dialogs',
			            link: 'https://developers.facebook.com/docs/reference/dialogs/',
			            picture: 'http://fbrell.com/f8.jpg',
			            caption: 'Reference Documentation',
			            description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
			     	};
					FB.ui(params, function(obj) { console.log(obj);});
			    }
			}
            
            document.addEventListener('deviceready', function() {
                                      try {
                                      alert('Device is ready! Make sure you set your app_id below this alert.');
                                      FB.init({ appId: "appid", nativeInterface: CDV.FB, useCachedDialogs: false });
                                      document.getElementById('data').innerHTML = "";
                                      } catch (e) {
                                      alert(e);
                                      }
                                      }, false);
            
