import { Prisma, PrismaClient, TaskStatus } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const app = express();
app.use(express.json());

// --- API 구현 ---

/**
 * 1. 사용자 생성 API
 * @route POST /users
 * @body { "email": "...", "name": "..." }
 */
app.post("/users", async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "이메일은 필수입니다." });
  }

  try {
    const newUser = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "이미 사용 중인 이메일입니다." });
    }
    res.status(500).json({ error: "사용자를 생성하는 데 실패했습니다." });
  }
});

/**
 * 2. 할 일(Task) 생성 API
 * @route POST /tasks
 * @header { "x-user-id": "..." }
 * @body { "title": "..." }
 */
app.post("/tasks", async (req, res) => {
  const authorId = parseInt(req.headers["x-user-id"] as string, 10);
  const { title } = req.body;

  if (isNaN(authorId)) {
    return res.status(400).json({ error: "유효하지 않은 사용자 ID입니다." });
  }

  if (!title) {
    return res.status(400).json({ error: "할 일 제목은 필수입니다." });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        authorId,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "할 일 생성에 실패했습니다." });
  }
});

/**
 * 3. 할 일(Task) 목록 조회 API
 * @route GET /tasks
 * @header { "x-user-id": "..." }
 * @query { "status": "PENDING" | "IN_PROGRESS" | "DONE" }
 */
app.get("/tasks", async (req, res) => {
  const authorId = parseInt(req.headers["x-user-id"] as string, 10);
  const status = req.query.status as TaskStatus | undefined;

  if (isNaN(authorId)) {
    return res.status(400).json({ error: "유효하지 않은 사용자 ID입니다." });
  }

  const where: Prisma.TaskWhereInput = { authorId };
  if (status && Object.values(TaskStatus).includes(status)) {
    where.status = status;
  }

  try {
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "할 일 목록 조회에 실패했습니다." });
  }
});

/**
 * 4. 할 일(Task) 수정 API
 * @route PUT /tasks/:id
 * @header { "x-user-id": "..." }
 * @body { "title": "...", "status": "..." }
 */
app.put("/tasks/:id", async (req, res) => {
  const authorId = parseInt(req.headers["x-user-id"] as string, 10);
  const taskId = parseInt(req.params.id, 10);
  const { title, status } = req.body;

  if (isNaN(authorId) || isNaN(taskId)) {
    return res.status(400).json({ error: "유효하지 않은 ID입니다." });
  }

  const dataToUpdate: Prisma.TaskUpdateInput = {};
  if (title) dataToUpdate.title = title;
  if (status && Object.values(TaskStatus).includes(status)) {
    dataToUpdate.status = status;
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId, authorId }, // 본인의 Task만 수정 가능하도록 authorId 조건 추가
      data: dataToUpdate,
    });
    res.json(updatedTask);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "할 일을 찾을 수 없거나 수정할 권한이 없습니다." });
    }
    res.status(500).json({ error: "할 일 수정에 실패했습니다." });
  }
});

/**
 * 5. 할 일(Task) 삭제 API
 * @route DELETE /tasks/:id
 * @header { "x-user-id": "..." }
 */
app.delete("/tasks/:id", async (req, res) => {
  const authorId = parseInt(req.headers["x-user-id"] as string, 10);
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(authorId) || isNaN(taskId)) {
    return res.status(400).json({ error: "유효하지 않은 ID입니다." });
  }

  try {
    await prisma.task.delete({
      where: { id: taskId, authorId }, // 본인의 Task만 삭제 가능하도록 authorId 조건 추가
    });
    res.status(204).send(); // No Content
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "할 일을 찾을 수 없거나 삭제할 권한이 없습니다." });
    }
    res.status(500).json({ error: "할 일 삭제에 실패했습니다." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
