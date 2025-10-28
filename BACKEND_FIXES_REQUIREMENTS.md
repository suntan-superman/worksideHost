# Backend Fixes - Requirements Document

## 🎯 **PROBLEM SUMMARY**
The backend has several critical issues that need systematic fixing:
1. **Routes missing tenantMiddleware** - Some routes still use old authorization
2. **Database connection issues** - Incorrect MongoDB URI causing connection failures
3. **User firm associations** - Users incorrectly associated with wrong firms
4. **Missing tenantId filtering** - Data not properly isolated by tenant
5. **Authentication token issues** - JWT token validation problems

## 🔧 **REQUIRED FIXES**

### **1. UPDATE ALL ROUTES TO USE TENANTMIDDLEWARE**
**Problem:** Some routes still use old authorization middleware instead of tenantMiddleware
**Impact:** 401 errors, data leakage between tenants

**Files to check and update:**
- `routes/requestBid.js`
- `routes/contact.js` 
- `routes/firm.js`
- `routes/user.js`
- `routes/product.js`
- `routes/supplierproduct.js`
- `routes/rig.js`
- `routes/rigcompany.js`
- `routes/supplier.js`
- `routes/customer.js`
- `routes/email.js`
- `routes/message.js`
- `routes/deliveryassociate.js`
- `routes/shipment.js`
- `routes/transaction.js`
- `routes/mapping.js`
- `routes/progresstracker.js`
- `routes/projectrequestor.js`
- `routes/document.js`
- `routes/customersuppliermsa.js`
- `routes/suppliergroup.js`
- `routes/suppliergroupuser.js`
- `routes/requesttemplate.js`
- `routes/notifications.js`
- `routes/delivery.js`
- `routes/vehicle.js`
- `routes/expo-notifications.js`
- `routes/request-distribution-list.js`
- `routes/feedback.js`
- `routes/delivery-assignments.js`
- `routes/custom.js`
- `routes/directions.js`

**Find this pattern:**
```javascript
const { authorize, requireStandardUser, requirePowerUser, requireAdmin, checkResourceOwnership } = require("../middleware/authorizationMiddleware");

// Routes using old middleware
router.get("/", requireStandardUser, getSomething);
router.post("/", requirePowerUser, createSomething);
```

**Replace with:**
```javascript
const tenantMiddleware = require("../middleware/tenantMiddleware");

// Apply tenant middleware to all routes
router.use(tenantMiddleware);

// Routes now use tenantMiddleware automatically
router.get("/", getSomething);
router.post("/", createSomething);
```

### **2. ENSURE ALL CONTROLLERS FILTER BY TENANTID**
**Problem:** Controllers not filtering data by tenantId, causing data leakage

**Files to check:**
- `controllers/projectController.js`
- `controllers/requestController.js`
- `controllers/requestBidController.js`
- `controllers/contactController.js`
- `controllers/firmController.js`
- `controllers/userController.js`
- `controllers/productController.js`
- `controllers/supplierProductController.js`
- `controllers/rigController.js`
- `controllers/rigCompanyController.js`
- `controllers/supplierController.js`
- `controllers/customerController.js`

**Find queries like:**
```javascript
const projects = await Project.find({ customer: customer });
const requests = await Request.find({ project_id: projectId });
const users = await User.find({});
```

**Replace with:**
```javascript
const projects = await Project.find({ 
    customer: customer, 
    tenantId: req.tenantId 
});
const requests = await Request.find({ 
    project_id: projectId, 
    tenantId: req.tenantId 
});
const users = await User.find({ 
    firmId: req.tenantId 
});
```

### **3. FIX DATABASE CONNECTION**
**Problem:** Incorrect MongoDB URI causing connection failures

**File:** `server.js`
**Check:** Ensure correct MONGO_URI is set
```javascript
// Should be:
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
```

**File:** `.env`
**Ensure:** Correct MongoDB connection string
```
MONGO_URI=mongodb+srv://sroy:l8dUBdRiajc8CYkG@cluster0.btnh8k6.mongodb.net/client
```

### **4. FIX USER FIRM ASSOCIATIONS**
**Problem:** Users incorrectly associated with wrong firms

**Create script:** `scripts/fixUserFirmAssociations.js`
```javascript
const mongoose = require('mongoose');
const { User } = require('../models/userModel');
const Firm = require('../models/firmModel');

const fixUserFirmAssociations = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to database');
        
        const users = await User.find({});
        console.log(`📊 Found ${users.length} users`);
        
        for (const user of users) {
            if (user.company) {
                // Find firm by company name
                const firm = await Firm.findOne({ name: user.company });
                if (firm) {
                    user.firmId = firm._id;
                    await user.save();
                    console.log(`✅ Updated ${user.email} -> ${firm.name}`);
                } else {
                    console.log(`❌ No firm found for company: ${user.company}`);
                }
            }
        }
        
        console.log('🎉 User firm associations fixed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

fixUserFirmAssociations();
```

### **5. ADD TENANTID TO ALL MODELS**
**Problem:** Models missing tenantId field for multi-tenant isolation

**Files to update:**
- `models/projectModel.js`
- `models/requestModel.js`
- `models/requestBidModel.js`
- `models/contactModel.js`
- `models/productModel.js`
- `models/supplierProductModel.js`
- `models/rigModel.js`
- `models/rigCompanyModel.js`
- `models/supplierModel.js`
- `models/customerModel.js`

**Add to each model:**
```javascript
tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm',
    required: true,
    index: true
},
```

### **6. FIX JWT TOKEN VALIDATION**
**Problem:** JWT token validation issues

**File:** `middleware/tenantMiddleware.js`
**Ensure:** Proper token validation
```javascript
const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
const user = await User.findById(decoded._id).populate('firmId');

if (!user) {
    return res.status(401).json({
        error: 'User not found',
        message: 'Invalid authentication token'
    });
}

if (!user.firmId) {
    return res.status(403).json({
        error: 'User not associated with any firm',
        message: 'Please contact administrator to assign you to a firm'
    });
}
```

## 🔍 **HOW TO FIND THE ISSUES**

### **Step 1: Find Routes with Old Authorization**
```bash
# Search for old authorization patterns
grep -r "requireStandardUser\|requirePowerUser\|requireAdmin" routes/
grep -r "authorizationMiddleware" routes/
```

### **Step 2: Find Controllers Missing tenantId**
```bash
# Search for queries without tenantId
grep -r "\.find({" controllers/
grep -r "\.findOne({" controllers/
```

### **Step 3: Find Models Missing tenantId**
```bash
# Search for models without tenantId
grep -r "tenantId" models/
```

## 📋 **PRIORITY ORDER**

1. **CRITICAL:** Fix database connection (prevents all API calls)
2. **CRITICAL:** Update routes to use tenantMiddleware (prevents 401 errors)
3. **HIGH:** Add tenantId filtering to controllers (prevents data leakage)
4. **HIGH:** Fix user firm associations (prevents login failures)
5. **MEDIUM:** Add tenantId to models (ensures data isolation)
6. **LOW:** Fix JWT token validation (improves security)

## ✅ **SUCCESS CRITERIA**

After fixes:
- [ ] All routes use tenantMiddleware
- [ ] All controllers filter by tenantId
- [ ] Database connection works reliably
- [ ] Users can log in without "firm association" errors
- [ ] Data is properly isolated by tenant
- [ ] No 401 errors on API calls
- [ ] JWT tokens validate correctly

## 🚨 **CRITICAL NOTES**

- **Test each route individually** after updating
- **Verify data isolation** - users should only see their firm's data
- **Check authentication** - all protected routes should require valid tokens
- **Test with different user types** - standard, power, admin users
- **Verify firm associations** - users should be associated with correct firms

## 📁 **FILES LIKELY TO NEED CHANGES**

### **Route Files (30+ files):**
- All files in `routes/` directory
- Replace old authorization with tenantMiddleware

### **Controller Files (15+ files):**
- All files in `controllers/` directory
- Add tenantId filtering to all queries

### **Model Files (10+ files):**
- All files in `models/` directory
- Add tenantId field to schemas

### **Configuration Files:**
- `server.js` - Database connection
- `.env` - Environment variables
- `middleware/tenantMiddleware.js` - Token validation

## 🔧 **TESTING**

After making changes:
1. **Test database connection** - Should connect without errors
2. **Test user login** - Should work without firm association errors
3. **Test API endpoints** - Should return data filtered by tenant
4. **Test data isolation** - Users should only see their firm's data
5. **Test authentication** - Protected routes should require valid tokens

## 📊 **VERIFICATION COMMANDS**

```bash
# Test database connection
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('✅ Connected')).catch(err => console.log('❌ Error:', err.message))"

# Test specific route
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/project

# Check user firm associations
node scripts/checkUserFirmAssociations.js
```

---

**This document provides everything needed to fix the backend issues systematically and efficiently.**
