import { Directive, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import User from './User';
import { Post } from './Post';
import { Expose } from 'class-transformer';
import { Field } from 'type-graphql';

@ObjectType()
@Entity({ name: 'Subs' })
@Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
export class Sub extends BaseEntity {
  constructor(sub: Partial<Sub>) {
    super()
    Object.assign(this, sub);
  }

  @Index()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @Directive("@cacheControl(maxAge: 1000, scope: PUBLIC)")
  id: number;

  @Field()
  @Index()
  @Column({ unique: true })
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  name: string;

  @Field()
  @Column()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  describtion: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  imageUrn: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  bannerUrn: string;

  @Field()
  @Column()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  username: string;

  @Field()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  postCount: number;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  user: User;

  @Field(() => [Post], { nullable: true, })
  @OneToMany(() => Post, (post) => post.sub)
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  posts: Post[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, user => user.followedSubs, {
    cascade: true
  })
  @JoinTable()
  follower: User[]



  @Field()
  @Directive("@cacheControl(maxAge: 100, scope: PRIVATE)")
  protected userFollows: number;


  @Field(() => Number)
  @Directive("@cacheControl(maxAge: 10, scope: PUBLIC)")
  followerCount: number

  //virual field. Not in db
  @Expose()
  @Field()
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  imageUrl: string

  //virual field. Not in db
  @Expose()
  @Field(() => String, { nullable: true })
  @Directive("@cacheControl(maxAge: 100, scope: PUBLIC)")
  bannerUrl: string | null

  @Field()
  @CreateDateColumn()
  @Directive("@cacheControl(maxAge: 1000, scope: PUBLIC)")
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

