import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Entity 데코레이터를 정의하면 클래스 이름을 기반으로 자동으로 데이터베이스 테이블을 생성해준다.
// 클래스 이름은 카멜케이스인데 데이터베이스 테이블 이름은 스네이크 케이스로 변환된다.
@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
