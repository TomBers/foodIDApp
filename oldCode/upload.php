<?php
   print_r($_FILES);
   //$new_image_name = "YEAH.jpg";
   $new_image_name = "".rand(1, 150).".jpg";
   move_uploaded_file($_FILES["file"]["tmp_name"], "".$new_image_name);
?>