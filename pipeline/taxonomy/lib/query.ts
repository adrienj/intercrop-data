import fetch from 'node-fetch';

export const query = async <T = any>(url: string): Promise<T | null> => {
    try {
        const res = await fetch(url);
        try {
            return (await res.json()) as T;
        } catch (e) {
            throw new Error(`Failed to parse JSON from ${url} : ${await res.text()}`);
        }
    } catch (error) {
        throw new Error(`Request failed : ${error}`);
        return null;
    }
    return null;
};
