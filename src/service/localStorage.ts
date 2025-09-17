// services/token.service.ts
class TokenService {

    // Store token in localStorage
    static setToken(tokenKey: string, token: string): void {
        localStorage.setItem(tokenKey, token);
    }

    // Get token from localStorage
    static getToken(tokenKey: string): string | null {
        return localStorage.getItem(tokenKey);
    }

    // Remove token from localStorage
    static removeToken(tokenKey: string): void {
        localStorage.removeItem(tokenKey);
    }

    // Check if token exists
    static hasToken(tokenKey: string): boolean {
        return this.getToken(tokenKey) !== null;
    }

}

export default TokenService;