const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const dbConfig = {
  server: 'aquabanco.mssql.somee.com',
  database: 'aquabanco',
  user: 'AquaSite_SQLLogin_1',
  password: '9neba9kj38',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
  }
  return pool;
}

async function initDB() {
  const db = await getPool();

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
    CREATE TABLE users (
      id INT IDENTITY(1,1) PRIMARY KEY,
      username NVARCHAR(100) UNIQUE NOT NULL,
      email NVARCHAR(200) UNIQUE NOT NULL,
      password NVARCHAR(200) NOT NULL
    )
  `);

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='posts' AND xtype='U')
    CREATE TABLE posts (
      id INT IDENTITY(1,1) PRIMARY KEY,
      usuario NVARCHAR(100) NOT NULL,
      content NVARCHAR(MAX) NOT NULL,
      image NVARCHAR(MAX) NULL,
      likes INT DEFAULT 0,
      time NVARCHAR(10) NOT NULL
    )
  `);

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='comments' AND xtype='U')
    CREATE TABLE comments (
      id INT IDENTITY(1,1) PRIMARY KEY,
      post_id INT NOT NULL,
      usuario NVARCHAR(100) NOT NULL,
      text NVARCHAR(MAX) NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts(id)
    )
  `);

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'bio')
    ALTER TABLE users ADD bio NVARCHAR(MAX) NULL
  `);

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'avatar')
    ALTER TABLE users ADD avatar NVARCHAR(MAX) NULL
  `);

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('users') AND name = 'created_at')
    ALTER TABLE users ADD created_at DATETIME DEFAULT GETDATE()
  `);

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='follows' AND xtype='U')
    CREATE TABLE follows (
      id INT IDENTITY(1,1) PRIMARY KEY,
      follower NVARCHAR(100) NOT NULL,
      following NVARCHAR(100) NOT NULL,
      UNIQUE (follower, following)
    )
  `);

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='messages' AND xtype='U')
    CREATE TABLE messages (
      id INT IDENTITY(1,1) PRIMARY KEY,
      sender NVARCHAR(100) NOT NULL,
      receiver NVARCHAR(100) NOT NULL,
      content NVARCHAR(MAX) NOT NULL,
      image NVARCHAR(MAX) NULL,
      created_at DATETIME DEFAULT GETDATE(),
      is_read BIT DEFAULT 0
    )
  `);

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('messages') AND name = 'image')
    ALTER TABLE messages ADD image NVARCHAR(MAX) NULL
  `);

  await db.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='notifications' AND xtype='U')
    CREATE TABLE notifications (
      id INT IDENTITY(1,1) PRIMARY KEY,
      recipient NVARCHAR(100) NOT NULL,
      sender NVARCHAR(100) NOT NULL,
      type NVARCHAR(50) NOT NULL,
      post_id INT NULL,
      message NVARCHAR(500) NULL,
      is_read BIT DEFAULT 0,
      created_at DATETIME DEFAULT GETDATE()
    )
  `);

  // Seeds iniciais
  const count = await db.request().query('SELECT COUNT(*) as total FROM posts');
  if (count.recordset[0].total === 0) {
    await db.request().query(`
      INSERT INTO posts (usuario, content, image, likes, time) VALUES
      ('@Marina', 'Avistei golfinhos hoje na praia! Que espetáculo incrível!', '/img/golfinho.jpg', 12, '14:30'),
      ('@João', 'Sabia que os tubarões existem há mais de 450 milhões de anos? São mais antigos que as árvores!', NULL, 8, '13:15'),
      ('@Ana', 'Mergulhei hoje e encontrei um cardume de peixes-palhaço. A vida marinha é fantástica!', '/img/peixepalhaço.webp', 25, '11:00')
    `);
  }

  console.log('Tabelas criadas/verificadas com sucesso');
}

// GET /api/posts
app.get('/api/posts', async (req, res) => {
  try {
    const db = await getPool();
    const posts = await db.request().query('SELECT * FROM posts ORDER BY id DESC');
    const comments = await db.request().query('SELECT * FROM comments');

    const result = posts.recordset.map(post => ({
      id: post.id,
      user: post.usuario,
      content: post.content,
      image: post.image,
      likes: post.likes,
      time: post.time,
      comments: comments.recordset
        .filter(c => c.post_id === post.id)
        .map(c => ({ id: c.id, user: c.usuario, text: c.text }))
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// POST /api/posts
app.post('/api/posts', async (req, res) => {
  try {
    const { user, content, image } = req.body;
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const db = await getPool();

    const result = await db.request()
      .input('usuario', sql.NVarChar, user)
      .input('content', sql.NVarChar, content)
      .input('image', sql.NVarChar, image || null)
      .input('time', sql.NVarChar, time)
      .query('INSERT INTO posts (usuario, content, image, likes, time) OUTPUT INSERTED.id VALUES (@usuario, @content, @image, 0, @time)');

    const id = result.recordset[0].id;
    res.json({ id, user, content, image: image || null, likes: 0, time, comments: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// POST /api/posts/:id/like
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { user } = req.body;
    const db = await getPool();

    await db.request()
      .input('id', sql.Int, id)
      .query('UPDATE posts SET likes = likes + 1 WHERE id = @id');

    const result = await db.request()
      .input('id', sql.Int, id)
      .query('SELECT likes, usuario, content FROM posts WHERE id = @id');

    const post = result.recordset[0];

    if (user && post) {
      const postOwner = post.usuario?.startsWith('@') ? post.usuario.slice(1) : post.usuario;
      if (postOwner && user !== postOwner) {
        try {
          await db.request()
            .input('recipient', sql.NVarChar, postOwner)
            .input('sender', sql.NVarChar, user)
            .input('post_id', sql.Int, id)
            .input('message', sql.NVarChar, (post.content || '').substring(0, 80))
            .query(`INSERT INTO notifications (recipient, sender, type, post_id, message)
                    VALUES (@recipient, @sender, 'like', @post_id, @message)`);
        } catch (e) { console.error('notif like error:', e.message); }
      }
    }

    res.json({ likes: post?.likes ?? 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao curtir post' });
  }
});

// POST /api/posts/:id/comments
app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const post_id = parseInt(req.params.id);
    const { user, text } = req.body;
    const db = await getPool();

    const result = await db.request()
      .input('post_id', sql.Int, post_id)
      .input('usuario', sql.NVarChar, user)
      .input('text', sql.NVarChar, text)
      .query('INSERT INTO comments (post_id, usuario, text) OUTPUT INSERTED.id VALUES (@post_id, @usuario, @text)');

    const id = result.recordset[0].id;

    try {
      const postData = await db.request()
        .input('id', sql.Int, post_id)
        .query('SELECT usuario FROM posts WHERE id = @id');
      const postOwner = postData.recordset[0]?.usuario?.startsWith('@')
        ? postData.recordset[0].usuario.slice(1)
        : postData.recordset[0]?.usuario;
      if (postOwner && user !== postOwner) {
        await db.request()
          .input('recipient', sql.NVarChar, postOwner)
          .input('sender', sql.NVarChar, user)
          .input('post_id', sql.Int, post_id)
          .input('message', sql.NVarChar, text.substring(0, 80))
          .query(`INSERT INTO notifications (recipient, sender, type, post_id, message)
                  VALUES (@recipient, @sender, 'comment', @post_id, @message)`);
      }
    } catch (e) { console.error('notif comment error:', e.message); }

    res.json({ id, user, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao comentar' });
  }
});

// POST /api/users/register
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password, bio, avatar } = req.body;
    const db = await getPool();

    const existing = await db.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .query('SELECT username, email FROM users WHERE username = @username OR email = @email');

    if (existing.recordset.length > 0) {
      const found = existing.recordset[0];
      const field = found.username === username ? 'Nome de usuário' : 'Email';
      return res.json({ success: false, error: `${field} já está em uso.` });
    }

    await db.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .input('bio', sql.NVarChar, bio || null)
      .input('avatar', sql.NVarChar, avatar || null)
      .query('INSERT INTO users (username, email, password, bio, avatar, created_at) VALUES (@username, @email, @password, @bio, @avatar, GETDATE())');

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao cadastrar.' });
  }
});

// POST /api/users/login
app.post('/api/users/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const db = await getPool();

    const result = await db.request()
      .input('login', sql.NVarChar, login)
      .input('password', sql.NVarChar, password)
      .query('SELECT username, email FROM users WHERE (username = @login OR email = @login) AND password = @password');

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.json({ success: true, user: { username: user.username, email: user.email } });
    } else {
      res.json({ success: false, error: 'Usuário ou senha incorretos.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao fazer login.' });
  }
});

// GET /api/users/:username/posts
app.get('/api/users/:username/posts', async (req, res) => {
  try {
    const { username } = req.params;
    const db = await getPool();
    const posts = await db.request()
      .input('usuario', sql.NVarChar, `@${username}`)
      .query('SELECT * FROM posts WHERE usuario = @usuario ORDER BY id DESC');
    const comments = await db.request().query('SELECT * FROM comments');
    const result = posts.recordset.map(post => ({
      id: post.id, user: post.usuario, content: post.content,
      image: post.image, likes: post.likes, time: post.time,
      comments: comments.recordset.filter(c => c.post_id === post.id).map(c => ({ id: c.id, user: c.usuario, text: c.text }))
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json([]);
  }
});

// GET /api/users/:username/follow-status?viewer=xxx
app.get('/api/users/:username/follow-status', async (req, res) => {
  try {
    const { username } = req.params;
    const { viewer } = req.query;
    const db = await getPool();
    const result = await db.request()
      .input('follower', sql.NVarChar, viewer)
      .input('following', sql.NVarChar, username)
      .query('SELECT id FROM follows WHERE follower = @follower AND following = @following');
    res.json({ following: result.recordset.length > 0 });
  } catch (err) {
    res.json({ following: false });
  }
});

// GET /api/messages/conversations/:username
app.get('/api/messages/conversations/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const db = await getPool();
    const result = await db.request()
      .input('username', sql.NVarChar, username)
      .query(`
        SELECT
          other_user,
          last_time,
          (SELECT TOP 1 content FROM messages m2
           WHERE (m2.sender = @username AND m2.receiver = t.other_user)
              OR (m2.sender = t.other_user AND m2.receiver = @username)
           ORDER BY m2.created_at DESC) AS last_message,
          (SELECT TOP 1 avatar FROM users WHERE username = t.other_user) AS avatar
        FROM (
          SELECT
            CASE WHEN sender = @username THEN receiver ELSE sender END AS other_user,
            MAX(created_at) AS last_time
          FROM messages
          WHERE sender = @username OR receiver = @username
          GROUP BY CASE WHEN sender = @username THEN receiver ELSE sender END
        ) t
        ORDER BY last_time DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json([]);
  }
});

// GET /api/messages/:user1/:user2
app.get('/api/messages/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const db = await getPool();
    const result = await db.request()
      .input('u1', sql.NVarChar, user1)
      .input('u2', sql.NVarChar, user2)
      .query(`
        SELECT * FROM messages
        WHERE (sender = @u1 AND receiver = @u2) OR (sender = @u2 AND receiver = @u1)
        ORDER BY created_at ASC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json([]);
  }
});

// POST /api/messages
app.post('/api/messages', async (req, res) => {
  try {
    const { sender, receiver, content, image } = req.body;
    const db = await getPool();
    const result = await db.request()
      .input('sender', sql.NVarChar, sender)
      .input('receiver', sql.NVarChar, receiver)
      .input('content', sql.NVarChar, content || '')
      .input('image', sql.NVarChar, image || null)
      .query('INSERT INTO messages (sender, receiver, content, image) OUTPUT INSERTED.* VALUES (@sender, @receiver, @content, @image)');
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// DELETE /api/messages/:id
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = req.query.user || req.body?.user;
    const db = await getPool();

    const msgRes = await db.request()
      .input('id', sql.Int, id)
      .query('SELECT sender FROM messages WHERE id = @id');

    if (msgRes.recordset.length === 0)
      return res.status(404).json({ success: false, error: 'Mensagem não encontrada' });

    if (msgRes.recordset[0].sender !== user)
      return res.status(403).json({ success: false, error: 'Sem permissão' });

    await db.request().input('id', sql.Int, id).query('DELETE FROM messages WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erro ao deletar mensagem' });
  }
});

// GET /api/search?q=termo
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) return res.json({ users: [], posts: [] });

    const db = await getPool();
    const termo = `%${q}%`;

    const users = await db.request()
      .input('q', sql.NVarChar, termo)
      .query('SELECT username, bio, avatar FROM users WHERE username LIKE @q');

    const posts = await db.request()
      .input('q', sql.NVarChar, termo)
      .query('SELECT * FROM posts WHERE content LIKE @q ORDER BY id DESC');

    res.json({
      users: users.recordset,
      posts: posts.recordset.map(p => ({
        id: p.id, user: p.usuario, content: p.content,
        image: p.image, likes: p.likes, time: p.time
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ users: [], posts: [] });
  }
});

// DELETE /api/posts/:id
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { user } = req.body;
    const db = await getPool();

    const postRes = await db.request()
      .input('id', sql.Int, id)
      .query('SELECT usuario FROM posts WHERE id = @id');

    if (postRes.recordset.length === 0)
      return res.status(404).json({ success: false, error: 'Post não encontrado' });

    const owner = postRes.recordset[0].usuario?.startsWith('@')
      ? postRes.recordset[0].usuario.slice(1)
      : postRes.recordset[0].usuario;

    if (owner !== user)
      return res.status(403).json({ success: false, error: 'Sem permissão' });

    await db.request().input('id', sql.Int, id).query('DELETE FROM comments WHERE post_id = @id');
    await db.request().input('id', sql.Int, id).query('DELETE FROM notifications WHERE post_id = @id');
    await db.request().input('id', sql.Int, id).query('DELETE FROM posts WHERE id = @id');

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao deletar post' });
  }
});

// PUT /api/users/:username/avatar
app.put('/api/users/:username/avatar', async (req, res) => {
  try {
    const { username } = req.params;
    const { avatar, currentUser } = req.body;

    if (currentUser && currentUser !== username)
      return res.status(403).json({ success: false, error: 'Sem permissão' });

    const db = await getPool();
    await db.request()
      .input('username', sql.NVarChar, username)
      .input('avatar', sql.NVarChar, avatar || null)
      .query('UPDATE users SET avatar = @avatar WHERE username = @username');

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao atualizar foto.' });
  }
});

// PUT /api/users/:username/bio
app.put('/api/users/:username/bio', async (req, res) => {
  try {
    const { username } = req.params;
    const { bio, currentUser } = req.body;

    if (currentUser && currentUser !== username)
      return res.status(403).json({ success: false, error: 'Sem permissão' });

    const db = await getPool();
    await db.request()
      .input('username', sql.NVarChar, username)
      .input('bio', sql.NVarChar, bio || null)
      .query('UPDATE users SET bio = @bio WHERE username = @username');

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao atualizar biografia.' });
  }
});

// GET /api/users/:username/stats
app.get('/api/users/:username/stats', async (req, res) => {
  try {
    const { username } = req.params;
    const db = await getPool();

    const posts = await db.request()
      .input('usuario', sql.NVarChar, `@${username}`)
      .query('SELECT COUNT(*) as total FROM posts WHERE usuario = @usuario');

    const followers = await db.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT COUNT(*) as total FROM follows WHERE following = @username');

    const following = await db.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT COUNT(*) as total FROM follows WHERE follower = @username');

    const user = await db.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT email, bio, avatar, created_at FROM users WHERE username = @username');

    res.json({
      postsCount: posts.recordset[0].total,
      followersCount: followers.recordset[0].total,
      followingCount: following.recordset[0].total,
      email: user.recordset[0]?.email || '',
      bio: user.recordset[0]?.bio || '',
      avatar: user.recordset[0]?.avatar || null,
      joinDate: user.recordset[0]?.created_at
        ? new Date(user.recordset[0].created_at).toLocaleDateString('pt-BR')
        : 'desconhecido'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar stats' });
  }
});

// POST /api/users/:username/follow
app.post('/api/users/:username/follow', async (req, res) => {
  try {
    const { username } = req.params;
    const { follower } = req.body;
    const db = await getPool();

    const existing = await db.request()
      .input('follower', sql.NVarChar, follower)
      .input('following', sql.NVarChar, username)
      .query('SELECT id FROM follows WHERE follower = @follower AND following = @following');

    if (existing.recordset.length > 0) {
      return res.json({ success: true, alreadyFollowing: true });
    }

    await db.request()
      .input('follower', sql.NVarChar, follower)
      .input('following', sql.NVarChar, username)
      .query('INSERT INTO follows (follower, following) VALUES (@follower, @following)');

    try {
      await db.request()
        .input('recipient', sql.NVarChar, username)
        .input('sender', sql.NVarChar, follower)
        .query(`INSERT INTO notifications (recipient, sender, type)
                VALUES (@recipient, @sender, 'follow')`);
    } catch (e) { console.error('notif follow error:', e.message); }

    res.json({ success: true, alreadyFollowing: false });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// DELETE /api/users/:username/follow
app.delete('/api/users/:username/follow', async (req, res) => {
  try {
    const { username } = req.params;
    const { follower } = req.body;
    const db = await getPool();

    await db.request()
      .input('follower', sql.NVarChar, follower)
      .input('following', sql.NVarChar, username)
      .query('DELETE FROM follows WHERE follower = @follower AND following = @following');

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// GET /api/notifications/:username
app.get('/api/notifications/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const db = await getPool();
    const result = await db.request()
      .input('recipient', sql.NVarChar, username)
      .query(`
        SELECT TOP 50 n.id, n.recipient, n.sender, n.type, n.post_id,
               n.message, n.is_read, n.created_at, u.avatar AS sender_avatar
        FROM notifications n
        LEFT JOIN users u ON u.username = n.sender
        WHERE n.recipient = @recipient
        ORDER BY n.created_at DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('notifications error:', err);
    res.status(500).json([]);
  }
});

// GET /api/notifications/:username/unread-count
app.get('/api/notifications/:username/unread-count', async (req, res) => {
  try {
    const { username } = req.params;
    const db = await getPool();
    const result = await db.request()
      .input('recipient', sql.NVarChar, username)
      .query('SELECT COUNT(*) as count FROM notifications WHERE recipient = @recipient AND is_read = 0');
    res.json({ count: result.recordset[0].count });
  } catch (err) {
    res.json({ count: 0 });
  }
});

// PUT /api/notifications/:username/read
app.put('/api/notifications/:username/read', async (req, res) => {
  try {
    const { username } = req.params;
    const db = await getPool();
    await db.request()
      .input('recipient', sql.NVarChar, username)
      .query('UPDATE notifications SET is_read = 1 WHERE recipient = @recipient');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar ao banco:', err.message);
  process.exit(1);
});
