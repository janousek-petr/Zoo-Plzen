<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index()
    {
        return response()->json(Media::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,mp3,wav,ogg,m4a,aac|max:20480',
        ]);

        $file = $request->file('file');
        $path = $file->store('media', 'public'); // vrátí např. "media/xxx.png"

        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => '/storage/' . $path, // veřejná URL cesta
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($media, 201);
    }

    public function destroy($id)
    {
        $media = Media::find($id);
        
        if (!$media) {
            return response()->json(['message' => 'Nenalezeno'], 404);
        }

        $relativePath = str_replace('/storage/', '', $media->path);
        Storage::disk('public')->delete($relativePath);
        
        $media->delete();
        
        return response()->json(['message' => 'Smazáno']);
    }
}