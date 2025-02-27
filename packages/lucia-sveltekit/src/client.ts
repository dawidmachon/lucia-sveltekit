import { getClientUser, getSSRUser } from "./user.js";
import { LuciaError } from "./error.js";

export const signOut = async (redirect?: string): Promise<void> => {
    const user = getClientUser();
    if (!user) throw new LuciaError("AUTH_NOT_AUTHENTICATED");
    const response = await fetch("/api/auth/logout", {
        method: "POST"
    });
    if (response.ok) {
        if (redirect) {
            globalThis.location.href = redirect;
        }
        return;
    }
    let result;
    try {
        result = await response.json();
    } catch (e) {
        console.error(e);
        throw new LuciaError("UNKNOWN_ERROR");
    }
    if (result.message) throw new LuciaError(result.message);
};

export const refreshSession = async (): Promise<number> => {
    const response = await fetch("/api/auth/refresh-session", {
        method: "POST"
    });
    if (!response.ok) {
        let result;
        try {
            result = await response.json();
        } catch (e) {
            console.error(e);
            throw new LuciaError("UNKNOWN_ERROR");
        }
        throw new LuciaError(result.message);
    }
    const result = await response.json() as {
        expires: number
    }
    return result.expires
};

export const getUser = () => {
    if (typeof window === "undefined") {
        // server
        return getSSRUser();
    }
    // browser
    return getClientUser();
};