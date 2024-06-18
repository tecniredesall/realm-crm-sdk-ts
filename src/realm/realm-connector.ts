import Realm, { ErrorCallback, } from 'realm';

export interface RealmConfig {
    path?: string;
    realm_app_id: string;
    schemas: Array<object>;
    token: string;
    partition_keys: Array<string>;
    error?: ErrorCallback;
    debug?: boolean;
}

export interface OpenOptions {
    realmConn: any,
    path?: string,
    partition_keys?: Array<string>,
}

export class RealmConnector {
    private path?: string;
    private realm_app_id: string;
    private schemas: Array<object>;
    private token: string;
    private partition_keys: Array<string>;
    private realmApps: object;
    private error?: ErrorCallback;
    private debug?: boolean;

    constructor(config: RealmConfig) {
        this.path = config.path || undefined;
        this.realm_app_id = config.realm_app_id;
        this.schemas = config.schemas;
        this.token = config.token;
        this.partition_keys = config.partition_keys;
        this.error = config.error || (() => { });
        this.debug = config.debug || false;
        this.realmApps = {};
    }

    public async signIn(token: string = this.token): Promise<Realm.App> {
        let realmConn = new Realm.App({ id: this.realm_app_id });
        const credentials = Realm.Credentials.jwt(token)
        await realmConn.logIn(credentials);
        return realmConn;
    }

    public async open({
        realmConn,
        path = this.path,
        partition_keys = this.partition_keys
    }: OpenOptions): Promise<boolean> {
        let arraySchemas = Object.entries(this.schemas).map((e) => (e[1]));
        try {
            if (this.debug) console.log(`El partition es ${partition_keys}`);
            let configRealm = {
                ...(path ? { path } : {}),
                schema: arraySchemas,
                sync: {
                    partitionValue: partition_keys,
                    error: this.error,
                    user: realmConn.currentUser,
                    existingRealmFileBehavior: {
                        type: Realm.OpenRealmBehaviorType.OpenImmediately
                    },
                    newRealmFileBehavior: {
                        type: Realm.OpenRealmBehaviorType.OpenImmediately
                    }
                }
            }

            if (path != undefined) {
                configRealm = { ...configRealm, path }
            }
            await Promise.all(partition_keys.map(async pk => {
                if (this.realmApps[pk] === undefined) {
                    /*this.realmApps[pk] = await Realm.open({
                        ...configRealm,
                        sync: {
                            ...configRealm.sync,
                            partitionValue: pk
                        }
                    });*/
                }
                return pk
            }));
            return true
        } catch (error) {
            if (this.debug) console.log(`login error: `, error.message);
        }
        return false
    }

    public close() {
        if (this.realmApps != undefined) {
            Object.values(this.realmApps).forEach(realmApps => {
                realmApps.close();
            });
        }
    }

    public getAllRealmsApps(): object {
        return this.realmApps;
    }

    public getOneRealmApp(partition_key?: string): object {

        return partition_key ? this.realmApps[partition_key] : Object.values(this.realmApps)[0];
    }

}