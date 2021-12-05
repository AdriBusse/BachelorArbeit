import { ID, ObjectType } from 'type-graphql';
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
export class Sub extends BaseEntity {
  constructor(sub: Partial<Sub>) {
    super()
    Object.assign(this, sub);
  }

  @Index()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  describtion: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrn: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerUrn: string;

  @Field()
  @Column()
  username: string;

  @Field()
  postCount: number;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Field(() => [Post], { nullable: true, })
  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, user => user.followedSubs, {
    cascade: true
  })
  @JoinTable()
  follower: User[]



  @Field()
  protected userFollows: number;


  @Field(() => Number)
  followerCount: number

  //virual field. Not in db
  @Expose()
  @Field()
  imageUrl: string

  //virual field. Not in db
  @Expose()
  @Field(() => String, { nullable: true })
  bannerUrl: string | null

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

