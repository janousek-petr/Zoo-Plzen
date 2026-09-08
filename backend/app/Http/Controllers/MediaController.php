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
        ], ['mimes' => 'Prosím, nahrajte obrázek s příponou jpg,jpeg,png,webp nebo audio s příponou mp3,wav,ogg,m4a,aac.', "max" => "Velikost souboru nesmí přesáhnout 20 MB."]);

        $file = $request->file('file');
        $path = $file->store('media', 'public'); // vrátí např. "media/xxx.png"
        $file_hash = hash_file('sha256', $file);
        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => '/storage/'.$path, // veřejná URL cesta
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'file_hash' => $file_hash,
        ]);

        return response()->json($media, 201);
    }

    public function destroy($id)
    {
        $media = Media::find($id);

        if (! $media) {
            return response()->json(['message' => 'Nenalezeno'], 404);
        }

        $relativePath = str_replace('/storage/', '', $media->path);
        Storage::disk('public')->delete($relativePath);

        $media->delete();

        return response()->json(['message' => 'Smazáno']);
    }

    public function checkIfMediaExists(string $file_hash)
    {
        $media = Media::where('file_hash', $file_hash)->first();

        return response()->json([
            'exists' => $media !== null,
            'media' => $media,
        ]);
    }
}
