import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import User from './User';
import { Sub } from './Sub';
import Comment from './Comment';
import Vote from './Vote';
import { Exclude, Expose } from 'class-transformer';
import { Directive, Field, ID, ObjectType } from 'type-graphql';
import { makeId } from '../modules/utils/makeId';
import { slugify } from '../modules/utils/slugify';

@ObjectType()
@Entity({ name: 'Posts' })
@Directive("@cacheControl(maxAge: 60, scope: PUBLIC)")
export class Post extends BaseEntity {
  constructor(post: Partial<Post>) {
    super()
    Object.assign(this, post);
  }

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  id: number;

  @Index()
  @Column()
  @Field()
  @Directive("@cacheControl(maxAge: 200, scope: PUBLIC)")
  identifier: string; //7 char ID

  @Column()
  @Field()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  title: string;

  @Index()
  @Column()
  @Field()
  @Directive("@cacheControl(maxAge: 200, scope: PUBLIC)")
  slug: string;

  @Column({ nullable: true, type: 'text' })
  @Field()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  body: string;

  @Column()
  @Field()
  @Directive("@cacheControl(maxAge: 200, scope: PUBLIC)")
  subName: string;

  @Column()
  @Field()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  username: string; //by default join column is not include to the response

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  @Field(() => Sub)
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true })
  @Field(() => [Comment])
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  @Field(() => [Vote])
  votes: Vote[];

  @Field()
  @Directive("@cacheControl(maxAge: 5, scope: PRIVATE)")
  protected userVote: number;
  setUserVote(user: User) {
    if (user) {
      const index = this.votes?.findIndex((v) => v.username === user?.username)
      this.userVote = index > -1 ? this.votes[index].value : 0
    } else {
      this.userVote = 0
    }

  }
  @Field()
  protected url: string;
  @AfterLoad()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  createFields() {
    this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  //virtuell field. Not in DB (Same like url field)
  @Field()
  @Directive("@cacheControl(maxAge: 60, scope: PUBLIC)")
  @Expose() get commentCount(): number {
    if (this.comments != undefined) {
      return this.comments.length;
    } else {
      return 0;
    }
  }
  //? behind votes and comments
  @Field()
  @Directive("@cacheControl(maxAge: 20, scope: PUBLIC)")
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
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
