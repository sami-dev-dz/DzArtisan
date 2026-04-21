<?php
function stripComments($dir) {
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $content = file_get_contents($file->getRealPath());
            $tokens = token_get_all($content);
            $newContent = '';
            foreach ($tokens as $token) {
                if (is_array($token)) {
                    if (in_array($token[0], [T_COMMENT, T_DOC_COMMENT])) {
                        // skip
                        continue;
                    }
                    $newContent .= $token[1];
                } else {
                    $newContent .= $token;
                }
            }
            // Remove excessive blank lines
            $newContent = preg_replace("/\n\s*\n/", "\n\n", $newContent);
            file_put_contents($file->getRealPath(), $newContent);
        }
    }
}

stripComments(__DIR__ . '/app/Http/Controllers');
stripComments(__DIR__ . '/app/Models');
stripComments(__DIR__ . '/routes');

echo "Comments stripped successfully.\n";
