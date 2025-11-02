<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoMensalidade extends Model
{
    protected $table = 'tipos_mensalidade';

    protected $fillable = ['nome', 'valor'];

    protected $casts = [
        'valor' => 'decimal:2',
    ];
}
