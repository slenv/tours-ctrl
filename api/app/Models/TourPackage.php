<?php

namespace App\Models;

use App\Utils\StringFormat;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TourPackage extends Model
{
    use SoftDeletes;

    protected $table = 'tour_packages';

    protected $fillable = [
        'name',
        'description',
        'image',
        'price'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'pkg_number',
        'image_url'
    ];

    public function getPkgNumberAttribute()
    {
        return 'Paq-Tur-' . StringFormat::for($this->id)->padLeft(3, '0');
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        if (!file_exists(public_path("tour-packages/{$this->image}"))) {
            return null;
        }
        return asset("tour-packages/{$this->image}");
    }

    public function itineraries()
    {
        return $this->hasMany(Itinerary::class);
    }
}
