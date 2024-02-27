# Socket io Cheat sheet

### Server-side

```
io.on("connection", (socket) => {

  // Sử dụng emit cơ bản
  socket.emit(/* ... */);

  //  Gửi tất cả clients có trong namespace trừ thẳng gửi ra
  socket.broadcast.emit(/* ... */);

  //  Gửi cho những thằng có mặt trong room1 trừ thằng gửi ra.
  socket.to("room1").emit(/* ... */);

  // Gửi cho những thằng có mặt trong room1 or và room2  trừ thằng gửi ra.
  socket.to(["room1", "room2"]).emit(/* ... */);

  // Gửi cho những thằng có mặt trong room1 bao gồm thằng gửi.
  io.in("room1").emit(/* ... */);

  // Gửi cho những thằng có mặt trong room1hoặc và room2 ngoại trừ room3 bao gồm thằng gửi.
  io.to(["room1", "room2"]).except("room3").emit(/* ... */);

  //  Gửi cho tất cả các thằng có trong namespace "myNamespace"
  io.of("myNamespace").emit(/* ... */);

  // Gửi cho tất cả các thằng có trong room1 và  có  namespace "myNamespace"
  io.of("myNamespace").to("room1").emit(/* ... */);

  // Gửi cho các nhân với nhau giống như  (private message)
  io.to(socketId).emit(/* ... */);

  //  Cái này mới, chưa biết sao nhưng nó dùng để gửi cho tâtr cả client trong một nod. Chắc là cluster node.js
  io.local.emit(/* ... */);

  //  Gửi cho tất cả Client đã connec rồi.
  io.emit(/* ... */);

  // with acknowledgement
  socket.emit("question", (answer) => {
    // ...
  });

  //  không nén dữ liệu khi gửi, hinh như mặc định là có.
  socket.compress(false).emit(/* ... */);

  // a message that might be dropped if the low-level transport is not writable
  socket.volatile.emit(/* ... */);

})
```

### Client-side

```
// basic emit
socket.emit(/* ... */);

// with acknowledgement
socket.emit("question", (answer) => {
  // ...
});

// without compression
socket.compress(false).emit(/* ... */);

// a message that might be dropped if the low-level transport is not writable
socket.volatile.emit(/* ... */);
```

### Redis-Adapter

## install

```
 npm install "@socket.io/redis-adapter" redis

  or with typescript if you are using redis@3

  npm install "@socket.io/redis-adapter" @types/redis
```

## redis-emitter install

```
  npm install "@socket.io/redis-emitter" redis
```
