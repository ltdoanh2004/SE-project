export class TokenService {
    static decodeToken = (token) => {
        if (!token) return null;

        const base64Token = token.split('.')[1];
        if (!base64Token) return null;

        const payloadToken = base64Token.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(payloadToken));
    }
}