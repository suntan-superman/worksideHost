import { Realm, createRealmContext } from '@realm/react';


// updated: { type: 'date', default: Date.now() },
// age: { type: 'number', min: 18, max: 65, required: true },

export class Supplier {
  constructor({id = new Realm.BSON.ObjectId(), supplierName}) {
    this._id = id;
    this.supplierName = supplierName;
    this.statusdate = new Date();
    this.suppliercontact = [];
    this.products = [];
    this.deliverycontacts = [];
  }

    static schema  = {
      name: 'Supplier',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        supplierName: 'string',
        address1: 'string',
        address2: 'string',
        city: 'string',
        state: 'string',
        zipCode: 'string',
        mailingaddress1: 'string',
        mailingaddress2: 'string',
        mailingcity: 'string',
        mailingstate: 'string',
        mailingzipcode: 'string',
        status: 'string',
        statusdate: 'date',
        comment: 'string',
        contacts: "SupplierContact[]",
        products: "Product[]",
        deliverycontacts: "DeliveryContact[]"
      }
    };
  }

export class SupplierContact {
    constructor({id = new Realm.BSON.ObjectId(), username}) {
      this._id = id;
      this.username = username;
      this.statusdate = new Date();
    }
  
    static schema = { 
      name: 'SupplierContact',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        accesslevel: 'string',
        username: 'string',
        userpassword: 'string',
        firstname: 'string',
        lastname: 'string',
        nickname: 'string',
        primaryphone: 'string',
        secondaryphone: 'string',
        primaryemail: 'string',
        secondaryemail: 'string',
        status: 'string',
        statusdate: 'date',
        comment: 'string',
        customer: { type : 'linkingObjects', objectType : 'Supplier', property: 'contacts' }
      }
    };
  }

export class Product {
    constructor({id = new Realm.BSON.ObjectId(), productname}) {
      this._id = id;
      this.productname = productname;
      this.statusdate = new Date();
    }
  
    static schema = { 
      name: 'Product',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        productname: 'string',
        productdescription: 'string',
        status: 'string',
        statusdate: 'date',
        comment: 'string',
        customer: { type : 'linkingObjects', objectType : 'Supplier', property: 'products' }
      }
    };
  }

 export class DeliveryContact {
    constructor({id = new Realm.BSON.ObjectId(), username}) {
      this._id = id;
      this.username = username;
      this.statusdate = new Date();
    }
  
    static schema = { 
      name: 'DeliveryContact',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        username: 'string',
        userpassword: 'string',
        primaryphone: 'string',
        secondaryphone: 'string',
        primaryemail: 'string',
        secondaryemail: 'string',
        status: 'string',
        statusdate: 'date',
        comment: 'string',
        requestrackers: 'RequestTracker[]',
        customer: { type : 'linkingObjects', objectType : 'Supplier', property: 'deliverycontacts' }
      }
    };
  }

export class RequestTracker {
    constructor({id = new Realm.BSON.ObjectId(), requestid}) {
      this._id = id;
      this.requestid = requestid;
      this.statusdate = new Date();
    }
  
    static schema = {
      name: 'RequestTracker',
      primaryKey: '_id',
      properties: {
        _id: 'objectId',
        requestid: 'objectId',
        status: 'string',
        statusdate: 'date',
        locationlongitude: 'string',
        locationlatitude: 'string',
        comment: 'string',
        customer: { type : 'linkingObjects', objectType : 'DeliveryContact', property: 'requestrackers' }
      }
    };
  }
