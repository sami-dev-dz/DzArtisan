<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$artisan = \App\Models\Artisan::first();
if($artisan) {
    echo 'Artisan ID: ' . $artisan->id . PHP_EOL;
    echo 'Count: ' . $artisan->matchingRequests()->count();
} else {
    echo 'No artisan';
}
