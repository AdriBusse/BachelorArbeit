import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import User from './User';
import { Post } from './Post';
import Vote from './Vote';
import { Directive, Field, ID, ObjectType } from 'type-graphql';
import { makeId } from '../modules/utils/makeId';

@Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
@ObjectType()
@Entity({ name: 'Comments' })
export default class Comment extends BaseEntity {
  constructor(comment: Partial<Comment>) {
    super()
    Object.assign(this, comment);
  }

  @Index()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  id: number;

  @Index()
  @Column()
  @Field()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  identifier: string; //7 char ID

  @Column()
  @Field()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  body: string;

  @Column()
  @Field()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false, onDelete: 'CASCADE' })
  @Field(() => Post)
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  @Field(() => [Vote])
  votes: Vote[];

  @Field()
  @Directive("@cacheControl(maxAge: 10, scope: PRIVATE)")
  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username)
    this.userVote = index > -1 ? this.votes[index].value : 0
  }
  @Field()
  @Directive("@cacheControl(maxAge: 10, scope: PUBLIC)")
  @Expose() get voteScore(): number {
    if (this.votes != undefined) {
      return this.votes.reduce((prev, curr) => prev + (curr.value || 0), 0);
    } else {
      return 0;
    }
  }
  @Field()
  @CreateDateColumn()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  updatedAt: Date;

  @BeforeInsert()
  makeId() {
    this.identifier = makeId(8);
  }
}
