<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Escalao extends Model
{
    protected $table = 'escaloes';

    protected $fillable = [
        'nome',
        'idade_minima',
        'idade_maxima',
        'genero',
    ];

    protected $casts = [
        'idade_minima' => 'integer',
        'idade_maxima' => 'integer',
    ];
}
