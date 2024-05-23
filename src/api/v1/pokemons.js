import request from '@/services/axios';

/**
 * getPokemons
 * @author HaoDT
 */
export function getPokemons(query, props = {}) {
    return request({
        url: 'pokemons',
        method: 'get',
        params: query,
        ...props,
    });
}

/**
 * showPokemon
 * @author HaoDT
 */
export function showPokemon(id, props = {}) {
    return request({
        url: `pokemons/${id}`,
        method: 'get',
        ...props,
    });
}

/**
 * getType
 * @author HaoDT
 */
export function getType(props = {}) {
    return request({
        url: `types`,
        method: 'get',
        ...props,
    });
}

