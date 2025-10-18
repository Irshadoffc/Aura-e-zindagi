<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class OptimizeResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Enable GZIP compression
        if (function_exists('gzencode') && $request->header('Accept-Encoding') && strpos($request->header('Accept-Encoding'), 'gzip') !== false) {
            $content = $response->getContent();
            if (strlen($content) > 1024) { // Only compress if content > 1KB
                $response->setContent(gzencode($content, 6));
                $response->headers->set('Content-Encoding', 'gzip');
                $response->headers->set('Content-Length', strlen($response->getContent()));
            }
        }

        // Add performance headers
        $response->headers->set('Cache-Control', 'public, max-age=300');
        $response->headers->set('Vary', 'Accept-Encoding');
        
        return $response;
    }
}