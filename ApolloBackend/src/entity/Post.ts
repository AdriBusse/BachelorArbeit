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
import { Field, ID, ObjectType } from 'type-graphql';
import { makeId } from '../modules/utils/makeId';
import { slugify } from '../modules/utils/slugify';

@ObjectType()
@Entity({ name: 'Posts' })
export class Post extends BaseEntity {
  constructor(post: Partial<Post>) {
    super()
    Object.assign(this, post);
  }

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  @Field()
  identifier: string; //7 char ID

  @Column()
  @Field()
  title: string;

  @Index()
  @Column()
  @Field()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  @Field()
  body: string;

  @Column()
  @Field()
  subName: string;

  @Column()
  @Field()
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
  createFields() {
    this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  //virtuell field. Not in DB (Same like url field)
  @Field()
  @Expose() get commentCount(): number {
    if (this.comments != undefined) {
      return this.comments.length;
    } else {
      return 0;
    }
  }
  //? behind votes and comments
  @Field()
  @Expose() get voteScore(): number {
    if (this.votes != undefined) {
      return this.votes.reduce((prev, curr) => prev + (curr.value || 0), 0);
    } else {
      return 0;
    }
  }
  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
