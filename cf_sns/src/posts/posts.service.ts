import { Injectable, NotFoundException } from '@nestjs/common';
export interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: Post[] = [
  {
    id: 1,
    author: '홍길동',
    title: '제목 1',
    content: '내용 1',
    likeCount: 10,
    commentCount: 5,
  },
  {
    id: 2,
    author: '이순신',
    title: '제목 2',
    content: '내용 2',
    likeCount: 20,
    commentCount: 12,
  },
  {
    id: 3,
    author: '김구',
    title: '제목 3',
    content: '내용 3',
    likeCount: 30,
    commentCount: 35,
  },
];

@Injectable()
export class PostsService {
  getAllPosts() {
    return posts;
  }

  getPostById(id: number) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  createPost(author: string, title: string, content: string) {
    const post = {
      id: posts.length + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts.push(post);
    return post;
  }

  updatePost(id: number, author: string, title: string, content: string) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    // posts = posts.map((p) => (p.id === +id ? post : p));

    // const updatedPost = {
    //   ...posts[index],
    //   author,
    //   title,
    //   content,
    // };

    // posts[index] = updatedPost;

    return post;
  }

  deletePost(id: number) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    posts = posts.filter((post) => post.id !== +id);
    return id;
  }
}
