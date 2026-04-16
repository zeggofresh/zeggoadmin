# 🍞 Toast Notifications - Usage Guide

## Overview
The Zeggo Admin Panel now uses proper React toast notifications instead of browser alerts. All components have been updated to use the Toast component.

---

## ✅ What Changed

### ❌ Before (Old Way - Using Alerts):
```javascript
alert('Payment successful!');
alert('Error: Something went wrong');
```

### ✅ After (New Way - Using Toast):
```javascript
setToast({ message: 'Payment successful!', type: 'success' });
setToast({ message: 'Error: Something went wrong', type: 'error' });
```

---

## 📦 Available Toast Types

1. **Success** (Green) - ✅
   ```javascript
   setToast({ message: 'Operation successful!', type: 'success' });
   // or
   showSuccess('Operation successful!');
   ```

2. **Error** (Red) - ❌
   ```javascript
   setToast({ message: 'Something went wrong', type: 'error' });
   // or
   showError('Something went wrong');
   ```

3. **Warning** (Yellow) - ⚠️
   ```javascript
   setToast({ message: 'Please check your input', type: 'warning' });
   // or
   showWarning('Please check your input');
   ```

4. **Info** (Blue) - ℹ️
   ```javascript
   setToast({ message: 'Processing your request', type: 'info' });
   // or
   showInfo('Processing your request');
   ```

---

## 🎯 Method 1: Using setToast State (Recommended for Components with Toast Already)

If your component already has `toast` state:

```javascript
import Toast from '../Toast';

const MyComponent = () => {
  const [toast, setToast] = useState(null);

  const handleSave = () => {
    // Success toast
    setToast({ message: 'Saved successfully!', type: 'success' });
    
    // Error toast
    setToast({ message: 'Failed to save', type: 'error' });
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Your component JSX */}
    </>
  );
};
```

---

## 🎯 Method 2: Using useToast Hook (Cleanest Approach)

For new components or cleaner code:

```javascript
import useToast from '../hooks/useToast';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo, ToastComponent } = useToast();

  const handleSave = () => {
    // Show success
    showSuccess('Data saved successfully!');
    
    // Show error
    showError('Failed to save data');
    
    // Show warning
    showWarning('Please review before continuing');
    
    // Show info
    showInfo('Processing your request...');
  };

  return (
    <>
      {ToastComponent}
      
      {/* Your component JSX */}
    </>
  );
};
```

---

## 📝 Complete Example - PaymentHistory Component

```javascript
import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import Toast from '../Toast';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/api/zeggo/payment-history/all');
      setPayments(response.data.data);
      setToast({ message: 'Payments loaded successfully', type: 'success' });
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || 'Failed to load payments', 
        type: 'error' 
      });
    }
  };

  const handleViewDetails = (payment) => {
    setToast({ 
      message: `Payment: ${payment.id} - ₹${payment.amount}`, 
      type: 'info' 
    });
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="p-6">
        {/* Your content */}
      </div>
    </>
  );
};
```

---

## ⏱️ Auto-Close Behavior

All toasts automatically close after **3 seconds** (3000ms).

To customize duration in useToast hook:
```javascript
showToast('Message', 'success', 5000); // 5 seconds
showToast('Message', 'error', 0); // No auto-close
```

---

## 🎨 Toast Features

✅ **Auto-close** after 3 seconds  
✅ **Manual close** button (X)  
✅ **Icons** for each type  
✅ **Responsive** design (mobile-friendly)  
✅ **Stackable** - Multiple toasts can be shown  
✅ **Smooth animations** (slide-in effect)  
✅ **Touch-friendly** on mobile devices  

---

## 📱 Responsive Behavior

- **Desktop**: Fixed position top-right (384px width)
- **Mobile**: Full width with margins (calc(100vw - 2rem))
- **Z-index**: 50 (always on top)
- **Position**: Top-4 right-4

---

## 🚫 Removed: Alert()

All `alert()` calls have been removed and replaced with toasts:

```javascript
// ❌ OLD
alert('Payment successful!');

// ✅ NEW
setToast({ message: 'Payment successful!', type: 'success' });
```

---

## 🛠️ Best Practices

1. **Always provide context** in toast messages
   ```javascript
   // ❌ Too vague
   setToast({ message: 'Error', type: 'error' });
   
   // ✅ Specific
   setToast({ message: 'Failed to connect to server', type: 'error' });
   ```

2. **Use appropriate type**
   - Success for completed operations
   - Error for failures
   - Warning for cautions
   - Info for general messages

3. **Keep messages concise** (under 100 characters)

4. **Don't overuse** - Only show important notifications

5. **Clear toast** manually if needed:
   ```javascript
   setToast(null);
   ```

---

## 📁 Files Modified

- ✅ `src/components/Toast.jsx` - Added warning & info types
- ✅ `src/components/paymenthistory/PaymentHistory.jsx` - Removed alerts
- ✅ `src/responsive.css` - Toast responsive styles
- ✅ `src/hooks/useToast.js` - New custom hook
- ✅ All other components updated

---

## 🎯 Quick Reference

| Action | Code |
|--------|------|
| Show Success | `setToast({ message: 'Done!', type: 'success' })` |
| Show Error | `setToast({ message: 'Error!', type: 'error' })` |
| Show Warning | `setToast({ message: 'Careful!', type: 'warning' })` |
| Show Info | `setToast({ message: 'FYI', type: 'info' })` |
| Hide Toast | `setToast(null)` |
| Use Hook | `const { showSuccess } = useToast()` |

---

## 💡 Pro Tips

1. **Chain multiple toasts** for complex operations:
   ```javascript
   showInfo('Processing...');
   setTimeout(() => showSuccess('Completed!'), 2000);
   ```

2. **Use with API calls**:
   ```javascript
   try {
     showInfo('Saving...');
     await api.post('/endpoint', data);
     showSuccess('Saved successfully!');
   } catch (err) {
     showError('Failed to save');
   }
   ```

3. **Combine with loading states** for better UX

---

## 📞 Need Help?

Check existing components like `PaymentHistory.jsx` or `Notification.jsx` for examples.

Happy Toasting! 🍞✨
