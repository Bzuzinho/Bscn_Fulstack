<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CentroCusto extends Model
{
    protected $table = 'centros_custo';

    protected $fillable = ['nome', 'codigo'];
}
