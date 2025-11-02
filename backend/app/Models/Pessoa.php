<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pessoa extends Model
{
    protected $table = 'pessoas';

    protected $fillable = [
        'nome', 'tipo', 'escalao', 'nif', 'data_nascimento', 'genero',
        'morada', 'codigo_postal', 'localidade', 'telefone', 'email',
        'cc', 'validade_cc', 'iban', 'nr_utente',
        'nome_enc_educacao', 'telefone_enc_educacao', 'email_enc_educacao',
        'observacoes',
    ];

    protected $casts = [
        'data_nascimento' => 'date',
        'validade_cc' => 'date',
        'escalao' => 'integer',
    ];
}
