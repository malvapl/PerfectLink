<?php

use App\Models\Wedding;

if (! function_exists('generateUniqueCode')) {
    function generateUniqueCode()
    {
        $caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $codigo = '';

        $codigo .= substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 1);
        $codigo .= substr(str_shuffle('abcdefghijklmnopqrstuvwxyz'), 0, 1);
        $codigo .= substr(str_shuffle('0123456789'), 0, 1);
        $codigo .= substr(str_shuffle($caracteres), 0, 2);

        $codigo = str_shuffle($codigo);
        return $codigo;
    }
}

if (! function_exists('formatGroup')) {
    function formatGroup($group, $spouse1, $spouse2)
    {
        if (str_contains($group, 'spouse1')) return str_replace('spouse1', $spouse1, $group);
        if (str_contains($group, 'spouse2')) return str_replace('spouse2', $spouse2, $group);
        return $group;
    }
}

if (! function_exists('reFormatGroup')) {
    function reFormatGroup($group, $spouse1, $spouse2)
    {
        if (str_contains($group, $spouse1)) return str_replace($spouse1, 'spouse1', $group);
        if (str_contains($group, $spouse2)) return str_replace($spouse2, 'spouse2', $group);
        if ($group === 'Sin asignar') return null;
        return $group;
    }
}
