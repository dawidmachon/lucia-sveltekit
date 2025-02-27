import type { Handle } from "../kit.js";
import type { Env } from "../types.js";
import { handleHooksFunction } from "./hooks.js";
import {
    authenticateUserFunction,
    createUserFunction,
    deleteUserFunction,
    getUserFunction,
    getUserByProviderIdFunction,
    updateUserDataFunction,
    updateUserPasswordFunction,
    updateUserProviderIdFunction,
    getSessionUserFunction,
} from "./user/index.js";
import { parseRequestFunction, validateRequestFunction } from "./request.js";
import {
    invalidateRefreshTokenFunction,
    validateAccessTokenFunction,
    validateRefreshTokenFunction,
} from "./token/index.js";
import {
    createSessionFunction,
    invalidateAllUserSessionsFunction,
    deleteExpiredUserSessionsFunction,
    invalidateSessionFunction,
    refreshSessionFunction
} from "./session.js";
import { handleServerSessionFunction } from "./load.js";
import { deleteAllCookiesFunction } from "./cookie.js";
import clc from "cli-color";
import { Adapter } from "../adapter/index.js";

export const lucia = (configs: Configurations) => {
    return new Auth(configs) as Omit<Auth, "getAuthSession">;
};

const validateConfigurations = (configs: Configurations) => {
    const isAdapterIdentified = !configs.adapter;
    if (isAdapterIdentified) {
        console.log(
            `${clc.red.bold("[LUCIA_ERROR]")} ${clc.red(
                `Adapter is not defined in configuration ("config.adapter").`
            )}`
        );
        process.exit(1);
    }
};

export class Auth {
    private context: Context;
    constructor(configs: Configurations) {
        validateConfigurations(configs);
        this.context = {
            auth: this,
            adapter: configs.adapter,
            generateCustomUserId:
                configs.generateCustomUserId || (async () => null),
            env: configs.env,
            csrfProtection: configs.csrfProtection || true,
        };
        this.getUser = getUserFunction(this.context);
        this.getUserByProviderId = getUserByProviderIdFunction(this.context);
        this.getSessionUser = getSessionUserFunction(this.context);
        this.createUser = createUserFunction(this.context);
        this.authenticateUser = authenticateUserFunction(this.context);
        this.deleteUser = deleteUserFunction(this.context);
        this.updateUserData = updateUserDataFunction(this.context);
        this.updateUserProviderId = updateUserProviderIdFunction(this.context);
        this.updateUserPassword = updateUserPasswordFunction(this.context);
        this.parseRequest = parseRequestFunction(this.context);
        this.validateRequest = validateRequestFunction(this.context);
        this.refreshSession = refreshSessionFunction(this.context);
        this.createSession = createSessionFunction(this.context);
        this.invalidateSession = invalidateSessionFunction(this.context);
        this.invalidateAllUserSessions = invalidateAllUserSessionsFunction(
            this.context
        );
        this.deleteExpiredUserSessions = deleteExpiredUserSessionsFunction(
            this.context
        );
        this.validateAccessToken = validateAccessTokenFunction(this.context);
        this.validateRefreshToken = validateRefreshTokenFunction(this.context);
        this.invalidateRefreshToken = invalidateRefreshTokenFunction(
            this.context
        );
        this.handleHooks = handleHooksFunction(this.context);
        this.handleServerSession = handleServerSessionFunction(this.context);
        this.deleteAllCookies = deleteAllCookiesFunction(this.context);
    }
    public handleHooks: () => Handle;
    public authenticateUser: ReturnType<typeof authenticateUserFunction>;
    public createUser: ReturnType<typeof createUserFunction>;
    public getUser: ReturnType<typeof getUserFunction>;
    public getUserByProviderId: ReturnType<typeof getUserByProviderIdFunction>;
    public getSessionUser: ReturnType<typeof getSessionUserFunction>;
    public deleteUser: ReturnType<typeof deleteUserFunction>;
    public parseRequest: ReturnType<typeof parseRequestFunction>;
    public validateRequest: ReturnType<typeof validateRequestFunction>;
    public refreshSession: ReturnType<typeof refreshSessionFunction>;
    public invalidateRefreshToken: ReturnType<
        typeof invalidateRefreshTokenFunction
    >;
    public createSession: ReturnType<typeof createSessionFunction>;
    public deleteExpiredUserSessions: ReturnType<
        typeof deleteExpiredUserSessionsFunction
    >;
    public validateAccessToken: ReturnType<typeof validateAccessTokenFunction>;
    public validateRefreshToken: ReturnType<
        typeof validateRefreshTokenFunction
    >;
    public updateUserData: ReturnType<typeof updateUserDataFunction>;
    public updateUserProviderId: ReturnType<
        typeof updateUserProviderIdFunction
    >;
    public updateUserPassword: ReturnType<typeof updateUserPasswordFunction>;
    public handleServerSession: ReturnType<typeof handleServerSessionFunction>;
    public invalidateSession: ReturnType<typeof invalidateSessionFunction>;
    public invalidateAllUserSessions: ReturnType<
        typeof invalidateAllUserSessionsFunction
    >;
    public deleteAllCookies: ReturnType<typeof deleteAllCookiesFunction>;
}

interface Configurations {
    adapter: Adapter;
    env: Env;
    generateCustomUserId?: () => Promise<string | null>;
    csrfProtection?: boolean;
}

export type Context = {
    auth: Auth;
} & Required<Configurations>;
