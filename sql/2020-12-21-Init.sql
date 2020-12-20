create database `ask_hub` default charset utf8mb4 collate utf8mb4_unicode_ci;

create table `users`
(
    id        varchar(191)  not null primary key,
    name      varchar(255)  not null,
    email     varchar(255)  not null,
    password  varchar(255)  not null,
    active    int default 1 not null,
    loginFrom json          not null,
    createdAt datetime      not null,
    updatedAt datetime      not null,

    constraint `unique_users_email` unique (email)
);

create table `questions`
(
    id          varchar(191)  not null primary key,
    title       varchar(255)  not null,
    description varchar(1024) not null,
    active      tinyint       not null default 1,
    createdAt   datetime      not null,
    updatedAt   datetime      not null,
    userId      varchar(191)  not null,

    constraint `fk_questions_userId` foreign key (userId) references users (id)
);

create table `tags`
(
    id        varchar(191) not null primary key,
    name      varchar(255) not null,
    slug      varchar(255) not null,
    createdAt datetime     not null,
    updatedAt datetime     not null
);

create table `answers`
(
    id         varchar(191) not null primary key,
    text       text         not null,
    active     tinyint      not null default 1,
    createdAt  datetime     not null,
    updatedAt  datetime     not null,
    questionId varchar(191) not null,
    userId     varchar(191) not null,

    constraint `fk_answers_questionId` foreign key (questionId)
        references questions (id) on update cascade on delete no action,
    constraint `fk_answers_userId` foreign key (userId)
        REFERENCES users (id) on update cascade on delete no action
);

create table `questions_tags`
(
    questionId varchar(191) not null,
    tagId      varchar(191) not null,

    primary key (questionId, tagId),
    constraint `fk_questions_tags_questionId` foreign key (questionId)
        references questions (id) on update cascade on delete cascade,
    constraint `fk_questions_tags_tagId` foreign key (tagId)
        references tags (id) on update cascade on delete cascade
);

create table `answers_users_star`
(
    answerId varchar(191) not null,
    userId   varchar(191) not null,

    primary key (answerId, userId),
    constraint `fk_answers_users_star_answerId` foreign key (answerId)
        references answers (id) on update cascade on delete cascade,
    constraint `fk_answers_users_star_userId` foreign key (userId)
        references users (id) on update cascade on delete cascade
);
