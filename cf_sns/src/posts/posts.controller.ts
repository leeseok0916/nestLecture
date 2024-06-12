import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';

interface Post {
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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return posts;
  }

  @Get(':id')
  // @Get(':id/author/:authorId')
  // getPost(@Param('id') id: string, @Param('authorId') authorId: string) {
  getPost(@Param('id') id: string) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
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

  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
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

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    posts = posts.filter((post) => post.id !== +id);
    return id;
  }
}
