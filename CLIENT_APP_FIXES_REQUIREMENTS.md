# Client App Fixes - Requirements Document

## 🎯 **PROBLEM SUMMARY**
The client app has three critical issues:
1. **"Network request failed" errors** showing scary error messages to users
2. **High polling frequency** causing network overload (every 10 seconds)
3. **Authentication issues** with API calls

## 🔧 **REQUIRED FIXES**

### **1. FIX NETWORK ERROR HANDLING**
**File:** `src/api/worksideAPI.jsx`

**Problem:** Network errors show full stack traces and scary error messages
**Solution:** Replace all error handling with graceful error messages

**Find this pattern:**
```javascript
} catch (error) {
    console.error('📱 [FETCH] ❌ ERROR in fetchWithHandling:');
    console.error('📱 [FETCH] Error message:', error.message);
    console.error('📱 [FETCH] Error stack:', error.stack);
    return { status: 500, data: [] };
}
```

**Replace with:**
```javascript
} catch (error) {
    // Graceful error handling - no scary messages
    console.log('📱 [FETCH] ⚠️ Network request failed - handling gracefully');
    console.log('📱 [FETCH] Error type:', error.name);
    
    if (error.name === 'TypeError' && error.message === 'Network request failed') {
        return { 
            status: 503, 
            data: [], 
            error: 'Network unavailable. Please check your connection.',
            isNetworkError: true 
        };
    }
    
    return { 
        status: 500, 
        data: [], 
        error: 'Request failed. Please try again.',
        isNetworkError: false 
    };
}
```

### **2. REDUCE POLLING FREQUENCY**
**Problem:** API calls happening every 10 seconds causing network overload
**Target:** Projects every 60s, Requests every 15s, Bids every 15s

**Files to check:**
- `src/screens/SelectProject.js` (or similar project screens)
- `src/screens/SelectRequest.js` (or similar request screens)
- Any screen with `useEffect` calling `GetAllProjects`, `GetAllRequests`, `GetAllRequestBids`

**Find patterns like:**
```javascript
useEffect(() => {
    const interval = setInterval(() => {
        // API calls here
    }, 10000); // 10 seconds - TOO FREQUENT
    return () => clearInterval(interval);
}, []);
```

**Change to:**
```javascript
useEffect(() => {
    const interval = setInterval(() => {
        // API calls here
    }, 60000); // 60 seconds for projects
    return () => clearInterval(interval);
}, []);
```

**Specific intervals needed:**
- **Projects:** 60000ms (60 seconds)
- **Requests:** 15000ms (15 seconds)  
- **Bids:** 15000ms (15 seconds)

### **3. ENSURE AUTHENTICATION IN API CALLS**
**Problem:** Some API calls may not include authentication tokens

**Check all API calls use the `fetchWithHandling` function:**
```javascript
// GOOD - uses authentication
const result = await fetchWithHandling('/api/project');

// BAD - no authentication
const response = await fetch(`${apiURL}/api/project`);
```

**Replace all raw `fetch` calls with `fetchWithHandling`**

## 🔍 **HOW TO FIND THE ISSUES**

### **Step 1: Find Polling Code**
```bash
# Search for polling patterns
grep -r "setInterval\|setTimeout" src/
grep -r "useEffect.*\[\]" src/
grep -r "GetAllProjects\|GetAllRequests\|GetAllRequestBids" src/
```

### **Step 2: Find Error Handling**
```bash
# Search for error handling patterns
grep -r "console.error.*Error" src/
grep -r "catch.*error" src/
```

### **Step 3: Find API Calls**
```bash
# Search for API calls
grep -r "fetch.*api" src/
grep -r "axios.*api" src/
```

## 📋 **PRIORITY ORDER**

1. **HIGH PRIORITY:** Fix network error handling (prevents scary error messages)
2. **HIGH PRIORITY:** Reduce polling frequency (prevents network overload)
3. **MEDIUM PRIORITY:** Ensure all API calls use authentication

## ✅ **SUCCESS CRITERIA**

After fixes:
- [ ] No more "Network request failed" error messages shown to users
- [ ] Projects refresh every 60 seconds (not 10)
- [ ] Requests refresh every 15 seconds (not 10)
- [ ] Bids refresh every 15 seconds (not 10)
- [ ] All API calls include authentication tokens
- [ ] Network errors are handled gracefully with user-friendly messages

## 🚨 **CRITICAL NOTES**

- **Don't remove error logging** - just make it user-friendly
- **Keep the same API endpoints** - only change timing and error handling
- **Test with network disconnected** to verify graceful error handling
- **Check both online and offline scenarios**

## 📁 **FILES LIKELY TO NEED CHANGES**

- `src/api/worksideAPI.jsx` (error handling)
- `src/screens/SelectProject.js` (polling frequency)
- `src/screens/SelectRequest.js` (polling frequency)
- Any screen with project/request/bid lists
- Any component that calls API functions repeatedly

## 🔧 **TESTING**

After making changes:
1. **Test with good network** - should work normally
2. **Test with poor network** - should show graceful errors
3. **Test with no network** - should show "Network unavailable" message
4. **Check polling frequency** - should be much less frequent
5. **Verify authentication** - all API calls should include tokens

---

**This document provides everything needed to fix the client app issues efficiently.**
