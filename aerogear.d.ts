// Type definitions for Aerogear 2.1.0
// Project: https://aerogear.org/javascript/
// Definitions by: Ali Ok <http://github.com/aliok>


declare module AeroGear {
    // region DiffSync

    interface DiffSyncClientConfig {
        /**
         * the url of the Differential Sync Server
         */
        serverUrl:string;
        syncEngine?:DiffSyncEngine;
        /**
         * will be called when a connection to the sync server has been opened
         */
        onopen?:(event:Event)=>void;
        /**
         * will be called when a connection to the sync server has been closed
         */
        onclose?:(event:Event)=>void;
        /**
         * listens for "sync" events from the sync server
         */
        onsync?:(doc:SyncDocument, event:Event)=>void;
        /**
         * will be called when there are errors from the sync server
         */
        onerror?:(event:Event)=>void;
    }

    /**
     The AeroGear Differential Sync Client.
     @status Experimental
     */
    class DiffSyncClient {
        /**
         @constructs AeroGear.DiffSyncClient
         @param {DiffSyncClientConfig} config - A configuration
         @returns {DiffSyncClient} diffSyncClient - The created DiffSyncClient
         */
        constructor(config:DiffSyncClientConfig);

        /**
         addDocument - Adds a document to the Sync Engine
         @param {SyncDocument} doc - a document to add to the sync engine
         */
        addDocument(doc:SyncDocument);

        /**
         Disconnects from the Differential Sync Server closing it's Websocket connection
         */
        disconnect();

        /**
         fetch - fetch a document from the Sync Server.  Will perform a sync on it
         @param {string} docId - the id of a document to fetch from the Server
         */
        fetch(docId:string);

        /**
         getDocument - gets the document from the Sync Engine
         @param {string} id - the id of the document to get
         @returns {SyncDocument} - The document from the sync engine
         */
        getDocument(id):SyncDocument;

        /**
         removeDoc
         TODO
         */
        removeDoc(doc:SyncDocument);

        /**
         sync - performs the Sync process
         @param {Object} data - the Data to be sync'd with the server
         */
        sync(data:any);
    }


    /**
     The AeroGear Differential Sync Engine.
     @status Experimental
     */
    class DiffSyncEngine {
        /**
         @constructs AeroGear.DiffSyncEngine
         @param {Object} config - A configuration
         @param {String} [config.type = "jsonPatch"] - the type of sync engine, defaults to jsonPatch
         @returns {DiffSyncEngine} diffSyncEngine - The created DiffSyncEngine
         */
        constructor(config:{type?:string});
    }

    interface SyncDocument {
        id: string;
        clientId: string;
        content:any;
    }

    // endregion

    // region DataManager

    /**
     @param {String|Array|Object} [config] - A configuration for the store(s) being created along with the DataManager. If an object or array containing objects is used, the objects can have the following properties:
     @param {String} config.name - the name that the store will later be referenced by
     @param {String} [config.type="Memory"] - the type of store as determined by the adapter used
     @param {String} [config.recordId="id"] - @deprecated the identifier used to denote the unique id for each record in the data associated with this store
     @param {Object} [config.settings={}] - the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using.
     @param {Boolean} [config.settings.fallback=true] - falling back to a supported adapter is on by default, to opt-out, set this setting to false
     @param {Array} [config.settings.preferred] - a list of preferred adapters to try when falling back. Defaults to [ "IndexedDB", "WebSQL", "SessionLocal", "Memory" ]
     @returns {object} dataManager - The created DataManager containing any stores that may have been created
     */
    interface DataManagerConfig {
        /** the name that the store will later be referenced by **/
        name:string;
        /** the type of store as determined by the adapter used. defaults to 'Memory' **/
            type?:string;
        /** @deprecated the identifier used to denote the unique id for each record in the data associated with this store. defaults to 'id' **/
        recordId?:string;
        /** the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using. **/
        settings?:{
            /** falling back to a supported adapter is on by default, to opt-out, set this setting to false. Defaults to 'true'. **/
            fallback?:boolean;
            /** a list of preferred adapters to try when falling back. Defaults to [ "IndexedDB", "WebSQL", "SessionLocal", "Memory" ] **/
            preferred?:string[];
        };
    }

    /**
     A collection of data connections (stores) and their corresponding data models. This object provides a standard way to interact with client side data no matter the data format or storage mechanism used.
     @status Stable
     @class
     @augments AeroGear.Core
     @example
     // Create an empty DataManager
     var dm = AeroGear.DataManager();

     // Create a single store using the default adapter
     var dm2 = AeroGear.DataManager( "tasks" );

     // Create multiple stores using the default adapter
     var dm3 = AeroGear.DataManager( [ "tasks", "projects" ] );

     // Create a custom store
     var dm3 = AeroGear.DataManager({
        name: "mySessionStorage",
        type: "SessionLocal",
        id: "customID"
    });

     // Create multiple custom stores
     var dm4 = AeroGear.DataManager([
     {
         name: "mySessionStorage",
         type: "SessionLocal",
         id: "customID"
     },
     {
         name: "mySessionStorage2",
         type: "SessionLocal",
         id: "otherId",
         settings: { ... }
     }
     ]);
     */
    class DataManager {
        /**
         * @param configString A configuration for the store(s) being created along with the DataManager.
         */
        constructor(configString:string);
        /**
         * @param config A configuration for the store(s) being created along with the DataManager.
         */
        constructor(config:DataManagerConfig);
        /**
         * @param config A configuration for the store(s) being created along with the DataManager.
         */
        constructor(config:DataManagerConfig[]);

        /**
         The name used to reference the collection of data store instances created from the adapters
         */
        stores:any;
    }

    class DataStore {
        /**
         * Determine if this adapter is supported in the current environment
         */
        static isValid():boolean;


        /**
         Filter the current store's data
         @param {Object} [filterParameters] - An object containing key/value pairs on which to filter the store's data. To filter a single parameter on multiple values, the value can be an object containing a data key with an Array of values to filter on and its own matchAny key that will override the global matchAny for that specific filter parameter.
         @param {Boolean} [matchAny] - When true, an item is included in the output if any of the filter parameters is matched.
         @example
         var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

         / Create an empty DataManager
         var dm = AeroGear.DataManager();

         dm.open()
         .then( function() {

            // An object can be passed to filter the data
            // This would return all records with a user named 'admin' **AND** a date of '2012-08-01'
            dm.filter( {
                    date: "2012-08-01",
                    user: "admin"
                } )
                .then( function( filteredData ) { ... } )
                .catch( function( error ) { ... } );

            // The matchAny parameter changes the search to an OR operation
            // This would return all records with a user named 'admin' **OR** a date of '2012-08-01'
            dm.filter( {
                    date: "2012-08-01",
                    user: "admin"
                }, true )
                .then( function( filteredData ) { ... } )
                .catch( function( error ) { ... } );
        });
         */
        filter(filterParameters?:any, matchAny?:boolean):DataStorePromise;

        /**
         Read data from a store
         @param {String|Number} [id] - Usually a String or Number representing a single "record" in the data set or if no id is specified, all data is returned
         @example
         var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

         // Get an array of all data in the store
         dm.read()
         .then( function( data ) {
            console.log( data );
        });

         // Read a specific piece of data based on an id
         dm.read( 12345 )
         .then( function( data ) {
            console.log( data );
        });
         */
        read(id):DataStorePromise;
        read(string):DataStorePromise;

        /**
         Removes data from the store
         @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
         @returns {Object} A Promise
         @example
         var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

         dm.open()
         .then( function() {

            // Delete a record
            dm.remove( 1, )
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // Remove all data
            dm.remove( undefined )
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // Delete all remaining data from the store
            dm.remove()
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );
        });
         */
        remove(toRemove?:any):DataStorePromise;
        remove(toRemove?:any[]):DataStorePromise;

        /**
         Saves data to the store, optionally clearing and resetting the data
         @param {Object|Array} data - An object or array of objects representing the data to be saved to the server. When doing an update, one of the key/value pairs in the object to update must be the `recordId` you set during creation of the store representing the unique identifier for a "record" in the data set.
         @param {Object} [options={}] - options
         @param {Boolean} [options.reset] - If true, this will empty the current data and set it to the data being saved
         @returns {Object} A Promise
         @example
         var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

         dm.open()
         .then( function() {

            // save one record
            dm.save({
                    title: "Created Task",
                    date: "2012-07-13",
                    ...
                })
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // save multiple records
            dm.save([
                    {
                        title: "Task2",
                        date: "2012-07-13"
                    },
                    {
                        title: "Task3",
                        date: "2012-07-13"
                        ...
                    }
                ])
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // Update an existing piece of data
            var toUpdate = dm.read()[ 0 ];
            toUpdate.data.title = "Updated Task";
            dm.save( toUpdate )
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );
        });
         */
        save(data:any, options?:{reset?:boolean}):DataStorePromise;
        save(data:any[], options?:{reset?:boolean}):DataStorePromise;
    }

    interface DataStorePromise {
        then(thenFn:(data)=>void):DataStorePromise;
        catch(errorFn:(error)=>void):DataStorePromise;
    }


    // endregion
}