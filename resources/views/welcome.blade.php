<?php
?>
<!DOCTYPE html>
<html>
<head>
    <title>API</title>
</head>
<body>
<h3>This is API page</h3>
<p>Access the frontend on: <a href="{{ env('FRONTEND_URL', '#') }}">{{ env('FRONTEND_URL', 'FRONTEND_URL not set') }}</a></p>
</body>
</html>
