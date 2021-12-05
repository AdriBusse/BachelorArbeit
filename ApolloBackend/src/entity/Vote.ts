import { ID, ObjectType } from 'type-graphql';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, BaseEntity } from 'typeorm';
import { Post } from './Post';
import User from './User';
import Comment from './Comment';
import { Field } from 'type-graphql';

@ObjectType()
@Entity({ name: 'Votes' })
export default class Vote extends BaseEntity {
  constructor(vote: Partial<Vote>) {
    super()
    Object.assign(this, vote);
  }

  @Index()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  value: number;

  @Field(() => User)
  @ManyToOne(() => User,)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Field()
  @Column()
  username: string;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post: Post;

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
  comment: Comment | null;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
