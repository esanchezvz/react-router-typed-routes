export type Post = {
  id: number;
  slug: string;
  title: string;
  body: string[];
};

const posts: Post[] = [
  { id: 1, title: "Post 1", slug: "post-1", body: [] },
  { id: 2, title: "Post 2", slug: "post-2", body: [] },
  { id: 3, title: "Post 3", slug: "post-3", body: [] },
  { id: 4, title: "Post 4", slug: "post-4", body: [] },
  { id: 5, title: "Post 5", slug: "post-5", body: [] },
  { id: 6, title: "Post 6", slug: "post-6", body: [] },
  { id: 7, title: "Post 7", slug: "post-7", body: [] },
  { id: 8, title: "Post 8", slug: "post-8", body: [] },
  { id: 9, title: "Post 9", slug: "post-9", body: [] },
  { id: 10, title: "Post 10", slug: "post-10", body: [] },
];

export { posts };
