# Payment History API Integration Guide

## Overview
The Payment History component has been integrated with real backend APIs to manage payment transactions in the Zeggo Admin Panel.

---

## 📊 API Endpoints Integrated

### 1. Get All Payment History
**Endpoint:** `GET /api/zeggo/payment-history/all`

**Description:** Fetch all payment history records

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "user_id": "5386d982-cd33-4ea3-ba6b-724cd101616a",
      "order_id": "89f47bb8-f26f-48e0-baf3-39766284f7cb",
      "payment_order_id": "PAY123456",
      "amount": "500",
      "type": "order_payment",
      "status": "completed",
      "payment_method": "online",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 2. Create Payment History (For Reference)
**Endpoint:** `POST /api/zeggo/payment-history/create`

**Request Body:**
```json
{
  "user_id": "5386d982-cd33-4ea3-ba6b-724cd101616a",
  "order_id": "89f47bb8-f26f-48e0-baf3-39766284f7cb",
  "payment_order_id": "PAY123456",
  "amount": "500",
  "type": "order_payment",
  "status": "completed",
  "payment_method": "online"
}
```

---

### 3. Get Payment by ID
**Endpoint:** `GET /api/zeggo/payment-history/:id`

**Example:** `/api/zeggo/payment-history/ebe9aeca-d55d-44ee-8c41-da8e482e4366`

---

### 4. Update Payment
**Endpoint:** `PUT /api/zeggo/payment-history/:id`

**Request Body:**
```json
{
  "status": "completed",
  "payment_method": "cash_on_delivery"
}
```

---

### 5. Delete Payment
**Endpoint:** `DELETE /api/zeggo/payment-history/:id`

---

## ✅ Frontend Implementation

### PaymentHistory.jsx Component

**Features Implemented:**
- ✅ Fetch payment history from API on mount
- ✅ Display payments in table format
- ✅ Filter by status (All, Completed, Pending, Failed)
- ✅ Filter by type (All, Delivery Boy, Supplier)
- ✅ Filter by date
- ✅ Pagination support (10 items per page)
- ✅ Loading states with spinner
- ✅ Error handling with toast notifications
- ✅ Responsive design for mobile/desktop
- ✅ View Details button for each transaction

**State Management:**
```javascript
const [payments, setPayments] = useState([]);       // Payment data
const [loading, setLoading] = useState(false);       // Loading state
const [error, setError] = useState(null);           // Error state
const [toast, setToast] = useState(null);           // Toast notifications
const [currentPage, setCurrentPage] = useState(1);   // Pagination
const [statusFilter, setStatusFilter] = useState('All');
const [dateFilter, setDateFilter] = useState('');
const [typeFilter, setTypeFilter] = useState('All');
```

**API Integration:**
```javascript
const fetchPaymentHistory = async () => {
  try {
    setLoading(true);
    const response = await api.get('/api/zeggo/payment-history/all');
    
    let paymentsData = [];
    if (response.data?.data) {
      paymentsData = Array.isArray(response.data.data) 
        ? response.data.data 
        : [];
    } else if (Array.isArray(response.data)) {
      paymentsData = response.data;
    }
    
    setPayments(paymentsData);
    setError(null);
  } catch (err) {
    console.error('Error fetching payment history:', err);
    setError(err.response?.data?.message || 'Failed to load payment history');
    setPayments([]);
    setToast({ message: 'Failed to load payment history', type: 'error' });
  } finally {
    setLoading(false);
  }
};
```

---

## 🎨 UI Features

### Table Columns:
1. **Transaction ID** - `payment_order_id`
2. **Recipient** - `user_name` or `recipient`
3. **Type** - Payment type (order_payment, etc.)
4. **Amount** - Formatted with ₹ symbol
5. **Date** - Formatted from ISO date
6. **Status** - Color-coded badges:
   - ✅ Green: Completed
   - ⏳ Yellow: Pending
   - ❌ Red: Failed
   - ⚪ Gray: Unknown
7. **Actions** - View Details button

### Status Badge Colors:
- **Completed**: Green background
- **Pending**: Yellow background  
- **Failed**: Red background
- **Unknown**: Gray background

---

## 🔧 Usage

### In App.jsx:
```jsx
<Route path="paymenthistory" element={<PaymentHistory theme={theme} />} />
```

### Component Props:
```jsx
<PaymentHistory theme={theme} />
```

---

## 📱 Responsive Design

- **Mobile**: Full-width table with horizontal scroll
- **Desktop**: Optimized column widths
- **Tablet**: Adaptive layout
- **Scrollbar**: Hidden but functional (custom CSS)

---

## 🚀 Testing Checklist

- [ ] Load payment history successfully
- [ ] Handle empty state gracefully
- [ ] Handle API errors with proper messages
- [ ] Filter by status works correctly
- [ ] Filter by type works correctly
- [ ] Filter by date works correctly
- [ ] Pagination works correctly
- [ ] Loading spinner shows during API calls
- [ ] Toast notifications appear on success/error
- [ ] View Details button works
- [ ] Responsive on mobile devices
- [ ] Scrollbar hidden properly

---

## 💡 Notes

1. **API Response Handling**: The component handles different API response structures (wrapped in `data` property or direct array)

2. **Error Handling**: Shows user-friendly error messages via toast notifications

3. **Loading States**: Displays spinner while fetching data

4. **Empty States**: Shows helpful message when no data matches filters

5. **Data Formatting**: Automatically formats dates and amounts for display

---

## 🔄 Future Enhancements

1. Add export to CSV/PDF functionality
2. Add bulk actions (delete multiple, update status)
3. Add advanced search functionality
4. Add date range picker
5. Add sorting by columns
6. Add real-time updates via WebSocket
7. Add detailed payment view modal
8. Add payment method icons

---

## 📞 Support

For API-related issues, contact the backend development team.
For frontend issues, check the component code in `src/components/paymenthistory/PaymentHistory.jsx`.
