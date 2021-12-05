import { UserSubmissionType } from './gql/SubmissionType';
import { IsEmail, Length } from "class-validator";
import { Field, ID, ObjectType, Root } from "type-graphql";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Vote from "./Vote";
import bcrypt from 'bcrypt';
import { Exclude } from "class-transformer";
import { Post } from "./Post";
import Comment from "./Comment";
import { Sub } from './Sub';




@ObjectType()
@Entity({ name: 'Users' })
export default class User extends BaseEntity {
    constructor(user: Partial<User>) {
        super()
        Object.assign(this, user);
    }

    @Index()
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Index() //Improve Performance
    @Column({ unique: true })
    @Length(3, 255, { message: 'Must be at least 3 characters long' })
    username: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    lastName: string;

    @Column()
    @Length(6, 255, { message: 'Must be at least 6 characters long' })
    @Exclude()
    password: string;

    @Field()
    @Column("text", { unique: true })
    @IsEmail(undefined, { message: 'Must be a valid email address' })
    @Length(1, 255, { message: 'Email is empty' })
    email: string;

    @Column("bool", { default: false })
    confirmed: boolean;

    @Field(() => [Vote])
    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @Field(() => [Comment])
    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @Field(() => [Sub], { nullable: true })
    @ManyToMany(() => Sub, (sub) => sub.follower)
    followedSubs: Sub[]

    @Field()
    name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`
    }
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    @Field(() => [UserSubmissionType])
    userSubmissions: any


    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;


}

