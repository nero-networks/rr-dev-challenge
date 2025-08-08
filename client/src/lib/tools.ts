/**
 * quick and dirty unique id generator
 * 
 * @returns random string of `len` characters length (default 5)
 */
export function randId(len = 5) {
    return ((0.0000000001 + Math.random()).toString(36)).slice(2, len + 2);
}
