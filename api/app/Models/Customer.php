<?php

namespace App\Models;

use App\Enums\DocType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $table = 'customers';

    protected $fillable = [
        'doc_type_code',
        'doc_number',
        'firstname',
        'lastname',
        'business_name',
        'phone',
        'email',
        'address',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'doc_type_abbrev',
        'doc_type_label',
        'fullname',
        'shortname',
        'person_type'
    ];

    public function getDocTypeAbbrevAttribute()
    {
        return DocType::abbreviation($this->doc_type_code);
    }

    public function getDocTypeLabelAttribute()
    {
        return DocType::label($this->doc_type_code);
    }

    public function getFullnameAttribute()
    {
        if ($this->doc_type_code === DocType::RUC->value) {
            return null;
        }
        return "{$this->firstname} {$this->lastname}";
    }

    public function getShortnameAttribute()
    {
        if ($this->doc_type_code === DocType::RUC->value) {
            return null;
        }
        return explode(' ', $this->firstname)[0] . ' ' . explode(' ', $this->lastname)[0];
    }

    public function getPersonTypeAttribute()
    {
        if ($this->doc_type_code === DocType::RUC->value) {
            return 'Persona Jurídica';
        } else {
            return 'Persona Natural';
        }
    }
}
