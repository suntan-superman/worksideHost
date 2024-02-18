import { createRealmContext, Realm } from '@realm/react';

export class Request {
  constructor({id = new Realm.BSON.ObjectId(), requestname}) {
    this._id = id;
    this.requestname = requestname;
    this.statusdate = new Date();
    this.requestbids = [];
    this.requestUpdates = [];
  }

    static schema = { 
      name: 'Request',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        requestname: 'string',
        customerid: 'objectId',
        customercontactid: 'objectId',
        rigcompanyid: 'objectId',
        rigcompanycontactid: 'objectId',
        creationdate: 'date',
        quantity: 'double',
        comments: 'string',
        vendortype: 'string',
        datetimerequested: 'date',
        reqlinkname: 'string',
        reqlinkid: 'objectId',
        status: 'string',
        statusdate: 'date',
        comment: 'string',
        requestbids: 'RequestBid[]',
        requestUpdates: 'RequestUpdate[]'
      }
    };
  }

  export class RequestBid {
    constructor({id = new Realm.BSON.ObjectId(), requestbid}) {
      this._id = id;
      this.requestbid = requestbid;
      this.statusdate = new Date();
    }
  
      static schema = { 
        name: 'RequestBid',
        primaryKey: '_id',
        properties: {
          _id: 'objectId',
          requestbid: 'string',
          supplierid: 'objectId',
          suppliercontactid: 'objectId',
          quantity: 'double',
          comments: 'string',
          deliverydate: 'date',
          status: 'string',
          statusdate: 'date',
          comment: 'string',
          customer: { type : 'linkingObjects', objectType : 'Request', property: 'requestbid' }
        }
      };
}

export class RequestUpdate {
  constructor({id = new Realm.BSON.ObjectId(), requestupdate}) {
    this._id = id;
    this.requestupdate = requestupdate;
    this.statusdate = new Date();
  }

    static schema = { 
      name: 'RequestUpdate',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        requestupdate: 'string',
        requestid: 'objectId',
        suppliercontactid: 'objectId',
        comments: 'string',
        deliverydate: 'date',
        status: 'string',
        statusdate: 'date',
        comment: 'string',
        customer: { type : 'linkingObjects', objectType : 'Request', property: 'requestUpdates' }
      }
    };
  }
