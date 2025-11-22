import server from "./app.js"; // 수정된 부분

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  // 수정된 부분
  console.log(`Server is running on port ${PORT}`);
});
