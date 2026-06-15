const API_BASE = 'https://aquasite-frontend.onrender.com/api';

export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error('Falha ao carregar posts');
  return await res.json();
}

export async function createPost({ user, content, image }) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, content, image })
  });
  if (!res.ok) throw new Error('Falha ao criar post');
  return await res.json();
}

export async function likePost(postId, user) {
  const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user })
  });
  if (!res.ok) throw new Error('Falha ao curtir');
  return await res.json();
}

export async function addComment(postId, { user, text }) {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, text })
  });
  if (!res.ok) throw new Error('Falha ao comentar');
  return await res.json();
}
