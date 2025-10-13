import { Prisma, PrismaClient } from "@prisma/client";
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
 * @body { "name": "...", "email": "..." }
 */
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(newUser);
  } catch (error) {
    // P2002는 Prisma의 unique constraint violation 에러 코드입니다.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "이미 사용 중인 이메일입니다." });
    }
    res.status(500).json({ error: "사용자를 생성하는 데 실패했습니다." });
  }
});

/**
 * 2. 팔로우 API
 * @route POST /users/:id/follow
 * @header { "x-user-id": "..." } // 실제 앱에서는 인증 토큰을 사용합니다.
 */
app.post("/users/:id/follow", async (req, res) => {
  // 실제 앱에서는 JWT 토큰 등에서 현재 사용자 ID를 가져옵니다.
  // 여기서는 헤더를 통해 간단히 구현합니다.
  const followerId = parseInt(req.headers["x-user-id"] as string, 10);
  const followingId = parseInt(req.params.id, 10);

  if (!followerId) {
    return res.status(400).json({ error: "x-user-id 헤더가 필요합니다." });
  }

  if (followerId === followingId) {
    return res.status(400).json({ error: "자기 자신을 팔로우할 수 없습니다." });
  }

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    res.status(201).json(follow);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: 이미 팔로우 중인 경우 (복합 기본 키 위반)
      if (error.code === "P2002") {
        return res.status(409).json({ error: "이미 팔로우 중인 사용자입니다." });
      }
      // P2003: 사용자가 존재하지 않는 경우 (외래 키 위반)
      if (error.code === "P2003") {
        return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      }
    }
    res.status(500).json({ error: "팔로우에 실패했습니다." });
  }
});

/**
 * 3. 게시물 생성 API
 * @route POST /posts
 * @header { "x-user-id": "..." }
 * @body { "title": "...", "content": "..." }
 */
app.post("/posts", async (req, res) => {
  const authorId = parseInt(req.headers["x-user-id"] as string, 10);
  const { title, content } = req.body;

  if (!authorId) {
    return res.status(400).json({ error: "x-user-id 헤더가 필요합니다." });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "게시물 생성에 실패했습니다." });
  }
});

/**
 * 5. 게시물 좋아요 API
 * @route POST /posts/:id/like
 */
app.post("/posts/:id/like", async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ error: "유효하지 않은 게시물 ID입니다." });
  }

  try {
    const post = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: {
          increment: 1, // likes 필드를 1 증가시킵니다.
        },
      },
    });
    res.json(post);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }
    res.status(500).json({ error: "좋아요 처리에 실패했습니다." });
  }
});

/**
 * 4. 타임라인 (팔로우 중인 사용자 게시물) 조회 API
 * @route GET /timeline
 * @header { "x-user-id": "..." }
 */
app.get("/timeline", async (req, res) => {
  const currentUserId = parseInt(req.headers["x-user-id"] as string, 10);

  if (!currentUserId) {
    return res.status(400).json({ error: "x-user-id 헤더가 필요합니다." });
  }

  const timelinePosts = await prisma.post.findMany({
    where: {
      author: {
        followers: {
          some: {
            followerId: currentUserId,
          },
        },
      },
    },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(timelinePosts);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
