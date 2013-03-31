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
                options.mimeType="image/jpeg";
                
                var params = new Object();
                params.value1 = "test";
                params.value2 = "param";
                
                options.params = params;
                
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
