
$.getScript("phonegap.js", function(){
            
            var pictureSource;   // picture source
            var destinationType; // sets the format of returned value
            
            // Called when a photo is successfully retrieved
            //
            var finalImageData;
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
            
            function onFileSystemSuccessB(fileSystem) {
            fileSystem.root.getDirectory("FoodDiary", {create: true, exclusive: false}, getDirSuccess3, fail);
            }
            
            function onFileSystemSuccessF(fileSystem) {
            
            
            fileSystem.root.getDirectory("FoodDiary", {create: true, exclusive: false}, getDirSuccess2, fail);
            
            }
            
            function getDirSuccess2(dirEntry){
            
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
            
            
            
            var day = new Date().getDate();
            var month = new Date().getMonth();
            var year = new Date().getFullYear();
            
            var name = day.toString() +month.toString() + year.toString()+ value+".fooddiary";
            
            
            dirEntry.getFile(name, {create: true, exclusive: false}, gotFileEntry, fail);
            
            
            }
            
            function getDirSuccess3(dirEntry) {
            // Get a directory reader
            var directoryReader = dirEntry.createReader();
            
            // Get a list of all the entries in the directory
            directoryReader.readEntries(readerSuccess2,fail);
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
            
            
            // A button will call this function
            //
            function capturePhoto() {
            // Take picture using device camera and retrieve image as base64-encoded string
            alert("made it");
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
                                        destinationType: destinationType.DATA_URL });
            }
            
            
            // Called if something bad happens.
            //
            function onFail(message) {
            alert('Failed because: ' + message);
            }
            
            function fail(error) {
            alert(error.code);
            console.log(error.code);
            }
            
            function addPhoto(){
            
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccessF, fail);
            
            
            }
            
            
            
            function gotFileEntry(fileEntry) {
            fileEntry.createWriter(gotFileWriter, fail);
            }
            
            function gotFileWriter(writer) {
            writer.onwriteend = function(evt) {
            
            };
            
            
            writer.write(finalImageData);
            
            
            }
            
            
      

            
            });
