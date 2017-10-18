# mono-notifications

Mono notifications library for node

[![npm version](https://img.shields.io/npm/v/@terrajs/mono-notifications.svg)](https://www.npmjs.com/package/@terrajs/mono-notifications)
[![Travis](https://img.shields.io/travis/terrajs/mono-notifications/master.svg)](https://travis-ci.org/terrajs/mono-notifications)
[![Coverage](https://img.shields.io/codecov/c/github/terrajs/mono-notifications/master.svg)](https://codecov.io/gh/terrajs/mono-notifications.js)
[![license](https://img.shields.io/github/license/terrajs/mono-notifications.svg)](https://github.com/terrajs/mono-notifications/blob/master/LICENSE)

## Installation

```bash
npm install --save mono-notifications
```

## Usage

Mono notifications library manage your users feed notifications

```js
//Control the notifications workflow (create, read, count, list)
const monoNotification = require('mono-notifications')
```

Mono notifications also expose the notifications as REST routes

All rest calls need a session that specify the user notifications

## Routes

| Method | URI | Query params | Body | Action   |
| :------| :---| :------------| :-----| :--------|
| `GET`  | /notifications    |  `markRead`, `limit`, `offset`, `read`   | | Return the notifications |
| `GET`  | /notifications/count | | | Return the number of unread notifications |
| `PUT`  | /notifications/read | | `[notificationId1, ...]` | Set the notifications as read |
| `PUT`  | /notifications/:id/read | | | Set the specified notification as read

Query params:
- `markRead`: Boolean (`true, false`) Set the notifications as read
- `limit`: Number. Limit the returned notifications
- `offset`: String (`ASC` or `DESC`). Sort the returned notifications
- `read`: Boolean (`true, false`) Get notifications as read or unread

## Methods

### add

```js
add(userId = string || ObjectID, payload = object): Promise<void>
```

Insert a new notification for a specific userId with a specific payload

```js
// Add a new notification of the userId '59c0de2dfe8fa448605b1d89' with a specific payload
const notification = monoNotification.add('59c0de2dfe8fa448605b1d89', {
  title: 'mono-notification',
  description: 'mono notification description'
})
```

### count

```js
count(userId = string || ObjectID, read = boolean): Promise<Number>
```

Return the number of notifications (all, read or unread) for a specific userId

```js
// Return all notifications of the userId '59c0de2dfe8fa448605b1d89'
const notifications = monoNotification.count('59c0de2dfe8fa448605b1d89')
```

```js
// Return all unread notifications of the userId '59c0de2dfe8fa448605b1d89'
const notifications = monoNotification.count('59c0de2dfe8fa448605b1d89', false)
```

```js
// Return all read notifications of the userId '59c0de2dfe8fa448605b1d89'
const notifications = monoNotification.count('59c0de2dfe8fa448605b1d89', true)
```

### read

```js
read(userId = string || ObjectID, notificationsId = string || Array<string>): Promise<void>
```

Set a notification or a list of notifications as read

```js
// Set the notification as read that match '59c0de2dfe8fa448605b1d89' of the userId '59c0de2dfe8fa448605b1d90'
const result = await monoNotification.read('59c0de2dfe8fa448605b1d90', '59c0de2dfe8fa448605b1d89')
```
```js
// Set the notifications as read that match ['59c0de2dfe8fa448605b1d89','59c0de2dfe8fa448605b1d87'] of the userId '59c0de2dfe8fa448605b1d90'
const result = await monoNotification.read('59c0de2dfe8fa448605b1d90', ['59c0de2dfe8fa448605b1d89', '59c0de2dfe8fa448605b1d87'])
```

### list

```js
list(userId = string || ObjectID, query = { limit, offset, sort, fields, read }): Promise<Array<notification>>
```

Return all notifications (all, read or unread) for a specific userId

```js
// Get all notifications of the userId '59c0de2dfe8fa448605b1d89'
const notifications = await monoNotification.list('59c0de2dfe8fa448605b1d89')
```

```js
// Get all unread notifications of the userId '59c0de2dfe8fa448605b1d89'
const notifications = await monoNotification.list('59c0de2dfe8fa448605b1d89', { read: false })
```

```js
// Get all read notifications of the userId '59c0de2dfe8fa448605b1d89'
const notifications = await monoNotification.list('59c0de2dfe8fa448605b1d89', { read: true })
```

