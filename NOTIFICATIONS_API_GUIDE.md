# Notifications & Contact Messages - API Integration Guide

## Overview
This document outlines the API endpoints required for the Notification and Contact Messages features in the Zeggo Admin Panel.

---

## 📢 Notification Endpoints

### 1. Send Notification
**Endpoint:** `POST /api/zeggo/notifications/send`

**Description:** Send push notifications and/or emails to users

**Request Body:**
```json
{
  "title": "System Update",
  "message": "Scheduled maintenance on Sunday at 2 AM",
  "type": "general", // or "promotional", "urgent", "update"
  "sendEmail": true,
  "sendPush": true,
  "targetAudience": "all" // or "specific_users", "new_users"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "id": "notification_id",
    "sentCount": 150
  }
}
```

---

### 2. Get Notification History
**Endpoint:** `GET /api/zeggo/notifications/history`

**Query Parameters (optional):**
- `page` - Page number
- `limit` - Items per page
- `type` - Filter by type (general, promotional, urgent, update)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_001",
      "title": "System Update",
      "message": "Scheduled maintenance on Sunday at 2 AM",
      "type": "update",
      "sendEmail": true,
      "sendPush": true,
      "targetAudience": "all",
      "sentCount": 150,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 3. Delete Notification
**Endpoint:** `DELETE /api/zeggo/notifications/:id`

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## 📧 Contact Messages Endpoints

### 1. Get All Contact Messages
**Endpoint:** `GET /api/zeggo/contact/messages`

**Query Parameters (optional):**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status (read, unread)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg_001",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "subject": "Inquiry about services",
      "message": "I would like to know more about your products...",
      "isRead": false,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ]
}
```

---

### 2. Mark Message as Read
**Endpoint:** `PATCH /api/zeggo/contact/messages/:id/read`

**Response:**
```json
{
  "success": true,
  "message": "Message marked as read"
}
```

---

### 3. Reply to Contact Message
**Endpoint:** `POST /api/zeggo/contact/messages/reply`

**Request Body:**
```json
{
  "to": "john@example.com",
  "subject": "Re: Inquiry about services",
  "message": "Thank you for contacting us. We will get back to you shortly..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reply sent successfully"
}
```

---

### 4. Delete Contact Message
**Endpoint:** `DELETE /api/zeggo/contact/messages/:id`

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## 🔧 Implementation Notes

### Frontend Features Implemented:

#### Notifications Component (`Notification.jsx`)
- ✅ Send notifications with title, message, type
- ✅ Choose delivery method (Push Notification, Email)
- ✅ Target audience selection (All users, Specific users, New users)
- ✅ View notification history with filters
- ✅ Search notifications
- ✅ Delete notifications
- ✅ Pagination support

#### Contact Messages Component (`ContactMessages.jsx`)
- ✅ View all contact form submissions
- ✅ Filter by status (Read/Unread)
- ✅ Search by name, email, or message content
- ✅ View message details in modal
- ✅ Reply to messages via email
- ✅ Mark messages as read automatically when viewed
- ✅ Delete messages
- ✅ Pagination support

### Backend Requirements:

1. **Email Service Integration**
   - Configure SMTP or use services like SendGrid, Mailgun, or AWS SES
   - Support HTML email templates
   - Handle email delivery failures gracefully

2. **Push Notification Service**
   - Firebase Cloud Messaging (FCM) for web/mobile push notifications
   - Store device tokens for registered users
   - Handle notification permissions

3. **Database Collections Needed:**
   - `notifications` - Store sent notifications
   - `contactMessages` - Store contact form submissions
   - `userDevices` - Store user device tokens for push notifications

4. **Security Considerations:**
   - Validate all input data
   - Implement rate limiting for sending notifications
   - Sanitize email content to prevent XSS
   - Verify admin authentication for all endpoints
   - Implement proper error handling

---

## 🎨 UI Features

### Notification Types:
- **General** - Gray badge
- **Promotional** - Green badge
- **Urgent** - Red badge
- **Update** - Blue badge

### Message Status:
- **Unread** - Red badge with blue-tinted row
- **Read** - Green badge

---

## 📱 Testing Checklist

### Notifications:
- [ ] Send notification with only push
- [ ] Send notification with only email
- [ ] Send notification with both push and email
- [ ] Test all notification types
- [ ] Test different target audiences
- [ ] Verify notification appears in history
- [ ] Test search functionality
- [ ] Test delete functionality
- [ ] Test pagination

### Contact Messages:
- [ ] View all messages
- [ ] Filter by read/unread
- [ ] Search messages
- [ ] View message details
- [ ] Reply to message
- [ ] Mark as read (automatic on view)
- [ ] Delete message
- [ ] Test pagination

---

## 🚀 Next Steps

1. Backend team needs to implement the API endpoints listed above
2. Update the API base URL in `src/config/api.js` if needed
3. Test the complete flow with real API calls
4. Add proper error messages based on actual API responses
5. Consider adding bulk operations (delete multiple, mark multiple as read)
6. Add export functionality for reports (CSV/PDF)

---

## 📞 Support

For questions or issues, please contact the development team.
