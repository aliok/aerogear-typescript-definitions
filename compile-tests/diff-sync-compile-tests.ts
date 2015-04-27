/// <reference path="../aerogear.d.ts" />

//NOTE: see folder's README.md


// with optional properties
new AeroGear.DiffSyncClient({
    serverUrl: "ws://localhost:7777/sync",
    syncEngine: "test",
    onopen: (event):void=> {
    },
    onclose: (event):void=> {
    },
    onsync: (event, document):void=> {
    },
    onerror: (event):void=> {
    }
});

// with no optional properties
var syncClient = new AeroGear.DiffSyncClient({
    serverUrl: "ws://localhost:7777/sync",
    syncEngine: "test",
    onopen: (event):void=> {
        event.bubbles;
    },
    onclose: (event):void=> {
        event.bubbles;
    },
    onsync: (document, event):void=> {
        document.id;
        document.clientId;
        document.content.something;
        event.bubbles;
    },
    onerror: (event):void=> {
        event.bubbles;
    }
});

var syncDocument = {
    id: '1234',
    clientId: 'test',
    content: {
        foo: 'bar'
    }
};

syncClient.addDocument(syncDocument);

syncClient.disconnect();

syncClient.fetch("test");

syncDocument = syncClient.getDocument('12345');

syncClient.removeDoc(syncDocument);

syncClient.sync({foo: 'bar'});