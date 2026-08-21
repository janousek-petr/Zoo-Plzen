import axios from '@/lib/axios'
import {AxiosError, AxiosResponse} from "axios";

/**
 * Odesílá HTTP POST požadavek na zadanou API adresu s předanými daty.
 *
 * @template T - Typ dat, která server vrátí v těle odpovědi (`res.data`).
 * @template D - Typ dat odesílaných v těle požadavku (payload).
 *
 * @param apiUrl - Cílová URL adresa nebo relativní endpoint (např. `/api/addXp`).
 * @param data - Volitelný objekt s daty, která se posílají na server v těle požadavku.
 *
 * @returns Promise s kompletní Axios odpovědí obsahující data typu `T`.
 * @throws {AxiosError} Vyhodí chybu v případě selhání sítě nebo chybového status kódu (4xx/5xx).
 */
export async function apiPost<T = any, D = any>(
    apiUrl: string,
    data?: D
): Promise<AxiosResponse<T>> {
    try {
        return await axios.post<T>(apiUrl, data);
    } catch (err) {
        throw err as AxiosError;
    }
}
/**
 * Odesílá HTTP GET požadavek na zadanou API adresu pro načtení dat ze serveru.
 *
 * @template T - Typ dat, která server vrátí v těle odpovědi (`res.data`).
 *
 * @param apiUrl - Cílová URL adresa nebo relativní endpoint (např. `/api/profile`).
 *
 * @returns Promise s kompletní Axios odpovědí obsahující načtená data typu `T`.
 * @throws {AxiosError} Vyhodí chybu v případě selhání sítě nebo chybového status kódu (4xx/5xx).
 */
export async function apiGet<T = any>(
    apiUrl: string
): Promise<AxiosResponse<T>> {
    try {
        return await axios.get<T>(apiUrl);
    } catch (err) {
        throw err as AxiosError;
    }
}